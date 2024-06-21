"use client";

import React, { useEffect, useState, useContext } from "react";
import { ToastContext } from "../store/context/ToastContextProvider";
import withAuth from "@/helpers/WithAuth";
import { postApi } from "@/helpers/api-helpers";
import Notes from "../components/assessment/Notes";

function CreditAssessment() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [pending, setPending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getPending = async () => {
    setLoading(true);
    try {
      const data = await postApi("assessment/getNotes", {
        loanStatus: "pending",
      });
      addToast({
        message: "It is what it is... error eh? Luckily this is a test. Ooops!",
        type: "error",
      });

      console.log(data.notes);

      setPending(data.notes);
    } catch (err) {
      addToast({
        message: "It is what it is... error eh? Luckily this is a test. Ooops!",
        type: "error",
      });
      console.error("Error fetching pending items:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRecent = async () => {
    return [];
  };

  const doSearch = async () => {
    return [];
  };

  const refreshData = async () => {
    await getPending();
    await getRecent();
  };

  useEffect(() => {
    let isMounted = true;

    const fetchNotes = async () => {
      if (isMounted) {
        await refreshData();
      }
    };
    fetchNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="drawer-content p-10 container mx-auto">
      <div className="text-secondary font-bold text-3xl mb-5">
        Credit Assessment
      </div>

      <div className="flex justify-start mb-0">
        <div className="tabs">
          <a
            className={`tab tab-bordered ${
              activeTab === "tab1"
                ? "tab-active !border-b-2 !border-primary text-primary font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("tab1")}
          >
            Pending <span className="badge badge-secondary ml-2">2</span>
          </a>
          <a
            className={`tab tab-bordered ${
              activeTab === "tab2"
                ? "tab-active !border-b-2 !border-primary text-primary font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("tab2")}
          >
            Recent
          </a>
          <a
            className={`tab tab-bordered ${
              activeTab === "tab3"
                ? "tab-active !border-b-2 !border-primary text-primary font-bold"
                : ""
            }`}
            onClick={() => handleTabClick("tab3")}
          >
            Search
          </a>
        </div>
      </div>

      <div className="border border-t-0 bg-white p-4 rounded-b-lg mt-[-1px]">
        {loading ? (
          <div>Put Skeleton Here...</div>
        ) : (
          <>
            {activeTab === "tab1" && <Notes data={pending} />}
            {activeTab === "tab2" && <Notes data={recent} />}
            {activeTab === "tab3" && <Notes data={hits} />}
          </>
        )}
      </div>
    </div>
  );
}

export default withAuth(CreditAssessment);
