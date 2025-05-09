// User profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  location: string;
  joinedDate: string;
  bio: string;
  avatar: string;
  vps?: number; // Victory Points
  postCount?: number; // Track number of posts for VP calculation
  favoriteGameId?: string; // ID reference to favorite board game
  favoriteGenreId?: string; // ID reference to favorite board game genre
}

// Game listing interface
export interface GameListing {
  id: string;
  userId: string;
  title: string;
  description: string;
  condition: string;
  price?: number; // Optional for trade-only listings
  tradeOnly: boolean;
  imageUrl?: string; // Optional for listings without images
  location: string;
  createdAt: string;
  type: 'offering' | 'selling' | 'wanting';
  starCount?: number; // Number of users who have starred this listing
  starredBy?: string[]; // Array of user IDs who have starred this listing
}

// Game condition options
export const conditionOptions = [
  { value: 'new', label: 'New - Still in shrink wrap' },
  { value: 'likeNew', label: 'Like New - Opened but unplayed' },
  { value: 'veryGood', label: 'Very Good - Played a few times, like new' },
  { value: 'good', label: 'Good - Shows signs of use but complete' },
  { value: 'fair', label: 'Fair - Worn but playable' },
]; 