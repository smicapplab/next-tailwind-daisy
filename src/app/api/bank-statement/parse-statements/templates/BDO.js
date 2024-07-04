import {
  replaceDotsWithCommasExceptLast,
  parseFloatWithCheck,
} from "@/helpers/AmountHelper";
import { bdoStringToDate, fixDateTypo } from "@/helpers/DateHelper";
import {
  parse,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  addYears,
  isValid,
} from "date-fns";

const convertDate = ({ dateInput, month, year, format = "dd/MMM/yyyy" }) => {
  const rawDate =
    fixDateTypo(dateInput).replace(/\s+/g, "/").substring(0, 6) + "/" + year;
  try {
    const date = parse(rawDate, format, new Date());
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

const isDate = (dateInput) => {
  const rawDate = fixDateTypo(dateInput).replace(/\s+/g, "/").substring(0, 6);
  const date = parse(rawDate, "dd/MMM", new Date());
  return isValid(date);
};

const isDateMonth = (dayInput, monthInput) => {
  const date = parse(
    dayInput.trim() + "/" + monthInput.trim(),
    "dd/MMM",
    new Date()
  );
  return isValid(date);
};

const convertFullDate = ({ dateInput, format }) => {
  try {
    const date = parse(
      fixDateTypo(dateInput).replace(/\s+/g, "/"),
      format,
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

const constructSevenCols = ({ row, start, end }) => {
  const date = convertFullDate({
    dateInput: row[0],
    format: "MM/dd/yyyy",
  });

  if (date && isWithinInterval(date, { start, end })) {
    let description = row[2] || "";
    let checkNumber = row[6] || "";
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

const constructEightCols = ({ row, start, end }) => {
  try {
    const date = convertDate({
      dateInput: `${row[0].trim()} ${row[1].trim()}`,
      month: start.getMonth(),
      year: start.getFullYear(),
    });

    let description = row[5] || "";
    let checkNumber = row[4] || "";
    const amount = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[6]).replace(/,/g, "")
    );
    let debit = 0;
    let credit = 0;
    if (row[6].endsWith("DR") && amount > 0) {
      debit = amount;
    } else {
      credit = amount;
    }

    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[7]).replace(/,/g, "")
    );
    if (date && isWithinInterval(date, { start, end })) {
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
  } catch (err) {
    console.error(err);
    return null;
  }
};

const constructSevenColsA = ({ row, start, end }) => {
  const date = convertDate({
    dateInput: row[0],
    month: start.getMonth(),
    year: start.getFullYear(),
  });

  if (date && isWithinInterval(date, { start, end })) {
    const checkNumber = row[2] || "";
    const description = row[3] || "";
    const amount = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[5]).replace(/,/g, "")
    );
    let debit = 0;
    let credit = 0;
    if (row[5].endsWith("DR") && amount > 0) {
      debit = amount;
    } else {
      credit = amount;
    }

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
  try {
    const date = bdoStringToDate({
      dateInput: row[0],
      month: start.getMonth(),
      year: start.getFullYear(),
    });

    if (date && isWithinInterval(date, { start, end })) {
      const checkNumber = "";
      const description = row[3] || "";
      let debit = 0;
      let credit = 0;

      const amount = parseFloatWithCheck(
        replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
      );

      if (row[4].trim().endsWith("-") && amount > 0) {
        debit = amount;
      } else {
        credit = amount;
      }

      let balance = parseFloatWithCheck(
        replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
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
  } catch (err) {
    console.error(err);
    return null;
  }
};

const constructSixColsA = ({ row, start, end }) => {
  try {
    const date = convertDate({
      dateInput: row[0],
      month: start.getMonth(),
      year: start.getFullYear(),
    });

    if (date && isWithinInterval(date, { start, end })) {
      const checkNumber = row[2] || "";
      const description = row[3] || "";
      const amount = parseFloatWithCheck(
        replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
      );
      let debit = 0;
      let credit = 0;
      if (row[4].endsWith("DR") && amount > 0) {
        debit = amount;
      } else {
        credit = amount;
      }

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
  } catch (err) {
    console.error(err);
    return null;
  }
};

const constructFiveCols = ({ row, start, end }) => {
  const date = bdoStringToDate({
    dateInput: row[0],
    month: start.getMonth(),
    year: start.getFullYear(),
  });

  if (date && isWithinInterval(date, { start, end })) {
    const checkNumber = "";
    const description = row[2] || "";
    let debit = 0;
    let credit = 0;

    const amount = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[3]).replace(/,/g, "")
    );

    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
    );

    if (row[3].trim().endsWith("-") && amount > 0) {
      debit = amount;
    } else {
      credit = amount;
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

const constructFiveColsA = ({ row, start, end }) => {
  const date = convertDate({
    dateInput: row[0],
    month: start.getMonth(),
    year: start.getFullYear(),
  });

  if (date && isWithinInterval(date, { start, end })) {
    const checkNumber = "";
    const description = row[2] || "";
    let debit = 0;
    let credit = 0;
    const amount = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[3]).replace(/,/g, "")
    );
    if (row[3].endsWith("DR") && amount > 0) {
      debit = amount;
    } else {
      credit = amount;
    }

    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[4]).replace(/,/g, "")
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

const constructFourCols = ({ row, start, end }) => {
  const date = bdoStringToDate({
    dateInput: row[0],
    month: start.getMonth(),
    year: start.getFullYear(),
  });

  if (date && isWithinInterval(date, { start, end })) {
    const checkNumber = "";
    const description = row[1] || "";
    let debit = 0;
    let credit = 0;

    const amount = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[2]).replace(/,/g, "")
    );

    if (row[2].trim().endsWith("-") && amount > 0) {
      debit = amount;
    } else {
      credit = amount;
    }

    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[3]).replace(/,/g, "")
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
};

const constructFourColsA = ({ row, start, end }) => {
  const date = convertDate({
    dateInput: row[0],
    month: start.getMonth(),
    year: start.getFullYear(),
  });

  if (date && isWithinInterval(date, { start, end })) {
    const checkNumber = "";
    const description = row[1] || "";
    let debit = 0;
    let credit = 0;
    const amount = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[2]).replace(/,/g, "")
    );
    if (row[2].endsWith("DR") && amount > 0) {
      debit = amount;
    } else {
      credit = amount;
    }

    let balance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(row[3]).replace(/,/g, "")
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

const parseData = async ({ dateRange, data = [] }) => {
  const start = startOfMonth(parse(dateRange.startDate, "MM-yyyy", new Date()));
  const end = endOfMonth(parse(dateRange.endDate, "MM-yyyy", new Date()));
  const parsedData = [];
  if (data.length > 0) {
    for (let table of data) {
      for (let row of table.rows) {
        if (row.length === 8) {
          if (isDateMonth(row[0], row[1])) {
            const parsedRow = constructEightCols({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          }
        } else if (row.length === 7) {
          if (isDate(row[1])) {
            const parsedRow = constructSevenColsA({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          } else {
            const parsedRow = constructSevenCols({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          }
        } else if (row.length === 6) {
          if (isDate(row[1])) {
            const parsedRow = constructSixColsA({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          } else {
            const parsedRow = constructSixCols({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          }
        } else if (row.length === 5) {
          if (isDate(row[1])) {
            const parsedRow = constructFiveColsA({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          } else {
            const parsedRow = constructFiveCols({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          }
        } else if (row.length === 4) {
          if (isDate(row[0])) {
            const parsedRow = constructFourColsA({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          } else {
            const parsedRow = constructFourCols({ row, start, end });
            if (parsedRow) {
              parsedData.push(parsedRow);
            }
          }
        }
      }
    }
  }

  return parsedData || [];
};

const parseFormData = async ({ data }) => {
  return {
    bankAccountNumber: data.accountNumber || "",
    bankAccountHolderName: data.accountName || "",
  };
};

export { parseData, parseFormData };
