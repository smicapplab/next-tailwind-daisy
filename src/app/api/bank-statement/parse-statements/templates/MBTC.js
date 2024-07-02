import {
  replaceDotsWithCommasExceptLast,
  parseFloatWithCheck,
} from "@/helpers/AmountHelper";
import {
  parse,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  addYears,
  isValid,
} from "date-fns";

const convertDate = ({ dateInput, month, year }) => {
  try {
    const date = parse(
      dateInput.replace(/\s+/g, "").substring(0, 5) + "/" + year,
      "MM/dd/yyyy",
      new Date()
    );
    if (!isValid(date)) {
      return null;
    }
    if (date.getMonth() < month) {
      return addYears(date, 1);
    }
    return date;
  } catch (err) {
    return null;
  }
};

const parseData = async ({ dateRange, data }) => {
  const start = startOfMonth(parse(dateRange.startDate, "MM-yyyy", new Date()));
  const end = endOfMonth(parse(dateRange.endDate, "MM-yyyy", new Date()));
  const parsedData = [];
  if (data.length > 0) {
    for (let table of data) {
      for (let row of table.rows) {
        if (row.length === 6) {
          const date = convertDate({
            dateInput: row[0],
            month: start.getMonth(),
            year: start.getFullYear(),
          });
          if (date && isWithinInterval(date, { start, end })) {
            const debit = parseFloatWithCheck(replaceDotsWithCommasExceptLast(row[3]).replace(/,/g, ""));
            const credit = parseFloatWithCheck(replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, ""));
            const balance = parseFloatWithCheck(replaceDotsWithCommasExceptLast(row[5]).replace(/,/g, ""));
            const description = row[1];
            const checkNumber = row[2];

            parsedData.push({
              date: date.toISOString(),
              description: description === "NA" ? "" : description,
              checkNumber: checkNumber === "NA" ? "" : checkNumber,
              debit,
              credit,
              balance,
            });
          }
        }
      }
    }
  }

  return parsedData || [];
};

const parseFormData = async ({ data }) => {
  return {
    bankAccountNumber: data.accountNo || "",
    bankAccountHolderName: "",
  };
}

export { parseData, parseFormData };