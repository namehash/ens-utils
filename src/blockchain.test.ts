import { describe, it, expect } from "vitest";
import { buildBlockchainReference, getBlockchainByName, getBlockchainMetadata } from "./blockchain";

describe("buildBlockchainReference() function", () => {

    it("Build from string values", () => {
        const chainId = "1";

        const result = buildBlockchainReference(chainId);
    
        expect(result).toStrictEqual({
            chainId: 1,
        });
      });

      it("Build from non-string values", () => {
        const chainId = 1;

        const result = buildBlockchainReference(chainId);
    
        expect(result).toStrictEqual({
            chainId: 1,
        });
      });

      it("Invalid chainId: non-number", () => {
        const chainId = "q";
    
        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: q. All chain IDs must be numbers.");
      });

      it("Invalid chainId: chainId non-positive", () => {
        const chainId = 0;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: 0. All chain IDs must be positive integers.");
      });

      it("Invalid chainId: chainId negative", () => {
        const chainId = -1;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: -1. All chain IDs must be positive integers.");
      });

      it("Invalid chainId: chainId non-integer", () => {
        const chainId = 1.5;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: 1.5. All chain IDs must be integers.");
      });

      it("Invalid chainId: chainId NaN", () => {
        const chainId = NaN;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: NaN. All chain IDs must be numbers.");
      });

      it("Invalid chainId: chainId Infinity", () => {
        const chainId = Infinity;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: Infinity. All chain IDs must be finite numbers.");
      });

});

describe("getBlockchainByName() function", () => {

  it("known chain", () => {
      const name = "mainnet";

      const result = getBlockchainByName(name);
  
      expect(result).toStrictEqual({
          chainId: 1,
      });
    });

    it("case-insensitive unknown chain", () => {
      const name = "Mainnet";

      const result = getBlockchainByName(name);
  
      expect(result).toBeNull();
    });

    it("general unknown chain", () => {
      const name = "unknown";

      const result = getBlockchainByName(name);
  
      expect(result).toBeNull();
    });
});

describe("getBlockchainMetadata() function", () => {

  it("known chain", () => {
      const ref = buildBlockchainReference(1);
      const result = getBlockchainMetadata(ref);
  
      expect(result).toBeDefined();
    });

    it("unknown chain", () => {
      const ref = buildBlockchainReference(1234567890);
      const result = getBlockchainMetadata(ref);
  
      expect(result).toBeNull();
    });
});