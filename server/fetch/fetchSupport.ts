// import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { SupportTicketWithProfile } from "@/types/support";

export const fetchSupport = async (
  page: number,
  perPage: number
): Promise<{
  data: SupportTicketWithProfile[] | null;
  count: number | null;
  error: any;
}> => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      )
    `, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });


  return { data, count, error };
};

export const fetchSupportById = async (
  id: string
): Promise<{ data: SupportTicketWithProfile | null; error: any }> => {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      )
    `)
    .eq("id", id)
    .single();


  return { data, error };
};

export const fetchSupportByIds = async (
  ids: string[]
): Promise<{ data: SupportTicketWithProfile[] | null; error: any; count: number | null }> => {

  const { data, error, count } = await supabase
    .from("support_tickets")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      )
    `, { count: "exact" })
    .in("id", ids);


  return { data, count, error };
};
