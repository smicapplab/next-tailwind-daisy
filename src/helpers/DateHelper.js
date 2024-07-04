import { parse, addYears, isValid } from "date-fns";

const fixDateTypo = (inputString) => {
  // Define a mapping of common OCR mistakes
  const replacements = {
    O: "0",
    I: "1",
    L: "1",
    Z: "2",
    B: "8",
    S: "5",
  };

  // Function to determine if a character should be replaced based on surrounding context
  function shouldReplace(char, index, array) {
    // Check if the character before or after is a digit, suggesting a numeric context
    const prevCharIsDigit = index > 0 ? /\d/.test(array[index - 1]) : false;
    const nextCharIsDigit =
      index < array.length - 1 ? /\d/.test(array[index + 1]) : false;
    return prevCharIsDigit || nextCharIsDigit;
  }

  // Replace each character if needed
  let correctedString = inputString
    .split("")
    .map((char, index, array) => {
      // Apply replacements only if the character should be replaced based on its context
      if (replacements[char] && shouldReplace(char, index, array)) {
        return replacements[char];
      }
      return char;
    })
    .join("");

  return correctedString;
};

const bdoStringToDate = ({
  dateInput,
  month,
  year,
  dateFormat = "ddMMMyyyy",
}) => {
  try {
    const rawDate =
      fixDateTypo(dateInput).replace(/\s+/g, "").substring(0, 5) + year;
    const date = parse(rawDate, dateFormat, new Date());
    if (!isValid(date)) {
      return null;
    }
    if (date.getMonth() < month) {
      return addYears(date, 1);
    }
    return date;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export { fixDateTypo, bdoStringToDate };
