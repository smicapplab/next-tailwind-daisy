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

const constructFiveCols = ({
  lastDate,
  description,
  debit,
  credit,
  balance,
  start,
  end,
}) => {
  try {
    let retVal = null;
    const parsedDebit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(debit).replace(/,/g, "")
    );
    const parsedCredit = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(credit).replace(/,/g, "")
    );
    const parsedBalance = parseFloatWithCheck(
      replaceDotsWithCommasExceptLast(balance).replace(/,/g, "")
    );

    if (lastDate && isWithinInterval(lastDate, { start, end })) {
        if( !isNaN( parseFloat( replaceDotsWithCommasExceptLast(balance).replace(/,/g, "") ) ) ){
            retVal = {
                date: lastDate.toISOString(),
                description: description || "",
                checkNumber: "",
                debit: parsedDebit,
                credit: parsedCredit,
                balance: parsedBalance,
            };
        }
    }    

    return retVal;
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
    let lastDate = null;
    if (data.length > 0) {
      for (let table of data) {
        for (let row of table.rows) {
          if (row.length === 5) {
            const normalizedDateString = row[0].replace(",", "");
            if (normalizedDateString && normalizedDateString.length > 0) {
              const parsedDate = parse(
                normalizedDateString,
                "ddMMMyy",
                new Date()
              );
              if (isValid(parsedDate)) {
                lastDate = parsedDate;
              }
            }

            if (lastDate && row[1] && (row[2] || row[3]) && row[4]) {
                const parsedRow = constructFiveCols({
                    lastDate,
                    description: row[1] || "",
                    debit: row[2],
                    credit: row[3],
                    balance: row[4],
                    start,
                    end,
                });

                if (parsedRow) {
                  parsedData.push(parsedRow);
                }
            }
          }
        }
      }
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
    bankAccountHolderName: data.accountName || "",
  };
}

export { parseData, parseFormData };