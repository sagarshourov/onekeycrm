import axios from "axios";
import { getBaseApi, adminApi } from "../configuration";

const token = localStorage.getItem("token");

const headers = { Authorization: `Bearer ${token}` };

export async function chatHistory() {
  const userApiUrl = getBaseApi() + "whatsapp";

  try {
    const response = await axios.get(userApiUrl, { headers });
    return response.data || [];
  } catch (error) {
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function postChat(data) {
  const userApiUrl = getBaseApi() + "whatsapp";

  try {
    //const response = await axios.get(userApiUrl, { headers });

    const response = await axios.put(userApiUrl, data, {
      headers
    });

    return response.data || [];
  } catch (error) {
    throw new Error(`Error in 'axiosGetJsonData(${userApiUrl})': 'Err`);
  }
}

export async function recordHistory(id) {
  const userApiUrl = adminApi() + "whatsapp/record_history/" + id;

  try {
    //const response = await axios.get(userApiUrl, { headers });

    const response = await axios.get(userApiUrl, { headers });

    return response.data || [];
  } catch (error) {
    throw new Error(`Error in 'axioGetHistory(${userApiUrl})': 'Err`);
  }
}
