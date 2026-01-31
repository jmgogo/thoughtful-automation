import { describe, test, expect } from "bun:test";
import { sort, checkIfBulky, checkIfHeavy } from "./sort.js";

describe("Package Sorting System", () => {
  describe("STANDARD packages", () => {
    test("should return STANDARD for package just below all thresholds", () => {
      // Volume < 1,000,000
      // All dimensions < 150 cm
      // Mass < 20 kg
      expect(sort(99.99, 99.99, 99.99, 19.99)).toBe("STANDARD");
    });
  });

  describe("SPECIAL packages - Bulky only", () => {
    test("should return SPECIAL when volume equals or exceeds threshold", () => {
      // Volume: 100 * 100 * 100 = 1,000,000 cm³
      expect(sort(100, 100, 100, 10)).toBe("SPECIAL");
      expect(sort(105, 105, 105, 10)).toBe("SPECIAL");
    });

    test("should return SPECIAL when input equals dimension threshold", () => {
      expect(sort(150, 1, 1, 1)).toBe("SPECIAL");
      expect(sort(1, 150, 1, 1)).toBe("SPECIAL");
      expect(sort(1, 1, 150, 1)).toBe("SPECIAL");
    });

    test("should return SPECIAL when input exceeds dimension threshold", () => {
      expect(sort(155, 1, 1, 1)).toBe("SPECIAL");
      expect(sort(1, 155, 1, 1)).toBe("SPECIAL");
      expect(sort(1, 1, 155, 1)).toBe("SPECIAL");
    });
  });

  describe("SPECIAL packages - Heavy only", () => {
    test("should return SPECIAL when mass equals or exceeds threshold", () => {
      expect(sort(10, 10, 10, 20)).toBe("SPECIAL");
      //   expect(sort(10, 10, 10, 25)).toBe("SPECIAL");
    });
    test("should return SPECIAL when mass equals or exceeds threshold", () => {
      //   expect(sort(10, 10, 10, 20)).toBe("SPECIAL");
      expect(sort(10, 10, 10, 25)).toBe("SPECIAL");
    });
  });

  describe("REJECTED packages", () => {
    test("should return REJECTED when both bulky (volume) and heavy", () => {
      // Volume: 100 * 100 * 100 = 1,000,000 cm³
      expect(sort(100, 100, 100, 20)).toBe("REJECTED");
    });

    test("should return REJECTED when bulky (dimension) and heavy", () => {
      expect(sort(150, 10, 10, 20)).toBe("REJECTED");
    });
  });

  describe("Edge cases and boundaries", () => {
    test("should handle decimal dimensions correctly", () => {
      expect(sort(149.9, 10, 10, 5)).toBe("STANDARD");
      expect(sort(150.1, 10, 10, 5)).toBe("SPECIAL");
    });

    test("should handle decimal mass correctly", () => {
      expect(sort(10, 10, 10, 19.99)).toBe("STANDARD");
      expect(sort(10, 10, 10, 20.01)).toBe("SPECIAL");
    });

    test("should handle packages with 1 dimension at threshold", () => {});
  });

  describe("Input validation", () => {
    test("should throw error for negative dimensions", () => {
      expect(() => sort(-1, 1, 1, 1)).toThrow();
      expect(() => sort(1, -1, 1, 1)).toThrow();
      expect(() => sort(1, 1, -1, 1)).toThrow();
      expect(() => sort(1, 1, 1, -1)).toThrow();
    });

    test("should throw error for zero input", () => {
      expect(() => sort(0, 1, 1, 1)).toThrow();
      expect(() => sort(1, 0, 1, 1)).toThrow();
      expect(() => sort(1, 1, 0, 1)).toThrow();
      expect(() => sort(1, 1, 1, 0)).toThrow();
    });

    test("should throw error for negative mass", () => {
      expect(() => sort(1, 1, 1, -0.1)).toThrow();
    });

    test("should throw error for invalid inputs", () => {
      expect(() => sort(Infinity, 10, 10, 5)).toThrow();
      expect(() => sort(NaN, 10, 10, 5)).toThrow();
      expect(() => sort(null, 10, 10, 5)).toThrow();
      expect(() => sort(undefined, 10, 10, 5)).toThrow();
      expect(() => sort({}, 10, 10, 5)).toThrow();
      expect(() => sort([], 10, 10, 5)).toThrow();
    });
  });

  describe("Helper functions", () => {
    describe("checkIfBulky", () => {
      test("should return true when volume equals threshold", () => {
        expect(checkIfBulky(100, 100, 100)).toBe(true);
      });

      test("should return true when any dimension equals threshold", () => {
        expect(checkIfBulky(150, 1, 1)).toBe(true);
        expect(checkIfBulky(1, 150, 1)).toBe(true);
        expect(checkIfBulky(1, 1, 150)).toBe(true);
      });

      test("should return false when all criteria are below threshold", () => {
        expect(checkIfBulky(99.99, 99.99, 99.99)).toBe(false);
      });
    });

    describe("checkIfHeavy", () => {
      test("should return true when mass equals threshold", () => {
        expect(checkIfHeavy(20)).toBe(true);
      });

      test("should return false when mass is below threshold", () => {
        expect(checkIfHeavy(19.9)).toBe(false);
      });
    });
  });
});
