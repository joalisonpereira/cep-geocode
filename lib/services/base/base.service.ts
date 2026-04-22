import { KeyMissingException } from "../../exceptions/key-missing.exception";

export const KEYS = [
  "cep",
  "state",
  "city",
  "neighborhood",
  "street",
  "coords",
] as const;

export type Address<AllowNullCoords extends boolean = false> = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
} & (AllowNullCoords extends true
  ? { coords: { lat: number; lng: number } | null }
  : { coords: { lat: number; lng: number } });

export abstract class BaseService<T extends object> {
  protected abstract TEMPLATE_URL: string;

  public abstract execute(cep: string): Promise<Address>;

  protected async get(cep: string): Promise<T> {
    const response = await fetch(
      this.TEMPLATE_URL.replace("{{cep}}", cep.replace(/\D/g, "")),
    );

    const data = (await response.json()) as T;

    return data;
  }

  protected result(data: Address): Address {
    KEYS.forEach((key) => {
      if (!data[key as keyof Address]) {
        throw new KeyMissingException();
      }
    });

    return { ...data, cep: data.cep.replace(/\D/g, "") };
  }
}
