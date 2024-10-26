import { EXPO_SERVER_IP } from "@env";
import { AxiosResponse } from "axios";
import { http } from "./http-service";
export interface ExchangeHistoryEntry {
    from: string;
    to: string;
    rate: number;
    amount: number;
    result: number;
    fromFlag?: string;
    toFlag?: string;
    timestamp: string;
}

export async function setExchangeHistory(
  username: string,
  from: string,
  to: string,
  rate: number,
  amount: string,
  result: string,
  fromFlag: string,
  toFlag: string,
  timestamp: string
): Promise<AxiosResponse<any>> {
  try {
    const res = await http.post(`http://${EXPO_SERVER_IP}:3000/exchange`, {
      username: username,
      from: from,
      to: to,
      rate: rate,
      amount: amount,
      result: result,
      fromFlag: fromFlag,
      toFlag: toFlag,
      timestamp: timestamp,
    });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function getExchangeHistory(username: string) {
  try {
    const res = await http.get(
      `http://${EXPO_SERVER_IP}:3000/exchange-history/${username}`
    );
    return res;
  } catch (error) {
    console.error("Failed to fetch exchange history:", error);
    throw error;
  }
}

export async function deleteExchangeHistory(username: string) {
  try {
    const res = await http.delete(
      `http://${EXPO_SERVER_IP}/exchange-history/${username}`
    );
    return res;
  } catch (error) {
    console.error("Failed to delete exchange history:", error);
    throw error;
  }
}
