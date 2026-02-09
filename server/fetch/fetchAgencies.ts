import { fetcher } from "../fetcher";
import { Agency } from "@/types/agency";
import { AgencyProfile } from "@/types/packages"
// import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
// Change "users" to "agencies" if you have that table
export const fetchAgencies = async (
  page: number, 
  perPage: number
): Promise<{
  data: Agency[] | null;
  count: number | null;
  error: any;
}> => {
  // return await fetcher<Agency>(page, perPage, "profiles", "role", "agency");
   const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const { data, error, count } = await supabase
      .from("agency_profiles")
      .select(`
      *,
       profiles!agency_profiles_user_id_fkey  (
        id,
        full_name,
        email,
        role
      )
    `,{ count: "exact" }).range(from, to);
  
    console.log(data, error, "agency_profiles by IDs");
  
    return { data, count, error };
};

export const fetchAgencyProfileByUserId = async (
  id: string,
): Promise<{
  data: AgencyProfile[] | null;
  error: any;
}> => {
  
  // return await fetcher<TravelerProfile>(page, perPage, "traveler_profiles", "id", id);
   const { data, error } = await supabase
    .from("agency_profiles")
    .select(`
    *,
    profiles!agency_profiles_user_id_fkey (
      id,
      full_name,
      email,
      role
    )
  `).eq("id", id)


  return { data, error };
};
export const fetchAgencyProfileByUser_Id = async (
  id: string,
): Promise<{
  data: AgencyProfile[] | null;
  error: any;
}> => {
  
  // return await fetcher<TravelerProfile>(page, perPage, "traveler_profiles", "id", id);
   const { data, error } = await supabase
    .from("agency_profiles")
    .select(`
    *,
    profiles!agency_profiles_user_id_fkey (
      id,
      full_name,
      email,
      role
    )
  `).eq("user_id", id)


  return { data, error };
};

export const fetchAgencyProfileByUserIds = async (
  ids: string[]
): Promise<{ data: any[] | null; error: any, count:any }> => {
  
  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" }).in("id", ids); 


  return { data, count, error };
};