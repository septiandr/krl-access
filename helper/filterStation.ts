import { TrainSchedule } from "@/api/getSchedule";

export const filterSchedule = (
  schedule: TrainSchedule[] | null,
  destinationFilter: string,
  timeFilter: string
): TrainSchedule[] => {
  if (!schedule) return [];

  return schedule.filter((item) => {
    const hour = parseInt(item.time_est.slice(0, 2), 10);

    const matchesDestination = item.dest
      .toLowerCase()
      .includes(destinationFilter.toLowerCase());

    const matchesTime =
      (timeFilter === "1" && hour < 12) ||
      (timeFilter === "2" && hour >= 12 && hour < 17) ||
      (timeFilter === "3" && hour >= 17) ||
      timeFilter === "";

    return matchesDestination && matchesTime;
  });
};