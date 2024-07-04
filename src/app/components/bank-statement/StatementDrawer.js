import { format, parse } from "date-fns";
import numeral from "numeral";
import { Fragment } from "react";

const StatementDrawer = ({ selectedStatement, closeDrawer }) => {
  return (
    <div className="drawer drawer-end">
      <input
        id="statement-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked
        readOnly
      />
      <div className="drawer-side">
        <label
          htmlFor="statement-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={closeDrawer}
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-1/2 sm:w-9/10 p-5">
          <div className="text-lg font-bold">
            {selectedStatement.issuer.businessName}
          </div>
          <div className="font-bold">
            {selectedStatement.bank.name} (
            {selectedStatement.form.bankAccountNumber})
          </div>
          <div className="divider w-full"></div>
          <div className="font-bold text-lg text-neutral">Summary</div>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedStatement.parsed.map((p) => (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-lg font-bold mb-2">
                    {format(parse(p.month, "MM-yyyy", new Date()), "MMM-yyyy")}
                  </h2>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th className="text-secondary">Credit Turnover</th>
                        <td className="text-right">
                          {numeral(p.creditTurnover).format("0,0.00")}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-accent border">Date</th>
                        <th className="text-accent border">Ending Balance</th>
                      </tr>
                      {Object.keys(p.endingBalance).map((k) => (
                        <tr>
                          <td className="border">
                            {format(
                              parse(p.month, "MM-yyyy", new Date()),
                              "MMM"
                            )}{" "}
                            {k}
                          </td>
                          <td className="text-right border">
                            {p.endingBalance[k]
                              ? numeral(p.endingBalance[k]).format("0,0.00")
                              : 0}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="text-secondary">Total Ending Balance</td>
                        <td className="text-right">
                          {numeral(
                            Object.values(p.endingBalance).reduce(
                              (acc, value) => acc + value,
                              0
                            )
                          ).format("0,0.00")}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-secondary">
                          Average Ending Balance
                        </td>
                        <td className="text-right">
                          {numeral(
                            Object.values(p.endingBalance).reduce(
                              (acc, value) => acc + value,
                              0
                            ) / 4
                          ).format("0,0.00")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            <div className="font-bold text-lg text-neutral mt-10">
              Bounced Checks / Reversals
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <table className="table border">
                <tbody>
                  <tr>
                    <th className="text-center text-accent border">Date</th>
                    <th className="text-center text-accent border">Amount</th>
                    <th className="text-center text-accent border">
                      Description
                    </th>
                  </tr>
                  {selectedStatement.parsed.map((p, x) => (
                    <Fragment key={x}>
                      {p.reversals.map((reversal) => (
                        <tr>
                          <td className="border">
                            {format(new Date(reversal.date), "MM/dd/yyyy")}
                          </td>
                          <td className="text-right border">
                            {numeral(reversal.credit).format("0,0.00")}
                          </td>
                          <td className="border">{reversal.description}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="font-bold text-lg text-neutral mt-10">
              Extracted Data
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {selectedStatement.parsed.map((p, x) => (
                <Fragment key={x}>
                  <span className="font-bold text-lg text-secondary">
                    {p.month}
                  </span>
                  <table className="table mb-16 border">
                    <tbody>
                      <tr>
                        <th className="text-center text-accent border">Date</th>
                        <th className="text-center text-accent border">
                          Description
                        </th>
                        <th className="text-center text-accent border">
                          Check Number
                        </th>
                        <th className="text-center text-accent border">
                          Debit
                        </th>
                        <th className="text-center text-accent border">
                          Credit
                        </th>
                        <th className="text-center text-accent border">
                          Balance
                        </th>
                      </tr>
                      {p.data.map((row, i) => (
                        <tr className="border-b border-gray-300" key={i}>
                          <td className="px-4 py-2 border-r border-gray-300">
                            {format(new Date(row.date), "MM/dd/yyyy")}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-300">
                            {row.description}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-300">
                            {row.checkNumber}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-300 text-right">
                            {numeral(row.debit).format("0,000.##")}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-300 text-right">
                            {numeral(row.credit).format("0,000.##")}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-300 text-right">
                            {numeral(row.balance).format("0,000.##")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementDrawer;
