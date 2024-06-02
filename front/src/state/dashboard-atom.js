import { atom, selector, selectorFamily } from "recoil";

import { getDashboard } from "../service/dashboard";

import { loginState } from "../state/login-atom";
import { helper } from "@/utils/helper";
export const dashBoardSelect = selectorFamily({
  key: "dashBoardSelect",
  get:
    (data) =>
    async ({ get }) => {
      //  try {
    //  console.log("end date" + data);
      console.log("team" , data.teamFilter);
      console.log("date" , data.dateFilter);

      var spilt = data.dateFilter.split("-");
      var startDate = Date.parse(spilt[0]);
      var endDate = Date.parse(spilt[1]);

      const response = await getDashboard(
        get(loginState),
        data.teamFilter,
        helper.formatDate(startDate, "YYYY-MM-DD"),
        helper.formatDate(endDate, "YYYY-MM-DD")
      );

     return response.data || [];
      // } catch (error) {
      //   console.error(`getUserInfo -> getUsers() ERROR: \n${error}`);
      //   return [];
      // }

      return [];
    },
});
