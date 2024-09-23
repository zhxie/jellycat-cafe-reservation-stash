const APP = "Jellycat Cafe Reservation";
const INTERVAL = 5000;

function check() {
  console.log("Check begins");
  const token = $persistentStore.read("JELLYCAT_CAFE_LT_TOKEN");
  if (!token) {
    console.log("Empty token");
    $done();
  }

  $httpClient.get(
    {
      url: "https://xcx-api.dtmiller.com/mini/mine/invitation/126eXMa9uH6",
      headers: {
        "LT-TOKEN": token,
      },
    },
    (error, _, data) => {
      if (error) {
        handleError("An error occurred while requesting HTTP.");
        return;
      }

      handleResponse(data);
    }
  );
}

function isSlotValid(date, time) {
  const current = Date.now();
  const target = new Date(`${date}T${time}+08:00`);
  return current < target.getTime();
}

function handleError(message) {
  $notification.post(APP, "", message);
  $persistentStore.write("", "JELLYCAT_CAFE_LT_TOKEN");
  console.log(message);
  $done();
}

function handleResponse(bytes) {
  const data = JSON.parse(bytes);
  if (data["code"] != 200) {
    handleError("The token is invalid or expired.");
    return;
  }

  const res = [];
  for (const dateSlot of data["data"]["dateList"]) {
    const date = dateSlot["slotDate"];
    const slots = [];
    for (const timeSlot of dateSlot["timeList"]) {
      const time = timeSlot["slotStart"];
      if (isSlotValid(date, time)) {
        const remain = timeSlot["slotLimit"] - timeSlot["slotOccupy"];
        if (remain > 0) {
          slots.push({ time, remain });
        }
      }
    }
    if (slots.length > 0) {
      res.push({ date, slots });
    }
  }

  if (res.length > 0) {
    let dateStr = [];
    for (const dateSlot of res) {
      dateStr.push(dateSlot.date);
    }
    const message = `Available slots found in ${dateStr.join(", ")}.`;
    $notification.post(APP, "", message);
    console.log(message);
  } else {
    console.log("No available slot");
  }
}

for (let i = 0; i < 60000; i += INTERVAL) {
  setTimeout(check, i);
}
setTimeout($done, 59000);
