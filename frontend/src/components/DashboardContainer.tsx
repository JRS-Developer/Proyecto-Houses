import React, { ReactNode } from "react";

const DashboardContainer = ({
  action,
  children,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  title: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          {action && <span className="sm:ml-3">{action}</span>}
        </div>
      </div>
      {children}
    </div>
  );
};

export default DashboardContainer;
