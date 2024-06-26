document.addEventListener("DOMContentLoaded", function () {
  // Selecting elements from the DOM
  const clockfacedisplay = document.getElementById("current_time");
  const alarmListDisplay = document.getElementById("list-alarm");
  const setAlarmButton = document.getElementById("set-alarm");

  // Variables to store current time and alarms list
  let alarms = [];

  // Function to display live clock and check for alarms
  function clockface() {
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const am_pm = hours >= 12 ? "PM" : "AM";
      const twelveHourFormat = hours % 12 || 12; // Convert hour to 12-hour format

      const current_time = `${twelveHourFormat}:${
        minutes < 10 ? "0" + minutes : minutes
      }:${seconds < 10 ? "0" + seconds : seconds} ${am_pm}`;

      clockfacedisplay.textContent = current_time;
      alarm_checker(now); // Pass current time (as Date object) to alarm checker
    }, 1000); // Update every second
  }

  // Function to set a new alarm
  function setAlarm(event) {
    event.preventDefault();
    const alarm_hours = parseInt(document.getElementById("hours").value);
    const alarm_min = parseInt(document.getElementById("minute").value);
    const alarm_sec = parseInt(document.getElementById("sec").value);
    const alarm_am_pm = document.getElementById("am_pm").value;

    // Validate input values
    if (isNaN(alarm_hours) || isNaN(alarm_min) || isNaN(alarm_sec)) {
      alert("Please enter valid time values.");
      return;
    }

    // Format minutes and seconds with leading zeros if necessary
    const formatted_min = alarm_min < 10 ? `0${alarm_min}` : `${alarm_min}`;
    const formatted_sec = alarm_sec < 10 ? `0${alarm_sec}` : `${alarm_sec}`;

    // Convert hours to 24-hour format
    let formatted_hours = alarm_hours;
    if (alarm_am_pm === "pm" && alarm_hours < 12) {
      formatted_hours += 12;
    } else if (alarm_am_pm === "am" && alarm_hours === 12) {
      formatted_hours = 0;
    }

    // Create the alarm time string in "HH:mm:ss" format
    const alarm_time = `${formatted_hours}:${formatted_min}:${formatted_sec}`;

    // Add the alarm to the list
    alarms.push(alarm_time);
    updateAlarmList();

    // Save alarms to local storage
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }

  // Function to update the displayed list of alarms
  function updateAlarmList() {
    alarmListDisplay.innerHTML = ""; // Clear existing list

    alarms.forEach((alarm, index) => {
      // Convert from 24-hour to 12-hour format for display
      const [hours, minutes, seconds] = alarm.split(":");
      let displayHours = parseInt(hours);
      let am_pm = displayHours >= 12 ? "PM" : "AM";
      displayHours = displayHours % 12;
      displayHours = displayHours ? displayHours : 12; // Handle midnight (0 hours)

      const alarmItem = document.createElement("li");
      alarmItem.innerHTML = `${displayHours}:${minutes}:${seconds} ${am_pm} <button class="delete-btn">Delete</button>`;
      alarmListDisplay.appendChild(alarmItem);
    });
  }

  // Function to delete an alarm from the list
  function deleteAlarm(index) {
    alarms.splice(index, 1);
    updateAlarmList();

    // Update local storage after deletion
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }

  // Event listener for set alarm button
  setAlarmButton.addEventListener("click", setAlarm);

  // Event delegation for delete buttons
  alarmListDisplay.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const index = event.target.parentElement.dataset.index;
      deleteAlarm(index);
    }
  });

  // Function to check if it's time for any alarms
  function alarm_checker(currentTime) {
    alarms.forEach((alarm, index) => {
      const [hours, minutes, seconds] = alarm.split(":");
      const alarmTime = new Date(currentTime);
      alarmTime.setHours(parseInt(hours));
      alarmTime.setMinutes(parseInt(minutes));
      alarmTime.setSeconds(parseInt(seconds));

      if (
        currentTime.getHours() === alarmTime.getHours() &&
        currentTime.getMinutes() === alarmTime.getMinutes() &&
        currentTime.getSeconds() === alarmTime.getSeconds()
      ) {
        alert("Wake up buddy! It's time for your alarm: " + alarm);
        alarms.splice(index, 1); // Remove triggered alarm from list
        updateAlarmList();
        localStorage.setItem("alarms", JSON.stringify(alarms));
      }
    });
  }

  // Initialize clock display and load alarms from local storage
  clockface();

  // Load alarms from local storage if available
  if (localStorage.getItem("alarms")) {
    alarms = JSON.parse(localStorage.getItem("alarms"));
    updateAlarmList();
  }
});
