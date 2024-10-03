import axios, { AxiosResponse, AxiosError } from "axios";

//create instance
const http = axios.create({
  headers: { "Content-Type": "application/json" },
});

export { http };

export type { AxiosResponse, AxiosError };