import { authAPI } from "./auth";
import communityAPI from "./communities";

export const api = {
  auth: authAPI,
  community: communityAPI,
};
