export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  userId: string;
  agentId?: string | null;
  categoryId?: string | null;
  status: "open" | "pending" | "closed";
  created_at: string;
  updated_at?: string;
  profiles?: Profile;
}

export type SupportTicketWithProfile = SupportTicket & {
  profiles?: Profile;
};

export interface SupportTicketForTable extends SupportTicket {
  status: "open" | "pending" | "closed";
}
