"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase"; 

const users = [
  { created_at: "2026-01-30T12:00:00Z", email: "agency1@example.com", name: "Agency One", password: "password1", role: "agency" },
  { created_at: "2026-01-30T12:05:00Z", email: "agency2@example.com", name: "Agency Two", password: "password2", role: "agency" },
  { created_at: "2026-01-30T12:10:00Z", email: "agency3@example.com", name: "Agency Three", password: "password3", role: "agency" },
  { created_at: "2026-01-30T12:15:00Z", email: "agency4@example.com", name: "Agency Four", password: "password4", role: "agency" },
  { created_at: "2026-01-30T12:20:00Z", email: "agency5@example.com", name: "Agency Five", password: "password5", role: "agency" },
  { created_at: "2026-01-30T12:25:00Z", email: "agency6@example.com", name: "Agency Six", password: "password6", role: "agency" },
  { created_at: "2026-01-30T12:30:00Z", email: "agency7@example.com", name: "Agency Seven", password: "password7", role: "agency" },
  { created_at: "2026-01-30T12:35:00Z", email: "agency8@example.com", name: "Agency Eight", password: "password8", role: "agency" },
  { created_at: "2026-01-30T12:40:00Z", email: "agency9@example.com", name: "Agency Nine", password: "password9", role: "agency" },
  { created_at: "2026-01-30T12:45:00Z", email: "agency10@example.com", name: "Agency Ten", password: "password10", role: "agency" },
];

const columns = [
  { name: "Created At", selector: (row: any) => row.created_at },
  { name: "Email", selector: (row: any) => row.email },
  { name: "Name", selector: (row: any) => row.name },
  { name: "Role", selector: (row: any) => row.role },
];

export default function UploadUsersTable() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    setSuccess(false);

    const { data, error } = await supabase.from("users").insert(users);

    if (error) {
      console.error("Upload error:", error);
      alert("Failed to upload users: " + error.message);
    } else {
      console.log("Inserted rows:", data);
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Agency Users</h2>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload to Supabase"}
      </button>
      {success && <p className="text-green-600 mb-2">Users uploaded successfully!</p>}

      
    </div>
  );
}
