const PLACEHOLDER = "/placeholder.jpg";

export function getDisplayableImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string" || !url.trim()) return PLACEHOLDER;
  const u = url.trim();
  if (u.startsWith("https://") || u.startsWith("http://")) return u;
  if (u.startsWith("//")) return `https:${u}`;
  if (u.startsWith("/")) return u;
  return PLACEHOLDER;
}

export function mapPhotoUrls(photos?: string[] | null): string[] {
  if (!photos?.length) return [PLACEHOLDER];
  return photos.map((p) => getDisplayableImageUrl(p));
}

export function productGalleryImages(
  productPhotos: string[] | undefined | null,
  variantPhotos: string[] | undefined | null
): string[] {
  const variantHas =
    Array.isArray(variantPhotos) &&
    variantPhotos.some((p) => p && String(p).trim());
  if (variantHas) return mapPhotoUrls(variantPhotos);
  return mapPhotoUrls(productPhotos);
}
