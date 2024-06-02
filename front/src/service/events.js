import axios from "axios";
import { adminApi } from "../configuration";

const token = localStorage.getItem("token");

const headers = { Authorization: `Bearer ${token}` };

export async function getEvents() {
  const userApiUrl = adminApi() + "events";
  // ("userApiUrl", userApiUrl);
  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error)
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}
