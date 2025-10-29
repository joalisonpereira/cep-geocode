# 📍 cep-geocode

![](./docs/badge-statements.svg) ![](./docs/badge-functions.svg) ![](./docs/badge-lines.svg) ![](./docs/badge-branches.svg)

A lightweight and reliable library to **fetch Brazilian address data by ZIP code (CEP)**, including **latitude and longitude**.  
It automatically falls back between multiple providers, ensuring high availability and consistent geolocation accuracy.

---

## 🚀 Features

- 🔄 **Automatic fallback** between multiple APIs (Nominatim → AwesomeAPI)
- 📦 **Zero heavy dependencies**
- 🌎 Returns **latitude and longitude**
- ⚙️ Built with **TypeScript** (fully typed)
- 🧩 Works in both **Node.js** and **browser** environments

---

## 📦 Installation

```bash
npm install cep-geocode
# or
yarn add cep-geocode
# or
pnpm add cep-geocode
```

## 💡 Usage

```ts
import { cepGeocode } from "cep-geocode";

async function run() {
  // second parameter is optional
  const data = await cepGeocode("50030310");

  console.log(data);
}

run();
```

## ✅ Example Response

```json
{
  "cep": "50030-310",
  "state": "PE",
  "city": "Recife",
  "neighborhood": "Bairro do Recife",
  "street": "Rua do Bom Jesus",
  "lat": -8.06317,
  "lng": -34.87114
}
```

### ⚙️ Options

```ts
const data = await cepGeocode("50030310", { acceptEmptyLatLng: true });
```

| Option              | Type      | Default | Description                                                                                                                        |
| ------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `acceptEmptyLatLng` | `boolean` | `false` | When `true`, returns address data even if `lat` and `lng` could not be obtained. Useful when the CEP is valid but geocoding fails. |

### 🧠 Fallback Strategy

The library uses a smart fallback mechanism to ensure consistent results even if one provider is unavailable:

🔍 Nominatim (OpenStreetMap) — Primary provider for address and coordinates.

💪 AwesomeAPI — Used automatically if Nominatim fails.

This ensures resilience against downtime from any single provider.

### 🧰 Compatibility

| Environment | Supported |
| ----------- | --------- |
| Node.js     | ✅        |
| Browser     | ✅        |
| TypeScript  | ✅        |
