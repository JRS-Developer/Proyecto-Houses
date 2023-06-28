"use client";
import { SWRConfig, SWRConfiguration } from "swr/_internal";

const SWRProvider = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: SWRConfiguration["fallback"];
}) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;
