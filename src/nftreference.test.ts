import { describe, it, expect } from "vitest";

import {
    buildNFTReference,
    fromNFTReferenceToString,
    fromStringToNFTReference,
} from "./nftreference";

describe("buildNFTReference() function", () => {

    it("Build NFTReference from string values", () => {
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

      it("Build NFTReference from non-string values", () => {
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

      it("Invalid chainId: non-number", () => {
        const chainId = "q";
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = 1234567890123456789012345678901234567890n;
    
        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid chain ID: q in buildNFTReference");
      });

      it("Invalid chainId: chainId 0", () => {
        const chainId = 0;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = 1234567890123456789012345678901234567890n;

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid chain ID: 0 in buildNFTReference");
      });

      it("Invalid chainId: chainId -1", () => {
        const chainId = -1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = 1234567890123456789012345678901234567890n;

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid chain ID: -1 in buildNFTReference");
      });

      it("Invalid chainId: chainId 1.5", () => {
        const chainId = 1.5;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = 1234567890123456789012345678901234567890n;

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid chain ID: 1.5 in buildNFTReference");
      });

      it("Invalid address", () => {
        const chainId = 1;
        const contractAddress = "x";
        const tokenId = 1234567890123456789012345678901234567890n;

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid address: x in buildNFTReference");
      });

      it("Invalid tokenId", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = "x";

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid token ID: x in buildNFTReference");
      });

      it("Negative tokenId", () => {
        const chainId = 1;
        const contractAddress = "0x1234567890123456789012345678901234567890";
        const tokenId = -1n;

        expect(() => buildNFTReference(chainId, contractAddress, tokenId)).toThrow("Invalid token ID: -1 in buildNFTReference");
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