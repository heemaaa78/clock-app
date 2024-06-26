const clockfacedisplay = document.getElementById("current_time");
const alarmListDisplay = document.getElementById("list-alarm");
const setAlarmButton = document.getElementById("set-alarm");
const deleteAlarmButton = document.getElementById("delete-alarm");

let current_time = null;
let alarm_time = null;
let alarms = [];

// Load alarms from local storage if available
if (localStorage.getItem("alarms")) {
  alarms = JSON.parse(localStorage.getItem("alarms"));
  updateAlarmList();
}

//this function is for live clock that has displayed in the web page
function clockface() {
  setInterval(() => {
    current_time = new Date().toLocaleTimeString();
    clockfacedisplay.textContent = current_time;
    alarm_checker();
  }, 1000); // Update every second
}

clockface();

//this function is for set the alarm .
function setAlarm(event) {
  event.preventDefault();
  let alarm_hours = parseInt(document.getElementById("hours").value);
  let alarm_min = parseInt(document.getElementById("minute").value);
  let alarm_sec = parseInt(document.getElementById("sec").value);
  let alarm_am_pm = document.getElementById("am_pm").value;

  // Check if the entered values are valid
  if (isNaN(alarm_hours) || isNaN(alarm_min) || isNaN(alarm_sec)) {
    alert("Please enter valid time values.");
    return;
  }

  if (alarm_min < 10) {
    alarm_min = "0" + alarm_min;
  }
  if (alarm_sec < 10) {
    alarm_sec = "0" + alarm_sec;
  }

  alarm_time = `${alarm_hours}:${alarm_min}:${alarm_sec} ${alarm_am_pm}`;

  alarms.push(alarm_time);
  updateAlarmList();
  // Save alarms to local storage
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function updateAlarmList() {
  alarmListDisplay.innerHTML = alarms
    .map(
      (alarm, index) =>
        `<h2> Alarm </h2> <br/><li>${alarm} <button onclick="deleteAlarm(${index})">Delete</button></li>`
    )
    .join("");
}

//delete the alarm
function deleteAlarm(index) {
  alarms.splice(index, 1);
  updateAlarmList();
  // Save alarms to local storage after deletion
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

//function that used to send the alert if it is time for alarm
function alarm_checker() {
  alarms.forEach((alarm) => {
    if (current_time === alarm) {
      alert("Wake up buddy! It's time for your alarm: " + alarm);
      // Remove the alarm that has been triggered
      const index = alarms.indexOf(alarm);
      alarms.splice(index, 1);
      updateAlarmList();
      // Update local storage after removing the triggered alarm
      localStorage.setItem("alarms", JSON.stringify(alarms));
    }
  });
}

//EventListener for button
setAlarmButton.addEventListener("click", setAlarm);
deleteAlarmButton.addEventListener("click", delete_alarm);
