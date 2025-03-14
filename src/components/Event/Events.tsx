"use client";
import React, { useState } from "react";
import AdminEventsApproved from "./adminEventsApproved";
import AdminEventsPending from "./adminEventsPending";
import AdminEventsRejected from "./adminEventsRejected";
import AdminEventsSoldout from "./adminEventsSoldout";
import EventPendingSidePannel from "./RightSidePanel/EventsPendingView";
import EventsApprovedView from "./RightSidePanel/EventsApprovedView";
import EventsSouldoutView from "./RightSidePanel/EventsSouldoutView";
import EventsRejectedView from "./RightSidePanel/EventsRejectedView";

// Define the type for the event
interface Event {
  id: number;
  title: string;
  type: string;
  organizer: string;
  location: string;
  tickets: number;
  date: string;
}

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState("Pending");

  const tabs = ["Pending", "Active", "Sold Out", "Rejected"];

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedEvent(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Pending":
        return <AdminEventsPending onView={handleViewEvent} />;
      case "Active":
        return <AdminEventsApproved onView={handleViewEvent} />;
      case "Sold Out":
        return <AdminEventsSoldout onView={handleViewEvent} />;
      case "Rejected":
        return <AdminEventsRejected onView={handleViewEvent} />;
      default:
        return null;
    }
  };

  const sidePannel = () => {
    if (!selectedEvent) return null;

    if (activeTab === "Pending") {
      return <EventPendingSidePannel event={selectedEvent} />;
    }
    if (activeTab === "Active") {
      return <EventsApprovedView event={selectedEvent} />;
    }
    if (activeTab === "Sold Out") {
      return <EventsSouldoutView event={selectedEvent} />;
    }
    if (activeTab === "Rejected") {
      return <EventsRejectedView event={selectedEvent} />;
    }
    return null;
  };

  return (
    <div>
      {/* Sidebar */}
      <div className="absolute right-[-2.5rem] top-[-2.5rem]">
        {sidePannel()}
      </div>

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
