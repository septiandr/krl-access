// api/krl.js
import axios from "axios";

const TOKEN = `Bearer ${process.env.EXPO_PUBLIC_TOKEN}`;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "";

export const getSchedule = async ({ stationId = "YK", timeFrom = "00:00", timeTo = "24:00" }) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          stationid: stationId,
          timefrom: timeFrom,
          timeto: timeTo
        },
        headers: {
          Authorization: TOKEN,
        }
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Gagal fetch jadwal:", error.response?.data || error.message);
      return null;
    }
  };