"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        // Get current session
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            // console.log(data);

            setSession(data.session);
            setLoading(false);

            // Redirect if not admin or superadmin
              const role = data.session?.user?.app_metadata.role ?? "";
              if (!["admin", "superadmin"].includes(role)) {
                router.replace("/");
              }
            if (session) {
                router.replace("/");
            }
        };

        getSession();

        // Listen to auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, currentSession) => {
                setSession(currentSession);
                const role = currentSession?.user?.app_metadata.role ?? "";
                if (!["admin", "superadmin", "authenticated"].includes(role)) {
                  router.replace("/");
                }
                if (session) {
                    router.replace("/");
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700">
                Loading...
            </div>
        );
    }

    return <>{children}</>;
}
