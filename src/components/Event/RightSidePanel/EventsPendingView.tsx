"use client";
import { Calendar, MapPin } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Event } from "@/type/EventType";
import { useUpdateEventStatusMutation, useDeleteEventMutation } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2";

interface EventsPendingViewProps {
  event: Event | null;
  onClose: () => void;
}

const EventsPendingView: React.FC<EventsPendingViewProps> = ({ event, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [updateEventStatus] = useUpdateEventStatusMutation();
  const [deleteEvent] = useDeleteEventMutation();

  useEffect(() => {
    if (event) setIsVisible(true);
  }, [event]);

  if (!isVisible || !event) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "Approve Event?",
      text: `Publish "${event.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0065AD",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve",
    });
    if (!result.isConfirmed) return;
    try {
      await updateEventStatus({ eventId: event._id, status: "Published" }).unwrap();
      Swal.fire({ title: "Approved!", icon: "success", confirmButtonText: "OK" });
      handleClose();
    } catch (err) {
      console.error("Approve error:", err);
      Swal.fire({ title: "Error!", text: "Failed to approve event.", icon: "error" });
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Reject Event?",
      text: `Reject "${event.title}"?`,
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
      handleClose();
    } catch (err) {
      console.error("Reject error:", err);
      Swal.fire({ title: "Error!", text: "Failed to reject event.", icon: "error" });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: `Permanently delete "${event.title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteEvent(event._id).unwrap();
      Swal.fire({ title: "Deleted!", icon: "success", confirmButtonText: "OK" });
      handleClose();
    } catch {
      Swal.fire({ title: "Error!", text: "Failed to delete event.", icon: "error" });
    }
  };

  return (
    <div className="absolute right-0 z-50 flex w-[600px] flex-col items-center gap-6 overflow-y-auto border-l bg-white p-6 shadow-[0_0_5px_0_rgba(0,0,0,0.25)]" style={{ maxHeight: "100vh" }}>
      <div className="flex w-[476px] justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="mt-4 font-raleway text-2xl font-bold text-[#0065AD]">View Event</h2>
          <h4 className="font-kulim text-sm font-normal text-[#1F1F1F]">
            Approve or reject events by reviewing their details below.
          </h4>
        </div>
        <button className="flex items-center justify-center text-2xl font-medium text-[#1F1F1F] hover:text-red-500" onClick={handleClose}>✕</button>
      </div>

      {/* Event Image */}
      <div className="mt-2 flex h-[160px] w-[476px] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        {event.image ? (
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      {/* Status badge */}
      <div className="w-[476px]">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
          ⏳ Pending Review
        </span>
      </div>

      <div className="flex w-[476px] flex-col gap-4 font-kulim text-[#1F1F1F]">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-500">Title</label>
          <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">{event.title}</div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-500">Description</label>
          <div className="min-h-[80px] rounded border border-gray-200 bg-gray-50 p-3 text-sm">{event.description || "—"}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-500">Date</label>
            <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              {event.date ? new Date(event.date).toLocaleDateString() : "—"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-500">Type</label>
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">{event.event_type}</div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-500">Location</label>
          <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-3 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            {event.location}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-500">Ticket Price</label>
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-green-700">${event.ticket_price}</div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-500">Total Tickets</label>
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">{event.quantity}</div>
          </div>
        </div>
      </div>

      <div className="w-[476px] border-t pt-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 rounded-md border border-red-500 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            ✗ Reject
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            🗑️ Delete
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="flex-1 rounded-md bg-[#0065AD] py-2.5 text-sm font-bold text-white hover:bg-[#004d87] transition-colors"
          >
            ✓ Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPendingView;
