import { describe, it, expect } from "vitest";
import { buildBlockchainReference } from "./blockchainreference";

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
    
        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: q");
      });

      it("Invalid chainId: chainId 0", () => {
        const chainId = 0;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: 0");
      });

      it("Invalid chainId: chainId -1", () => {
        const chainId = -1;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: -1");
      });

      it("Invalid chainId: chainId 1.5", () => {
        const chainId = 1.5;

        expect(() => buildBlockchainReference(chainId)).toThrow("Invalid chain ID: 1.5");
      });

});