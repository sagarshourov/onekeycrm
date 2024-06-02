import { atom, selector, selectorFamily } from "recoil";

import { chatHistory ,recordHistory} from "../service/whatsapp";

/**
 * Populate the default selector return value with a service call.
 */


export const CallRecordHistory = selectorFamily({
  key: "recordHistory",
  get:
    (id) =>
    async ({ get }) => {
      try {
        const response = await recordHistory(id);
        return response.data || [];
      } catch (error) {
        console.error(`getUserInfo -> getUsers() ERROR: \n${error}`);
        return [];
      }
    },
});



export const WhatsAppChatSele = selector({
  key: "WhatsAppChatSele",
  get: async ({ get }) => {
    try {
      const response = await chatHistory();
      return response.data || [];
    } catch (error) {
      console.error(`SlackConListSel -> SlackConListSel() ERROR: \n${error}`);
      return [];
    }
  },
});

export const WhatsAppChatList = atom({
  key: "WhatsAppChatList",
  default: WhatsAppChatSele,
});
