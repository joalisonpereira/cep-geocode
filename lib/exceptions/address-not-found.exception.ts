export class AddressNotFoundException extends Error {
  constructor() {
    super("Could not find the address for the provided CEP");

    this.name = "AddressNotFoundException";
  }
}
