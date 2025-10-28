export class InvalidResponseException extends Error {
  constructor() {
    super("The response from the service is invalid or malformed");

    this.name = "InvalidResponseException";
  }
}
