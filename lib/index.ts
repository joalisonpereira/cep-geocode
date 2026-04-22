import "reflect-metadata";
import type { Address } from "./services/base/base.service";
import { AddressNotFoundException } from "./exceptions/address-not-found.exception";
import { AwesomeService } from "./services/awesome/awesome.service";
import { NominatimService } from "./services/nominatim/nominatim.service";
import cepPromise from "cep-promise";
import { container } from "tsyringe";

export async function cepGeocode(
  cep: string,
  config?: { acceptEmptyCoords?: boolean },
): Promise<
  Address<typeof config extends { acceptEmptyCoords: true } ? true : false>
> {
  type CoordsRule = typeof config extends { acceptEmptyCoords: true }
    ? true
    : false;

  const services = [
    container.resolve(NominatimService),
    container.resolve(AwesomeService),
  ];

  for (const service of services) {
    try {
      const address = await service.execute(cep);
      return address as Address<CoordsRule>;
    } catch {
      // try again with the next service
    }
  }

  if (config?.acceptEmptyCoords) {
    const address = await cepPromise(cep);
    return { ...address, coords: null } as unknown as Address<CoordsRule>;
  }

  throw new AddressNotFoundException();
}
