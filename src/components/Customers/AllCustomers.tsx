"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/Redux/features/authApiSlice";
import { useGetTicketsQuery } from "@/Redux/features/ticketApiSlice";
import Swal from "sweetalert2";
import { User } from "@/type/user";

export type FilterType = "all" | "bought" | "not_bought";

interface AllCustomersProps {
  filter?: FilterType;
}

const AllCustomers = ({ filter = "all" }: AllCustomersProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  const { data: usersData, isLoading: usersLoading, isError: usersError } = useGetAllUsersQuery();
  const { data: ticketsData, isLoading: ticketsLoading } = useGetTicketsQuery();
  const [deleteUser] = useDeleteUserMutation();

  const allCustomers: User[] = Array.isArray(usersData)
    ? usersData.filter((user) => user.role === "customer")
    : [];

  // Set of customer IDs who have bought at least one ticket
  const buyerIds = new Set(
    Array.isArray(ticketsData) ? ticketsData.map((t) => t.userId) : []
  );

  const filteredCustomers =
    filter === "bought"
      ? allCustomers.filter((c) => buyerIds.has(c._id))
      : filter === "not_bought"
      ? allCustomers.filter((c) => !buyerIds.has(c._id))
      : allCustomers;

  if (usersLoading || ticketsLoading) {
    return (
      <p className="text-center text-xl font-semibold text-blue-600 mt-20">
        Loading customers...
      </p>
    );
  }

  if (usersError) {
    return (
      <p className="text-center text-lg font-semibold text-red-500">
        Failed to load customers.
      </p>
    );
  }

  const handleDelete = async (customer: User) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${customer.name}". This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmed.isConfirmed) return;

    try {
      await deleteUser(customer._id).unwrap();
      Swal.fire({
        title: "Deleted!",
        text: `${customer.name} has been deleted.`,
        icon: "success",
        confirmButtonText: "OK",
      });
      setSelectedCustomer(null);
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete customer. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  return (
    <div className="relative min-h-screen overflow-y-auto p-6">
      <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-[#1F1F1F]">
          {filter === "bought" ? "Ticket Bought Customers" : filter === "not_bought" ? "No Ticket Customers" : "All Customers"}
        </h3>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-left">
              <th className="p-3 text-[#1F1F1F]">Customer</th>
              <th className="p-3 text-[#1F1F1F]">Creation Date</th>
              <th className="p-3 text-[#1F1F1F]">NIC</th>
              <th className="p-3 text-[#1F1F1F]">Contact</th>
              <th className="p-3 text-[#1F1F1F]">Ticket</th>
              <th className="p-3 text-[#1F1F1F]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="flex items-center gap-2 p-3">
                    <div className="h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={customer.profilePic || "/default-avatar.png"}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {customer.name}
                  </td>
                  <td className="p-3 text-[#1F1F1F]">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3 text-[#1F1F1F]">{customer.nic || "N/A"}</td>
                  <td className="p-3 text-[#1F1F1F]">{customer.contactNumber || "N/A"}</td>
                  <td className="p-3">
                    {buyerIds.has(customer._id) ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Bought
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                        No Ticket
                      </span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-white text-xs"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      View 👁️
                    </button>
                    <button
                      className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1 text-white text-xs"
                      onClick={() => handleDelete(customer)}
                    >
                      Delete 🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* View Side Panel */}
        {selectedCustomer && (
          <div className="fixed right-0 top-16 h-full w-[360px] bg-white p-6 shadow-lg z-50 overflow-y-auto">
            <button
              className="absolute right-4 top-4 text-xl"
              onClick={() => setSelectedCustomer(null)}
            >
              ✖
            </button>

            <h3 className="text-left text-lg font-bold text-blue-700">View Customer</h3>
            <p className="text-left text-xs text-gray-500">
              Customer details and account information.
            </p>

            {/* Ticket badge */}
            <div className="mt-2">
              {buyerIds.has(selectedCustomer._id) ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  ✓ Has Purchased Tickets
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                  ✗ No Tickets Purchased
                </span>
              )}
            </div>

            {/* Profile Image */}
            <div className="mt-4 flex justify-start">
              <div className="h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-gray-300">
                <Image
                  src={selectedCustomer.profilePic || "/default-avatar.png"}
                  alt="Customer"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="mt-2 text-xs">
              {[
                { label: "Name", value: selectedCustomer.name },
                { label: "NIC", value: selectedCustomer.nic },
                { label: "Gender", value: selectedCustomer.gender },
                { label: "Email", value: selectedCustomer.email },
                { label: "Contact Number", value: selectedCustomer.contactNumber },
                { label: "Address", value: selectedCustomer.address },
              ].map(({ label, value }, index) => (
                <div key={index}>
                  <label className="mt-4 block font-medium text-gray-700">{label}</label>
                  <input
                    className="w-full rounded-lg border bg-transparent p-2"
                    value={value || "N/A"}
                    readOnly
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-2 text-xs">
              <button
                onClick={() => handleDelete(selectedCustomer)}
                className="w-1/2 border-2 border-red-600 bg-transparent px-4 py-2 text-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-1/2 bg-blue-700 px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCustomers;
