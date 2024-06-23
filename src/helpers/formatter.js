const formatToPeso = (amount) => {
  if (isNaN(amount)) {
    throw new Error("Input must be a number");
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
    throw new Error("Input must be a number");
  }

  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const formatter = new Intl.NumberFormat("en-PH", options);
  return formatter.format(amount);
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  if (isNaN(date)) {
    throw new Error("Invalid date");
  }

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  const parts = formattedDate.split(" ");
  return `${parts[0]}, ${parts[1].replace(",", "")}, ${parts[2]}`;
};

export { formatToPeso, formatCurrency, formatDate };
