import { AddressNotFoundException } from "./exceptions/address-not-found.exception";
import { AwesomeService } from "./services/awesome.service";
import type { Address } from "./services/base.service";
import { NominatimService } from "./services/nominatim.service";
import cepPromise from "cep-promise";

export async function cepGeocode<AllowEmptyLatLng extends boolean = false>(
  cep: string,
  config?: { acceptEmptyLatLng?: AllowEmptyLatLng }
): Promise<Address<AllowEmptyLatLng>> {
  const services = [new NominatimService(), new AwesomeService()];

  for (const service of services) {
    try {
      const address = await service.execute(cep);
      return address as Address<AllowEmptyLatLng>;
    } catch {
      // try again with the next service
    }
  }

  if (config?.acceptEmptyLatLng) {
    const address = await cepPromise(cep);

    return {
      ...address,
      lat: null,
      lng: null,
    } as unknown as Address<AllowEmptyLatLng>;
  }

  throw new AddressNotFoundException();
}
