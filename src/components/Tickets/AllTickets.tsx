"use client";
import React, { useState } from "react";
import {
  useGetTicketsQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "@/Redux/features/ticketApiSlice";
import { TicketType } from "@/type/TicketType";
import Swal from "sweetalert2";

type TabFilter = "all" | "pending" | "confirmed" | "cancelled";

const statusBadge: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  pending:   "bg-yellow-100 text-yellow-700",
};

const AllTickets = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 8;

  const { data, isLoading, isError } = useGetTicketsQuery();
  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  const allTickets: TicketType[] = Array.isArray(data) ? data : [];

  const filtered =
    activeTab === "all"
      ? allTickets
      : allTickets.filter((t) => (t.status || "pending") === activeTab);

  const counts: Record<TabFilter, number> = {
    all:       allTickets.length,
    pending:   allTickets.filter((t) => (t.status || "pending") === "pending").length,
    confirmed: allTickets.filter((t) => t.status === "confirmed").length,
    cancelled: allTickets.filter((t) => t.status === "cancelled").length,
  };

  const totalPages = Math.ceil(filtered.length / ticketsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedTicket(null);
  };

  const handleApprove = async (ticket: TicketType) => {
    const confirmed = await Swal.fire({
      title: "Approve Ticket?",
      text: `Approve ticket for "${ticket.name}" — ${ticket.event_title}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await updateTicket({ ticketId: ticket._id, status: "confirmed" }).unwrap();
      Swal.fire({ title: "Confirmed!", icon: "success", confirmButtonText: "OK" });
      setSelectedTicket(null);
    } catch {
      Swal.fire({ title: "Error!", text: "Failed to approve ticket.", icon: "error" });
    }
  };

  const handleReject = async (ticket: TicketType) => {
    const confirmed = await Swal.fire({
      title: "Reject Ticket?",
      text: `Reject ticket for "${ticket.name}" — ${ticket.event_title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await updateTicket({ ticketId: ticket._id, status: "cancelled" }).unwrap();
      Swal.fire({ title: "Cancelled!", icon: "success", confirmButtonText: "OK" });
      setSelectedTicket(null);
    } catch {
      Swal.fire({ title: "Error!", text: "Failed to reject ticket.", icon: "error" });
    }
  };

  const handleDelete = async (ticket: TicketType) => {
    const confirmed = await Swal.fire({
      title: "Delete Ticket?",
      text: `This will permanently delete "${ticket.name}"'s ticket. Cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await deleteTicket(ticket._id).unwrap();
      Swal.fire({ title: "Deleted!", icon: "success", confirmButtonText: "OK" });
      setSelectedTicket(null);
    } catch {
      Swal.fire({ title: "Error!", text: "Failed to delete ticket.", icon: "error" });
    }
  };

  if (isLoading) {
    return (
      <p className="mt-20 text-center text-xl font-semibold text-blue-600">
        Loading tickets...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-lg font-semibold text-red-500">
        Failed to load tickets.
      </p>
    );
  }

  const tabs: { label: string; value: TabFilter; color: string }[] = [
    { label: "All",       value: "all",       color: "bg-blue-600" },
    { label: "Pending",   value: "pending",   color: "bg-yellow-500" },
    { label: "Confirmed", value: "confirmed", color: "bg-green-600" },
    { label: "Cancelled", value: "cancelled", color: "bg-red-600" },
  ];

  return (
    <div className="relative min-h-screen overflow-y-auto p-6">
      <div className="mt-4 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-[#1F1F1F]">Ticket Bookings</h3>

        {/* Tabs */}
        <div className="mb-5 flex gap-2 flex-wrap">
          {tabs.map(({ label, value, color }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors border-2 ${
                activeTab === value
                  ? `${color} text-white border-transparent`
                  : "bg-transparent text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === value ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
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
                <th className="p-3 text-[#1F1F1F]">#</th>
                <th className="p-3 text-[#1F1F1F]">Customer</th>
                <th className="p-3 text-[#1F1F1F]">Event</th>
                <th className="p-3 text-[#1F1F1F]">Type</th>
                <th className="p-3 text-[#1F1F1F]">Qty</th>
                <th className="p-3 text-[#1F1F1F]">Total</th>
                <th className="p-3 text-[#1F1F1F]">Date</th>
                <th className="p-3 text-[#1F1F1F]">Status</th>
                <th className="p-3 text-[#1F1F1F]">Payment</th>
                <th className="p-3 text-[#1F1F1F]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                paginated.map((ticket, index) => {
                  const status = ticket.status || "pending";
                  return (
                    <tr key={ticket._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-gray-500">
                        {(currentPage - 1) * ticketsPerPage + index + 1}
                      </td>
                      <td className="p-3 font-medium text-[#1F1F1F]">{ticket.name}</td>
                      <td className="p-3 text-[#1F1F1F]">{ticket.event_title}</td>
                      <td className="p-3 text-[#1F1F1F]">{ticket.event_type}</td>
                      <td className="p-3 text-[#1F1F1F]">{ticket.quantity}</td>
                      <td className="p-3 text-[#1F1F1F]">${ticket.totalPrice}</td>
                      <td className="p-3 text-[#1F1F1F]">
                        {ticket.date ? new Date(ticket.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            statusBadge[status] ?? "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3">
                        {ticket.status === "confirmed" ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            ✓ Paid
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            ✗ Not Paid
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          View 👁️
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded bg-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-2 text-sm">Page {currentPage} of {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded bg-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Side Panel */}
      {selectedTicket && (
        <div className="fixed right-0 top-16 z-50 h-full w-[380px] overflow-y-auto bg-white p-6 shadow-xl">
          <button
            className="absolute right-4 top-4 text-xl text-gray-500 hover:text-black"
            onClick={() => setSelectedTicket(null)}
          >
            ✖
          </button>

          <h3 className="text-lg font-bold text-blue-700">Ticket Details</h3>
          <p className="mb-4 text-xs text-gray-500">Review and manage this booking.</p>

          {/* Badges row */}
          <div className="flex gap-2 flex-wrap">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                statusBadge[selectedTicket.status || "pending"] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {selectedTicket.status || "pending"}
            </span>
            {selectedTicket.status === "confirmed" ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                ✓ Paid
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                ✗ Not Paid
              </span>
            )}
          </div>

          {/* Details */}
          <div className="mt-4 space-y-3 text-xs">
            {[
              { label: "Customer Name", value: selectedTicket.name },
              { label: "Event Title",   value: selectedTicket.event_title },
              { label: "Event Type",    value: selectedTicket.event_type },
              { label: "Location",      value: selectedTicket.location },
              { label: "Quantity",      value: String(selectedTicket.quantity) },
              { label: "Total Price",   value: `$${selectedTicket.totalPrice}` },
              {
                label: "Date",
                value: selectedTicket.date
                  ? new Date(selectedTicket.date).toLocaleDateString()
                  : "N/A",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block font-medium text-gray-700">{label}</label>
                <input
                  className="w-full rounded-lg border bg-transparent p-2"
                  value={value || "N/A"}
                  readOnly
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2 text-xs">
            <button
              onClick={() => handleApprove(selectedTicket)}
              disabled={selectedTicket.status === "confirmed"}
              className="w-full border-2 border-green-600 py-2 text-green-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50"
            >
              ✓ Confirm
            </button>
            <button
              onClick={() => handleReject(selectedTicket)}
              disabled={selectedTicket.status === "cancelled"}
              className="w-full border-2 border-red-500 py-2 text-red-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50"
            >
              ✗ Reject
            </button>
            <button
              onClick={() => handleDelete(selectedTicket)}
              className="w-full bg-red-600 py-2 text-white hover:bg-red-700"
            >
              🗑️ Delete
            </button>
            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full bg-blue-700 py-2 text-white hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTickets;
