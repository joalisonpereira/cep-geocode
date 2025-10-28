import { describe, expect, it, vi } from "vitest";
import { cepGeocode } from ".";
import type { Address } from "./services/base/base.service";
import { AwesomeService } from "./services/awesome/awesome.service";
import { container } from "tsyringe";
import { NominatimService } from "./services/nominatim/nominatim.service";
import { beforeEach } from "node:test";
import { AddressNotFoundException } from "./exceptions/address-not-found.exception";
import { KeyMissingException } from "./exceptions/key-missing.exception";

function getMockAddress(): Address {
  return {
    cep: "01310100",
    state: "SP",
    city: "São Paulo",
    neighborhood: "Bela Vista",
    street: "Avenida Paulista",
    lat: -23.5613,
    lng: -46.6565,
  };
}

vi.mock("lib/services/nominatim/nominatim.service");

vi.mock("lib/services/awesome/awesome.service");

vi.mock("cep-promise", () => {
  return {
    default: vi.fn().mockResolvedValue(getMockAddress()),
  };
});

describe("cepGeocode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return correct data from AwesomeService", async () => {
    container.registerInstance<Partial<AwesomeService>>(AwesomeService, {
      execute: vi.fn().mockResolvedValue(getMockAddress()),
    });

    container.registerInstance<Partial<NominatimService>>(NominatimService, {
      execute: vi.fn().mockRejectedValue(new Error("Service not available")),
    });

    const result = await cepGeocode("01310100");

    expect(result).toEqual({
      cep: "01310100",
      state: "SP",
      city: "São Paulo",
      neighborhood: "Bela Vista",
      street: "Avenida Paulista",
      lat: -23.5613,
      lng: -46.6565,
    });
  });

  it("should return correct data from NominatimService when AwesomeService fails", async () => {
    container.registerInstance<Partial<AwesomeService>>(AwesomeService, {
      execute: vi.fn().mockRejectedValue(new Error("Service not available")),
    });

    container.registerInstance<Partial<NominatimService>>(NominatimService, {
      execute: vi.fn().mockResolvedValue(getMockAddress()),
    });
    const result = await cepGeocode("01310100");

    expect(result).toEqual({
      cep: "01310100",
      state: "SP",
      city: "São Paulo",
      neighborhood: "Bela Vista",
      street: "Avenida Paulista",
      lat: -23.5613,
      lng: -46.6565,
    });
  });

  it("should throw an error when both services fail", async () => {
    container.registerInstance<Partial<AwesomeService>>(AwesomeService, {
      execute: vi.fn().mockRejectedValue(new Error("Service not available")),
    });

    container.registerInstance<Partial<NominatimService>>(NominatimService, {
      execute: vi.fn().mockRejectedValue(new Error("Service not available")),
    });

    await expect(cepGeocode("01310100")).rejects.toThrow(
      AddressNotFoundException
    );
  });

  it("should return address with null lat/lng when acceptEmptyLatLng is true", async () => {
    container.registerInstance<Partial<AwesomeService>>(AwesomeService, {
      execute: vi.fn().mockRejectedValue(new Error("Service not available")),
    });

    container.registerInstance<Partial<NominatimService>>(NominatimService, {
      execute: vi.fn().mockRejectedValue(new Error("Service not available")),
    });

    const result = await cepGeocode("01310100", {
      acceptEmptyLatLng: true,
    });

    expect(result).toEqual({
      cep: "01310100",
      state: "SP",
      city: "São Paulo",
      neighborhood: "Bela Vista",
      street: "Avenida Paulista",
      lat: null,
      lng: null,
    });
  });

  it("should throw an KeyMissingException error when response is missing required keys", async () => {
    container.registerInstance<Partial<AwesomeService>>(AwesomeService, {
      execute: vi.fn().mockResolvedValue({
        cep: "01310100",
        state: "SP",
        city: "São Paulo",
        // neighborhood is missing
        street: "Avenida Paulista",
        lat: -23.5613,
        lng: -46.6565,
      }),
    });

    container.registerInstance<Partial<NominatimService>>(NominatimService, {
      execute: vi.fn().mockRejectedValue(new Error("Service not available")),
    });

    try {
      await cepGeocode("01310100");
    } catch (error) {
      expect(error).toBeInstanceOf(KeyMissingException);
    }
  });
});
