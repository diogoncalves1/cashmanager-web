import React from "react";

export function ContentLayout(params: { children: React.ReactNode }) {
  return (
    <div className="p-2 xl:p-5 bg-white rounded-lg shadow-md gap-3 flex flex-col">
      {params.children}
    </div>
  );
}
