import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AllTickets from "@/components/Tickets/AllTickets";

const TicketsPage = () => {
  return (
    <DefaultLayout>
      <div>
        <h2 className="text-3xl font-bold text-[#0065AD]">Ticket Bookings</h2>
        <AllTickets />
      </div>
    </DefaultLayout>
  );
};

export default TicketsPage;
