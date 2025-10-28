import "reflect-metadata";
import type { Address } from "./services/base/base.service";
import { AddressNotFoundException } from "./exceptions/address-not-found.exception";
import { AwesomeService } from "./services/awesome/awesome.service";
import { NominatimService } from "./services/nominatim/nominatim.service";
import cepPromise from "cep-promise";
import { container } from "tsyringe";

export async function cepGeocode<AllowEmptyLatLng extends boolean = false>(
  cep: string,
  config?: { acceptEmptyLatLng?: AllowEmptyLatLng }
): Promise<Address<AllowEmptyLatLng>> {
  const services = [
    container.resolve(NominatimService),
    container.resolve(AwesomeService),
  ];

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
