import { format } from "date-fns";
import OpenIcon from "../Icons/OpenIcon";
import StatementDrawer from "./StatementDrawer";
import { useState } from "react";

const headers = ["Business Name", "Bank", "Upload Date", "Status", ""];

const ParsedStatements = ({ statements }) => {
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openInfo = (statement) => {
    setSelectedStatement(statement);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedStatement(null);
  };

  return (
    <div className="w-full">
      <table className="table">
        <thead>
          <tr>
            {headers.map((h, index) => (
              <th key={index} className="text-center text-primary font-semibold text-sm">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statements.map(
            (statement, i) => (
              <tr key={i}>
                <td>{statement.issuer.businessName}</td>
                <td>{statement.bank.name}</td>
                <td className="text-center">
                  {format(new Date(statement.sk), "MMM dd, yyyy hh:ss a")}
                </td>
                <td className="text-center">
                  {statement.skStatus === "PENDING" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <span 
                      className="flex justify-center items-center w-full h-full cursor-pointer"
                      onClick={() => openInfo(statement)}
                    >
                      <OpenIcon />
                    </span>
                  )}
                </td>
                <td></td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {isDrawerOpen && (
        <StatementDrawer 
          selectedStatement={selectedStatement} 
          closeDrawer={closeDrawer} 
        />
      )}
    </div>
  );
};

export default ParsedStatements;
