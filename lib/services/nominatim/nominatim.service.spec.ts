/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { NominatimService } from "./nominatim.service";
import { afterEach } from "vitest";
import { InvalidResponseException } from "../../exceptions/invalid-response.exception";

vi.mock("cep-promise", () => {
  return {
    default: vi.fn().mockResolvedValue({
      cep: "01310-100",
      state: "SP",
      city: "São Paulo",
      neighborhood: "Bela Vista",
      street: "Avenida Paulista",
    }),
  };
});

describe("NominatimService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should transform API response to expected format", async () => {
    const mockFetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          place_id: 123456789,
          licence: "Data © OpenStreetMap contributors",
          lat: "-23.5613",
          lon: "-46.6565",
          class: "place",
          type: "city",
          place_rank: 10,
          importance: 0.85,
          addresstype: "city",
          name: "Recife",
          display_name: "Recife, Pernambuco, Brazil",
          boundingbox: ["-8.1530", "-7.9460", "-34.9990", "-34.7910"],
        },
      ],
    } as any);

    const service = new NominatimService();

    const result = await service.execute("01310-100");

    expect(result).toBeTruthy();

    expect(result.cep).toBe("01310100");

    expect(result.state).toBe("SP");

    expect(result.city).toBe("São Paulo");

    expect(result.neighborhood).toBe("Bela Vista");

    expect(result.street).toBe("Avenida Paulista");

    expect(result.lat).toBe(-23.5613);

    expect(result.lng).toBe(-46.6565);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should throw InvalidResponseException when API response is empty", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as any);

    const service = new NominatimService();

    try {
      await service.execute("01310-100");
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidResponseException);
    }
  });
});
