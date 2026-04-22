import { cepGeocode } from "../lib";

async function run() {
  const data = await cepGeocode("50030310", { acceptEmptyCoords: true });

  console.log(data);
}

run();
