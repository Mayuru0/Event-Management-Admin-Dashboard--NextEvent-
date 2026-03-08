"use client";
import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AllCustomers, { FilterType } from "@/components/Customers/AllCustomers";
import { useGetAllUsersQuery } from "@/Redux/features/authApiSlice";
import { useGetTicketsQuery } from "@/Redux/features/ticketApiSlice";

const tabs: { label: string; value: FilterType }[] = [
  { label: "All Customers", value: "all" },
  { label: "Ticket Bought", value: "bought" },
  { label: "No Ticket", value: "not_bought" },
];

const Page = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const { data: usersData } = useGetAllUsersQuery();
  const { data: ticketsData } = useGetTicketsQuery();

  const allCustomers = Array.isArray(usersData)
    ? usersData.filter((u) => u.role === "customer")
    : [];
  const buyerIds = new Set(
    Array.isArray(ticketsData) ? ticketsData.map((t) => t.userId) : []
  );

  const counts: Record<FilterType, number> = {
    all: allCustomers.length,
    bought: allCustomers.filter((c) => buyerIds.has(c._id)).length,
    not_bought: allCustomers.filter((c) => !buyerIds.has(c._id)).length,
  };

  return (
    <DefaultLayout>
      <div>
        <h2 className="text-3xl font-bold text-[#0065AD]">Customers</h2>

        {/* Filter Tabs */}
        <div className="flex mt-4 bg-white p-2 rounded-lg shadow-md w-max gap-1">
          {tabs.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  activeFilter === value
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Component Render */}
        <div className="mt-4">
          <AllCustomers filter={activeFilter} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
