// import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { Profile } from "@/types/agency";

export type UserWithReportCount = Profile & {
  reportCount: number;
};

export const fetchUsersWithReportCount = async (): Promise<{
  data: UserWithReportCount[] | null;
  error: any;
  count: number;
}> => {
  //  Fetch all users
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("*");
  if (usersError || !users) return { data: null, error: usersError, count: 0 };

  // Fetch all reports
  const { data: reports, error: reportsError } = await supabase
    .from("reports")
    .select("reported_user_id");
  if (reportsError || !reports) return { data: null, error: reportsError, count: 0 };

  // Count reports per reporter
  const reportCountByUser: Record<string, number> = reports.reduce((acc, report) => {
    acc[report.reported_user_id] = (acc[report.reported_user_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Merge counts and filter users with at least 1 report
  const usersWithReportCount: UserWithReportCount[] = users
    .map(user => ({
      ...user,
      reportCount: reportCountByUser[user.id] || 0,
    }))
    .filter(user => user.reportCount > 0);

  // Total users with reports
  const count = usersWithReportCount.length;

  return { data: usersWithReportCount, error: null, count };
};
