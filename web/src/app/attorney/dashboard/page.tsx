"use client"
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      Welcome to Attorney Dashboard <br />
      <strong>{user && user.email}</strong>
    </div>
  );
}

export default Dashboard;
