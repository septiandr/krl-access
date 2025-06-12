import { API_BASE_URL, TOKEN } from "@/constants/constanst";
import axios from "axios";

export interface TrainSchedule {
  train_id: string;
  ka_name: string;
  station_id: string;
  station_name: string;
  time_est: string;
  transit_station: boolean;
  color: string;
  transit: string;
}

export interface TrainScheduleResponse {
  status: number;
  data: TrainSchedule[];
}

export type GetScheduleResult = TrainScheduleResponse | null;

export const getTrainSchedule = async (trainid: string): Promise<GetScheduleResult> => {
    const response = await axios.get<TrainScheduleResponse>(
      `${API_BASE_URL}/schedule-train`,
      {
        params: {
          trainid: trainid,
        },
        headers: {
          Authorization: TOKEN,
        },
      }
    );

    return response.data;
};
