export const base64ToFile = async (
  base64String: string,
  fileName: string
): Promise<File> => {
  // Expecting "data:image/jpeg;base64,...."
  const [header, base64Data] = base64String.split(",");

  // Extract MIME type from header
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";

  // Decode base64 into bytes
  const byteCharacters = atob(base64Data);
  const byteArrays: BlobPart[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  const blob = new Blob(byteArrays, { type: mime });
  return new File([blob], fileName, { type: mime });
};