import { bufferToHex, hexToBuffer } from "@celo/base/lib/address"
import { SecureTrie } from "merkle-patricia-tree"
import { encode as rlpEncode } from "rlp"
import Web3 from "web3"

// from Proxy.sol

// bytes32 private constant OWNER_POSITION = bytes32(
//   uint256(keccak256("eip1967.proxy.admin")) - 1
// );
const OWNER_POSITION = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"

// bytes32 private constant IMPLEMENTATION_POSITION = bytes32(
//   uint256(keccak256("eip1967.proxy.implementation")) - 1
// );
const IMPLEMENTATION_POSITION = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

export async function verifyProxyStorageProof(web3: Web3, proxy: string, owner: string) {
  const proof = await web3.eth.getProof(
    web3.utils.toChecksumAddress(proxy),
    [OWNER_POSITION, IMPLEMENTATION_POSITION],
    "latest",
  )

  const trie = new SecureTrie()
  await trie.put(hexToBuffer(OWNER_POSITION), rlpEncode(owner))

  // @ts-ignore
  return proof.storageHash === bufferToHex(trie.root)
}