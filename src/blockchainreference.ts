// TODO: add validations for other special `number` values.
// TODO: add utility function that tries to get a display name of a BlockchainReference

export interface BlockchainReference {

    /**
     * Chain ID. See https://chainid.network/
     * Always a positive integer.
     */
    chainId: number;
};

/**
 * Builds a BlockchainReference object.
 * @param chainId the chain ID to reference. See https://chainid.network/
 * @returns a BlockchainReference object.
 */
export const buildBlockchainReference = (
    chainId: number | string,
): BlockchainReference => {


    let chain : number;

    if (typeof chainId === "string") {

        chain = Number(chainId);
    } else {
        chain = chainId
    }

    if (Number.isNaN(chain)) {
        throw new Error(`Invalid chain ID: ${chainId}`);
    }

    if (chain % 1 !== 0) {
        throw new Error(`Invalid chain ID: ${chainId}`);
    }

    if (chain <= 0) {
        throw new Error(`Invalid chain ID: ${chainId}`);
    }

    return {
        chainId: chain,
    };
}