"use client";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface UsersResponse {
  nextCursor: string | null;
  results: number;
  users: User[];
}

export default function ProductsPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch users function
  const fetchUsers = async (cursor?: string) => {
    setLoading(true);
    try {
      const response = await axios.get<UsersResponse>(
        "http://localhost:5000/api/admin/users",
        {
          params: cursor ? { cursor } : {},
          withCredentials: true,
        },
      );

      // Append new users
      setUsers((prev) => [...prev, ...response.data.users]);

      // Update nextCursor
      setNextCursor(response.data.nextCursor || null);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-auto p-6 bg-white rounded-2xl border border-dashed border-slate-300">
      <Settings className="w-16 h-16 text-slate-200 mb-4" />
      <h3 className="text-xl font-bold text-slate-800 capitalize">
        Customer Management
      </h3>
      <p className="text-slate-500 mb-6">This module is under development.</p>

      <div className="w-full max-w-2xl">
        <h4 className="text-lg font-semibold mb-2">Fetched Users:</h4>

        {users.length === 0 && !loading && (
          <p className="text-slate-500">No users found.</p>
        )}

        <ul className="list-disc list-inside mb-4">
          {users.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>

        {loading && <p className="text-slate-500 mb-2">Loading...</p>}

        {nextCursor && !loading && (
          <button
            onClick={() => fetchUsers(nextCursor)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Load More
          </button>
        )}

        {!nextCursor && users.length > 0 && (
          <p className="text-slate-400 mt-2">All users loaded.</p>
        )}
      </div>
    </div>
  );
}
