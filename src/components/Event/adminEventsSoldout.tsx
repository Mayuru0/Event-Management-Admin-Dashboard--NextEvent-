import React, { useState } from "react";
import Image from "next/image";
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice";
import { Event } from "@/type/EventType";
import { useGetUserQuery } from "@/Redux/features/authApiSlice";
import { useUpdateEventStatusMutation, useDeleteEventMutation } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2";

// Define the prop types for AdminEventsSoldout
interface AdminEventsSoldoutProps {
  onView: (event: Event) => void;
}

// Separate component to fetch and display user info
const UserInfo: React.FC<{ organizerId: string | undefined }> = ({ organizerId }) => {
  const { data: user, isLoading, isError } = useGetUserQuery(organizerId || "");

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span className="text-red-500">User not found</span>;

  return (
    <div className="flex items-center gap-2">
      <Image
        src={user?.profilePic || "/default-avatar.png"}
        alt="Organizer Avatar"
        width={30}
        height={30}
        className="rounded-full"
      />
      <span>{user?.name || "Unknown Organizer"}</span>
    </div>
  );
};

const AdminEventsSoldout: React.FC<AdminEventsSoldoutProps> = ({ onView }) => {
  const { data, isLoading, isError } = useGetAllEventsQuery();
  const [updateEventStatus] = useUpdateEventStatusMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const filteredEvents: Event[] = Array.isArray(data)
    ? data.filter((event) => event.status === "Archived") // archived/sold-out
    : [];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center text-xl font-semibold text-blue-600">
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

  return (
    <div className="min-h-screen p-6">
      {/* Table */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-[#1F1F1F]">
          Sold Out Events
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-left">
              <th className="p-3 text-[#1F1F1F]">Title</th>
              <th className="p-3 text-[#1F1F1F]">Type</th>
              <th className="p-3 text-[#1F1F1F]">Organizer</th>
              <th className="p-3 text-[#1F1F1F]">Location</th>
              <th className="p-3 text-[#1F1F1F]">Sold Tickets</th>
              <th className="p-3 text-[#1F1F1F]">date</th>
              <th className="p-3 text-[#1F1F1F]">Status</th>
              <th className="p-3 text-[#1F1F1F]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr key={event._id} className="border-b border-gray-300">
                <td className="p-3 text-[#1F1F1F]">{event.title}</td>
                <td className="p-3 text-[#1F1F1F]">{event.event_type}</td>
                <td className="p-3">
                  <UserInfo organizerId={event.organizerid} />
                </td>
                <td className="p-3 text-[#1F1F1F]">{event.location || "N/A"}</td>
                <td className="p-3 text-[#1F1F1F]">{event.quantity}</td>
                <td className="p-3 text-[#1F1F1F]">
                  {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-md px-3 py-1 text-sm ${
                      event.status === "Sold-Out"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="p-3 text-[#1F1F1F] flex gap-2">
                  <button
                    onClick={() => onView(event)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1 text-white"
                  >
                    View <span role="img" aria-label="eye">👁️</span>
                  </button>
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: "Restore Event?",
                        text: `Move \"${event.title}\" back to Published?`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#0065AD",
                        cancelButtonColor: "#6b7280",
                        confirmButtonText: "Yes, Restore",
                      });
                      if (!result.isConfirmed) return;
                      try {
                        await updateEventStatus({ eventId: event._id, status: "Published" }).unwrap();
                        Swal.fire({ title: "Restored!", icon: "success", confirmButtonText: "OK" });
                      } catch {
                        Swal.fire({ title: "Error!", text: "Failed to restore event.", icon: "error" });
                      }
                    }}
                    className="rounded-md bg-green-600 px-3 py-1 text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: "Reject Event?",
                        text: `Mark \"${event.title}\" as Rejected?`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#dc2626",
                        cancelButtonColor: "#6b7280",
                        confirmButtonText: "Yes, Reject",
                      });
                      if (!result.isConfirmed) return;
                      try {
                        await updateEventStatus({ eventId: event._id, status: "Rejected" }).unwrap();
                        Swal.fire({ title: "Rejected!", icon: "success", confirmButtonText: "OK" });
                      } catch {
                        Swal.fire({ title: "Error!", text: "Failed to reject event.", icon: "error" });
                      }
                    }}
                    className="rounded-md bg-red-600 px-3 py-1 text-white"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`rounded-md px-4 py-2 ${
                currentPage === 1 ? "cursor-not-allowed bg-gray-300" : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`rounded-md px-4 py-2 ${
                currentPage === totalPages ? "cursor-not-allowed bg-gray-300" : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsSoldout;
