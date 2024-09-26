const APP = "Jellycat CAFE Reservation";

const LT_TOKEN_KEY = "JELLYCAT_CAFE_LT_TOKEN";

console.log("Record begins");
const ltToken =
  $request.headers["LT-TOKEN"] || $request.headers["Lt-Token"] || $request.headers["lt-token"];
if (ltToken) {
  const token = $persistentStore.read(LT_TOKEN_KEY);
  if (token != ltToken) {
    $persistentStore.write(ltToken, LT_TOKEN_KEY);
    console.log(`Rotate LT-TOKEN to ${ltToken}`);
    $notification.post(APP, "", "The token has been rotated.");
  } else {
    console.log("Same LT-TOKEN");
  }
} else {
  console.log("No LT-TOKEN");
}

$done({});
