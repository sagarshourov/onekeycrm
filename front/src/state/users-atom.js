import { atom, selector, selectorFamily } from "recoil";


import {
 
    getUserInfo,
    getAllActivity
  } from "../service/users";




export const userSelect = selectorFamily({
    key: "userSelect",
    get:
      (id) =>
      async ({ get }) => {
        try {
          const response = await getUserInfo(id);
          return response.data || [];
        } catch (error) {
          console.error(`getUserInfo -> getUsers() ERROR: \n${error}`);
          return [];
        }
      },
  });



  export const activitySelect = selectorFamily({
    key: "activitySelect",
    get:
      (id) =>
      async ({ get }) => {
        try {
          const response = await getAllActivity(id);
          return response.data || [];
        } catch (error) {
          console.error(`getUserInfo -> getUsers() ERROR: \n${error}`);
          return [];
        }
      },
  });
  
  
  