const formatToPeso = (amount) => {
  if (isNaN(amount)) {
    return "0"
  }

  const options = {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const formatter = new Intl.NumberFormat("en-PH", options);
  return formatter.format(amount);
};

const formatCurrency = (amount) => {
  if (isNaN(amount)) {
    return "0"
  }

  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const formatter = new Intl.NumberFormat("en-PH", options);
  return formatter.format(amount);
};

export { formatToPeso, formatCurrency };
