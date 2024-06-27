
let timerInterval;
let totalSeconds = 0;
let lapTimes = [];
let isRunning = false;

function updateTimer() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById('timer').innerText = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

function updateLapTimes() {
  const lapTimesContainer = document.getElementById('lap-times');
  lapTimesContainer.innerHTML = '';

  lapTimes.forEach((lap, index) => {
    const lapTime = document.createElement('div');
    lapTime.textContent = `Lap ${index + 1}: ${lap}`;
    lapTimesContainer.appendChild(lapTime);
  });
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function startStopwatch() {
  if (!isRunning) {
    timerInterval = setInterval(function() {
      totalSeconds++;
      updateTimer();
    }, 1000);
    isRunning = true;
  }
}

function pauseStopwatch() {
  clearInterval(timerInterval);
  isRunning = false;
}

function lapStopwatch() {
  if (isRunning) {
    const lapTime = document.getElementById('timer').innerText;
    lapTimes.unshift(lapTime);
    updateLapTimes();
  }
}

function resetStopwatch() {
  totalSeconds = 0;
  lapTimes = [];
  updateTimer();
  updateLapTimes();
  pauseStopwatch();
}

document.getElementById('start').addEventListener('click', startStopwatch);
document.getElementById('pause').addEventListener('click', pauseStopwatch);
document.getElementById('lap').addEventListener('click', lapStopwatch);
document.getElementById('reset').addEventListener('click', resetStopwatch);
