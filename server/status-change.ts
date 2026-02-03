import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface StatusChangeOptions {
  tableName: string;
  id: string;
  newStatus: string;
  equalCol: string;
  statusColumn?: string;
  reason?: string;
  additionalData?: Record<string, any>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export async function changeStatus({
  tableName,
  id,
  equalCol,
  newStatus,
  statusColumn = "status",
  reason,
  additionalData = {},
  onSuccess,
  onError
}: StatusChangeOptions): Promise<{
  success: boolean;
  data: any | null;
  error: any | null;
}> {
  try {
    // Prepare update data
    const updateData = {
      [statusColumn]: newStatus,
      updated_at: new Date().toISOString(),
      ...additionalData
    };

    // Add reason if provided
    if (reason) {
      updateData.status_change_reason = reason;
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq(equalCol, id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Call success callback
    if (onSuccess) {
      onSuccess(data);
    }

    return {
      success: true,
      data,
      error: null
    };
  } catch (error: any) {
    console.error(`Failed to update status in ${tableName}:`, error);
    
    // Call error callback
    if (onError) {
      onError(error);
    }

    return {
      success: false,
      data: null,
      error
    };
  }
}

// Batch status change
export async function changeStatusBatch({
  tableName,
  ids,
  newStatus,
  statusColumn = "status",
  reason,
  additionalData = {}
}: {
  tableName: string;
  ids: string[];
  newStatus: string;
  statusColumn?: string;
  reason?: string;
  additionalData?: Record<string, any>;
}): Promise<{
  success: boolean;
  data: any[] | null;
  error: any | null;
}> {
  try {
    const updateData = {
      [statusColumn]: newStatus,
      updated_at: new Date().toISOString(),
      ...additionalData
    };

    if (reason) {
      updateData.status_change_reason = reason;
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .in("id", ids)
      .select();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
      error: null
    };
  } catch (error: any) {
    console.error(`Failed to batch update status in ${tableName}:`, error);
    return {
      success: false,
      data: null,
      error
    };
  }
}

// Status change with notification
export async function changeStatusWithNotification(
  options: StatusChangeOptions & {
    successMessage?: string;
    errorMessage?: string;
  }
) {
  const { successMessage, errorMessage, ...changeOptions } = options;

  const result = await changeStatus(changeOptions);

  if (result.success) {
    toast.success(successMessage || `Status updated to ${options.newStatus}`);
  } else {
    toast.error(errorMessage || "Failed to update status");
  }

  return result;
}