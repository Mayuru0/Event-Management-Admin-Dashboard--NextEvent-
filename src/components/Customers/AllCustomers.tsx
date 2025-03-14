"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useGetAllUsersQuery } from "@/Redux/features/authApiSlice";
import Swal from 'sweetalert2';
import { User } from '@/type/user';


const AllCustomers = () => {
  const [selectedOrganizer, setSelectedOrganizer] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const organizersPerPage = 5;

  const { data, isLoading, isError } = useGetAllUsersQuery();
  const organizers: User[] = Array.isArray(data) ? data.filter(user => user.role === "customer" ) : [];




  if (isLoading) {
    return (
      <p className="relative -mt-[20%] text-center text-xl font-semibold text-blue-600">
        Loading events...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-lg font-semibold text-red-500">
        Failed to load events.
      </p>
    );
  }





  const totalPages = Math.ceil(organizers.length / organizersPerPage);
  const paginatedOrganizers = organizers.slice(
    (currentPage - 1) * organizersPerPage,
    currentPage * organizersPerPage
  );

  return (
    <div className="relative min-h-screen overflow-y-auto p-6">
      {/* Table */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-[#1F1F1F]">
          Verified Organizers
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-left">
              <th className="p-3 text-[#1F1F1F]">Organizers</th>
              <th className="p-3 text-[#1F1F1F]">Creation Date</th>
              <th className="p-3 text-[#1F1F1F]">NIC</th>
              <th className="p-3 text-[#1F1F1F]">Address</th>
              <th className="p-3 text-[#1F1F1F]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrganizers.map((org, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="flex items-center gap-2 p-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={org.profilePic || "/default-avatar.png"}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {org.name}
                </td>
                <td className="p-3 text-[#1F1F1F]">
                  {org.createdAt
                    ? new Date(org.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-3 text-[#1F1F1F]">{org.nic || "N/A"}</td>
                <td className="p-3 text-[#1F1F1F]">{org.address || "N/A"}</td>
                <td className="p-3">
                  <button
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1 text-white"
                    onClick={() => setSelectedOrganizer(org)}
                  >
                    View 👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
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
