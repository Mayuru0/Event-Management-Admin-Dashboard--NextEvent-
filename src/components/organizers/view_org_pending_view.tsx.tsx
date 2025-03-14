"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useGetAllUsersQuery } from "@/Redux/features/authApiSlice";
import Swal from 'sweetalert2';
import { User } from '@/type/user';
import { useUpdateUserStatusMutation } from "@/Redux/features/authApiSlice";

const ViewOrgPending = () => {
  const [selectedOrganizer, setSelectedOrganizer] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const organizersPerPage = 5;

  const { data, isLoading, isError } = useGetAllUsersQuery();
  const organizers: User[] = Array.isArray(data) ? data.filter(user => user.role === "organizer" && user.status === "pending") : [];


  const [update] = useUpdateUserStatusMutation();

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

  console.log("orgaanizer", selectedOrganizer?._id)
  console.log("status", selectedOrganizer?.status)

  const handleUpdate = async (organizer: User | null) => {


    if (!organizer) return;

      // Confirm the rejection action with the user
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to verified this organizer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, verified",
        cancelButtonText: "No, Cancel",
      });
    
      if (!confirmed.isConfirmed) return; // Do nothing if the user cancels
  
    try {
      // Update the user status to "approved"
      const response = await update({ UserId: organizer._id, status: "verified" }).unwrap();
      
      // Show a success alert
      Swal.fire({
        title: "Success!",
        text: "Organizer has been approved.",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      // Close the sidebar after the update
      setSelectedOrganizer(null);
  
    } catch (error) {
      // Handle error (e.g., show an alert)
      Swal.fire({
        title: "Error!",
        text: "Failed to update organizer status.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleReject = async (organizer: User | null) => {
    if (!organizer) return;
  
    // Confirm the rejection action with the user
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to reject this organizer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "No, Cancel",
    });
  
    if (!confirmed.isConfirmed) return; // Do nothing if the user cancels
  
    try {
      // Update the user status to "rejected"
      const response = await update({ UserId: organizer._id, status: "rejected" }).unwrap();
      
      // Show a success alert
      Swal.fire({
        title: "Rejected!",
        text: "Organizer has been rejected.",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      // Close the sidebar after the update
      setSelectedOrganizer(null);
  
    } catch (error) {
      // Handle error (e.g., show an alert)
      Swal.fire({
        title: "Error!",
        text: "Failed to reject organizer.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };
  
  
  
  

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

        {/* Sidebar Panel */}
        {selectedOrganizer && (
          <div className="fixed right-0 top-16 h-full w-[360px] bg-white p-6 shadow-lg">
            <button
              className="absolute right-4 top-4 text-xl"
              onClick={() => setSelectedOrganizer(null)}
            >
              ✖
            </button>

            <h3 className="text-left text-lg font-bold text-blue-700">
              View Organizer
            </h3>
            <p className=" text-left text-xs text-gray-500">
              View organizer details and their active <br /> events for easy
              tracking.
            </p>

            {/* Profile Image */}
            <div className="mt-4 flex justify-start">
              <div className="h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-gray-300">
                <Image
                  src={selectedOrganizer.profilePic || "/default-avatar.png"}
                  alt="Organizer"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Organizer Details */}
            <div className="mt-2 text-xs">
              {[
                { label: "Name", value: selectedOrganizer.name },
                { label: "NIC", value: selectedOrganizer.nic },
                { label: "Gender", value: selectedOrganizer.gender },
                { label: "Address", value: selectedOrganizer.address },
                { label: "Email", value: selectedOrganizer.email },
              ].map(({ label, value }, index) => (
                <div key={index}>
                  <label className="mt-4 block font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    className="w-full rounded-lg border bg-transparent p-2"
                    value={value || "N/A"}
                    readOnly
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-between text-xs">
  {/* Approve Button */}
  <button
    onClick={() => handleUpdate(selectedOrganizer)}
    className="w-1/2 border-2 border-blue-700 bg-transparent px-4 py-2 text-blue-700"
  >
    Approve
  </button>

  {/* Reject Button */}
  <button
    onClick={() => handleReject(selectedOrganizer)}
    className="ml-2 w-1/2 border-2 border-red-700 bg-transparent px-4 py-2 text-red-700"
  >
    Reject
  </button>

  {/* Close Button */}
  <button
    onClick={() => setSelectedOrganizer(null)}
    className="ml-2 w-1/2 bg-blue-700 px-4 py-2 text-white"
  >
    Close
  </button>
</div>

          </div>
        )}

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

export default ViewOrgPending;
