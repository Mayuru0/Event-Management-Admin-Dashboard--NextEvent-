"use client";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


import ViewOrgVerified from "@/components/organizers/view_org_verified_view";
import AllCustomers from "@/components/Customers/AllCustomers";
;

const Page = () => {
  const [activeTab, setActiveTab] = useState("All Customers");
  const tabs = ["All Customers", "Tickets buy Customers"];

  return (
    <DefaultLayout>
      <div>
        {/* Header */}
        <h2 className="text-3xl font-bold text-[#0065AD]">Customers</h2>

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
          {activeTab === "All Customers" && <AllCustomers />}
          {activeTab === "Tickets buy Customers" && <ViewOrgVerified />}
          
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
