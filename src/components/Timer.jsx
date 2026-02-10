function Timer({ time, isRunning }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`timer ${isRunning ? "running" : ""}`}>
      <span className="timer-icon">⏱️</span>
      <span className="timer-value">{formatTime(time)}</span>
    </div>
  );
}

export default Timer;
