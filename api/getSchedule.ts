import { API_BASE_URL, TOKEN } from "@/constants/constanst";
import axios from "axios";
export interface TrainSchedule {
  train_id: string;
  ka_name: string;
  route_name: string;
  dest: string;
  time_est: string;   // "HH:mm:ss"
  color: string;      // hex color, misal "#FF0000"
  dest_time: string;  // "HH:mm:ss"
}

export interface TrainScheduleResponse {
  status: number;
  data: TrainSchedule[];
}

// Parameter yang diterima fungsi getSchedule
export interface GetScheduleParams {
  stationId?: string;  // Optional, default "YK"
  timeFrom?: string;   // Optional, default "00:00"
  timeTo?: string;     // Optional, default "24:00"
}

// Tipe return function getSchedule
// bisa TrainScheduleResponse atau null kalau error
export type GetScheduleResult = TrainScheduleResponse | null;

export const getSchedule = async (
  params: GetScheduleParams = {}
): Promise<TrainScheduleResponse> => {
  const {
    stationId = "YK",
    timeFrom = "00:00",
    timeTo = "24:00",
  } = params;

  const response = await axios.get<TrainScheduleResponse>(`${API_BASE_URL}/schedule`, {
    params: {
      stationid: stationId,
      timefrom: timeFrom,
      timeto: timeTo,
    },
    headers: {
      Authorization: TOKEN,
    },
  });

  return response.data;
};

