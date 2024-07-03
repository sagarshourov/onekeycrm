import axios from "axios";
import { adminApi, getBaseApi, handelError } from "../configuration";

// const token = localStorage.getItem("token");

// const headers = { Authorization: `Bearer ${token}` };
export async function getAssignUEmployee(loginstate, id) {
  const userApiUrl = adminApi() + "assign_employee/" + id;
  // ("userApiUrl", userApiUrl);
  let tokens = loginstate.token ? loginstate.token : "token";

  let headers = { Authorization: `Bearer ` + tokens };
  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getSidebar(
  section,
  loginState,
  currentPage,
  order,
  limit
) {
  let tokens = loginState.token ? loginState.token : "invalid";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "get_sidebar/" +
    section +
    "/" +
    currentPage +
    "/" +
    order +
    "/" +
    limit;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getCallsPaginationIndex(
  section,
  loginState,
  currentPage,
  order,
  limit
) {
  let tokens = loginState.token ? loginState.token : "invalid";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "calls_pagination/" +
    section +
    "/" +
    currentPage +
    "/" +
    order +
    "/" +
    limit;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getEmpFollowReport(
  loginstate,
  startDate,
  endDate,
  result,
  offset,
  pageLimit,
  order
) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "emp_follow_filter/" +
    startDate +
    "/" +
    endDate +
    "/" +
    result +
    "/" +
    offset +
    "/" +
    pageLimit +
    "/" +
    order;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getEmpFcReport(
  loginstate,
  startDate,
  endDate,
  result,
  offset,
  pageLimit,
  order
) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "emp_fc_filter/" +
    startDate +
    "/" +
    endDate +
    "/" +
    result +
    "/" +
    offset +
    "/" +
    pageLimit +
    "/" +
    order;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getEmpReport(
  loginstate,
  startDate,
  endDate,
  Type,
  result,
  cancel,
  offset,
  pageLimit,
  order
) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "emp_filter/" +
    startDate +
    "/" +
    endDate +
    "/" +
    Type +
    "/" +
    result +
    "/" +
    cancel +
    "/" +
    offset +
    "/" +
    pageLimit +
    "/" +
    order;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getPreMadeReport(
  loginstate,
  startDate,
  endDate,
  User,
  Type,
  offset,
  pageLimit,
  order
) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "pre_filter/" +
    startDate +
    "/" +
    endDate +
    "/" +
    User +
    "/" +
    Type +
    "/" +
    offset +
    "/" +
    pageLimit +
    "/" +
    order;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getCallsPagination(
  loginstate,
  user_id,
  column,
  value,
  startDate,
  endDate,
  offset,
  limit,
  search,
  order
) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() +
    "call_filter/" +
    user_id +
    "/" +
    column +
    "/" +
    value +
    "/" +
    startDate +
    "/" +
    endDate +
    "/" +
    offset +
    "/" +
    limit +
    "/" +
    search +
    "/" +
    order;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllUsers(loginstate) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };
  const userApiUrl = adminApi() + "users";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllCalls(loginstate) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };
  const userApiUrl = adminApi() + "calls";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getAllReports(loginstate, user_id, count) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl = adminApi() + "reports/" + user_id + "/" + count;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

// export async function getCallsFilter(loginstate, results) {
//   let tokens = loginstate.token ? loginstate.token : "token";
//   let headers = { Authorization: `Bearer ` + tokens };
//   const userApiUrl = adminApi() + "call_filter/results/" + results;

//   try {
//     const response = await axios.get(userApiUrl, { headers });
//     return response.data || [];
//   } catch (error) {
//     handelError(error);
//     throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
//   }
// }

export async function getAllNoti(loginstate) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };
  const userApiUrl = adminApi() + "notifications";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function getSingleCall(loginstate, id) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl = adminApi() + "calls/" + id;

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}
