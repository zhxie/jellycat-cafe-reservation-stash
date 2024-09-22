const APP = "Jellycat Cafe Reservation";

console.log("Record begins");
const ltToken = $request.headers["LT-TOKEN"];
if (ltToken) {
  const token = $persistentStore.read("JELLYCAT_CAFE_LT_TOKEN");
  if (token != ltToken) {
    $persistentStore.write(ltToken, "JELLYCAT_CAFE_LT_TOKEN");
    console.log(`Rotate LT-TOKEN to ${ltToken}`);
    $notification.post(APP, "", "The token has been rotated.");
  } else {
    console.log("Same LT-TOKEN");
  }
} else {
  console.log("No LT-TOKEN");
}

$done({});
