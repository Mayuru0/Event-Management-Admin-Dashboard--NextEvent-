import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AllPayments from "@/components/Payments/AllPayments";

const PaymentsPage = () => {
  return (
    <DefaultLayout>
      <div>
        <h2 className="text-3xl font-bold text-[#0065AD]">Payments</h2>
        <AllPayments />
      </div>
    </DefaultLayout>
  );
};

export default PaymentsPage;
