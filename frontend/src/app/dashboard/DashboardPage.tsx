"use client";
import { useProfile } from "@/hooks/useProfile";

const DashboardPage = () => {
  const { profile } = useProfile();
  return <div>{profile?.email}</div>;
};

export default DashboardPage;
