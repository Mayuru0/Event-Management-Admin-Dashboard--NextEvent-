"use client";
import React, { useState } from "react";
import { Event } from "@/type/EventType";
import AdminEventsApproved from "./adminEventsApproved";
import AdminEventsPending from "./adminEventsPending";
import AdminEventsRejected from "./adminEventsRejected";
import AdminEventsSoldout from "./adminEventsSoldout";
import EventPendingSidePannel from "./RightSidePanel/EventsPendingView";
import EventsApprovedView from "./RightSidePanel/EventsApprovedView";
import EventsSouldoutView from "./RightSidePanel/EventsSouldoutView";
import EventsRejectedView from "./RightSidePanel/EventsRejectedView";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState("Active");

  const tabs = ["Active", "Pending", "Rejected", "Archived"];

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedEvent(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Active":
        return <AdminEventsApproved onView={handleViewEvent} />;
      case "Pending":
        return <AdminEventsPending onView={handleViewEvent} />;
      case "Rejected":
        return <AdminEventsRejected onView={handleViewEvent} />;
      case "Archived":
        return <AdminEventsSoldout onView={handleViewEvent} />;
      default:
        return null;
    }
  };

  const sidePannel = () => {
    if (!selectedEvent) return null;

    if (activeTab === "Pending") {
      return <EventPendingSidePannel event={selectedEvent} onClose={() => setSelectedEvent(null)} />;
    }
    if (activeTab === "Active") {
      return <EventsApprovedView event={selectedEvent} onClose={() => setSelectedEvent(null)} />;
    }
    if (activeTab === "Rejected") {
      return <EventsRejectedView event={selectedEvent}  onClose={() => setSelectedEvent(null)} />;
    }
    if (activeTab === "Archived") {
      return <EventsSouldoutView event={selectedEvent} onClose={() => setSelectedEvent(null)} />;
    }
    return null;
  };

  return (
    <div className="relative">
      {/* Sidebar */}
      {sidePannel()}

      <h2 className="text-3xl font-bold text-[#0065AD]">Events</h2>

      {/* Tabs */}
      <div className="mt-4 flex w-max rounded-lg bg-white p-2 shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default Events;
