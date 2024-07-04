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

const constructSevenCols = ({ row, start, end }) => {
  try {
    const normalizedDateString = row[0].replace(",", "");
    const date = parse(normalizedDateString, "yyyy/MM/dd hh:mm a", new Date());
    const debit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
    );
    const credit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[5]).replace(/,/g, "")
    );
    const balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[6]).replace(/,/g, "")
    );
    if (date && isWithinInterval(date, { start, end })) {
      return {
        date: date.toISOString(),
        description: row[2] || "",
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
  return null;
};

const parseData = async ({ dateRange, data }) => {
  const start = startOfMonth(parse(dateRange.startDate, "MM-yyyy", new Date()));
  const end = endOfMonth(parse(dateRange.endDate, "MM-yyyy", new Date()));
  const parsedData = [];
  if (data.length > 0) {
    for (let table of data) {
      for (let row of table.rows) {
        if (row.length === 7) {
          const parsedRow = constructSevenCols({ row, start, end });
          if (parsedRow) {
            parsedData.push(parsedRow);
          }
        }
      }
    }
  }

  return parsedData || [];
};

const parseFormData = async ({ data }) => {
  return {
    bankAccountNumber: data.accountNumber || data.accountNo || "",
    bankAccountHolderName: data.organizationName || "",
  };
}

export { parseData, parseFormData };