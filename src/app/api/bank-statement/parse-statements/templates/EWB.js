import {
  parseFloatWithCheck,
} from "@/helpers/AmountHelper";
import {
  parse,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  isValid,
} from "date-fns";

const constructNineCols = ({ row, start, end }) => {
  if (row[0].startsWith("POSTING")) {
    return null;
  }

  try {
    const date = parse(row[0], "MM/dd/yyyy HH:mm", new Date());
    const debit = parseFloatWithCheck(row[3].replace(/,/g, ""));
    const credit = parseFloatWithCheck(row[4].replace(/,/g, ""));
    const balance = parseFloatWithCheck(row[5].replace(/,/g, ""));

    if (isValid(date) && isWithinInterval(date, { start, end })) {
      return {
        date: date.toISOString(),
        description: row[1] || "",
        checkNumber: row[8] || "",
        debit,
        credit,
        balance,
      };
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

const constructSevenCols = ({ row, start, end }) => {
  try {
    const normalizedDateString = row[0].replace(",", "");
    const date = parse(normalizedDateString, "MM/dd/yyyy", new Date());
    const debit = parseFloatWithCheck(row[4].replace(/,/g, ""));
    const credit = parseFloatWithCheck(row[5].replace(/,/g, ""));
    const balance = parseFloatWithCheck(row[6].replace(/,/g, ""));
    if (isValid(date) && isWithinInterval(date, { start, end })) {
      return {
        date: date.toISOString(),
        description: row[1] || "",
        checkNumber: row[3] || "",
        debit,
        credit,
        balance,
      };
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

const parseData = async ({ dateRange, data }) => {
  try {
    const start = startOfMonth(
      parse(dateRange.startDate, "MM-yyyy", new Date())
    );
    const end = endOfMonth(parse(dateRange.endDate, "MM-yyyy", new Date()));
    const parsedData = [];
    let toReverse = false;
    if (data.length > 0) {
      for (let table of data) {
        for (let row of table.rows) {
          if (row.length === 9) {
            const parsedRow = constructNineCols({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          }

          if (row.length === 7) {
            toReverse = true;
            const parsedRow = constructSevenCols({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          }
        }
      }
    }

    if (toReverse) {
      parsedData.reverse();
    }

    return parsedData || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

const parseFormData = async ({ data }) => {
  return {
    bankAccountNumber: data.accountNumber || "",
    bankAccountHolderName: data.customerName || "",
  };
};

export { parseData, parseFormData };
