import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

export default function App() {
  const [isTicking, setIsTicking] = useState(false);

  const [inputHours, setInputHours] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(10);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [configTime, setConfigTime] = useState(600000);

  const [remainingTime, setRemainingTime] = useState(configTime);
  const [hasStarted, setHasStarted] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const timeAtStartRef = useRef(configTime);

  const formatTime = (ms) => {
    if (ms < 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const minutes = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleReset = useCallback(
    (newTime) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsTicking(false);
      const finalTime = newTime !== undefined ? newTime : configTime;
      setRemainingTime(finalTime);
      timeAtStartRef.current = finalTime;
      setHasStarted(false);
    },
    [configTime]
  );

  const handleSetNewTime = () => {
    const newTotalMs =
      inputHours * 3600000 + inputMinutes * 60000 + inputSeconds * 1000;
    if (newTotalMs <= 0) {
      alert("Please set a time greater than 0.");
      return;
    }
    setConfigTime(newTotalMs);
    handleReset(newTotalMs);
  };

  const handleStartStop = () => {
    if (remainingTime <= 0 && !isTicking && !hasStarted) return;
    if (!isTicking) {
      setHasStarted(true);
      timeAtStartRef.current = remainingTime;
    }
    setIsTicking((prev) => !prev);
  };

  const handleTimeInputChange = (Time, unit) => {
    let val = parseInt(Time.target.value);
    if (isNaN(val) || val < 0) {
      val = 0;
    }
    if (unit !== "hours" && val > 59) {
      val = 59;
    }
    if (unit === "hours") {
      setInputHours(val);
    } else if (unit === "minutes") {
      setInputMinutes(val);
    } else if (unit === "seconds") {
      setInputSeconds(val);
    }
  };

  useEffect(() => {
    if (isTicking) {
      startTimeRef.current = Date.now();
      const timeAtStart = timeAtStartRef.current;
      timerRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        const newRemaining = timeAtStart - elapsedTime;
        if (newRemaining <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setRemainingTime(0);
          timeAtStartRef.current = 0;
          setIsTicking(false);
          setHasStarted(false);
          alert("Timer finished!");
        } else {
          setRemainingTime(newRemaining);
        }
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTicking]);

  // let timerStatus;
  // if (isTicking) {
  //   timerStatus = "Counting Down";
  // } else if (remainingTime <= 0) {
  //   timerStatus = "Time's Up";
  // } else if (hasStarted) {
  //   timerStatus = "Paused";
  // } else {
  //   timerStatus = "Ready";
  // }

  const startStopText = isTicking ? "Pause" : hasStarted ? "Resume" : "Start";
  const displayTime = formatTime(remainingTime);
  const isStartDisabled = remainingTime <= 0 && !isTicking && !hasStarted;

  return (
    <div className="container">
      <div className="input">
        <label htmlFor="hours-input">Hours: </label>
        <input
          type="number"
          value={inputHours}
          min="0"
          max="99"
          onChange={(Hour) => handleTimeInputChange(Hour, "hours")}
          disabled={isTicking}
        />
        <label htmlFor="minutes-input">Minutes: </label>
        <input
          type="number"
          value={inputMinutes}
          min="0"
          max="59"
          onChange={(Min) => handleTimeInputChange(Min, "minutes")}
          disabled={isTicking}
        />
        <label htmlFor="seconds-input">Seconds: </label>
        <input
          type="number"
          value={inputSeconds}
          min="0"
          max="59"
          onChange={(Sec) => handleTimeInputChange(Sec, "seconds")}
          disabled={isTicking}
        />
        <button onClick={handleSetNewTime} disabled={isTicking}>
          Set Time
        </button>
      </div>

      <p className="count">{displayTime}</p>

      <div className="b-container">
        <button
          onClick={handleStartStop}
          disabled={isStartDisabled}
          className="test"
        >
          {startStopText}
        </button>{" "}
        <button
          onClick={() => handleReset(configTime)}
          disabled={!hasStarted && remainingTime === configTime}
          className="test"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
