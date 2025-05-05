import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads an image to Firebase Storage
 * @param file The file to upload
 * @param path The path to store the file in Firebase Storage
 * @returns Promise with the download URL of the uploaded file
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
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
  const timestamp = new Date().getTime();
  const fileName = `${file.name.split('.')[0]}-${timestamp}`;
  const extension = file.name.split('.').pop();
  const path = `games/${userId}/${fileName}.${extension}`;
  
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