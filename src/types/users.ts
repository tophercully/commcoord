export interface UserProfile {
  uid: string; // is the users email in the case of email/password provider
  display_name: string | null;
  email: string;
  phone_number: string | null;
  photo_url: string | null;
  provider_id: string;
}
