import { format } from "date-fns";

const headers = ["Business Name", "Bank", "Upload Date", "Status", ""];

const ParsedStatements = ({ statements }) => {
  return (
    <div className="w-full">
      <table className="table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th className="text-center text-primary font-semibold text-sm">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statements.map(
            ({ sk, issuer: { businessName }, bank, status }, i) => (
              <tr key={i}>
                <td>{businessName}</td>
                <td>{bank.name}</td>
                <td className="text-center">
                  {format(new Date(sk), "MMM dd, yyyy hh:ss a")}
                </td>
                <td className="text-center">
                  {status === "PENDING" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    ""
                  )}
                </td>
                <td></td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParsedStatements;
