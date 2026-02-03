import { fetcher } from "../fetcher";
import { Traveler } from "@/types/traveler";
import { TravelerProfile } from "@/types/traveler"


export const fetchTravelers = async (
  page: number, 
  perPage: number
): Promise<{
  data: Traveler[] | null;
  count: number | null;
  error: any;
}> => {
  return await fetcher<Traveler>(page, perPage, "profiles", 'role', 'traveler'); 
};

export const fetchTravelerProfileByUserId = async (
  page: number, 
  perPage: number,
  id: string,
): Promise<{
  data: TravelerProfile[] | null;
  count: number | null;
  error: any;
}> => {
  return await fetcher<TravelerProfile>(page, perPage, "traveler_profiles", "user_id", id);
};