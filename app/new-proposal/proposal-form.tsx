"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface ProposalData {
  id: string;
  area: string;
  plant: string;
  name: string;
  email: string;
}

interface ProposalFormProps {
  initialData: ProposalData | null;
  userId: string;
}

export function ProposalForm({ initialData, userId }: ProposalFormProps) {
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

    const supabase = createClient();

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("agro")
          .update({ area, plant, name, email })
          .eq("id", initialData.id)
          .eq("user_id", userId);

        if (error) throw error;
        toast.success("Proposal updated successfully");
      } else {
        const { error } = await supabase
          .from("agro")
          .insert({ area, plant, name, email, user_id: userId });

        if (error) throw error;
        toast.success("Proposal added successfully");
      }

      router.push("/dashboard");
      router.refresh();
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
