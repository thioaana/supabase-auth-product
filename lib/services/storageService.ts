"use server";

import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "proposals";

// Validate PDF magic bytes (%PDF)
function isValidPdf(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
}

// Validate file belongs to user
function isUserOwned(filePath: string, userId: string): boolean {
  return filePath.startsWith(`${userId}/`);
}

export async function uploadPdfToStorage(
  pdfBase64: string,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Convert base64 to Uint8Array
  const base64Data = pdfBase64.split(",")[1] || pdfBase64;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Validate PDF content
  if (!isValidPdf(bytes)) {
    return { success: false, error: "Invalid PDF file" };
  }

  // Upload to storage with user folder structure
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, bytes, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return { success: true, url: urlData.publicUrl };
}

export async function updatePdfInStorage(
  pdfBase64: string,
  fileName: string,
  oldPdfUrl?: string | null
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Delete old PDF if exists (verify ownership first)
  if (oldPdfUrl) {
    const urlParts = oldPdfUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length >= 2) {
      const oldFilePath = urlParts[1];
      if (isUserOwned(oldFilePath, user.id)) {
        await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
      }
    }
  }

  // Convert base64 to Uint8Array
  const base64Data = pdfBase64.split(",")[1] || pdfBase64;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Validate PDF content
  if (!isValidPdf(bytes)) {
    return { success: false, error: "Invalid PDF file" };
  }

  // Upload new PDF
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, bytes, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return { success: true, url: urlData.publicUrl };
}

export async function getPdfUrl(filePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data?.publicUrl || null;
}

export async function deletePdfFromStorage(
  pdfUrl: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Extract file path from URL
  const urlParts = pdfUrl.split(`${BUCKET_NAME}/`);
  if (urlParts.length < 2) {
    return { success: false, error: "Invalid PDF URL" };
  }
  const filePath = urlParts[1];

  // Verify file belongs to current user
  if (!isUserOwned(filePath, user.id)) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
