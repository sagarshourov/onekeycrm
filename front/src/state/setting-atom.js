import { atom, selector, selectorFamily } from "recoil";

import { getTables } from "../service/setting";


export const settingSelect = selector({
    key: "settingSelect",
    get: async ({ get }) => {
      try {
        const response = await getTables();
        return response.data || [];
      } catch (error) {
        console.error(`settingSelect -> settingSelect() ERROR: \n${error}`);
        return [];
      }
    },
  });

export const settingState = atom({
  key: "settingState",
  default: settingSelect,
});
