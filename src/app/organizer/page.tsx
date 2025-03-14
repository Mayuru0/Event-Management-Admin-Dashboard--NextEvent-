"use client";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import ViewOrgRejected from "@/components/organizers/view_org_rejected_view";

import ViewOrgPending from "@/components/organizers/view_org_pending_view.tsx";
import ViewOrgVerified from "@/components/organizers/view_org_verified_view";
;

const Page = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const tabs = ["Pending", "Verified", "Rejected"];

  return (
    <DefaultLayout>
      <div>
        {/* Header */}
        <h2 className="text-3xl font-bold text-[#0065AD]">Organizers</h2>

        {/* Tabs */}
        <div className="flex mt-4 bg-white p-2 rounded-lg shadow-md w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Component Rendering */}
        <div className="mt-4">
          {activeTab === "Pending" && <ViewOrgPending />}
          {activeTab === "Verified" && <ViewOrgVerified />}
          {activeTab === "Rejected" && <ViewOrgRejected />}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
