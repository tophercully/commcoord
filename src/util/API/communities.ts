import { CommunityForm } from "@/types/communities";
import { User } from "firebase/auth";
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const communityAPI = {
  getCommunity: async (id: string) => {
    const communityDoc = await getDoc(doc(db, "communities", id));
    return communityDoc.data();
  },
  addMember: async (communityId: string, memberId: User["uid"]) => {
    const communityMembersRef = doc(db, "community_members", communityId);
    const communityMembersDoc = await getDoc(communityMembersRef);

    if (communityMembersDoc.exists()) {
      await updateDoc(communityMembersRef, {
        members: arrayUnion(memberId),
      });
    } else {
      await setDoc(communityMembersRef, {
        community_id: communityId,
        members: [memberId],
      });
    }
  },
  createCommunity: async (community: CommunityForm, founderId: User["uid"]) => {
    const newCommunityRef = await addDoc(
      collection(db, "communities"),
      community,
    );
    await communityAPI.addMember(newCommunityRef.id, founderId);
    return newCommunityRef.id;
  },
};

export default communityAPI;
