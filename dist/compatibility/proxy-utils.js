"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyProxyStorageProof = void 0;
const address_1 = require("@celo/base/lib/address");
const merkle_patricia_tree_1 = require("merkle-patricia-tree");
const rlp_1 = require("rlp");
// from Proxy.sol
// bytes32 private constant OWNER_POSITION = bytes32(
//   uint256(keccak256("eip1967.proxy.admin")) - 1
// );
const OWNER_POSITION = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";
// bytes32 private constant IMPLEMENTATION_POSITION = bytes32(
//   uint256(keccak256("eip1967.proxy.implementation")) - 1
// );
const IMPLEMENTATION_POSITION = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
async function verifyProxyStorageProof(web3, proxy, owner) {
    const proof = await web3.eth.getProof(web3.utils.toChecksumAddress(proxy), [OWNER_POSITION, IMPLEMENTATION_POSITION], "latest");
    const trie = new merkle_patricia_tree_1.SecureTrie();
    await trie.put((0, address_1.hexToBuffer)(OWNER_POSITION), (0, rlp_1.encode)(owner));
    // @ts-ignore
    return proof.storageHash === (0, address_1.bufferToHex)(trie.root);
}
exports.verifyProxyStorageProof = verifyProxyStorageProof;
