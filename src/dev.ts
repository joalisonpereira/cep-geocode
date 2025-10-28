import { cepGeocode } from "../lib";

async function run() {
  const data = await cepGeocode("50030310", { acceptEmptyLatLng: true });

  console.log(data);
}

run();
