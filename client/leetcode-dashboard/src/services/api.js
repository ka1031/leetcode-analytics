import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const fetchUser = async (username) => {
  const response = await API.get(`/user/${username}`);
  return response.data;
};