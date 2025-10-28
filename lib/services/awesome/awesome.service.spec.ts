/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { AwesomeService } from "./awesome.service";
import { afterEach } from "vitest";

describe("AwesomeService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should transform API response to expected format", async () => {
    const mockFetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        cep: "01310-100",
        address_type: "Avenida",
        address_name: "Paulista",
        address: "Avenida Paulista",
        state: "SP",
        district: "Bela Vista",
        city: "São Paulo",
        city_ibge: "3550308",
        ddd: "11",
        lat: "-23.5613",
        lng: "-46.6565",
      }),
    } as any);

    const service = new AwesomeService();

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
});
