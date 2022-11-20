import axios from "axios";
import { json } from "react-router-dom";
import { CONFIG } from "./utils";

const appAxios = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

appAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    if (config.url === '/upload') {
      config.headers['Content-Type'] = ''
    } else {
      config.headers['Content-Type'] = 'application/json'
    }


    const user = localStorage.getItem("user");
    if (user) {
      const parseUser = JSON.parse(user);
      config.headers['Authorization'] = parseUser.accessToken
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);


appAxios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response && error.response.status === 403) {
    const originalConfig = error.config
    originalConfig.headers = { ...originalConfig.headers }
    const user = localStorage.getItem("user");
    let refreshToken
    let parseUser
    if (user) {
      parseUser = JSON.parse(user);
      refreshToken = parseUser.refreshToken
    }
    if (refreshToken) {
      const refreshTokenData = await appAxios.post('auth/refreshToken', {
        refreshToken
      })
      originalConfig.headers['Authorization'] = refreshTokenData.data.body.data
      parseUser.accessToken = refreshTokenData.data.body.data
      localStorage.setItem('user', JSON.stringify(parseUser))
    }
  }
  return Promise.reject(error);
});

export default appAxios;
