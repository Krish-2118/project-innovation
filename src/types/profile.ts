export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdateInput {
  full_name?: string;
  phone?: string;
  college?: string;
  course?: string;
  year?: string;
}
