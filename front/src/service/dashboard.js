import axios from "axios";
import { adminApi, getBaseApi, handelError } from "../configuration";

export async function getDashboard(loginstate, team, sdate, edate) {
  let tokens = loginstate.token ? loginstate.token : "token";
  let headers = { Authorization: `Bearer ` + tokens };

  const userApiUrl =
    adminApi() + "dashboard/" + team + "/" + sdate + "/" + edate;
  const response = await axios.get(userApiUrl, { headers });
  try {
    const response = await axios.get(userApiUrl, { headers });

    // console.log(response);

    return response.data || [];
  } catch (error) {
    handelError(error);
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}
