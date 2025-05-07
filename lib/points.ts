import { UserProfile, GameListing } from './models';

/**
 * Calculates VPs earned from post count
 */
export const calculatePostVPs = (postCount: number): number => {
  if (postCount >= 10) return 5; // Max 5 points for 10+ posts
  if (postCount >= 5) return 3;  // 3 points for 5-9 posts
  if (postCount >= 1) return 1;  // 1 point for 1-4 posts
  return 0;
};

/**
 * Calculates total VPs for a user
 */
export const calculateTotalVPs = (
  profile: UserProfile,
  userListings: GameListing[] = [],
  highRatedListings: number = 0
): number => {
  let points = 0;
  
  // 1 point for creating an account
  points += 1;
  
  // Points based on post count
  const postCount = userListings.length || profile.postCount || 0;
  points += calculatePostVPs(postCount);
  
  // 1 point for every post that gets at least 2 stars
  points += highRatedListings;
  
  return points;
};

/**
 * Updates a user profile with current VP count
 */
export const updateProfileVPs = (
  profile: UserProfile, 
  userListings: GameListing[] = [],
  highRatedListings: number = 0
): UserProfile => {
  const vps = calculateTotalVPs(profile, userListings, highRatedListings);
  const postCount = userListings.length || profile.postCount || 0;
  
  return {
    ...profile,
    vps,
    postCount
  };
}; 