import { atom, selector, atomFamily, selectorFamily } from "recoil";
import {
  getAllUsers,
  getAllCalls,
  getSingleCall,
  getAllReports,
  getAllNoti,
  getCallsPagination,
  getCallsPaginationIndex,
  getAssignUEmployee,
} from "../service/admin";
import { loginState } from "../state/login-atom";
/**
 * Populate the default selector return value with a service call.
 */

export const assignSelect = selectorFamily({
  key: "assignSelect",
  get:
    (id) =>
    async ({ get }) => {
      try {
        const response = await getAssignUEmployee(get(loginState), id);
        return response.data || [];
      } catch (error) {
        console.error(`getAssignUEmployee -> getUsers() ERROR: \n${error}`);
        return [];
      }
    },
});

export const allUserSelect = selector({
  key: "allUserSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllUsers(get(loginState));
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const callSelect = selector({
  key: "callSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllCalls(get(loginState));
      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const notiSelect = selector({
  key: "notiSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllNoti(get(loginState));
      return response.data || [];
    } catch (error) {
      console.error(`getAllNoti -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const pageLimit = atom({
  key: "pageLimit",
  default: 20,
});

export const pagOffset = atom({
  key: "pagOffset",
  default: 0,
});

export const columnState = atom({
  key: "columnState",
  default: "sections",
});

export const valueState = atom({
  key: "valueState",
  default: null,
});

// cancel  start
export const cStartDate = atom({
  key: "cStartDate",
  default: null,
});

export const cEndDate = atom({
  key: "cEndDate",
  default: null,
});

export const searchAtom = atom({
  key: "searchAtom",
  default: "0",
});
export const CancelOrder = atom({
  key: "CancelOrder",
  default: "DESC",
});

export const CancelUser = atom({
  key: "CancelUser",
  default: 0,
});

export const cancelSelect = selector({
  key: "cancelSelect",
  get: async ({ get }) => {
    try {
      const response = await getCallsPagination(
        get(loginState),
        get(CancelUser),
        "results",
        1,
        get(cStartDate),
        get(cEndDate),
        get(pagOffset),
        get(pageLimit),
        get(searchAtom),
        get(CancelOrder)
      );

      //console.log('canN_res',response);

      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});
//cancel end
export const resultState = atom({
  key: "resultState",
  default: 0,
});

export const clientUser = atom({
  key: "clientUser",
  default: 0,
});

export const clientSelect = selector({
  key: "clientSelect",
  get: async ({ get }) => {
    try {
      const response = await getCallsPagination(
        get(loginState),
        get(clientUser),
        "results",
        get(resultState),
        get(cStartDate),
        get(cEndDate),
        get(pagOffset),
        get(pageLimit),
        get(searchAtom),
        "ASC"
      );

      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const callIdState = atom({
  key: "callIdState",
  default: 0,
});

export const singleCallselect = selector({
  key: "singleCallselect",
  get: async ({ get }) => {
    try {
      const response = await getSingleCall(get(loginState), get(callIdState));
      return response.data || [];
    } catch (error) {
      console.error(`getSingleCall -> getSingleCall() ERROR: \n${error}`);
      return [];
    }
  },
});

export const reportCount = atom({
  key: "reportCount",
  default: 0,
});
export const reportUser = atom({
  key: "reportUser",
  default: 0,
});

export const reportSelect = selector({
  key: "reportSelect",
  get: async ({ get }) => {
    try {
      const response = await getAllReports(
        get(loginState),
        get(reportUser),
        get(reportCount)
      );
      return response.data || [];
    } catch (error) {
      console.error(`reportSelect -> reportSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const reportListState = atom({
  key: "reportListState",
  default: reportSelect,
});
export const searchUser = atom({
  key: "searchUser",
  default: 0,
});

export const searchListSelect = selector({
  key: "searchListSelect",
  get: async ({ get }) => {
    try {
      const response = await getCallsPagination(
        get(loginState),
        get(searchUser),
        get(columnState),
        get(valueState),
        get(cStartDate),
        get(cEndDate),
        get(pagOffset),
        get(pageLimit),
        get(searchAtom),
        "ASC"
      );

      //console.log('canN_res',response);

      return response.data || [];
    } catch (error) {
      console.error(`allUserState -> allUserSelect() ERROR: \n${error}`);
      return [];
    }
  },
});

export const searchListState = atom({
  key: "searchListState",
  default: searchListSelect,
});

export const allUserListState = atom({
  key: "allUserListState",
  default: allUserSelect,
});

export const callListState = atom({
  key: "callListState",
  default: callSelect,
});

export const notiState = atom({
  key: "notiState",
  default: notiSelect,
});

export const cancelListState = atom({
  key: "cancelListState",
  default: cancelSelect,
});

export const clientListState = atom({
  key: "clientListState",
  default: clientSelect,
});

export const singleCallState = atom({
  key: "singleCallState",
  default: singleCallselect,
});



export const currentPageIndex = atom({
  key: "currentPageIndex",
  default: 1,
});
export const perPageIndex = atom({
  key: "perPageIndex",
  default: 1200,
});



export const callSelectIndex = selector({
  key: "callSelectIndex",
  get: async ({ get }) => {
    try {
      const response = await getCallsPaginationIndex(
        get(loginState),
        get(currentPageIndex),
        "ASC",
        get(perPageIndex)
      );

      //console.log('canN_res',response);

      return response.data || [];
    } catch (error) {
      console.error(`paginationCallState -> callSelectIndex() ERROR: \n${error}`);
      return [];
    }
  },
});


