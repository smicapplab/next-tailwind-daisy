"use client";

import withAuth from "@/helpers/WithAuth";

function Dashboard() {
  return (
    <div className="drawer-content p-10 w-full">
      <div className="text-secondary font-bold text-3xl mb-5">Dashboard</div>
      <div className="text-lg text-gray-800">Key Risk Indicators</div>
      <div className="mb-10">
        <div className="stats shadow">
          <div className="stat place-items-center">
            <div className="stat-title">Probability of Default</div>
            <div className="stat-value text-red-600">1.5%</div>
            <div className="stat-desc text-red-600">↗︎ 20 (0.3%)</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Exposure at Default</div>
            <div className="stat-value text-secondary">3.7M</div>
            <div className="stat-desc text-green-800">↘️ 30K (-0.4%)</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Loss Given Default</div>
            <div className="stat-value">35.3%</div>
            <div className="stat-desc text-green-800">↘︎ (22%)</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Expected Loss</div>
            <div className="stat-value text-orange-600">986K</div>
            <div className="stat-desc text-green-800">↘︎ (22%)</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Ave Investor Exposure</div>
            <div className="stat-value text-blue-500">6.3M</div>
            <div className="stat-desc text-green-800">↗︎ (76%)</div>
          </div>
        </div>
      </div>

      <div className="text-lg text-gray-800">Activities</div>
      <div className="mb-10">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">New Applications</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Ave Loan Amount</div>
            <div className="stat-value">3.6M</div>
            <div className="stat-desc text-green-800">↗︎ 400k (22%)</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Rejections</div>
            <div className="stat-value">200</div>
            <div className="stat-desc text-green-800">↘︎ 90 (14%)</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Cancellations</div>
            <div className="stat-value">1,234</div>
            <div className="stat-desc text-green-800">↘︎ 3,456 (54%)</div>
          </div>
        </div>
      </div>

      <div className="text-lg text-gray-800">Exposure by Credit Rating</div>
      <div class="grid grid-cols-2 gap-4 mb-10">
        <div class="grid grid-cols-11 gap-4 p-4 bg-white rounded-2xl shadow-md ">
          <div class="p-2 col-span-1 h-10 right text-sm">A+</div>
          <div class="bg-primary p-2 col-span-10 w-1/5 h-10"></div>
          <div class="p-2 col-span-1 h-10 text-sm">A</div>
          <div class="bg-primary p-2 col-span-10 w-1/3 h-10"></div>
          <div class="p-2 col-span-1 h-10 text-sm">B</div>
          <div class="bg-primary p-2 col-span-10 w-1/2 h-10"></div>
          <div class="p-2 col-span-1 h-10 text-sm">B-</div>
          <div class="bg-primary p-2 col-span-10 w-full h-10"></div>
          <div class="p-2 col-span-1 h-10 text-sm">C+</div>
          <div class="bg-primary p-2 col-span-10 w-1/5 h-10"></div>
          <div class="p-2 col-span-1 h-10 text-sm">C</div>
          <div class="bg-primary p-2 col-span-10 w-1/3 h-10"></div>
          <div class="p-2 col-span-1 h-10 text-sm">C-</div>
          <div class="bg-primary p-2 col-span-10 w-1/4 h-10 "></div>
          <div class="p-2 col-span-1 h-10"></div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">0</div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">5M</div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">10M</div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">15M</div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">20M</div>
        </div>
      </div>

      <div className="text-lg text-gray-800">Exposure by Industry</div>
      <div class="grid grid-cols-2 gap-4 mb-10">
        <div class="grid grid-cols-11 gap-4 p-4 bg-white rounded-2xl shadow-md ">
          <div class="p-2 col-span-3 h-10 text-sm">Manufacturing</div>
          <div class="bg-primary p-2 col-span-8 w-11/12 h-10"></div>
          <div class="p-2 col-span-3 h-10 text-sm">Healthcare Equipment</div>
          <div class="bg-primary p-2 col-span-8 w-1/2 h-10"></div>
          <div class="p-2 col-span-3 h-10 text-sm">Construction</div>
          <div class="bg-primary p-2 col-span-8 w-full h-10"></div>
          <div class="p-2 col-span-3 h-10 text-sm">Installation</div>
          <div class="bg-primary p-2 col-span-8 w-1/5 h-10"></div>
          <div class="p-2 col-span-3 h-10 text-sm">Trading</div>
          <div class="bg-primary p-2 col-span-8 w-1/3 h-10"></div>
          <div class="p-2 col-span-3 h-10 text-sm">Services</div>
          <div class="bg-primary p-2 col-span-8 w-11/12 h-10 "></div>
          <div class="p-2 col-span-3 h-10 text-sm">Materials</div>
          <div class="bg-primary p-2 col-span-8 w-1/5 h-10"></div>
          <div class="p-2 col-span-3 h-10"></div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">0</div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">5M</div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">10M</div>
          <div class="p-2 col-span-2 h-10 text-sm text-gray-800">15M</div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
