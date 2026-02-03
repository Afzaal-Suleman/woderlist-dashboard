import { fetcher } from "../fetcher";
import { Traveler } from "@/types/traveler";


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