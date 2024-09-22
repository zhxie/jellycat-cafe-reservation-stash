const ltToken = $request.headers["LT_TOKEN"];
if (ltToken) {
  $persistentStore.write(ltToken, "JELLYCAT_CAFE_LT_TOKEN");
}

$done();
