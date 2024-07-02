"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import withAuth from "@/helpers/WithAuth";
import { getApi, postApi } from "@/helpers/api-helpers";
import { SearchIcon } from "../components/Icons/SearchIcon";
import useDebounce from "@/helpers/useDebounce";
import DateRangePicker from "../components/Input/DateRangePicker";
import { v4 as uuidv4 } from "uuid";
import { getFileExtension } from "@/helpers/fileHelper";
import { ToastContext } from "../store/context/ToastContextProvider";
import ParsedStatements from "../components/bank-statement/ParsedStatements";

const bankFilter = [
  { id: "BDO", name: "BDO Unibank, Inc." },
  { id: "BPI", name: "Bank of the Philippine Islands" },
  { id: "MBTC", name: "Metropolitan Bank and Trust Company" },
  { id: "RCBC", name: "Rizal Commercial Banking Corporation" },
  { id: "UBP", name: "Union Bank of the Philippines" },
  { id: "EWB", name: "East West Banking Corporation" },
  { id: "SECB", name: "Security Bank Corporation" },
];

function BankStatement() {
  const { addToast } = useContext(ToastContext);
  const inputRef = useRef(null);
  const [keyword, setKeyword] = useState(" ");
  const [issuer, setIssuer] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchIssuer = useDebounce(keyword, 300);
  const [refetch, setRefetch] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [statements, setStatements] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function uploadToS3(presignedUrl, file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error("Upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("XHR error"));
      xhr.send(file);
    });
  }

  const handleUpload = async (e) => {
    setIsLoading(true);

    try {
      if (e.target.files.length > 0 && e.target.files[0]) {
        const file = e.target.files[0];
        const { name } = file;
        const fileName = `${uuidv4()}.${getFileExtension(name)}`;
        const response = await postApi(`bank-statement/get-upload-url`, {
          fileName,
          issuer,
        });

        await uploadToS3(response.uploadUrl, file);

        const triggerResponse = await postApi(
          `bank-statement/trigger-text-extract`,
          {
            fileName,
            originalFilename: name,
            issuer,
            dateRange,
            bank: selectedBank,
          }
        );

        if (triggerResponse.success) {
          addToast({
            message:
              "Bank statement has been uploaded and is queued for text extraction. File uploaded successfully. Extraction will take 5 minutes.",
            type: "success",
          });
        } else {
          addToast({
            message: "Oppppps! Something went wrong. Please try again.",
            type: "error",
          });
        }

        await getStatements();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatements = async () => {
    const data = await getApi("bank-statement/get-statements");
    setStatements(data.statements)
  }

  const searchBusiness = async () => {
    const data = await postApi("master/search-business", {
      keyword,
    });
  };

  const handleBusinessSelect = (e) => {
    setIssuer(e);
    setRefetch(false);
    setKeyword(e.businessName);
    setSuggestions([]); // Clear the suggestions
    setShowSuggestions(false); // Hide the suggestions list
  };

  const handleDateRangeChange = (e) => {
    const { startDate, endDate } = e;
    setDateRange({ startDate, endDate });
  };

  const parseData = async() => {
    const data = await getApi("bank-statement/parse-statements");
    if( data.parsedData ){
      getStatements();
    }
  }

  useEffect(() => {
    getStatements();
    searchBusiness();
    setSelectedBank(bankFilter[0]);
  }, []);

  useEffect(() => {
    parseData();
    const interval = setInterval(parseData, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const doSearchIssuer = async () => {
      if (refetch && keyword.trim().length > 3) {
        const response = await postApi("master/search-business", {
          keyword: keyword.trim(),
        });
        setSuggestions(() => response.hits);
        setShowSuggestions(true);
      }
      setRefetch(true);
    };

    doSearchIssuer();
  }, [debouncedSearchIssuer]);

  return (
    <div className="drawer-content p-10 container mx-auto">
      <div className="text-secondary font-bold text-3xl mb-">
        Bank Statement
      </div>

      <div className="paper-container">
        <div className="text-lg font-bold text-primary mb-5">
          Upload Statement
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Issuer/Business Name
        </label>
        <label className="input input-bordered flex items-center gap-2 mb-5 max-w-80">
          <input
            type="text"
            name="searchIssuer"
            className="grow"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search Issuer..."
          />
          <SearchIcon />
        </label>
        {showSuggestions && suggestions?.length > 0 && (
          <ul className="absolute z-10 w-auto max-w-lg bg-white mt-1 border border-gray-300 rounded-md">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.businessName}
                className="p-2 hover:bg-gray-100 cursor-pointer min-w-60 max-w-lg"
                onClick={() => handleBusinessSelect(suggestion)}
              >
                {suggestion.businessName}
              </li>
            ))}
          </ul>
        )}

        <div className="pb-5">
          <label className="block text-sm font-medium text-gray-700">
            Bank
          </label>
          {selectedBank && (
            <select
              value={selectedBank.id}
              onChange={(e) =>
                setSelectedBank(
                  bankFilter.find((bank) => bank.id == e.target.value)
                )
              }
              className="border border-gray-300 rounded-md shadow-sm p-4 text-gray-900 w-full max-w-80"
            >
              {bankFilter.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="pb-5">
          <DateRangePicker
            onDateRangeChange={(e) => handleDateRangeChange(e)}
          />
        </div>

        <input
          name="SC"
          style={{ display: "none" }}
          ref={inputRef}
          type="file"
          id="label-file-upload-SC"
          accept="image/*, application/pdf, .pdf; capture=camera"
          onChange={(e) => {
            handleUpload(e);
          }}
        />
        {isLoading ? (
          <div className="loading loading-dots loading-lg"></div>
        ) : (
          <button
            disabled={!issuer}
            onClick={() => {
              inputRef.current.click();
            }}
            className={`btn btn-active btn-secondary text-white`}
          >
            <div className="">Upload File</div>
          </button>
        )}
      </div>
      <div className="paper-container mt-5">
        <ParsedStatements statements={statements} />
      </div>
    </div>
  );
}

export default withAuth(BankStatement);
