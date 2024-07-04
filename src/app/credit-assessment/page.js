"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import withAuth from "@/helpers/WithAuth";
import { postApi } from "@/helpers/api-helpers";

const Notes = lazy(() => import("../components/assessment/Notes"));

function CreditAssessment() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [pendingCount, setPendingCount] = useState(0);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getPendingCount = async () => {
    const data = await postApi("assessment/get-note-count", {
      loanStatus: "pending",
    });

    if (data.success) {
      setPendingCount(data.count);
    } else {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    getPendingCount();
  }, []);

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
            Pending{" "}
            <span className="badge badge-secondary ml-2 text-white">
              {pendingCount}
            </span>
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
        </div>
      </div>

      <div className="border border-t-0 bg-white w-full">
        {activeTab === "tab1" && (
          <Suspense
            fallback={
              <div className="h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            }
          >
            <Notes
              loanStatus="pending"
              getPendingCount={getPendingCount}
              pendingCount={pendingCount}
            />
          </Suspense>
        )}
        {activeTab === "tab2" && (
          <Suspense
            fallback={
              <div className="h-screen flex items-center justify-center">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            }
          >
            <Notes loanStatus="done" pendingCount={pendingCount} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default withAuth(CreditAssessment);