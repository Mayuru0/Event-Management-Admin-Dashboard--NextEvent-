"use client";
import { Calendar, MapPin, X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useUpdateEventStatusMutation, useDeleteEventMutation } from "@/Redux/features/eventApiSlice";
import Swal from "sweetalert2";

// use shared Event type from central definitions
import { Event } from "@/type/EventType";

// (local variations like tickets/price are derived from the shared structure)

const products = [
  { title: "VIP", price: "$99", qty: "x50" },
  { title: "Premium", price: "$149", qty: "x30" },
  { title: "Basic", price: "$49", qty: "x100" },
];

// Define the prop types for the sold‑out panel (renamed and include onClose)
interface EventsSouldoutViewProps {
  event: Event | null; // event can either be an Event or null
  onClose: () => void;
}

const EventsSouldoutView: React.FC<EventsSouldoutViewProps> = ({ event, onClose }) => {
  const [formData, setFormData] = useState<Event | null>(event); // Ensure formData is either Event or null
  const [isVisible, setIsVisible] = useState(false);
  const [updateEventStatus] = useUpdateEventStatusMutation();
  const [deleteEvent] = useDeleteEventMutation();

  useEffect(() => {
    if (event) {
      setFormData(event);
      setIsVisible(true);
    }
  }, [event]);

  // Check if formData is valid before accessing its properties
  if (!isVisible || !formData) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "Restore Event?",
      text: `Move "${formData?.title}" back to Published?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0065AD",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Restore",
    });
    if (!result.isConfirmed || !formData) return;
    try {
      await updateEventStatus({ eventId: formData._id, status: "Published" }).unwrap();
      Swal.fire({ title: "Restored!", icon: "success", confirmButtonText: "OK" });
      handleClose();
    } catch {
      Swal.fire({ title: "Error!", text: "Failed to restore event.", icon: "error" });
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Reject Archived Event?",
      text: `Mark "${formData?.title}" as Rejected?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
    });
    if (!result.isConfirmed || !formData) return;
    try {
      await updateEventStatus({ eventId: formData._id, status: "Rejected" }).unwrap();
      Swal.fire({ title: "Rejected!", icon: "success", confirmButtonText: "OK" });
      handleClose();
    } catch {
      Swal.fire({ title: "Error!", text: "Failed to reject event.", icon: "error" });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleIconClick = () => {
    // Handle calendar icon click if necessary
  };

  return (
    <div className="z- absolute right-0 flex h-[1,621px] w-[600px] flex-col items-center gap-6 border-l bg-white                  p-6 text-white shadow-[0_0_5px_0_rgba(0,0,0,0.25)]">
      <div className="flex w-[476px] justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="mt-4 font-raleway text-2xl font-bold text-[#0065AD]">
            View Event
          </h2>
          <h4 className="h-[50px] w-[341px] font-kulim text-lg font-normal text-[#1F1F1F]">
            Approve or reject Events by reviewing their details in this panel.
          </h4>
        </div>
        <button
          className="flex items-center justify-center gap-1 text-3xl font-medium text-[#1F1F1F]"
          onClick={handleClose}
        >
          X
        </button>
      </div>

      <div className="mt-4 flex h-[131px] w-[476px] items-center justify-center overflow-hidden">
        <Image
          src={"/images/eventView.png"}
          width={476}
          height={131}
          alt="eventImage"
        />
      </div>

      <form className="flex flex-col items-center space-y-7 font-kulim text-[#1F1F1F]">
        <div className="flex flex-col gap-[5px]">
          <label className="font-kulim text-lg font-normal">Title</label>
          <input
            type="text"
            className="h-14 w-[476px] rounded border-[1px] border-black bg-transparent p-2 text-[#888888]"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="font-kulim text-lg font-normal">Description</label>
          <textarea
            className="h-[125px] w-[476px] rounded border-[1px] border-black bg-transparent p-2 text-[#888888]"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="relative flex flex-col gap-[5px]">
          <label className="font-kulim text-lg font-normal">Date</label>
          <input
            type="text"
            className="h-14 w-[476px] rounded border-[1px] border-black bg-transparent p-2 text-[#888888]"
            value={formData.date}
            onChange={handleChange}
          />
          <Calendar
            className="absolute right-4 top-12 cursor-pointer text-black"
            onClick={handleIconClick}
          />
        </div>

        <div className="relative flex flex-col gap-[5px]">
          <label className="font-kulim text-lg font-normal">Location</label>
          <input
            type="text"
            className="h-14 w-[476px] rounded border-[1px] border-black bg-transparent p-2 text-[#888888]"
            value={formData.location}
            onChange={handleChange}
          />
          <MapPin className="absolute right-4 top-12 text-black" />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label className="font-kulim text-lg font-normal">
            Regular Ticket Price
          </label>
          <div className="flex items-center space-x-11">
            <input
              type="number"
              className="h-14 w-[250px] rounded border-[1px] border-black bg-transparent p-2 text-[#888888]"
              value={formData.ticket_price}
              onChange={handleChange}
            />
            <h4 className="font-kulim text-lg font-normal">X</h4>
            <input
              type="number"
              className="h-14 w-[125px] rounded border-[1px] border-black bg-transparent p-2 text-[#888888]"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <h4 className="w-[476px] text-lg font-normal">Other Ticket Types</h4>
          <div className="h-[1px] w-[476px] bg-[#1F1F1F]" />
        </div>

        <div className="w-[476px] font-kulim text-sm font-normal">
          {/* table */}
          <table className="table-bordered table h-[140px] w-[326px] rounded-md border-[1px] border-[#1F1F1F] text-left">
            <thead>
              <tr>
                <th className="py-2 pl-4">Title</th>
                <th className="pl-4">Price</th>
                <th className="pl-4">Qty</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-[1px] border-[#1F1F1F]">
                  <td className="pl-4">{product.title}</td>
                  <td className="pl-4">{product.price}</td>
                  <td className="pl-4">{product.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* end table */}
        </div>

        <span className="h-[1px] w-[476px] bg-[#1F1F1F]" />

        <div className="flex w-[476px] flex-col gap-[5px]">
          <h4 className="w-[476px] text-lg font-normal">Gallery</h4>
          <div className="flex flex-wrap gap-1 rounded-md border-2 border-dashed border-[#888888] p-4">
            {formData.image && (
              <div className="relative my-2 ml-6 h-[110px] w-[111px]">
                <Image
                  src={formData.image}
                  alt="Event Image"
                  className="h-full w-full object-cover"
                  width={111}
                  height={110}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex w-[476px] gap-4 font-raleway">
          <button
            onClick={handleApprove}
            type="button"
            className="flex-1 rounded-md bg-green-600 py-2 text-lg font-bold text-white hover:bg-green-700"
          >
            Restore
          </button>
          <button
            onClick={handleReject}
            type="button"
            className="flex-1 rounded-md bg-red-600 py-2 text-lg font-bold text-white hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={handleClose}
            type="button"
            className="flex-1 rounded-md bg-[#0065AD] py-2 text-lg font-bold text-white hover:bg-[#0066AD]"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsSouldoutView;

