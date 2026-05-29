import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchUser = async (username) => {
  const response = await API.get(
    `/user/${username}`
  );

  return response.data;
};

export const fetchInsights = async (
  profileData
) => {
  const response = await API.post(
    "/insights",
    {
      profileData,
    }
  );

  return response.data;
};