import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Events from "@/components/Event/Events";

function page() {
  return (
    <DefaultLayout>
      <div className="relative">
        <Events />
      </div>
    </DefaultLayout>
  );
}

export default page;
