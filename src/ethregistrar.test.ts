import { describe, it, expect } from "vitest";
import { UNWRAPPED_MAINNET_ETH_REGISTRAR, WRAPPED_MAINNET_ETH_REGISTRAR, buildNFTRefFromENSName } from "./ethregistrar";
import { buildENSName } from "./ensname";
import { MAINNET, SEPOLIA, buildChainId } from "./blockchain";
import { buildNFTRef, buildTokenId } from "./nft";

// TODO: add a lot more unit tests here

describe("buildNFTRefFromENSName", () => {

    it("unrecognized registrar", () => {
        const result = buildNFTRefFromENSName(buildENSName("foo.eth"), SEPOLIA, false);
        expect(result).toBe(null);
    });

    it("non-.eth TLD", () => {
        const result = buildNFTRefFromENSName(buildENSName("foo.com"), MAINNET, false);
        expect(result).toBe(null);
    });

    it("subname of a .eth subname", () => {
        const result = buildNFTRefFromENSName(buildENSName("x.foo.eth"), MAINNET, false);
        expect(result).toBe(null);
    });

    it("non-normalized name", () => {
        const result = buildNFTRefFromENSName(buildENSName("FOO.eth"), MAINNET, false);
        expect(result).toBe(null);
    });

    it("unwrapped direct subname of .eth", () => {
        const token = buildTokenId(29714174079724412745887019504253973571029824035614949642323418802670541573197n);

        const result = buildNFTRefFromENSName(buildENSName("foo.eth"), MAINNET, false);
        expect(result).toStrictEqual(buildNFTRef(UNWRAPPED_MAINNET_ETH_REGISTRAR, token));
    });

    it("wrapped direct subname of .eth", () => {
        const token = buildTokenId(100687382630207452182552124992380359340282681784978135003332851042988456540239n);

        const result = buildNFTRefFromENSName(buildENSName("foo.eth"), MAINNET, true);
        expect(result).toStrictEqual(buildNFTRef(WRAPPED_MAINNET_ETH_REGISTRAR, token));
    });
});