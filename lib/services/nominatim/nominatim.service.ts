import { injectable } from "tsyringe";
import { InvalidResponseException } from "../../exceptions/invalid-response.exception";
import { BaseService } from "../../services/base/base.service";
import cepPromise from "cep-promise";

interface Response {
  place_id: number;
  licence: string;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [string, string, string, string];
}

@injectable()
export class NominatimService extends BaseService<Response[]> {
  protected TEMPLATE_URL =
    "https://nominatim.openstreetmap.org/search?postalcode={{cep}}&country=Brazil&format=json";

  public async execute(cep: string) {
    const data = await super.get(cep);

    const addressLocation = data[0];

    if (!addressLocation) {
      throw new InvalidResponseException();
    }

    const address = await cepPromise(cep);

    return this.result({
      cep: address.cep,
      state: address.state,
      city: address.city,
      neighborhood: address.neighborhood,
      street: address.street,
      lat: Number(addressLocation.lat),
      lng: Number(addressLocation.lon),
    });
  }
}
