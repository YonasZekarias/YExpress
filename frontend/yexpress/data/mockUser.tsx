export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

export const mockUser: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff",
  memberSince: "Jan 2023",
};
