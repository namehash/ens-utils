import { describe, it, expect } from "vitest";
import { buildSmartContractReference } from "./smartcontractreference";

describe("buildSmartContractReference() function", () => {

    it("Build SmartContractReference from string values", () => {
        const chainId = "1";
        const contractAddress = "0x1234567890123456789012345678901234567890";

        const result = buildSmartContractReference(chainId, contractAddress);
    
        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
        });
      });

      it("Build SmartContractReference from non-string values", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";

        const result = buildSmartContractReference(chainId, contractAddress);
    
        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
        });
      });

      it("Invalid chainId: non-number", () => {
        const chainId = "q";
        const contractAddress = "0x1234567890123456789012345678901234567890";
    
        expect(() => buildSmartContractReference(chainId, contractAddress)).toThrow("Invalid chain ID: q");
      });

      it("Invalid chainId: chainId 0", () => {
        const chainId = 0;
        const contractAddress = "0x1234567890123456789012345678901234567890";

        expect(() => buildSmartContractReference(chainId, contractAddress)).toThrow("Invalid chain ID: 0");
      });

      it("Invalid chainId: chainId -1", () => {
        const chainId = -1;
        const contractAddress = "0x1234567890123456789012345678901234567890";

        expect(() => buildSmartContractReference(chainId, contractAddress)).toThrow("Invalid chain ID: -1");
      });

      it("Invalid chainId: chainId 1.5", () => {
        const chainId = 1.5;
        const contractAddress = "0x1234567890123456789012345678901234567890";

        expect(() => buildSmartContractReference(chainId, contractAddress)).toThrow("Invalid chain ID: 1.5");
      });

      it("Invalid address", () => {
        const chainId = 1;
        const contractAddress = "x";

        expect(() => buildSmartContractReference(chainId, contractAddress)).toThrow("Invalid address: x");
      });

});