import { supabase } from "@/lib/supabase";

export const fetcher = async <T>(
  page: number, 
  perPage: number, 
  endpoint: string,
  roleColumn?: string,
  roleValue?: string
): Promise<{
  data: T[] | null;
  count: number | null;
  error: any;
}> => {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
    .from(endpoint)
    .select("*", { count: "exact" }).eq(roleColumn ? roleColumn: "", roleValue ? roleValue: "")
    .range(from, to);
console.log(data, count, error, "api Data");

  return { data, count, error };
};