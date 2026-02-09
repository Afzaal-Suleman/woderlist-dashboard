import { supabase } from "@/lib/supabase";

export const deleteData = async <T>(
  tableName: string,
  id: string | number,
  idColumn: string = "id"
): Promise<{
  data: T | null;
  error: any;
}> => {
  const { data, error } = await supabase
    .from(tableName)
    .delete()
    .eq(idColumn, id)
    .select()
    .single();


  return { 
    data: data as T, 
    error 
  };
};