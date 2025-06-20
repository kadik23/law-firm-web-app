export const base64ToFile = async (base64String: string, fileName: string): Promise<File> => {
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = base64String.split(',')[1];
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    return new File([blob], fileName, { type: 'image/jpeg' });
  };