import { supabase } from "@/lib/supabase";

export const fetchPackages = async (
  page: number,
  perPage: number
): Promise<{
  data: any[] | null;
  count: number | null;
  error: any;
}> => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // First, fetch packages with basic agency info
  const { data: packages, count, error } = await supabase
    .from("packages")
    .select(`
      id,
      title,
      status,
      created_at,
      short_description,
      destination,
      total_bookings,
      total_reviews,
      published_at,
      updated_at,
      images,
      min_age,
      max_age,
      max_travelers,
      duration_days,
      duration_nights,
      agency_profiles (
        id,
        business_name,
        user_id,
        approved_by,
        city
      )
    `, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching packages:", error);
    return { data: null, count: null, error };
  }

  if (!packages || packages.length === 0) {
    return { data: [], count, error: null };
  }

  // Collect all profile IDs needed
  const profileIds = new Set<string>();
  packages.forEach((pkg:any) => {
    if (pkg.agency_profiles) {
      if (pkg.agency_profiles.user_id) {
        profileIds.add(pkg.agency_profiles.user_id);
      }
      if (pkg.agency_profiles.approved_by) {
        profileIds.add(pkg.agency_profiles.approved_by);
      }
    }
  });

  // Fetch all profiles in a single query
  let profileMap: Record<string, any> = {};
  if (profileIds.size > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", Array.from(profileIds));

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return { data: null, count: null, error: profilesError };
    }

    if (profiles) {
      profileMap = profiles.reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, any>);
    }
  }

  // Enrich packages with profile data
  const enrichedData = packages.map((pkg:any) => {
    if (pkg.agency_profiles) {
      const agency = pkg.agency_profiles;
      return {
        ...pkg,
        agency_profiles: {
          ...agency,
          user_profile: agency.user_id ? profileMap[agency.user_id] || null : null,
          approver_profile: agency.approved_by ? profileMap[agency.approved_by] || null : null
        }
      };
    }
    return pkg;
  });

  console.log(enrichedData, count, error, "api Data packages");

  return { data: enrichedData, count, error: null };
};


export const fetchPackagesByIds = async (
  ids: string[]
): Promise<{ data: any[] | null; error: any, count:any }> => {
  console.log(ids, "ids");
  
  const { data, error, count } = await supabase
    .from("packages")
    .select("*", { count: "exact" }).in("id", ids); 

  console.log(data, error, "traveler_profiles by IDs");

  return { data, count, error };
};