import { api } from "./client";

export const uploadAPI = {
  uploadFile: async (file: File): Promise<{ url: string; publicId: string }> => {
    // Step 1: get signature from your backend (uses /consignments/upload-signature)
    const sig = await api.getUploadSignature();

    // Step 2: upload directly to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.api_key);
    formData.append("timestamp", String(sig.timestamp));
    formData.append("signature", sig.signature);
    if (sig.folder) formData.append("folder", sig.folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudinary upload failed: ${text}`);
    }

    const json = (await res.json()) as { secure_url: string; public_id: string };
    return { url: json.secure_url, publicId: json.public_id };
  },
};