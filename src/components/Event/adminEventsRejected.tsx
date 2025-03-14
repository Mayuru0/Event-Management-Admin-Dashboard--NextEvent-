import React, { useState } from "react";
import Image from "next/image";
import { useGetAllEventsQuery } from "@/Redux/features/eventApiSlice";
import { Event } from "@/type/EventType";
import { useGetUserQuery } from "@/Redux/features/authApiSlice";

// Define the prop types for AdminEventsPending
interface AdminEventsPendingProps {
  onView: (event: Event) => void;
}




// Separate component to fetch and display user info
const UserInfo: React.FC<{ organizerId: string | undefined }> = ({ organizerId }) => {
  const { data: user, isLoading } = useGetUserQuery(organizerId || "");

  if (isLoading) return <span>Loading...</span>;

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

// Rename the component to avoid conflict
const adminEventsRejected: React.FC<AdminEventsPendingProps> = ({ onView }) => {
   const { data, isLoading, isError } = useGetAllEventsQuery();
  
    const filteredEvents: Event[] = Array.isArray(data)
      ? data.filter((event) => event.status === "Pending")
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
        setCurrentPage((prev) => prev + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
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
          Rejected Events
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-200 text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Organizer</th>
              <th className="p-3">Location</th>
              <th className="p-3">Tickets</th>
              <th className="p-3">Created Date</th>
              <th className="p-3">Actions</th>
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
                <td className="p-3 text-[#1F1F1F]">{event.location}</td>
                <td className="p-3 text-[#1F1F1F]">{event.quantity}</td>
                <td className="p-3 text-[#1F1F1F]">
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onView(event)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1 text-white"
                  >
                    View{" "}
                    <span role="img" aria-label="eye">
                      👁️
                    </span>
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
              className={`rounded-md px-4 py-2 ${currentPage === 1 ? "cursor-not-allowed bg-gray-300" : "bg-blue-500 text-white"}`}
            >
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`rounded-md px-4 py-2 ${currentPage === totalPages ? "cursor-not-allowed bg-gray-300" : "bg-blue-500 text-white"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default adminEventsRejected;
