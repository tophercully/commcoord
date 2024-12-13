import { Community, CommunityForm } from "@/types/communities";
import { User } from "firebase/auth";
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
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
  getUserCommunities: async (userId: User["uid"]) => {
    const communityMembersRef = collection(db, "community_members");
    const communitiesRef = collection(db, "communities");

    const memberQuery = query(
      communityMembersRef,
      where("members", "array-contains", userId),
    );

    const memberSnapshot = await getDocs(memberQuery);
    const communityIds = memberSnapshot.docs.map((doc) => doc.id);

    if (communityIds.length === 0) return [];

    const communitiesQuery = query(
      communitiesRef,
      where("__name__", "in", communityIds),
    );

    const communitiesSnapshot = await getDocs(communitiesQuery);

    return communitiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Community[];
  },
};

export default communityAPI;
