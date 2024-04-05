import { describe, it, expect } from "vitest";
import { buildSmartContractReference } from "./contract";

describe("buildSmartContractReference() function", () => {

    it("Build from string values", () => {
        const chainId = "1";
        const contractAddress = "0x1234567890123456789012345678901234567890";

        const result = buildSmartContractReference(chainId, contractAddress);
    
        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
        });
      });

      it("Build from non-string values", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";

        const result = buildSmartContractReference(chainId, contractAddress);
    
        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
        });
      });

      it("Invalid address", () => {
        const chainId = 1;
        const contractAddress = "x";

        expect(() => buildSmartContractReference(chainId, contractAddress)).toThrow("Invalid address: x");
      });

});