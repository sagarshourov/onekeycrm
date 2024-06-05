/**
 * We generate a quasi-random URL to show that
 * when the service is called, changes in the results
 * will cause our Recoil app state to be synchronized.
 */

export const getBaseApi = () => `https://api.onekeycrm.us/api/`;

export const  adminApi = () => `https://api.onekeycrm.us/api/admin/`;

// export const getBaseApi = () => `http://localhost:8000/api/`;

// export const adminApi = () => `http://localhost:8000/api/admin/`;

export const handelError = (error) => {
  console.log(error);
  //  localStorage.clear();
  // window.location.href = "/login";
};

// export const handelError = (error) => {
// console.log(error);
// };
