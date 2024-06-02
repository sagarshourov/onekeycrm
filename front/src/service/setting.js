import axios from "axios";
import { adminApi } from "../configuration";

const token = localStorage.getItem("token");

const headers = { Authorization: `Bearer ${token}` };

export async function getTables() {
  const userApiUrl = adminApi() + "settings";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    handelError(error)
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}
