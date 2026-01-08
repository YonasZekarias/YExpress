"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  verified: boolean;
  isBanned: boolean;
  createdAt: string;
}

interface Filters {
  search: string;
  role: string;
  verified: string;
  isBanned: string;
}

export function useUsers(currentUserRole: string | undefined) {
  const [users, setUsers] = useState<User[]>([]);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    role: "",
    verified: "",
    isBanned: "",
  });

  // Debounced search term to prevent excessive API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const cursor = cursorStack[cursorStack.length - 1];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        params: {
          cursor,
          search: debouncedSearch,
          role: filters.role,
          verified: filters.verified,
          isBanned: filters.isBanned,
          limit: 10,
        },
        withCredentials: true,
      });

      setUsers(res.data.users);
      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [cursor, debouncedSearch, filters.role, filters.verified, filters.isBanned]);

  // When filters change, reset the pagination to the first page
  useEffect(() => {
    setCursorStack([null]);
  }, [debouncedSearch, filters.role, filters.verified, filters.isBanned]);

  // Trigger fetch whenever the cursor or filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const next = () => nextCursor && setCursorStack((p) => [...p, nextCursor]);
  const prev = () => cursorStack.length > 1 && setCursorStack((p) => p.slice(0, -1));

  const toggleBan = async (id: string) => {
    if (currentUserRole !== "admin") return;
    const originalUsers = [...users];
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBanned: !u.isBanned } : u)));

    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${id}/ban`, {}, { withCredentials: true });
    } catch {
      setUsers(originalUsers);
    }
  };

  return {
    users,
    loading,
    filters,
    setFilters,
    next,
    prev,
    hasNext: !!nextCursor,
    hasPrev: cursorStack.length > 1,
    toggleBan,
  };
}