"use client";
import React, { useState } from "react";
import { useGetAllPaymentsQuery } from "@/Redux/features/paymentApiSlice";
import { PaymentType } from "@/type/PaymentType";

type TabFilter = "all" | "success" | "pending" | "failed";

const statusBadge: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed:  "bg-red-100 text-red-600",
};

const AllPayments = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const { data, isLoading, isError } = useGetAllPaymentsQuery();
  const allPayments: PaymentType[] = Array.isArray(data) ? data : [];

  const filtered =
    activeTab === "all" ? allPayments : allPayments.filter((p) => p.paymentStatus === activeTab);

  const counts: Record<TabFilter, number> = {
    all:     allPayments.length,
    success: allPayments.filter((p) => p.paymentStatus === "success").length,
    pending: allPayments.filter((p) => p.paymentStatus === "pending").length,
    failed:  allPayments.filter((p) => p.paymentStatus === "failed").length,
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const tabs: { label: string; value: TabFilter; color: string }[] = [
    { label: "All",     value: "all",     color: "bg-blue-600" },
    { label: "Success", value: "success", color: "bg-green-600" },
    { label: "Pending", value: "pending", color: "bg-yellow-500" },
    { label: "Failed",  value: "failed",  color: "bg-red-600" },
  ];

  if (isLoading) return <p className="mt-20 text-center text-xl font-semibold text-blue-600">Loading payments...</p>;
  if (isError)   return <p className="text-center text-lg font-semibold text-red-500">Failed to load payments.</p>;

  return (
    <div className="relative min-h-screen overflow-y-auto p-6">
      <div className="mt-4 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-[#1F1F1F]">Payment Records</h3>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{counts.success}</p>
            <p className="text-xs text-green-600 mt-1">Successful</p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{counts.pending}</p>
            <p className="text-xs text-yellow-600 mt-1">Pending</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{counts.failed}</p>
            <p className="text-xs text-red-600 mt-1">Failed</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">
              ${allPayments.filter(p => p.paymentStatus === "success").reduce((s, p) => s + p.amount, 0).toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">Total Revenue</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-2 flex-wrap">
          {tabs.map(({ label, value, color }) => (
            <button
              key={value}
              onClick={() => { setActiveTab(value); setCurrentPage(1); setSelectedPayment(null); }}
              className={`rounded-full border-2 px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTab === value ? `${color} text-white border-transparent` : "bg-transparent text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${activeTab === value ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"}`}>
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-200 text-left">
                <th className="p-3">#</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Event</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">No payments found.</td></tr>
              ) : (
                paginated.map((payment, index) => (
                  <tr key={payment._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{(currentPage - 1) * perPage + index + 1}</td>
                    <td className="p-3 font-medium text-[#1F1F1F]">{payment.customerName || "—"}</td>
                    <td className="p-3 text-[#1F1F1F]">{payment.eventTitle || "—"}</td>
                    <td className="p-3 font-semibold text-[#1F1F1F]">{payment.currency?.toUpperCase()} {payment.amount?.toFixed(2)}</td>
                    <td className="p-3 capitalize text-[#1F1F1F]">{payment.paymentMethod}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[payment.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                        {payment.paymentStatus === "success" ? "✓ " : payment.paymentStatus === "failed" ? "✗ " : ""}
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-[#1F1F1F]">{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="p-3">
                      <button className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white" onClick={() => setSelectedPayment(payment)}>
                        View 👁️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded bg-gray-300 px-4 py-2 text-sm disabled:opacity-50">Previous</button>
          <span className="py-2 text-sm">Page {currentPage} of {totalPages || 1}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="rounded bg-gray-300 px-4 py-2 text-sm disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Side Panel */}
      {selectedPayment && (
        <div className="fixed right-0 top-16 z-50 h-full w-[380px] overflow-y-auto bg-white p-6 shadow-xl">
          <button className="absolute right-4 top-4 text-xl text-gray-500 hover:text-black" onClick={() => setSelectedPayment(null)}>✖</button>
          <h3 className="text-lg font-bold text-blue-700">Payment Details</h3>
          <p className="mb-4 text-xs text-gray-500">Full payment record.</p>

          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusBadge[selectedPayment.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
            {selectedPayment.paymentStatus === "success" ? "✓ Paid" : selectedPayment.paymentStatus === "failed" ? "✗ Failed" : "⏳ Pending"}
          </span>

          <div className="mt-4 space-y-3 text-xs">
            {[
              { label: "Customer Name", value: selectedPayment.customerName },
              { label: "Event Title",   value: selectedPayment.eventTitle },
              { label: "Amount",        value: `${selectedPayment.currency?.toUpperCase()} ${selectedPayment.amount?.toFixed(2)}` },
              { label: "Payment Method",value: selectedPayment.paymentMethod },
              { label: "Payment Status",value: selectedPayment.paymentStatus },
              { label: "Date",          value: selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString() : "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block font-medium text-gray-700">{label}</label>
                <input className="w-full rounded-lg border bg-transparent p-2 capitalize" value={value || "—"} readOnly />
              </div>
            ))}
            <div>
              <label className="block font-medium text-gray-700">Stripe Session ID</label>
              <input className="w-full rounded-lg border bg-transparent p-2 text-xs break-all" value={selectedPayment.stripeSessionId || "—"} readOnly />
            </div>
          </div>

          <button onClick={() => setSelectedPayment(null)} className="mt-6 w-full bg-blue-700 py-2 text-xs text-white hover:bg-blue-800">Close</button>
        </div>
      )}
    </div>
  );
};

export default AllPayments;
