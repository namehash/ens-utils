import { describe, it, expect } from "vitest";
import { getKnownNFTReference } from "./ethregistrar";
import { buildENSName } from "./ensname";

// TODO: add a lot more unit tests here

describe("getKnownNFTReference", () => {
    it("unsupported chain", () => {
        const result = getKnownNFTReference(buildENSName("foo.eth"), 0, false);
        expect(result).toBe(null);
    });

    it("non-.eth TLD", () => {
        const result = getKnownNFTReference(buildENSName("foo.com"), 1, false);
        expect(result).toBe(null);
    });

    it("subname of a .eth subname", () => {
        const result = getKnownNFTReference(buildENSName("x.foo.eth"), 1, false);
        expect(result).toBe(null);
    });

    it("non-normalized name", () => {
        const result = getKnownNFTReference(buildENSName("FOO.eth"), 1, false);
        expect(result).toBe(null);
    });

    it("unwrapped direct subname of .eth", () => {
        const result = getKnownNFTReference(buildENSName("foo.eth"), 1, false);
        expect(result).toStrictEqual({
            "chainId": 1,
            "contractAddress": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
            "tokenId": 29714174079724412745887019504253973571029824035614949642323418802670541573197n,
        });
    });

    it("wrapped direct subname of .eth", () => {
        const result = getKnownNFTReference(buildENSName("foo.eth"), 1, true);
        expect(result).toStrictEqual({
            "chainId": 1,
            "contractAddress": "0xd4416b13d2b3a9abae7acd5d6c2bbdbe25686401",
            "tokenId": 100687382630207452182552124992380359340282681784978135003332851042988456540239n,
        });
    });
});