const formatTime = (time: string) => {
  // Misalnya: "05:00:00" => "05:00"
  return time.split(":").slice(0, 2).join(":");
};

export { formatTime };
