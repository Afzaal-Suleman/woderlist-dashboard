import { fetcher } from "../fetcher";
import { Agency } from "@/types/agency";
import { AgencyProfile } from "@/types/packages"


// Change "users" to "agencies" if you have that table
export const fetchAgencies = async (
  page: number, 
  perPage: number
): Promise<{
  data: Agency[] | null;
  count: number | null;
  error: any;
}> => {
  return await fetcher<Agency>(page, perPage, "profiles", "role", "agency");
};


export const fetchAgencyProfileByUserId = async (
  page: number, 
  perPage: number,
  id: string,
): Promise<{
  data: AgencyProfile[] | null;
  count: number | null;
  error: any;
}> => {
  return await fetcher<AgencyProfile>(page, perPage, "agency_profiles", "user_id", id);
};
