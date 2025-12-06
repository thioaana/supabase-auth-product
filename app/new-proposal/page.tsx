import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProposalForm } from "./proposal-form";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewProposalPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const editId = params.id;

  let initialData = null;

  if (editId) {
    const { data } = await supabase
      .from("agro")
      .select("*")
      .eq("id", editId)
      .eq("user_id", user.id)
      .single();

    initialData = data;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">{editId ? "Edit Proposal" : "New Proposal"}</h1>
          <ProposalForm initialData={initialData} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
