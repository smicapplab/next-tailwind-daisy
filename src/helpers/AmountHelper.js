const replaceDotsWithCommasExceptLast = (inputString) => {
  const dotCount = (inputString.match(/\./g) || []).length;
  if (dotCount > 1) {
    const parts = inputString.split(".");
    const result = parts.slice(0, -1).join(",") + "." + parts[parts.length - 1];
    return result;
  }
  return inputString;
};

const parseFloatWithCheck = (amount) => {
  try{
    const floatAmt = parseFloat(amount);
    if(isNaN(floatAmt)){
      return 0;
    }
    return floatAmt;
  }catch(e){
    return 0;
  }
}

export { replaceDotsWithCommasExceptLast, parseFloatWithCheck }