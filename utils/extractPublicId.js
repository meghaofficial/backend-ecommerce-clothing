// Helper to extract public_id from a Cloudinary URL
export function extractPublicId(imageUrl) {
  try {
    const parts = imageUrl.split("/");
    const publicIdWithExt = parts[parts.length - 1];
    const publicId = publicIdWithExt.split(".")[0];
    return `products/${publicId}`;
  } catch (err) {
    return null;
  }
}
