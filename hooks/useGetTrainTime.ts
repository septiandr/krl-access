import { GetScheduleResult, getTrainSchedule } from "@/api/getTrainTimeList"
import { useCachedRequest } from "./useChachedFetch"


export function useGetTrainTime(params: string) {
  const key = `train_${params}`
  const fetchFn = () => getTrainSchedule(params)

  return useCachedRequest<GetScheduleResult>(key, fetchFn)
}
