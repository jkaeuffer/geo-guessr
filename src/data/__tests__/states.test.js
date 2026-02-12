import { describe, it, expect } from "vitest";
import { findState, states, getStatesByRegion, getStateByCode } from "../states";

describe("States Data", () => {
  it("should have exactly 50 states", () => {
    expect(states.length).toBe(50);
  });

  it("should find state by exact name", () => {
    const result = findState("Texas");
    expect(result).toBeTruthy();
    expect(result.code).toBe("TX");
    expect(result.capital).toBe("Austin");
  });

  it("should find state by code (lowercase)", () => {
    const result = findState("ca");
    expect(result).toBeTruthy();
    expect(result.name).toBe("California");
  });

  it("should find state by code (uppercase)", () => {
    const result = findState("CA");
    expect(result).toBeTruthy();
    expect(result.name).toBe("California");
  });

  it("should support fuzzy matching", () => {
    const result = findState("Texa");
    expect(result).toBeTruthy();
    expect(result.code).toBe("TX");
  });

  it("should support fuzzy matching for multi-word states", () => {
    const result = findState("New Yor");
    expect(result).toBeTruthy();
    expect(result.code).toBe("NY");
  });

  it("should return null for invalid input", () => {
    expect(findState("InvalidState")).toBeNull();
  });

  it("should return null for input too short", () => {
    expect(findState("AB")).toBeNull();
  });

  it("should find state by alias", () => {
    const result = findState("Mass");
    expect(result).toBeTruthy();
    expect(result.name).toBe("Massachusetts");
  });

  it("should return states by region - Northeast", () => {
    const northeast = getStatesByRegion("Northeast");
    expect(northeast.length).toBe(9);
    expect(northeast.some(s => s.name === "New York")).toBe(true);
  });

  it("should return states by region - Southeast", () => {
    const southeast = getStatesByRegion("Southeast");
    expect(southeast.length).toBe(14);
    expect(southeast.some(s => s.name === "Florida")).toBe(true);
  });

  it("should return states by region - Midwest", () => {
    const midwest = getStatesByRegion("Midwest");
    expect(midwest.length).toBe(12);
    expect(midwest.some(s => s.name === "Illinois")).toBe(true);
  });

  it("should return states by region - Southwest", () => {
    const southwest = getStatesByRegion("Southwest");
    expect(southwest.length).toBe(4);
    expect(southwest.some(s => s.name === "Texas")).toBe(true);
  });

  it("should return states by region - West", () => {
    const west = getStatesByRegion("West");
    expect(west.length).toBe(11);
    expect(west.some(s => s.name === "California")).toBe(true);
  });

  it("should get state by code", () => {
    const result = getStateByCode("NY");
    expect(result).toBeTruthy();
    expect(result.name).toBe("New York");
  });

  it("should handle case-insensitive code lookup", () => {
    const result = getStateByCode("ny");
    expect(result).toBeTruthy();
    expect(result.name).toBe("New York");
  });

  it("should return null for invalid code", () => {
    expect(getStateByCode("ZZ")).toBeNull();
  });

  it("should have all required properties for each state", () => {
    states.forEach(state => {
      expect(state).toHaveProperty("name");
      expect(state).toHaveProperty("code");
      expect(state).toHaveProperty("capital");
      expect(state).toHaveProperty("region");
      expect(state).toHaveProperty("aliases");
      expect(Array.isArray(state.aliases)).toBe(true);
    });
  });

  it("should have unique state codes", () => {
    const codes = states.map(s => s.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(states.length);
  });

  it("should have 2-letter codes", () => {
    states.forEach(state => {
      expect(state.code.length).toBe(2);
      expect(state.code).toMatch(/^[A-Z]{2}$/);
    });
  });

  it("should have valid regions", () => {
    const validRegions = ["Northeast", "Southeast", "Midwest", "Southwest", "West"];
    states.forEach(state => {
      expect(validRegions).toContain(state.region);
    });
  });

  it("should handle special states correctly", () => {
    // Alaska
    const alaska = findState("Alaska");
    expect(alaska.code).toBe("AK");
    expect(alaska.region).toBe("West");

    // Hawaii
    const hawaii = findState("Hawaii");
    expect(hawaii.code).toBe("HI");
    expect(hawaii.region).toBe("West");
  });
});
