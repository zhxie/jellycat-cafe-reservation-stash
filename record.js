const APP = "Jellycat Cafe Reservation";

console.log("Record begins");
const ltToken = $request.headers["LT-TOKEN"];
if (ltToken) {
  const token = $persistentStore.read("JELLYCAT_CAFE_LT_TOKEN");
  if (token != ltToken) {
    $persistentStore.write(ltToken, "JELLYCAT_CAFE_LT_TOKEN");
    console.log("Record LT_TOKEN");
    $notification.post(APP, "", "The token has been rotated.");
  }
}

$done({});
