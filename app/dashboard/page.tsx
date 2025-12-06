import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardTable } from "./dashboard-table";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: proposals, error } = await supabase
    .from("agro")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching proposals:", error);
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Dashboard</h1>
      <DashboardTable proposals={proposals || []} />
    </div>
  );
}
