export class KeyMissingException extends Error {
  constructor() {
    super("Some required key is missing in the response");

    this.name = "KeyMissingException";
  }
}
