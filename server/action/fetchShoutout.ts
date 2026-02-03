import { supabase } from "@/lib/supabase";

import { Agency } from "@/types/agency";

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
    traveler_profiles (
      id,
      user_id,
      profiles (
        id,
        full_name,
        email
      )
    )
  `, { count: "exact" })
  .range(from, to)
  .order("created_at", { ascending: false });


console.log(data, count, error, "api Data");

  return { data, count, error };
};
