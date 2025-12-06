"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { createProposal, updateProposal, type Proposal } from "@/lib/services/agroService";

interface ProposalFormProps {
  initialData: Proposal | null;
}

export function ProposalForm({ initialData }: ProposalFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [area, setArea] = useState(initialData?.area || "");
  const [plant, setPlant] = useState(initialData?.plant || "");
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { area, plant, name, email };

      if (isEditing) {
        const result = await updateProposal(initialData.id, data);
        if (!result.success) throw new Error(result.error);
        toast.success("Proposal updated successfully");
      } else {
        const result = await createProposal(data);
        if (!result.success) throw new Error(result.error);
        toast.success("Proposal added successfully");
      }

      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <div>
        <Label htmlFor="area">Area</Label>
        <Input
          id="area"
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
          placeholder="Enter area"
        />
      </div>

      <div>
        <Label htmlFor="plant">Plant</Label>
        <Input
          id="plant"
          type="text"
          value={plant}
          onChange={(e) => setPlant(e.target.value)}
          required
          placeholder="Enter plant type"
        />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter your name"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>

      <Button type="submit" disabled={loading} className="mt-3">
        {loading ? "Saving..." : isEditing ? "Update" : "Add"}
      </Button>
    </form>
  );
}
