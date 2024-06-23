"use client";

import React, { useState } from "react";
import withAuth from "@/helpers/WithAuth";
import Notes from "../components/assessment/Notes";

function CreditAssessment() {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="drawer-content p-10 container mx-auto">
      <div className="text-secondary font-bold text-3xl mb-5">
        Credit Assessment
      </div>

      <div className="flex justify-start mb-0">
        <div className="tabs">
          <button
            className={`tab tab-bordered ${
              activeTab === "tab1"
                ? "tab-active !border-b-2 !border-primary text-primary font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("tab1")}
          >
            Pending <span className="badge badge-secondary ml-2">2</span>
          </button>
          <button
            className={`tab tab-bordered ${
              activeTab === "tab2"
                ? "tab-active !border-b-2 !border-primary text-primary font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("tab2")}
          >
            Recent
          </button>
          <button
            className={`tab tab-bordered ${
              activeTab === "tab3"
                ? "tab-active !border-b-2 !border-primary text-primary font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("tab3")}
          >
            Search
          </button>
        </div>
      </div>

      <div className="border border-t-0 bg-white w-full">
        {activeTab === "tab1" && <Notes loanStatus="pending" />}
        {activeTab === "tab2" && <Notes loanStatus="recent" />}
        {activeTab === "tab3" && <Notes loanStatus="hits" />}
      </div>
    </div>
  );
}

export default withAuth(CreditAssessment);
