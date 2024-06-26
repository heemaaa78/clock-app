// Selecting elements from the DOM
const clockfacedisplay = document.getElementById("current_time");
const alarmListDisplay = document.getElementById("list-alarm");
const setAlarmButton = document.getElementById("set-alarm");
const deleteAlarmButton = document.getElementById("delete-alarm");

// Variables to store current time, alarm time, and alarms list
let current_time = null;
let alarms = [];

// Function to display live clock and check for alarms
function clockface() {
  setInterval(() => {
    const now = new Date();
    current_time = now.toLocaleTimeString([], { hour12: false }); // Get current time in "HH:mm:ss" format
    clockfacedisplay.textContent = current_time;
    alarm_checker();
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
  alarmListDisplay.innerHTML = alarms
    .map((alarm, index) => `<li>${alarm} <button onclick="deleteAlarm(${index})">Delete</button></li>`)
    .join("");
}

// Function to delete an alarm from the list
function deleteAlarm(index) {
  alarms.splice(index, 1);
  updateAlarmList();

  // Update local storage after deletion
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Function to check if it's time for any alarms
function alarm_checker() {
  const now = new Date();
  const currentTimeString = now.toLocaleTimeString([], { hour12: false }); // Get current time in "HH:mm:ss" format

  alarms.forEach((alarm, index) => {
    if (currentTimeString === alarm) {
      alert("Wake up buddy! It's time for your alarm: " + alarm);
      alarms.splice(index, 1); // Remove triggered alarm from list
      updateAlarmList();
      localStorage.setItem("alarms", JSON.stringify(alarms));
    }
  });
}

// Event listeners for buttons
setAlarmButton.addEventListener("click", setAlarm);
deleteAlarmButton.addEventListener("click", deleteAlarm);

// Initialize clock display and load alarms from local storage
clockface();

// Load alarms from local storage if available
if (localStorage.getItem("alarms")) {
  alarms = JSON.parse(localStorage.getItem("alarms"));
  updateAlarmList();
}
