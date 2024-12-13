import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface CommunityForm {
  name: string;
  description: string;
}

export interface Community extends CommunityForm {
  id: string;
  private: boolean;
  created_at: Timestamp;
}

export interface CommunityWithMembers extends Community {
  members: User["uid"][];
}
