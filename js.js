let timerInterval;
let totalSeconds = 0;
let lapTimes = [];
let isRunning = false;
let darkMode = false;
let milliseconds = 0;
let progressOffset = 816.8; // Initial value for circle circumference

// DOM elements
const timerDisplay = document.getElementById('timer');
const progressRing = document.querySelector('.progress-ring__circle');
const themeToggle = document.getElementById('theme-toggle');

// Update timer display with current time
function updateTimer() {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor(milliseconds / 10);

  timerDisplay.innerText = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  
  // Update progress ring (completes one full revolution every minute)
  const offset = progressOffset - ((seconds + (milliseconds / 1000)) / 60) * progressOffset;
  progressRing.style.strokeDashoffset = offset.toString();
}

// Update lap times display
function updateLapTimes() {
  const lapTimesContainer = document.getElementById('lap-times');
  lapTimesContainer.innerHTML = '';

  lapTimes.forEach((lap, index) => {
    const lapTime = document.createElement('div');
    
    // Calculate difference from previous lap
    let diffText = '';
    if (index < lapTimes.length - 1) {
      const currentTime = timeToSeconds(lap);
      const prevTime = timeToSeconds(lapTimes[index + 1]);
      const diff = currentTime - prevTime;
      
      if (diff > 0) {
        diffText = `+${formatDiff(diff)}`;
      } else if (diff < 0) {
        diffText = `-${formatDiff(Math.abs(diff))}`;
      } else {
        diffText = '±0.00';
      }
    }
    
    // Create lap display with two spans for alignment
    const lapNumber = document.createElement('span');
    lapNumber.textContent = `Lap ${lapTimes.length - index}`;
    
    const lapTimeValue = document.createElement('span');
    lapTimeValue.textContent = `${lap} ${diffText ? '(' + diffText + ')' : ''}`;
    
    lapTime.appendChild(lapNumber);
    lapTime.appendChild(lapTimeValue);
    lapTimesContainer.appendChild(lapTime);
  });
}

// Convert time string to seconds
function timeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// Format time difference
function formatDiff(seconds) {
  return seconds.toFixed(2) + 's';
}

// Format time components to have leading zeros
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Start the stopwatch
function startStopwatch() {
  if (!isRunning) {
    // Clear previous interval if any
    clearInterval(timerInterval);
    
    // Start a new interval that updates every 10ms for smoother animation
    let startTime = Date.now() - (totalSeconds * 1000) - milliseconds;
    
    timerInterval = setInterval(function() {
      const elapsedTime = Date.now() - startTime;
      totalSeconds = Math.floor(elapsedTime / 1000);
      milliseconds = elapsedTime % 1000;
      updateTimer();
    }, 10);
    
    isRunning = true;
    
    // Update button styles
    document.getElementById('start').classList.add('active');
    document.getElementById('pause').classList.remove('active');
    
    // Add pulsing animation to timer
    timerDisplay.classList.add('pulse');
  }
}

// Pause the stopwatch
function pauseStopwatch() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    
    // Update button styles
    document.getElementById('start').classList.remove('active');
    document.getElementById('pause').classList.add('active');
    
    // Remove pulsing animation
    timerDisplay.classList.remove('pulse');
  }
}

// Record a lap time
function lapStopwatch() {
  if (isRunning || totalSeconds > 0) {
    const currentTime = timerDisplay.innerText;
    lapTimes.unshift(currentTime);
    updateLapTimes();
    
    // Add a flash effect to the lap button
    const lapButton = document.getElementById('lap');
    lapButton.classList.add('flash');
    setTimeout(() => {
      lapButton.classList.remove('flash');
    }, 300);
  }
}

// Reset the stopwatch
function resetStopwatch() {
  totalSeconds = 0;
  milliseconds = 0;
  lapTimes = [];
  updateTimer();
  updateLapTimes();
  pauseStopwatch();
  progressRing.style.strokeDashoffset = progressOffset.toString();
  
  // Add shake animation to reset button
  const resetButton = document.getElementById('reset');
  resetButton.classList.add('shake');
  setTimeout(() => {
    resetButton.classList.remove('shake');
  }, 500);
}

// Toggle between light and dark mode
function toggleTheme() {
  darkMode = !darkMode;
  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Initialize circle properties based on screen size
function initProgressRing() {
  const circle = document.querySelector('.progress-ring__circle');
  const radius = parseInt(circle.getAttribute('r'));
  progressOffset = 2 * Math.PI * radius;
  
  circle.style.strokeDasharray = `${progressOffset} ${progressOffset}`;
  circle.style.strokeDashoffset = `${progressOffset}`;
}

// Event listeners
document.getElementById('start').addEventListener('click', startStopwatch);
document.getElementById('pause').addEventListener('click', pauseStopwatch);
document.getElementById('lap').addEventListener('click', lapStopwatch);
document.getElementById('reset').addEventListener('click', resetStopwatch);
themeToggle.addEventListener('change', toggleTheme);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    if (isRunning) {
      pauseStopwatch();
    } else {
      startStopwatch();
    }
    e.preventDefault();
  } else if (e.code === 'KeyL') {
    lapStopwatch();
    e.preventDefault();
  } else if (e.code === 'KeyR') {
    resetStopwatch();
    e.preventDefault();
  }
});

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
  darkMode = true;
  themeToggle.checked = true;
  document.body.classList.add('dark-mode');
}

// On window resize, update the progress ring
window.addEventListener('resize', initProgressRing);

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  updateTimer();
  initProgressRing();
  
  // Add animation classes
  document.querySelector('.stopwatch-container').classList.add('fade-in');
});

// Save theme preference
window.addEventListener('beforeunload', function() {
  localStorage.setItem('darkMode', darkMode);
});