import { Report } from "@/types/report";
// import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();


export const fetchReportsByuserIdAndEntity = async (
  page: number,
  perPage: number,
  entityTypeColumn?: string,
  entityTypeValue?: string | null,
  id?: string
): Promise<{
  data: Report[] | null;
  count: number | null;
  error: any;
}> => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  console.log(entityTypeValue, id, "21");
  
 let query = supabase
  .from("reports")
  .select("*", { count: "exact" })
  .range(from, to)
  .order("created_at", { ascending: false });

// filter by entity type (optional)
if (entityTypeColumn && entityTypeValue) {
  query = query.eq(entityTypeColumn, entityTypeValue);
}

// filter by id (optional)
if (id) {
  query = query.eq("reported_user_id", id);
}

const { data, count, error } = await query;



  return { data, count, error };
};

export const fetchEntityTypeOptions = async (id: string | undefined): Promise<
  { label: string; value: string }[] | null
> => {
  const { data, error } = await supabase
    .from("reports")
    .select("entity_type").eq("reported_user_id", id);

  if (error) {
    console.error("Error fetching entity types:", error);
    return null;
  }

  // Get unique values
  const uniqueValues = Array.from(new Set(data?.map((row) => row.entity_type)));

  // Format for dropdown/select
  const options = uniqueValues.map((value) => ({
    value,
    label: value
      .split("_")
      .map((word:any) => word[0].toUpperCase() + word.slice(1))
      .join(" "), 
  }));

  return options;
};


export const fetchWishlistById = async (
  page: number,
  perPage: number,
  id:string
): Promise<{
  data: Report[] | null;
  count: number | null;
  error: any;
}> => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
  .from("reports")
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
  .range(from, to).eq("id", id)
  .order("created_at", { ascending: false });



  return { data, count, error };
};


export const fetchReportsByShoutoutId = async (id: string | undefined): Promise<
  any
> => {
  
  const { data, error } = await supabase
    .from("reports")
    .select("*").eq("entity_id", id);

  if (error) {
    console.error("Error fetching entity types:", error);
    return null;
  }

  // Get unique values
  return {data, error}
};