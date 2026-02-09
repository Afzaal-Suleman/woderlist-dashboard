import { fetcher } from "../fetcher";
import { SubscriptionPlan } from "@/types/subscriptionPlan"


export const fetchSubscriptionPlan = async (
  page: number, 
  perPage: number
): Promise<{
  data: SubscriptionPlan[] | null;
  count: number | null;
  error: any;
}> => {
  return await fetcher<SubscriptionPlan>(page, perPage, "subscription_plans");
};


export const fetchSubscriptionPlanById = async (
  page: number, 
  perPage: number,
  id: string,
): Promise<{
  data: SubscriptionPlan[] | null;
  count: number | null;
  error: any;
}> => {
  return await fetcher<SubscriptionPlan>(page, perPage, "subscription_plans");
};
