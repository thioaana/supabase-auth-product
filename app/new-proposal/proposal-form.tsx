"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { createProposal, updateProposal, type Proposal } from "@/lib/services/agroService";
import { generateProposalPdf, generatePdfFileName } from "@/lib/utils/generatePdf";
import { uploadPdfToStorage, updatePdfInStorage } from "@/lib/services/storageService";
import { SignaturePad } from "@/components/SignaturePad";

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
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = { area, plant, name, email };

      // Generate PDF as Blob (include signature if provided)
      const pdfBlob = await generateProposalPdf({
        ...formData,
        signature: signature || undefined,
      });
      const fileName = generatePdfFileName(name);

      console.log("PDF Blob size:", (pdfBlob.size / 1024).toFixed(2), "KB");

      // Convert Blob to base64 for server upload
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      let pdfUrl: string | undefined;

      if (isEditing) {
        // Update PDF in storage (delete old, upload new)
        const uploadResult = await updatePdfInStorage(
          pdfBase64,
          fileName,
          initialData.pdf_url
        );
        if (!uploadResult.success) throw new Error(uploadResult.error);
        pdfUrl = uploadResult.url;

        // Update proposal with new PDF URL
        const result = await updateProposal(initialData.id, { ...formData, pdf_url: pdfUrl });
        if (!result.success) throw new Error(result.error);
        toast.success("Proposal updated successfully");
      } else {
        // Upload PDF to storage
        const uploadResult = await uploadPdfToStorage(pdfBase64, fileName);
        if (!uploadResult.success) throw new Error(uploadResult.error);
        pdfUrl = uploadResult.url;

        // Create proposal with PDF URL
        const result = await createProposal({ ...formData, pdf_url: pdfUrl });
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

      <div>
        <SignaturePad
          onSignatureChange={setSignature}
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading} className="mt-3">
        {loading ? "Saving..." : isEditing ? "Update" : "Add"}
      </Button>
    </form>
  );
}
