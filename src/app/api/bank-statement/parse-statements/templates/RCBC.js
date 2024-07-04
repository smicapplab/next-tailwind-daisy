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

const isFullDate = (dateInput) => {
  const date = parse(
    dateInput.replace(/\s\d{1,2}:\d{2}\s(AM|PM)$/i, ""),
    "MM/dd/yy",
    new Date()
  );
  return isValid(date);
};

const isDate = (dateInput) => {
  const date = parse(
    dateInput.replace(/\s+/g, "").substring(0, 7),
    "dd-MMM",
    new Date()
  );
  return isValid(date);
};

const convertFullDate = ({ dateInput }) => {
  try {
    const date = parse(
      dateInput.replace(/\s\d{1,2}:\d{2}\s(AM|PM)$/i, ""),
      "MM/dd/yy",
      new Date()
    );
    if (!isValid(date)) {
      return null;
    }

    return date;
  } catch (err) {
    return null;
  }
};

const convertDate = ({ dateInput, month, year }) => {
  try {
    const date = parse(
      dateInput.replace(/\s+/g, "/").substring(0, 7) + "-" + year,
      "dd-MMM-yyyy",
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

const constructSevenCols = ({ row, start, end }) => {
  const date = convertDate({
    dateInput: row[0],
    month: start.getMonth(),
    year: start.getFullYear(),
  });

  if (date && isWithinInterval(date, { start, end })) {
    let description = row[1] || "";
    let checkNumber = row[3] || "";
    let debit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
    );
    let credit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[5]).replace(/,/g, "")
    );
    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[6]).replace(/,/g, "")
    );

    return {
      date: date.toISOString(),
      description,
      checkNumber,
      debit,
      credit,
      balance,
    };
  }
  return null;
};

const constructSixCols = ({ row, start, end }) => {
  const date = convertDate({
    dateInput: row[0],
    month: start.getMonth(),
    year: start.getFullYear(),
  });

  if (date && isWithinInterval(date, { start, end })) {
    let description = row[1] || "";
    let checkNumber = row[2] || "";
    let debit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[3]).replace(/,/g, "")
    );
    let credit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
    );
    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[5]).replace(/,/g, "")
    );

    return {
      date: date.toISOString(),
      description,
      checkNumber,
      debit,
      credit,
      balance,
    };
  }
  return null;
};

const constructElevenCols = ({ row, start, end }) => {
  const date = convertFullDate({
    dateInput: row[0],
  });

  if (date && isWithinInterval(date, { start, end })) {
    let description = row[9] || "";
    let checkNumber = row[7] || "";
    let debit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
    );
    let credit = 0; 
    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[6]).replace(/,/g, "")
    );

    if( !description.replace(/\s/g, '').toUpperCase().includes( "REJECTEDCHECK" ) ) {
      credit = parseFloatWithCheck(
        replaceDotsWithCommasExceptLast(row[5]).replace(/,/g, "")
      );
    }

    return {
      date: date.toISOString(),
      description,
      checkNumber,
      debit,
      credit,
      balance,
    };
  }
  return null;
};

const parseData = async ({ dateRange, data }) => {
  const start = startOfMonth(parse(dateRange.startDate, "MM-yyyy", new Date()));
  const end = endOfMonth(parse(dateRange.endDate, "MM-yyyy", new Date()));
  const parsedData = [];
  let reverse = false;
  if (data.length > 0) {
    for (let table of data) {
      for (let row of table.rows) {
        if (row.length === 11 && isFullDate(row[0])) {
          reverse = true;
          const parsedRow = constructElevenCols({ row, start, end });
          if (parsedRow) {
            parsedData.push(parsedRow);
          }
        }

        if (row.length === 7 && isDate(row[0])) {
          const parsedRow = constructSevenCols({ row, start, end });
          if (parsedRow) {
            parsedData.push(parsedRow);
          }
        }

        if (row.length === 6 && isDate(row[0])) {
          const parsedRow = constructSixCols({ row, start, end });
          if (parsedRow) {
            parsedData.push(parsedRow);
          }
        }
        
      }
    }
  }

  if( reverse ){
    parsedData.reverse();
  }

  return parsedData || [];
};

const parseFormData = async ({ data }) => {
  return {
    bankAccountNumber: data.accountNumber || data.accountNo || "",
    bankAccountHolderName: "",
  };
}

export { parseData, parseFormData };