import api from "@/lib/axios";

export const getProfile = () =>
  api.get("/me/profile");

