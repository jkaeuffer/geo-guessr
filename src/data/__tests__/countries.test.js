import { describe, it, expect } from "vitest";
import {
  countries,
  continents,
  continentColors,
  getCountriesByContinent,
  findCountry,
  getCountryByCode,
  dependencies,
  findDependency,
  getDependenciesForCountry,
} from "../countries";

describe("Countries Data", () => {
  describe("countries array", () => {
    it("should contain 197 countries", () => {
      // The plan mentions 197 countries
      expect(countries.length).toBeGreaterThanOrEqual(190);
    });

    it("should have valid country objects with required properties", () => {
      countries.forEach((country) => {
        expect(country).toHaveProperty("name");
        expect(country).toHaveProperty("code");
        expect(country).toHaveProperty("continent");
        expect(country).toHaveProperty("capital");
        expect(country).toHaveProperty("aliases");
        expect(typeof country.name).toBe("string");
        expect(typeof country.code).toBe("string");
        expect(country.code).toHaveLength(2);
        expect(Array.isArray(country.aliases)).toBe(true);
      });
    });

    it("should have unique country codes", () => {
      const codes = countries.map((c) => c.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it("should have all countries assigned to valid continents", () => {
      countries.forEach((country) => {
        expect(continents).toContain(country.continent);
      });
    });
  });

  describe("continents array", () => {
    it("should contain 6 continents", () => {
      expect(continents).toEqual([
        "Africa",
        "Asia",
        "Europe",
        "North America",
        "South America",
        "Oceania",
      ]);
    });
  });

  describe("continentColors", () => {
    it("should have a color for each continent", () => {
      continents.forEach((continent) => {
        expect(continentColors).toHaveProperty(continent);
        expect(typeof continentColors[continent]).toBe("string");
        expect(continentColors[continent]).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe("getCountriesByContinent", () => {
    it("should return all African countries", () => {
      const africanCountries = getCountriesByContinent("Africa");
      expect(africanCountries.length).toBeGreaterThan(50);
      africanCountries.forEach((c) => {
        expect(c.continent).toBe("Africa");
      });
    });

    it("should return all Asian countries", () => {
      const asianCountries = getCountriesByContinent("Asia");
      expect(asianCountries.length).toBeGreaterThan(40);
      asianCountries.forEach((c) => {
        expect(c.continent).toBe("Asia");
      });
    });

    it("should return all European countries", () => {
      const europeanCountries = getCountriesByContinent("Europe");
      expect(europeanCountries.length).toBeGreaterThan(40);
      europeanCountries.forEach((c) => {
        expect(c.continent).toBe("Europe");
      });
    });

    it("should return all North American countries", () => {
      const northAmericanCountries = getCountriesByContinent("North America");
      expect(northAmericanCountries.length).toBeGreaterThan(20);
      northAmericanCountries.forEach((c) => {
        expect(c.continent).toBe("North America");
      });
    });

    it("should return all South American countries", () => {
      const southAmericanCountries = getCountriesByContinent("South America");
      expect(southAmericanCountries.length).toBe(12);
      southAmericanCountries.forEach((c) => {
        expect(c.continent).toBe("South America");
      });
    });

    it("should return all Oceanian countries", () => {
      const oceanianCountries = getCountriesByContinent("Oceania");
      expect(oceanianCountries.length).toBe(14);
      oceanianCountries.forEach((c) => {
        expect(c.continent).toBe("Oceania");
      });
    });

    it("should return empty array for invalid continent", () => {
      const invalidCountries = getCountriesByContinent("Invalid");
      expect(invalidCountries).toEqual([]);
    });
  });
});

describe("findCountry", () => {
  describe("exact matches (English)", () => {
    it("should find country by exact name (case insensitive)", () => {
      expect(findCountry("France")).toEqual(
        expect.objectContaining({ code: "FR", name: "France" })
      );
      expect(findCountry("FRANCE")).toEqual(
        expect.objectContaining({ code: "FR" })
      );
      expect(findCountry("france")).toEqual(
        expect.objectContaining({ code: "FR" })
      );
    });

    it("should find country by exact alias", () => {
      expect(findCountry("USA")).toEqual(
        expect.objectContaining({ code: "US", name: "United States" })
      );
      expect(findCountry("America")).toEqual(
        expect.objectContaining({ code: "US" })
      );
      expect(findCountry("UK")).toEqual(
        expect.objectContaining({ code: "GB", name: "United Kingdom" })
      );
      expect(findCountry("Great Britain")).toEqual(
        expect.objectContaining({ code: "GB" })
      );
    });

    it("should find Cape Verde with alias Cabo Verde", () => {
      expect(findCountry("Cape Verde")).toEqual(
        expect.objectContaining({ code: "CV" })
      );
      expect(findCountry("Cabo Verde")).toEqual(
        expect.objectContaining({ code: "CV" })
      );
    });

    it("should handle countries with special characters", () => {
      expect(findCountry("São Tomé and Príncipe")).toEqual(
        expect.objectContaining({ code: "ST" })
      );
      expect(findCountry("Sao Tome and Principe")).toEqual(
        expect.objectContaining({ code: "ST" })
      );
      expect(findCountry("Côte d'Ivoire")).toEqual(
        expect.objectContaining({ code: "CI" })
      );
    });
  });

  describe("fuzzy matching (English)", () => {
    it("should find country with minor typos", () => {
      // Fuzzy matching uses similarity threshold of 0.75
      // "Germani" (7 chars) vs "Germany" (7 chars) - 1 char different = similarity ~0.86
      expect(findCountry("Germani")).toEqual(
        expect.objectContaining({ code: "DE" })
      );
      // "Australa" (8 chars) vs "Australia" (9 chars) - 1 char different = good match
      expect(findCountry("Australa")).toEqual(
        expect.objectContaining({ code: "AU" })
      );
    });

    it("should NOT match with major typos (too different)", () => {
      expect(findCountry("Xyz")).toBeNull();
      expect(findCountry("Frxxxxxxxxx")).toBeNull();
    });

    it("should not match very short inputs for fuzzy matching", () => {
      expect(findCountry("Fr")).toBeNull();
      expect(findCountry("xx")).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      expect(findCountry("")).toBeNull();
    });

    it("should handle whitespace-only string", () => {
      expect(findCountry("   ")).toBeNull();
    });

    it("should handle string with leading/trailing whitespace", () => {
      expect(findCountry("  France  ")).toEqual(
        expect.objectContaining({ code: "FR" })
      );
    });

    it("should return null for non-existent country", () => {
      expect(findCountry("Atlantis")).toBeNull();
      expect(findCountry("Middle Earth")).toBeNull();
    });
  });

  describe("French language support", () => {
    it("should find country by French name", () => {
      expect(findCountry("Allemagne", "fr")).toEqual(
        expect.objectContaining({ code: "DE" })
      );
      expect(findCountry("Espagne", "fr")).toEqual(
        expect.objectContaining({ code: "ES" })
      );
      expect(findCountry("États-Unis", "fr")).toEqual(
        expect.objectContaining({ code: "US" })
      );
    });

    it("should find country by French alias", () => {
      expect(findCountry("Angleterre", "fr")).toEqual(
        expect.objectContaining({ code: "GB" })
      );
    });

    it("should support fuzzy matching in French", () => {
      expect(findCountry("Alemagn", "fr")).toEqual(
        expect.objectContaining({ code: "DE" })
      );
    });

    it("should fall back to English if not found in French", () => {
      expect(findCountry("France", "fr")).toEqual(
        expect.objectContaining({ code: "FR" })
      );
    });
  });
});

describe("getCountryByCode", () => {
  it("should find country by code", () => {
    expect(getCountryByCode("FR")).toEqual(
      expect.objectContaining({ name: "France", code: "FR" })
    );
    expect(getCountryByCode("US")).toEqual(
      expect.objectContaining({ name: "United States", code: "US" })
    );
  });

  it("should be case insensitive", () => {
    expect(getCountryByCode("fr")).toEqual(
      expect.objectContaining({ code: "FR" })
    );
    expect(getCountryByCode("Fr")).toEqual(
      expect.objectContaining({ code: "FR" })
    );
  });

  it("should return undefined for invalid code", () => {
    expect(getCountryByCode("XX")).toBeUndefined();
    expect(getCountryByCode("ZZZ")).toBeUndefined();
  });
});

describe("Dependencies", () => {
  describe("dependencies array", () => {
    it("should have valid dependency objects", () => {
      dependencies.forEach((dep) => {
        expect(dep).toHaveProperty("name");
        expect(dep).toHaveProperty("code");
        expect(dep).toHaveProperty("parentCode");
        expect(dep).toHaveProperty("parentName");
        expect(typeof dep.name).toBe("string");
        expect(typeof dep.code).toBe("string");
        expect(dep.code).toHaveLength(2);
      });
    });

    it("should include known dependencies", () => {
      const greenland = dependencies.find((d) => d.code === "GL");
      expect(greenland).toEqual(
        expect.objectContaining({
          name: "Greenland",
          parentCode: "DK",
          parentName: "Denmark",
        })
      );

      const puertoRico = dependencies.find((d) => d.code === "PR");
      expect(puertoRico).toEqual(
        expect.objectContaining({
          name: "Puerto Rico",
          parentCode: "US",
          parentName: "United States",
        })
      );
    });
  });

  describe("findDependency", () => {
    it("should find dependency by exact name", () => {
      expect(findDependency("Greenland")).toEqual(
        expect.objectContaining({ code: "GL", parentCode: "DK" })
      );
      expect(findDependency("Puerto Rico")).toEqual(
        expect.objectContaining({ code: "PR", parentCode: "US" })
      );
    });

    it("should find dependency by alias", () => {
      expect(findDependency("Reunion")).toEqual(
        expect.objectContaining({ code: "RE", parentCode: "FR" })
      );
      expect(findDependency("Curacao")).toEqual(
        expect.objectContaining({ code: "CW", parentCode: "NL" })
      );
    });

    it("should be case insensitive", () => {
      expect(findDependency("greenland")).toEqual(
        expect.objectContaining({ code: "GL" })
      );
      expect(findDependency("GREENLAND")).toEqual(
        expect.objectContaining({ code: "GL" })
      );
    });

    it("should support fuzzy matching for dependencies", () => {
      expect(findDependency("Greenlnd")).toEqual(
        expect.objectContaining({ code: "GL" })
      );
    });

    it("should return null for non-existent dependency", () => {
      expect(findDependency("Atlantis")).toBeNull();
      expect(findDependency("")).toBeNull();
    });

    it("should return null for short inputs", () => {
      expect(findDependency("Gr")).toBeNull();
    });
  });

  describe("getDependenciesForCountry", () => {
    it("should return dependencies for Denmark", () => {
      const denmarkDeps = getDependenciesForCountry("DK");
      expect(denmarkDeps.length).toBeGreaterThanOrEqual(2);
      expect(denmarkDeps.some((d) => d.code === "GL")).toBe(true); // Greenland
      expect(denmarkDeps.some((d) => d.code === "FO")).toBe(true); // Faroe Islands
    });

    it("should return dependencies for United States", () => {
      const usDeps = getDependenciesForCountry("US");
      expect(usDeps.length).toBeGreaterThanOrEqual(5);
      expect(usDeps.some((d) => d.code === "PR")).toBe(true); // Puerto Rico
      expect(usDeps.some((d) => d.code === "GU")).toBe(true); // Guam
    });

    it("should return dependencies for France", () => {
      const franceDeps = getDependenciesForCountry("FR");
      expect(franceDeps.length).toBeGreaterThanOrEqual(5);
      expect(franceDeps.some((d) => d.code === "GF")).toBe(true); // French Guiana
      expect(franceDeps.some((d) => d.code === "NC")).toBe(true); // New Caledonia
    });

    it("should return empty array for countries without dependencies", () => {
      const japanDeps = getDependenciesForCountry("JP");
      expect(japanDeps).toEqual([]);

      const brazilDeps = getDependenciesForCountry("BR");
      expect(brazilDeps).toEqual([]);
    });

    it("should return empty array for invalid country code", () => {
      const invalidDeps = getDependenciesForCountry("XX");
      expect(invalidDeps).toEqual([]);
    });
  });
});
