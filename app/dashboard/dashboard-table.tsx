"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Proposal {
  id: string;
  area: string;
  plant: string;
  name: string;
  email: string;
  created_at: string;
}

interface DashboardTableProps {
  proposals: Proposal[];
}

export function DashboardTable({ proposals }: DashboardTableProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/new-proposal?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this proposal?")) {
      return;
    }

    const supabase = createClient();

    const { error } = await supabase
      .from("agro")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete proposal");
      return;
    }

    toast.success("Proposal deleted");
    router.refresh();
  };

  if (proposals.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No proposals yet.</p>
        <Button onClick={() => router.push("/new-proposal")}>
          Create your first proposal
        </Button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Area</th>
            <th>Plant</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => (
            <tr key={proposal.id}>
              <td>{proposal.area}</td>
              <td>{proposal.plant}</td>
              <td>{proposal.name}</td>
              <td>{proposal.email}</td>
              <td>{new Date(proposal.created_at).toLocaleDateString()}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(proposal.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(proposal.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
