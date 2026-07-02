import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Use your computer's local IP address. 
// This allows both physical devices (iOS/Android) and emulators/simulators to connect via WiFi.
const getBaseUrl = () => {
  return "http://192.168.1.197:3000/api";
};

const api = axios.create({
 baseURL: getBaseUrl(),
 headers: {
  "Content-Type": "application/json",
 },
});

// Interceptor to inject token
api.interceptors.request.use(
 async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
   config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
 },
 (error) => {
  return Promise.reject(error);
 },
);

export default api;
