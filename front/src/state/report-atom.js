import { atom, selector } from "recoil";
import {
  getPreMadeReport,
  getEmpFcReport,
  getEmpReport,
  getEmpFollowReport
} from "../service/admin";
import { loginState } from "../state/login-atom";

export const pStartDate = atom({
  key: "pStartDate",
  default: "2022-01-01",
});

export const pEndDate = atom({
  key: "pEndDate",
  default: "2028-01-01",
});

export const pUser = atom({
  key: "pUser",
  default: 0,
});

export const pType = atom({
  // status
  key: "pType",
  default: 0,
});

// export const pLimit = atom({
//   key: "pLimit",
//   default: 0,
// });

export const pLimit = atom({
  key: "pLimit",
  default: 100,
});

export const pOffset = atom({
  key: "pOffset",
  default: 0,
});

export const aResult = atom({
  key: "aResult",
  default: 0,
});

export const aCancel = atom({
  key: "aCancel",
  default: 0,
});

export const preMadeReportSelect = selector({
  key: "preMadeReportSelect",
  get: async ({ get }) => {
    try {
      const response = await getPreMadeReport(
        get(loginState),
        get(pStartDate),
        get(pEndDate),
        get(pUser),
        get(pType),
        get(pOffset),
        get(pLimit),
        "ASC"
      );
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const preMadeState = atom({
  key: "preMadeState",
  default: preMadeReportSelect,
});

export const empReportSelect = selector({
  key: "empReportSelect",
  get: async ({ get }) => {
    try {
      const response = await getEmpReport(
        get(loginState),
        get(pStartDate),
        get(pEndDate),
        get(pType), // status
        get(aResult),
        get(aCancel),
        get(pOffset),
        get(pLimit),
        "ASC"
      );
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const empReportState = atom({
  key: "empReportState",
  default: empReportSelect,
});

export const empFirstCallReportSelect = selector({
  key: "empFirstCallReportSelect",
  get: async ({ get }) => {
    try {
      const response = await getEmpFcReport(
        get(loginState),
        get(pStartDate),
        get(pEndDate),
        get(aResult),
        get(pOffset),
        get(pLimit),
        "ASC"
      );
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});


export const empFollowUpReportSelect = selector({
  key: "empFollowUpReportSelect",
  get: async ({ get }) => {
    try {
      const response = await getEmpFollowReport(
        get(loginState),
        get(pStartDate),
        get(pEndDate),
        get(aResult),
        get(pOffset),
        get(pLimit),
        "ASC"
      );
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

