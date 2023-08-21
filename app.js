document.addEventListener("DOMContentLoaded", () => {
  const startTimerButton = document.getElementById("startTimer");
  const pauseTimerButton = document.getElementById("pauseTimer");
  const boxes = document.querySelectorAll(".box");
  const remainingTimeDisplay = document.getElementById("remainingTime");
  let timerInterval;
  let remainingTime = 0;
  let isTimerRunning = true;
  let timerValue = 0;

  const timerInput = document.getElementById("timer");

  timerInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      startTimerButton.click(); // Trigger the click event on the Start Timer button
    }
  });

  startTimerButton.addEventListener("click", () => {
    const timerInput = document.getElementById("timer");
    timerValue = parseTimeInput(timerInput.value); // Parse the time input

    if (timerValue === null) {
      alert("Please enter a valid timer value in the format hh:mm:ss.");
      return;
    }

    clearInterval(timerInterval);
    remainingTime = timerValue;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      remainingTime--;
      if (remainingTime < 1) {
        setInterval(() => {
          remainingTimeDisplay.textContent = `Time Over`;
        }, 1);

        clearInterval(timerInterval);
        timerInput.value = "";
      }
      updateTimerDisplay();
    }, 1000);
    isTimerRunning = true;
  });

  pauseTimerButton.addEventListener("click", () => {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      updateTimerDisplay();
    } else {
      timerInterval = setInterval(() => {
        remainingTime--;
        if (remainingTime <= 0) {
          clearInterval(timerInterval);
        }
        updateTimerDisplay();
      }, 1000);
      isTimerRunning = true;
    }
  });

  function updateTimerDisplay() {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    if (remainingTime < 1) {
      remainingTimeDisplay.textContent = `Time Over`;
    }
    if (isTimerRunning) {
      remainingTimeDisplay.textContent = `Remaining Time: ${formatTime(
        hours
      )}:${formatTime(minutes)}:${formatTime(seconds)}`;
    } else {
      remainingTimeDisplay.textContent = `Paused: ${formatTime(
        hours
      )}:${formatTime(minutes)}:${formatTime(seconds)}`;
    }
  }

  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }
  function parseTimeInput(input) {
    const parts = input.split(":");
    if (parts.length !== 3) {
      return null;
    }
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return null;
    }
    return hours * 3600 + minutes * 60 + seconds;
  }

  function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  //   boxes.forEach((box) => {
  //     box.addEventListener("click", () => {
  //       if (box.style.backgroundColor === "") box.style.backgroundColor = "red";
  //       else if (box.style.backgroundColor === "red")
  //         box.style.backgroundColor = "green";
  //       else if (box.style.backgroundColor === "green")
  //         box.style.backgroundColor = "grey";
  //       else if (box.style.backgroundColor === "grey")
  //         box.style.backgroundColor = "red";
  //     });
  //   });

  const timeTableBody = document.getElementById("timeTableBody");
  const boxColors = {}; // Store box colors and times

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      const boxId = box.id;
      const currentTime = new Date().toLocaleTimeString();

      if (!boxColors[boxId]) {
        boxColors[boxId] = {
          color: "green",
          time: remainingTime,
        };
      } else {
        switch (boxColors[boxId].color) {
          case "green":
            boxColors[boxId].color = "grey";
            break;
          case "grey":
            boxColors[boxId].color = "red";
            break;
          default:
            boxColors[boxId].color = "green";
            break;
        }
        boxColors[boxId].time = remainingTime;
      }

      box.style.backgroundColor = boxColors[boxId].color;
      updateTable();
    });
  });

  function updateTable() {
    timeTableBody.innerHTML = "";
    console.log(boxColors);
    const sortedBoxIds = Object.keys(boxColors).sort();

    console.log(sortedBoxIds);

    for (const boxId of sortedBoxIds) {
      const row = document.createElement("tr");
      const boxCell = document.createElement("td");
      const timeCell = document.createElement("td");

      boxCell.textContent = boxId;
      timeCell.textContent =
        boxColors[boxId].color === "green"
          ? secondsToHMS(timerValue - boxColors[boxId].time)
          : "-";

      row.appendChild(boxCell);
      row.appendChild(timeCell);
      timeTableBody.appendChild(row);
    }
  }
});
