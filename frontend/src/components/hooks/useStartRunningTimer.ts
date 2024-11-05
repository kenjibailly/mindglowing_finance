import { useEffect, useRef, useState } from "react";

// Timer interface for better type checking
interface Timer {
  id: string;
  running: boolean;
  time: string;
  newTime: string;
}

const useRunningTimer = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const timersRef = useRef<Timer[]>([]); // Use ref for the current timers data
  const intervalRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({}); // Store interval IDs by timer ID

  const startUseRunningTimer = (initialTimeString: string, id: string) => {
    const existingTimer = timersRef.current.find(
      (timer) => timer.id === id && timer.running
    );
    if (existingTimer) return; // Stop if timer is already running

    const parseTime = (timeString: string) => {
      const [hours, minutes, seconds] = timeString
        .split(" ")
        .map((part) => parseInt(part, 10) || 0);
      return { hours, minutes, seconds };
    };

    const { hours, minutes, seconds } = parseTime(initialTimeString);
    let updatedSeconds = seconds;
    let updatedMinutes = minutes;
    let updatedHours = hours;

    // Create a new interval only if one doesn’t already exist for this timer
    if (!intervalRef.current[id]) {
      const updateTimer = setInterval(() => {
        console.log("Interval running at " + Date.now());

        updatedSeconds += 1;
        if (updatedSeconds >= 60) {
          updatedSeconds = 0;
          updatedMinutes += 1;

          if (updatedMinutes >= 60) {
            updatedMinutes = 0;
            updatedHours += 1;
          }
        }

        const newTime = `${updatedHours}h ${updatedMinutes}m ${updatedSeconds}s`;

        // Update timersRef directly to avoid re-renders
        timersRef.current = timersRef.current.map((timer) =>
          timer.id === id ? { ...timer, newTime } : timer
        );

        // Optionally update the state to trigger UI updates only occasionally
        setTimers([...timersRef.current]);
      }, 1000);

      // Save interval ID for cleanup
      intervalRef.current[id] = updateTimer;

      // Add the timer to timersRef and optionally trigger a UI update
      timersRef.current = [
        ...timersRef.current,
        {
          id,
          running: true,
          time: initialTimeString,
          newTime: `${hours}h ${minutes}m ${seconds}s`,
        },
      ];
      setTimers([...timersRef.current]); // Trigger initial UI render
    }
  };

  const stopUseRunningTimer = (id: string) => {
    // Clear interval for the specific timer
    if (intervalRef.current[id]) {
      clearInterval(intervalRef.current[id]);
      intervalRef.current[id] = null;
    }

    // Update timersRef to mark the timer as stopped
    timersRef.current = timersRef.current.map((timer) =>
      timer.id === id ? { ...timer, running: false } : timer
    );

    setTimers([...timersRef.current]); // Trigger UI update to reflect stopped timer
  };

  const stopAllRunningTimers = () => {
    // Loop through all timers and stop each one
    timersRef.current.forEach((timer) => {
      if (timer.running) {
        stopUseRunningTimer(timer.id); // Stop the timer if it's running
      }
    });
  };

  useEffect(() => {
    // Cleanup intervals when component unmounts
    return () => {
      Object.values(intervalRef.current).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  return {
    timers,
    startUseRunningTimer,
    stopUseRunningTimer,
    stopAllRunningTimers,
  };
};

export default useRunningTimer;
