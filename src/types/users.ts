export interface UserProfileForm {
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  pronouns?: string;
}
export interface UserProfile extends UserProfileForm {
  uid: string;
}
