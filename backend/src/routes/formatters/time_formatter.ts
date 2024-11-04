const formatTime = (seconds: number) => {
  // Round down to ensure no decimal part
  seconds = Math.floor(seconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}h ${String(
    minutes
  ).padStart(2, "0")}m ${String(remainingSeconds).padStart(2, "0")}s`;
  return formattedTime;
};

export default formatTime;
