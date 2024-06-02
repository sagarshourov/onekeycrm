import { atom, selector, selectorFamily } from "recoil";

import SlackB from "slack";
var bot = new SlackB({ token: process.env.token });

/**
 * Populate the default selector return value with a service call.
 */

export const conversionHistory = selectorFamily({
  key: "ConversionHistory",
  get: (chID) => async () => {
    if (chID !== "") {
      let response = await bot.conversations.history({
        channel: chID,
      });

      console.log(response);
      return response;
    }

    // if (response.error) {
    //   throw response.error;
    // }

    return [];
  },
});

export const slackUsersSel = selector({
  key: "slackUsersSel",
  get: async ({ get }) => {
    try {
      const response = await bot.users.list();
      console.log("bot", response.members);
      return response.members || [];
    } catch (error) {
      console.error(`slackUsersSel -> slackUsersSel() ERROR: \n${error}`);
      return [];
    }
  },
});

export const SlackUsersState = atom({
  key: "SlackUsersState",
  default: slackUsersSel,
});

export const SlackConListSel = selector({
  key: "SlackConListSel",
  get: async ({ get }) => {
    try {
      const response = await bot.conversations.list();
      console.log("bot", response);
      return response.channels || [];
    } catch (error) {
      console.error(`SlackConListSel -> SlackConListSel() ERROR: \n${error}`);
      return [];
    }
  },
});

export const SlackConvrsionList = atom({
  key: "SlackConvrsionList",
  default: SlackConListSel,
});
