import { KeyMissingException } from "../../exceptions/key-missing.exception";

export interface AddressBase {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export const KEYS = [
  "cep",
  "state",
  "city",
  "neighborhood",
  "street",
  "lat",
  "lng",
] as const;

export type Address<AllowEmptyLatLng extends boolean = false> = AddressBase & {
  lat: AllowEmptyLatLng extends true ? number | null : number;
  lng: AllowEmptyLatLng extends true ? number | null : number;
};

export abstract class BaseService<T extends object> {
  protected abstract TEMPLATE_URL: string;

  public abstract execute(cep: string): Promise<Address>;

  protected async get(cep: string): Promise<T> {
    const response = await fetch(
      this.TEMPLATE_URL.replace("{{cep}}", cep.replace(/\D/g, ""))
    );

    const data = (await response.json()) as T;

    return data;
  }

  protected result(data: Address): Address {
    KEYS.forEach((key) => {
      if (!data[key as keyof Address]) {
        console.log("@@@", key);
        throw new KeyMissingException();
      }
    });

    return { ...data, cep: data.cep.replace(/\D/g, "") };
  }
}
