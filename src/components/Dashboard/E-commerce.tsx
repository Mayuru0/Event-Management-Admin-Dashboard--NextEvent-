"use client";
import React from "react";
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice";
import { useGetAllPaymentsQuery } from "@/Redux/features/paymentApiSlice";
import { useGetTicketsQuery } from "@/Redux/features/ticketApiSlice";
import { useGetAllUsersQuery } from "@/Redux/features/authApiSlice";
import { PaymentType } from "@/type/PaymentType";

const statusColors: Record<string, string> = {
  Pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  Published: "bg-green-100 text-green-700 border-green-200",
  Rejected:  "bg-red-100 text-red-700 border-red-200",
  Archived:  "bg-gray-100 text-gray-600 border-gray-200",
};

const paymentBadge: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed:  "bg-red-100 text-red-700",
};

const ECommerce: React.FC = () => {
  const { data: eventsData, isLoading: eventsLoading } = useGetAllEventsQuery();
  const { data: paymentsData, isLoading: paymentsLoading } = useGetAllPaymentsQuery();
  const { data: ticketsData, isLoading: ticketsLoading } = useGetTicketsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();

  const events = Array.isArray(eventsData) ? eventsData : [];
  const payments: PaymentType[] = Array.isArray(paymentsData) ? paymentsData : [];
  const tickets = Array.isArray(ticketsData) ? ticketsData : [];
  const users = Array.isArray(usersData) ? usersData : [];

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "success")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const ticketsSold = tickets.filter((t) => t.status === "confirmed").length;

  const eventStatusCounts = {
    Pending:   events.filter((e) => e.status === "Pending").length,
    Published: events.filter((e) => e.status === "Published").length,
    Rejected:  events.filter((e) => e.status === "Rejected").length,
    Archived:  events.filter((e) => e.status === "Archived").length,
  };

  const recentPayments = payments
    .filter((p) => p.paymentStatus === "success")
    .slice(0, 6);

  const loading = eventsLoading || paymentsLoading || ticketsLoading || usersLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0065AD] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Events */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <svg className="h-6 w-6 text-[#0065AD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">{eventStatusCounts.Published} live</span>
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-bold text-[#1F1F1F]">{events.length}</h4>
            <p className="mt-1 text-sm text-gray-500">Total Events</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">{payments.filter(p => p.paymentStatus === "success").length} txns</span>
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-bold text-[#1F1F1F]">${totalRevenue.toFixed(0)}</h4>
            <p className="mt-1 text-sm text-gray-500">Total Revenue</p>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600">{tickets.length} total</span>
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-bold text-[#1F1F1F]">{ticketsSold}</h4>
            <p className="mt-1 text-sm text-gray-500">Tickets Sold</p>
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500">registered</span>
          </div>
          <div className="mt-4">
            <h4 className="text-3xl font-bold text-[#1F1F1F]">{users.length}</h4>
            <p className="mt-1 text-sm text-gray-500">Total Users</p>
          </div>
        </div>
      </div>

      {/* Second Row: Event Status + Recent Payments */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Event Status Breakdown */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-[#1F1F1F]">Event Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(eventStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}>{status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${status === "Published" ? "bg-green-500" : status === "Pending" ? "bg-yellow-400" : status === "Rejected" ? "bg-red-500" : "bg-gray-400"}`}
                      style={{ width: events.length ? `${(count / events.length) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold text-gray-700">{count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t pt-4">
            <h3 className="mb-3 text-base font-semibold text-[#1F1F1F]">Payment Summary</h3>
            <div className="space-y-2">
              {[
                { label: "Successful", count: payments.filter(p => p.paymentStatus === "success").length, color: "bg-green-500" },
                { label: "Pending",    count: payments.filter(p => p.paymentStatus === "pending").length,  color: "bg-yellow-400" },
                { label: "Failed",     count: payments.filter(p => p.paymentStatus === "failed").length,   color: "bg-red-500" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    <span className="text-gray-600">{label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Successful Payments */}
        <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1F1F1F]">Recent Payments</h3>
            <a href="/payments" className="text-xs font-medium text-[#0065AD] hover:underline">View all →</a>
          </div>
          {recentPayments.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-gray-400 text-sm">No payments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Event</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-[#1F1F1F]">{payment.customerName || "—"}</td>
                      <td className="py-3 text-gray-600 max-w-[140px] truncate">{payment.eventTitle || "—"}</td>
                      <td className="py-3 font-semibold text-gray-800">${payment.amount?.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentBadge[payment.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                          {payment.paymentStatus === "success" ? "✓ Paid" : payment.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Third Row: Recent Events */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#1F1F1F]">Recent Events</h3>
          <a href="/Events" className="text-xs font-medium text-[#0065AD] hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Tickets Left</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.slice(0, 8).map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-[#1F1F1F] max-w-[180px] truncate">{event.title}</td>
                  <td className="py-3 text-gray-600">{event.event_type}</td>
                  <td className="py-3 text-gray-600 max-w-[120px] truncate">{event.location}</td>
                  <td className="py-3 font-semibold text-gray-800">${event.ticket_price}</td>
                  <td className="py-3 text-gray-600">{event.quantity}</td>
                  <td className="py-3">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[event.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-gray-500">{event.date ? new Date(event.date).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div className="flex h-24 items-center justify-center text-gray-400 text-sm">No events yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
