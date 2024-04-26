import { ENSName, ETH_TLD } from "./ensname";
import { NFTRef, TokenId, buildNFTRef, buildTokenId } from "./nft";
import { namehash, labelhash } from 'viem/ens'
import { buildAddress, isAddressEqual } from "./address";
import { ChainId, MAINNET } from "./chain";
import { assert } from "vitest";
import { ContractRef, buildContractRef } from "./contract";

// known registrars
export const WRAPPED_MAINNET_ETH_REGISTRAR =
  buildContractRef(MAINNET, buildAddress("0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401"));
export const UNWRAPPED_MAINNET_ETH_REGISTRAR =
  buildContractRef(MAINNET, buildAddress("0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"));

/**
 * Identifies if the provided name is a direct subname of ".eth".
 * 
 * @param name the name to evaluate.
 * @returns true if and only if the name is a direct subname of ".eth".
 */
export function belongsToEthRegistar(name: ENSName): boolean {
    
    // all direct subnames of ".eth" have exactly 2 labels
    if (name.labels.length !== 2) return false;

    // last label must be "eth"
    return name.labels[1] === ETH_TLD;
}

/**
 * Identifies the registrar smart contract for the provided name, if known.
 * 
 * @param name the name to evaluate.
 * @param chainId the id of the chain the name is managed on.
 * @param isWrapped if the name is wrapped or not.
 * @returns the contract of the registrar for the provided name and chainId or `null` if the registrar is not known.
 */
export function getKnownRegistrar(name: ENSName, chain: ChainId, isWrapped: boolean): ContractRef | null {
    if (!belongsToEthRegistar(name)) return null;

    // TODO: Add confirmed handling for additional chains.
    if (chain.chainId !== MAINNET.chainId) return null;

    return isWrapped ? WRAPPED_MAINNET_ETH_REGISTRAR : UNWRAPPED_MAINNET_ETH_REGISTRAR;
}

export function buildNFTRefFromENSName(name: ENSName, chain: ChainId, isWrapped: boolean): NFTRef | null {
    // TODO: better handle the case of unnormalized or unknown names
    if (name.normalization !== "normalized") return null;

    const registrar = getKnownRegistrar(name, chain, isWrapped);

    if (registrar === null) return null;

    let token : TokenId;

    if (isAddressEqual(registrar.address, WRAPPED_MAINNET_ETH_REGISTRAR.address)) {
      token = buildTokenId(BigInt(namehash(name.name)));
    } else if (isAddressEqual(registrar.address, UNWRAPPED_MAINNET_ETH_REGISTRAR.address)) {
      assert(name.labels.length === 2, `Name: "${name}" is incorrectly associated with the UNWRAPPED_MAINNET_ETH_REGISTRAR registrar`)    
      token = buildTokenId(BigInt(labelhash(name.labels[0])));
    } else {
      return null;
    }

    return buildNFTRef(registrar, token);
}