import { getSchedule, GetScheduleResult } from "@/api/getSchedule"
import { useCachedRequest } from "./useChachedFetch"

export function useSchedule(params = {}, onSuccess?: (data: GetScheduleResult) => void) {
  const key = `schedule_${JSON.stringify(params)}`
  const fetchFn = () => getSchedule(params)

  const { data, error, loading, refetch } = useCachedRequest<GetScheduleResult>(
    key,
    fetchFn,
    { onSuccess }
  )

  const filtered = data?.data.filter(
    (item) => item.ka_name === "COMMUTER LINE YOGYAKARTA"
  )

  return { data: filtered, error, loading, refetch }
}
