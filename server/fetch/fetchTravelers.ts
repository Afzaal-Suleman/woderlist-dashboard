import { fetcher } from "../fetcher";
import { TravelerProfileA } from "@/types/traveler";
import { TravelerProfile } from "@/types/traveler"
// import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export const fetchTravelers = async (
  page: number, 
  perPage: number
): Promise<{
  data: TravelerProfileA[] | null;
  count: number | null;
  error: any;
}> => {
  // return await fetcher<Traveler>(page, perPage, "profiles", 'role', 'traveler'); 
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, error, count } = await supabase
    .from("traveler_profiles")
    .select(`
    *,
    profiles (
      id,
      full_name,
      email,
      role
    )
  `,{ count: "exact" }).range(from, to);


  return { data, count, error };
};

export const fetchTravelerProfileByUserId = async (
  id: string,
): Promise<{
  data: TravelerProfile[] | null;
  error: any;
}> => {
  // return await fetcher<TravelerProfile>(page, perPage, "traveler_profiles", "id", id);
   const { data, error } = await supabase
    .from("traveler_profiles")
    .select(`
    *,
    profiles (
      id,
      full_name,
      email,
      role,
      avatar_url
    )
  `).eq("id", id)


  return { data, error };
};
export const fetchTravelerProfileByUser_Id = async (
  id: string,
): Promise<{
  data: TravelerProfile[] | null;
  error: any;
}> => {
  // return await fetcher<TravelerProfile>(page, perPage, "traveler_profiles", "id", id);
   const { data, error } = await supabase
    .from("traveler_profiles")
    .select(`
    *,
    profiles (
      id,
      full_name,
      email,
      role,
      avatar_url
    )
  `).eq("user_id", id)


  return { data, error };
};

export const fetchTravelerProfileByUserIds = async (
  ids: string[]
): Promise<{ data: any[] | null; error: any, count:any }> => {
  
  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" }).in("id", ids); 


  return { data, count, error };
};