const APP = "Jellycat Cafe Reservation";

function check() {
  const token = $persistentStore.read("JELLYCAT_CAFE_LT_TOKEN");
  if (!token) {
    $done();
  }

  $httpClient.get(
    {
      url: "https://xcx-api.dtmiller.com/mini/mine/invitation/126eXMa9uH6",
      headers: {
        LT_TOKEN: token,
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
  const target = Date.parse(`${date} ${time}+8:00`);
  return current < target;
}

function handleError(message) {
  $notification.post(APP, "Error", message);
  $persistentStore.write("", "JELLYCAT_CAFE_LT_TOKEN");
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
    let count = 0;
    let dateStr = [];
    for (const dateSlot of res) {
      let timeStr = [];
      for (const timeSlot of dateSlot.slots) {
        timeStr.push(`${timeSlot.time}(${timeSlot.remain})`);
        count += timeSlot.remain;
      }
      dateStr.push(`${dateSlot.date}: ${timeStr.join(", ")}`);
    }
    $notification.post(APP, `${count} Valid Seat${count > 1 ? "s" : ""} Found`, dateStr.join("\n"));
  }
  $done();
}

check();
setTimeout(check, 10000);
setTimeout(check, 20000);
setTimeout(check, 30000);
setTimeout(check, 40000);
setTimeout(check, 50000);
