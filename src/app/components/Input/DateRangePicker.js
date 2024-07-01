import { useState, useEffect } from "react";

const years = Array.from(
    new Array(5),
    (val, index) => new Date().getFullYear() - index
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

const DateRangePicker = ({ onDateRangeChange }) => {
  const [startMonth, setStartMonth] = useState("1");
  const [startYear, setStartYear] = useState(years[3]);
  const [endMonth, setEndMonth] = useState("1");
  const [endYear, setEndYear] = useState(years[0]);

  const updateStartDate = (newStartMonth, newStartYear) => {
    const updatedStartMonth = newStartMonth || startMonth;
    const updatedStartYear = newStartYear || startYear;
    setStartMonth(updatedStartMonth);
    setStartYear(updatedStartYear);

  };

  const updateEndDate = (newEndMonth, newEndYear) => {
    const updatedEndMonth = newEndMonth || endMonth;
    const updatedEndYear = newEndYear || endYear;
    console.log(updatedEndMonth, updatedEndYear);
    setEndMonth(updatedEndMonth);
    setEndYear(updatedEndYear);
  };

  useEffect(() => { 
    console.log(startMonth, startYear, endMonth, endYear)
    onDateRangeChange({
      startDate: `${startMonth.padStart(2, "0")}-${startYear}`, 
      endDate: `${endMonth.padStart(2, "0")}-${endYear}`
    });
  }, [startMonth, startYear, endMonth, endYear]);

  useEffect(() => { 
    onDateRangeChange({
      startDate: `${startMonth.padStart(2, "0")}-${startYear}`, 
      endDate: `${endMonth.padStart(2, "0")}-${endYear}`
    });
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <div className="mt-1 flex space-x-2">
          <select
            value={startMonth}
            onChange={(e) => updateStartDate(e.target.value, null)}
            className="border border-gray-300 rounded-md shadow-sm p-2.5 text-gray-900"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={startYear}
            onChange={(e) => updateStartDate(null, e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm p-2.5 text-gray-900"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <div className="mt-1 flex space-x-2">
          <select
            value={endMonth}
            onChange={(e) => updateEndDate(e.target.value, null)}
            className="border border-gray-300 rounded-md shadow-sm p-2.5 text-gray-900"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={endYear}
            onChange={(e) => updateEndDate(null, e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm p-2.5 text-gray-900"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
