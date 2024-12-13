import { authAPI } from "./auth";
import { messagesAPI } from "./chat";
import communityAPI from "./communities";

export const api = {
  auth: authAPI,
  community: communityAPI,
  messages: messagesAPI,
};
