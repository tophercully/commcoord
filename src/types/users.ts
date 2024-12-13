export interface UserProfileForm {
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
}
export interface UserProfile extends UserProfileForm {
  uid: string;
}
