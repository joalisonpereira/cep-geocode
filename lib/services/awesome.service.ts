import { BaseService } from "./base.service";

interface Response {
  cep: string;
  address_type: string;
  address_name: string;
  address: string;
  state: string;
  district: string;
  city: string;
  city_ibge: string;
  ddd: string;
  lat: string;
  lng: string;
}

export class AwesomeService extends BaseService<Response> {
  protected TEMPLATE_URL = "https://cep.awesomeapi.com.br/json/{{cep}}";

  async execute(cep: string) {
    const data = await super.get(cep);

    return this.result({
      cep,
      state: data.state,
      city: data.city,
      neighborhood: data.district,
      street: data.address,
      lat: Number(data.lat),
      lng: Number(data.lng),
    });
  }
}
