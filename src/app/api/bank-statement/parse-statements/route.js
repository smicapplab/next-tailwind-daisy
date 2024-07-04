import { genericQuery, updateOne } from "@/helpers/dynamo-db";
import { getTextExtractAsync } from "@/helpers/TextractHelper";
import {
  parse,
  lastDayOfMonth,
  parseISO,
  isEqual,
  startOfDay,
  addDays,
} from "date-fns";
import { NextResponse } from "next/server";

const exceptions = ["OFF-US", "OFF US", "InstaPay from"];

const groupByMonthAndYear = (data) => {
  try {
    const grouped = {};
    data.forEach((item) => {
      const date = new Date(item.date);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const monthYearKey = `${month}-${year}`;

      if (!grouped[monthYearKey]) {
        grouped[monthYearKey] = {
          month: monthYearKey,
          data: [],
        };
      }

      grouped[monthYearKey].data.push(item);
    });

    return Object.values(grouped);
  } catch (error) {
    throw error;
  }
};

const isDateYesterdayOrTomorrow = ({ transactionDate, baseDate }) => {
  const base = parseISO(baseDate);
  const today = startOfDay(base);
  const transDate = startOfDay(parseISO(transactionDate));
  const yesterday = addDays(today, -1);

  return isEqual(transDate, today) || isEqual(transDate, yesterday);
};

const findDateBeforeTarget = ({ targetDate, data }) => {
  try {
    let dateBeforeTarget = null;
    let smallestDiff = Infinity;
    const targetTimestamp = targetDate.getTime();

    data.forEach((item) => {
      const itemDate = new Date(item.date);
      if (!dateBeforeTarget) {
        dateBeforeTarget = itemDate;
      }

      const itemTimestamp = itemDate.getTime();
      const diff = targetTimestamp - itemTimestamp;
      // Check if itemDate is before targetDate and if the difference is smaller than the smallestDiff found so far
      if (diff > 0 && diff < smallestDiff) {
        dateBeforeTarget = itemDate;
        smallestDiff = diff;
      }
    });

    return dateBeforeTarget;
  } catch (error) {
    console.error({ targetDate, data, error });
  }
};


const getEndingBalance = ({ month, data }) => {
  try {
    let endingBalance = {};
    [7, 14, 21].map((targetDay) => {
      let totalEndingBalance = 0;
      data.forEach((item) => {
        const date = new Date(item.date);
        if (date.getDate() === targetDay) {
          totalEndingBalance = item.balance;
        }
      });

      if (totalEndingBalance === 0) {
        const targetDate = parse(
          `${month}-${targetDay}`,
          "MM-yyyy-dd",
          new Date()
        );
        const closestDate = findDateBeforeTarget({ data, targetDate });
        const closestDay = closestDate.getDate();
        data.forEach((item) => {
          const date = new Date(item.date);
          if (date.getDate() === closestDay) {
            totalEndingBalance = item.balance;
          }
        });
      }
      endingBalance[targetDay] = totalEndingBalance;
    });

    const targetDate = parse(month, "MM-yyyy", new Date());
    const lastDay = lastDayOfMonth(targetDate);

    const lastRecordDate = new Date(data[data.length - 1].date);
    const lastRecordDay = lastRecordDate.getDate();

    let creditTurnover = 0;
    let totalEndingBalance = 0;
    const reversals = [];

    const searchByDebit = ({ creditValue, dateToCheck }) => {
      return data.filter((transaction) => {
        if (transaction.debit === creditValue) {
          return isDateYesterdayOrTomorrow({
            transactionDate: transaction.date,
            baseDate: dateToCheck,
          });
        }
      });
    };

    const searchDoublePost = ({ creditValue, description, dateToCheck }) => {
      return data.filter((transaction) => {
        return (
          transaction.description === description &&
          transaction.credit === creditValue &&
          dateToCheck !== transaction.date
        );
      });
    };

    const containsAnyException = (inputString) => {
      const inputUpper = inputString.toUpperCase();
      return exceptions.some((exception) =>
        inputUpper.includes(exception.toUpperCase())
      );
    };

    const doublePostedCredits = [];
    data.forEach((item) => {
      if (item.credit && item.credit > 0) {
        const foundDebit = searchByDebit({
          creditValue: item.credit,
          dateToCheck: item.date,
        });

        if (foundDebit.length > 0 && !containsAnyException(item.description)) {
          const doublePost = searchDoublePost({
            creditValue: item.credit,
            description: item.description,
            dateToCheck: item.date,
          });

          if (doublePost.length > 0) {
            if (doublePostedCredits.includes(item.description)) {
              creditTurnover += item.credit;
            } else {
              doublePostedCredits.push(item.description);
              reversals.push(item);
            }
          } else {
            reversals.push(item);
          }
        } else {
          creditTurnover += item.credit;
        }
      }

      const date = new Date(item.date);
      if (date.getDate() === lastRecordDay) {
        totalEndingBalance = item.balance;
      }
    });

    endingBalance[lastDay.getDate()] = totalEndingBalance;
    return { endingBalance, creditTurnover, reversals };
  } catch (error) {
    throw error;
  }
};

export async function GET(request) {
  try {
    const params = {
      TableName: "Master",
      IndexName: "pkStatus-skStatus-index",
      KeyConditionExpression: `pkStatus = :pkStatus AND skStatus = :skStatus`,
      ExpressionAttributeValues: {
        ":pkStatus": "status",
        ":skStatus": "PENDING",
      },
      limit: 20,
    };

    const data = await genericQuery({
      params,
    });

    const pendingStatements = data.Items || [];
    if (pendingStatements.length > 0) {
      for (let pendingStatement of pendingStatements) {
        const { pk, sk, skSearch: jobId, bank, dateRange } = pendingStatement;
        const { parsedTable = [], parsedForm = {} } = await getTextExtractAsync(
          {
            jobId,
          }
        );

        const { parseData, parseFormData } = require("./templates/" + bank.id);
        const parsed = await parseData({ dateRange, data: parsedTable });
        const form = await parseFormData({ data: parsedForm });

        const organizedData = groupByMonthAndYear(parsed);
        const newParsed = [];
        for (let organized of organizedData) {
          const { month, data } = organized;
          if (data.length <= 1) continue;
          const sampleData = getEndingBalance({ month, data });
          newParsed.push({ ...organized, ...sampleData });
        }

        await updateOne({
          tableName: "Master",
          item: {
            pk,
            sk,
            parsed: newParsed,
            form,
            skStatus: "PARSED",
          },
        });
      }

      return NextResponse.json({
        success: true,
        parsedData: pendingStatements.length,
      });
    }

    return NextResponse.json({
      success: true,
      parsedData: 0,
    });
  } catch (e) {
    console.error("error", e);
    return NextResponse.json({ success: false, error: e });
  }
}
