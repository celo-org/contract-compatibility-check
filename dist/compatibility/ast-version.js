"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTContractVersionsChecker = exports.getContractVersion = exports.ASTContractVersions = void 0;
const version_1 = require("./version");
const report_1 = require("./report");
const common_1 = require("@ethereumjs/common");
const statemanager_1 = require("@ethereumjs/statemanager");
const blockchain_1 = require("@ethereumjs/blockchain");
const vm_1 = require("@ethereumjs/vm");
const evm_1 = require("@ethereumjs/evm");
const util_1 = require("@ethereumjs/util");
const abi = require("ethereumjs-abi");
/**
 * A mapping {contract name => {@link ContractVersion}}.
 */
class ASTContractVersions {
    constructor(contracts) {
        this.contracts = contracts;
    }
}
exports.ASTContractVersions = ASTContractVersions;
_a = ASTContractVersions;
ASTContractVersions.fromArtifacts = async (artifacts) => {
    const contracts = {};
    await Promise.all(artifacts.listArtifacts().filter(c => !(0, report_1.isLibrary)(c.contractName, artifacts)).map(async (artifact) => {
        contracts[artifact.contractName] = await getContractVersion(artifact);
    }));
    return new ASTContractVersions(contracts);
};
/**
 * Gets the version of a contract by calling Contract.getVersionNumber() on
 * the contract deployed bytecode.
 *
 * If the contract version cannot be retrieved, returns version 1.1.0.0 by default.
 */
async function getContractVersion(artifact) {
    const common = new common_1.Common({ chain: common_1.Chain.Mainnet, hardfork: common_1.Hardfork.London });
    const stateManager = new statemanager_1.DefaultStateManager();
    const blockchain = await blockchain_1.Blockchain.create();
    const eei = new vm_1.EEI(stateManager, common, blockchain);
    const evm = new evm_1.EVM({
        common,
        eei,
    });
    const bytecode = artifact.deployedBytecode;
    const data = "0x" + abi.methodID("getVersionNumber", []).toString("hex");
    const nullAddress = "0000000000000000000000000000000000000000";
    // Artificially link all libraries to the null address.
    const linkedBytecode = bytecode.split(/_+[\dA-Za-z]+_+/).join(nullAddress);
    const result = await evm.runCall({
        to: util_1.Address.zero(),
        caller: util_1.Address.zero(),
        code: Buffer.from(linkedBytecode.slice(2), "hex"),
        isStatic: true,
        data: Buffer.from(data.slice(2), "hex"),
    });
    if (result.execResult.exceptionError === undefined) {
        const value = result.execResult.returnValue;
        if (value.length === 4 * 32) {
            return version_1.ContractVersion.fromGetVersionNumberReturnValue(value);
        }
    }
    // If we can't fetch the version number, assume default version.
    return version_1.ContractVersion.fromString(version_1.DEFAULT_VERSION_STRING);
}
exports.getContractVersion = getContractVersion;
class ASTContractVersionsChecker {
    constructor(contracts) {
        this.contracts = contracts;
        /**
         * @return a new {@link ASTContractVersionsChecker} with the same contracts
         * excluding all those whose names match the {@param exclude} parameters.
         */
        this.excluding = (exclude) => {
            const included = (contract) => {
                // eslint-disable-next-line no-eq-null, eqeqeq
                if (exclude != null) {
                    return !exclude.test(contract);
                }
                return true;
            };
            const contracts = {};
            Object.keys(this.contracts).filter(included).map((contract) => {
                contracts[contract] = this.contracts[contract];
            });
            return new ASTContractVersionsChecker(contracts);
        };
        this.mismatches = () => {
            const mismatches = {};
            // eslint-disable-next-line array-callback-return
            Object.keys(this.contracts).map((contract) => {
                if (!this.contracts[contract].matches()) {
                    mismatches[contract] = this.contracts[contract];
                }
            });
            return new ASTContractVersionsChecker(mismatches);
        };
        this.isEmpty = () => {
            return Object.keys(this.contracts).length === 0;
        };
    }
}
exports.ASTContractVersionsChecker = ASTContractVersionsChecker;
_b = ASTContractVersionsChecker;
ASTContractVersionsChecker.create = async (oldArtifacts, newArtifacts, expectedVersionDeltas) => {
    const oldVersions = await ASTContractVersions.fromArtifacts(oldArtifacts);
    const newVersions = await ASTContractVersions.fromArtifacts(newArtifacts);
    const contracts = {};
    Object.keys(newVersions.contracts).map((contract) => {
        const versionDelta = expectedVersionDeltas[contract] === undefined ? version_1.ContractVersionDelta.fromChanges(false, false, false, false) : expectedVersionDeltas[contract];
        const oldVersion = oldVersions.contracts[contract] === undefined ? null : oldVersions.contracts[contract];
        contracts[contract] = new version_1.ContractVersionChecker(oldVersion, newVersions.contracts[contract], versionDelta);
    });
    return new ASTContractVersionsChecker(contracts);
};
