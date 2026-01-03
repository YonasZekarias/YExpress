'use client';
import { Settings } from "lucide-react";
import {  useEffect, useState } from "react";
const axios = require("axios").default;

export default function ProductsPage() {
  const token= "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDNkYzg2NDFkMWY4NmM1ODNhNjQyZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NjA3MDE2MywiZXhwIjoxNzY2MzI5MzYzfQ.yP6D1RnR1txlBrckrvogs4isFgItdfbU_TGbtdN10TE"
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
  ).then((response: any) => {
      console.log(response.data);
      setUsers(response.data);
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-dashed border-slate-300">
      <Settings className="w-16 h-16 text-slate-200 mb-4" />
      <h3 className="text-xl font-bold text-slate-800 capitalize">Customer Management</h3>
      <p className="text-slate-500">This module is under development.</p>
    {  users.map((user: any) => (
        <div key={user._id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}    
    </div>
  );
}
