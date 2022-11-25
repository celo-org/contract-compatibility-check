"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportASTIncompatibilities = exports.ASTCodeCompatibilityReport = exports.Mutability = exports.Visibility = void 0;
const tslib_1 = require("tslib");
const change_1 = require("./change");
const internal_1 = require("./internal");
const ContractAST_1 = tslib_1.__importDefault(require("@openzeppelin/upgrades/lib/utils/ContractAST"));
const bytecode_1 = require("./bytecode");
var Visibility;
(function (Visibility) {
    Visibility["NONE"] = "";
    Visibility["EXTERNAL"] = "external";
    Visibility["PUBLIC"] = "public";
    Visibility["INTERNAL"] = "internal";
    Visibility["PRIVATE"] = "private";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
var Mutability;
(function (Mutability) {
    Mutability["NONE"] = "";
    Mutability["PURE"] = "pure";
    Mutability["VIEW"] = "view";
    Mutability["PAYABLE"] = "payable";
})(Mutability = exports.Mutability || (exports.Mutability = {}));
var StorageLocation;
(function (StorageLocation) {
    StorageLocation["NONE"] = "";
    // Default gets replaced to None when comparing parameter storage locations
    StorageLocation["DEFAULT"] = "default";
    StorageLocation["STORAGE"] = "storage";
    StorageLocation["MEMORY"] = "memory";
    StorageLocation["CALLDATA"] = "calldata";
})(StorageLocation || (StorageLocation = {}));
const CONTRACT_KIND_CONTRACT = "contract";
const OUT_VOID_PARAMETER_STRING = "void";
/**
 * A compatibility report with all the detected changes from two compiled
 * contract folders.
 */
class ASTCodeCompatibilityReport {
    constructor(changes) {
        this.changes = changes;
        this.getChanges = () => {
            return this.changes;
        };
    }
    push(...changes) {
        this.changes.push(...changes);
    }
    include(other) {
        this.push(...other.changes);
    }
}
exports.ASTCodeCompatibilityReport = ASTCodeCompatibilityReport;
// Implementation
function getSignature(method) {
    // This is used as the ID of a method
    return method.selector;
}
/**
 * @returns A method index where {key: signature => value: method}
 */
function createMethodIndex(methods) {
    const asPairs = methods.map(m => ({ [`${getSignature(m)}`]: m }));
    return Object.assign({}, ...asPairs);
}
function mergeReports(reports) {
    const report = new ASTCodeCompatibilityReport([]);
    reports.forEach((r) => {
        report.include(r);
    });
    return report;
}
function parametersSignature(parameters) {
    if (parameters.length === 0) {
        return OUT_VOID_PARAMETER_STRING;
    }
    const singleSignature = (p) => {
        const storage = p.storageLocation === StorageLocation.DEFAULT ? StorageLocation.NONE : `${p.storageLocation} `;
        return `${storage}${p.typeDescriptions.typeString}`;
    };
    return parameters.map(singleSignature).join(", ");
}
function checkMethodCompatibility(contract, m1, m2) {
    const report = new ASTCodeCompatibilityReport([]);
    const signature = getSignature(m1);
    // Sanity check
    const signature2 = getSignature(m2);
    if (signature !== signature2) {
        throw new Error(`Signatures should be equal: ${signature} !== ${signature2}`);
    }
    // Visibility changes
    if (m1.visibility !== m2.visibility) {
        report.push(new change_1.MethodVisibilityChange(contract, signature, m1.visibility, m2.visibility));
    }
    // Return parameter changes
    const ret1 = parametersSignature(m1.returnParameters.parameters);
    const ret2 = parametersSignature(m2.returnParameters.parameters);
    if (ret1 !== ret2) {
        report.push(new change_1.MethodReturnChange(contract, signature, ret1, ret2));
    }
    // State mutability changes
    const state1 = m1.stateMutability;
    const state2 = m2.stateMutability;
    if (state1 !== state2) {
        report.push(new change_1.MethodMutabilityChange(contract, signature, state1, state2));
    }
    return report;
}
const getCheckableMethodsFromAST = (contract, id) => {
    const checkableMethods = (method) => method.visibility === Visibility.EXTERNAL || method.visibility === Visibility.PUBLIC;
    try {
        return contract.getMethods().filter(checkableMethods);
    }
    catch (error) {
        throw {
            message: `Error in the @openzeppelin/.../ContractAST.getMethods() for the artifacts in the '${id}' folder. 
    Most likely this is due to a botched build, or a build on a non-cleaned folder.`,
            error,
        };
    }
};
function doASTCompatibilityReport(contractName, oldAST, newAST) {
    const oldMethods = createMethodIndex(getCheckableMethodsFromAST(oldAST, "old"));
    const newMethods = createMethodIndex(getCheckableMethodsFromAST(newAST, "new"));
    const report = new ASTCodeCompatibilityReport([]);
    // Check for modified or missing methods in the new version
    Object.keys(oldMethods).forEach((signature) => {
        const method = oldMethods[signature];
        if (!newMethods.hasOwnProperty(signature)) {
            // Method deleted, major change
            report.push(new change_1.MethodRemovedChange(contractName, signature));
            // Continue
            return;
        }
        const newMethod = newMethods[signature];
        report.include(checkMethodCompatibility(contractName, method, newMethod));
    });
    // Check for added methods in the new version
    Object.keys(newMethods).forEach((signature) => {
        if (!oldMethods.hasOwnProperty(signature)) {
            // New method, minor change
            report.push(new change_1.MethodAddedChange(contractName, signature));
        }
    });
    return report;
}
function generateASTCompatibilityReport(oldContract, oldArtifacts, newContract, newArtifacts) {
    // Sanity checks
    if (newContract === null) {
        throw new Error("newContract cannot be null");
    }
    if (oldArtifacts === null) {
        throw new Error("oldArtifacts cannot be null");
    }
    if (newArtifacts === null) {
        throw new Error("newArtifacts cannot be null");
    }
    const contractName = newContract.schema.contractName;
    // Need to manually use ContractAST since its internal use in ZContract
    // does not pass the artifacts parameter to the constructor, therefore
    // forcing a reloading of BuildArtifacts.
    const newAST = new ContractAST_1.default(newContract, newArtifacts);
    const newKind = newAST.getContractNode().contractKind;
    if (oldContract === null) {
        if (newKind === CONTRACT_KIND_CONTRACT) {
            return new ASTCodeCompatibilityReport([new change_1.NewContractChange(contractName)]);
        }
        // New contract added of a non-contract kind (library/interface)
        // therefore no functionality added
        return new ASTCodeCompatibilityReport([]);
    }
    // Name sanity check
    if (oldContract.schema.contractName !== contractName) {
        throw new Error(`Contract names should be equal: ${oldContract.schema.contractName} !== ${contractName}`);
    }
    const oldAST = new ContractAST_1.default(oldContract, oldArtifacts);
    const oldKind = oldAST.getContractNode().contractKind;
    if (oldKind !== newKind) {
        // different contract kind (library/interface/contract)
        return new ASTCodeCompatibilityReport([new change_1.ContractKindChange(contractName, oldKind, newKind)]);
    }
    const report = doASTCompatibilityReport(contractName, oldAST, newAST);
    // Check deployed byte code change
    const old = (0, bytecode_1.stripMetadata)(oldContract.schema.deployedBytecode);
    const neww = (0, bytecode_1.stripMetadata)(newContract.schema.deployedBytecode);
    if (old !== neww) {
        report.push(new change_1.DeployedBytecodeChange(contractName));
    }
    return report;
}
/**
 * Runs an ast code comparison and returns the spotted changes from the built artifacts given.
 *
 * @param oldArtifacts
 * @param newArtifacts
 */
function reportASTIncompatibilities(oldArtifacts, newArtifacts) {
    const reports = newArtifacts.listArtifacts()
        .map(newArtifact => {
        const oldArtifact = oldArtifacts.getArtifactByName(newArtifact.contractName);
        const oldZContract = oldArtifact ? (0, internal_1.makeZContract)(oldArtifact) : null;
        return generateASTCompatibilityReport(oldZContract, oldArtifacts, (0, internal_1.makeZContract)(newArtifact), newArtifacts);
    });
    return mergeReports(reports);
}
exports.reportASTIncompatibilities = reportASTIncompatibilities;
