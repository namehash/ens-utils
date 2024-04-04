import { describe, it, expect } from "vitest";

import {
    buildNFTReference,
    fromNFTReferenceToString,
    fromStringToNFTReference,
} from "./nft";

describe("buildNFTReference() function", () => {

    it("Build from string values", () => {
        const chainId = "1";
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = "1234567890123456789012345678901234567890";

        const result = buildNFTReference(chainId, contractAddress, tokenId);
    
        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
            tokenId: 1234567890123456789012345678901234567890n,
        });
      });

      it("Build from non-string values", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = 1234567890123456789012345678901234567890n;

        const result = buildNFTReference(chainId, contractAddress, tokenId);
    
        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
            tokenId: 1234567890123456789012345678901234567890n,
        });
      });

      it("Non-integer tokenId", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = "x";

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid token ID: x. All token ID values must be integers.");
      });

      it("Negative tokenId", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = -1n;

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid token ID: -1. Must be non-negative.");
      });

      it("Max allowed tokenId value", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = (2n ** 256n) - 1n;

        const result = buildNFTReference(chainId, contractAddress, tokenId);
    
        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
            tokenId: 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        });
      });

      it("tokenId value overflow", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = 2n ** 256n;
    
        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid token ID: 115792089237316195423570985008687907853269984665640564039457584007913129639936. Must be representable as a uint256 value.");
      });

});

describe("fromNFTReferenceToString() function", () => {

    it("fromNFTReferenceToString", () => {
        const chainId = "1";
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = "1234567890123456789012345678901234567890";

        const nft = buildNFTReference(chainId, contractAddress, tokenId);
        const result = fromNFTReferenceToString(nft);
    
        expect(result).toEqual("1:0x1234567890123456789012345678901234567890:1234567890123456789012345678901234567890");
      });

});

describe("fromStringToNFTReference() function", () => {

    it("too few params", () => {
        expect(() => fromStringToNFTReference(":")).toThrow("Cannot convert: \":\" to NFTReference");
      });

    it("too many params", () => {
        expect(() => fromStringToNFTReference(":::")).toThrow("Cannot convert: \":::\" to NFTReference");
        });

    it("valid params", () => {
        const result = fromStringToNFTReference("1:0x1234567890123456789012345678901234567890:1234567890123456789012345678901234567890");

        expect(result).toStrictEqual({
            chainId: 1,
            contractAddress: "0x1234567890123456789012345678901234567890",
            tokenId: 1234567890123456789012345678901234567890n,
        });
    });

});