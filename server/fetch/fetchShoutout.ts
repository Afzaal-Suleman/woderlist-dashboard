// import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export const fetchShoutout = async (
  page: number,
  perPage: number
): Promise<{
  data: any[] | null;
  count: number | null;
  error: any;
}> => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
  .from("shoutouts")
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

export const fetchShoutoutById = async (
  id: string
): Promise<{ data: any | null; error: any }> => {
  const { data, error } = await supabase
    .from("shoutouts")
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

export const fetchShoutoutsByIds = async (
  ids: string[]
): Promise<{ data: any[] | null; error: any, count:any }> => {
  
  const { data, error, count } = await supabase
    .from("shoutouts")
    .select(`
    *,
    profiles (
      id,
      full_name,
      email
    )
  `,{ count: "exact" }).in("id", ids); 


  return { data, count, error };
};
