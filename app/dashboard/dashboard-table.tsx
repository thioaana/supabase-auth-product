"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { deleteProposal, type Proposal } from "@/lib/services/agroService";

interface DashboardTableProps {
  proposals: Proposal[];
}

export function DashboardTable({ proposals }: DashboardTableProps) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/new-proposal?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmation = await Swal.fire({
      title: "Delete proposal?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    const result = await deleteProposal(id);

    if (!result.success) {
      toast.error(result.error || "Failed to delete proposal");
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
