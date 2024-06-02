import { atom, selector } from "recoil";

import { getEvents } from "../service/events";

/**
 * Populate the default selector return value with a service call.
 */
export const allEventState = selector({
  key: "allEventState",
  get: async ({ get }) => {
    try {
      const response = await getEvents();

      return response.data || [];
    } catch (error) {
      console.error(`allEventState -> getEvents() ERROR: \n${error}`);
      return [];
    }
  },
});

export const eventListState = atom({
  key: "eventListState",
  default: allEventState,
});
