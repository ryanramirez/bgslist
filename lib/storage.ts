import { ref, uploadBytes, getDownloadURL, UploadMetadata } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads an image to Firebase Storage
 * @param file The file to upload
 * @param path The path to store the file in Firebase Storage
 * @returns Promise with the download URL of the uploaded file
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Creating storage reference for path:', path);
    // Create a reference to the storage location
    const storageRef = ref(storage, path);
    
    // Use simpler metadata with just content type
    const metadata: UploadMetadata = {
      contentType: file.type
    };
    
    console.log('Starting upload with file type:', file.type);
    // Upload the file with metadata
    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log('Upload completed, getting download URL');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('File uploaded successfully. Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Add detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

/**
 * Uploads a game image to Firebase Storage
 * @param file The file to upload
 * @param userId The ID of the user uploading the image
 * @returns Promise with the download URL of the uploaded file
 */
export const uploadGameImage = async (file: File, userId: string): Promise<string> => {
  // Sanitize filename to avoid special characters
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const timestamp = new Date().getTime();
  // Instead of extracting the extension separately, just use the sanitized filename
  const path = `games/${userId}/${timestamp}_${safeFileName}`;
  
  console.log('Uploading game image with safe path:', path);
  return uploadImage(file, path);
};

/**
 * Uploads a user profile image to Firebase Storage
 * @param file The file to upload
 * @param userId The ID of the user uploading the image
 * @returns Promise with the download URL of the uploaded file
 */
export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const timestamp = new Date().getTime();
  const fileName = `profile-${timestamp}`;
  const extension = file.name.split('.').pop();
  const path = `users/${userId}/${fileName}.${extension}`;
  
  return uploadImage(file, path);
}; 