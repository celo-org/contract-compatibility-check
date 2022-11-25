"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportLayoutIncompatibilities = exports.generateCompatibilityReport = exports.getLayout = void 0;
const upgrades_1 = require("@openzeppelin/upgrades");
const Web3 = require("web3");
const web3 = new Web3(null);
// getStorageLayout needs an oz-sdk Contract class instance. This class is a
// subclass of Contract from web3-eth-contract, with an added .schema member and
// several methods.
//
// Couldn't find an easy way of getting one just from contract artifacts. But
// for getStorageLayout we really only need .schema.ast and .schema.contractName.
const addSchemaForLayoutChecking = (web3Contract, artifact) => {
    // @ts-ignore
    const contract = web3Contract;
    // @ts-ignore
    contract.schema = {};
    contract.schema.ast = artifact.ast;
    contract.schema.contractName = artifact.contractName;
    return contract;
};
const makeZContract = (artifact) => {
    const contract = new web3.eth.Contract(artifact.abi);
    return addSchemaForLayoutChecking(contract, artifact);
};
const getLayout = (artifact, artifacts) => {
    const contract = makeZContract(artifact);
    return (0, upgrades_1.getStorageLayout)(contract, artifacts);
};
exports.getLayout = getLayout;
const selectIncompatibleOperations = (diff) => diff.filter(operation => operation.action !== "append" &&
    !(operation.action === "rename" && (`deprecated_${operation.original.label}` === operation.updated.label && operation.original.type === operation.updated.type)));
const operationToDescription = (operation) => {
    let message;
    const updated = operation.updated;
    const original = operation.original;
    switch (operation.action) {
        case "typechange":
            message = `variable ${updated.label} had type ${original.type}, now has type ${updated.type}`;
            break;
        case "insert":
            message = `variable ${updated.label} was inserted`;
            break;
        case "pop":
            message = `variable ${original.label} was removed`;
            break;
        case "delete":
            message = `variable ${original.label} was removed`;
            break;
        case "rename":
            message = `variable ${updated.label} was renamed from ${original.label}`;
            break;
        case "replace":
            message = `variable ${updated.label} was replaced from ${original.label}`;
            break;
        case "append":
            message = `variable ${updated.label} was appended`;
        default:
            message = `unknown operation ${operation.action}`;
    }
    return message;
};
const generateLayoutCompatibilityReport = (oldLayout, newLayout) => {
    const diff = (0, upgrades_1.compareStorageLayouts)(oldLayout, newLayout);
    const incompatibilities = selectIncompatibleOperations(diff);
    if (incompatibilities.length === 0) {
        return {
            compatible: true,
            errors: [],
        };
    }
    return {
        compatible: false,
        errors: incompatibilities.map(operationToDescription),
    };
};
const compareStructDefinitions = (oldType, newType, structExpandable) => {
    var _a;
    if (oldType.kind !== "struct") {
        return {
            same: false,
            errors: [`${newType.label} wasn't a struct type, now is`],
        };
    }
    if (structExpandable && oldType.members.length < newType.members.length) {
        // eslint-disable-next-line array-callback-return
        const expandableErrors = oldType.members.map((oldMember, i) => {
            const newMember = newType.members[i];
            if (oldMember.label !== newMember.label && `deprecated_${oldMember.label}` !== newMember.label) {
                return `struct ${newType.label} had ${oldMember.label} in slot ${i}, now has ${newMember.label}`;
            }
            if (oldMember.type !== newMember.type) {
                return `struct ${newType.label}'s member ${newMember.label} changed type from ${oldMember.type} to ${newMember.type}`;
            }
        }).filter(error => error);
        if (expandableErrors.length === 0) {
            return {
                same: true,
                expanded: true,
                errors: [],
            };
        }
    }
    if (oldType.members.length !== newType.members.length) {
        return {
            same: false,
            errors: [`struct ${newType.label} has changed members`],
        };
    }
    const memberErrors = (_a = newType.members) === null || _a === void 0 ? void 0 : _a.map((newMember, i) => {
        const oldMember = oldType.members[i];
        if (oldMember.label !== newMember.label && `deprecated_${oldMember.label}` !== newMember.label) {
            return `struct ${newType.label} had ${oldMember.label} in slot ${i}, now has ${newMember.label}`;
        }
        if (oldMember.type !== newMember.type) {
            return `struct ${newType.label}'s member ${newMember.label} changed type from ${oldMember.type} to ${newMember.type}`;
        }
        return "";
    }).filter(error => error !== "");
    return {
        same: memberErrors.length === 0,
        errors: memberErrors,
    };
};
// Struct is expandable only if used in mappings or arrays
const isStructExpandable = (oldType, oldLayout) => {
    const structString = `t_struct<${oldType.label}>`;
    return !oldLayout.storage.some(storage => storage.type === structString);
};
const generateStructsCompatibilityReport = (oldLayout, newLayout) => {
    let compatible = true;
    let errors = [];
    let expanded = false;
    for (const typeName of Object.keys(newLayout.types)) {
        const newType = newLayout.types[typeName];
        const oldType = oldLayout.types[typeName];
        if (newType.kind === "struct" && oldType !== undefined) {
            const structExpandable = isStructExpandable(oldType, oldLayout);
            const structReport = compareStructDefinitions(oldType, newType, structExpandable);
            if (!structReport.same) {
                compatible = false;
                // eslint-disable-next-line unicorn/prefer-spread
                errors = errors.concat(structReport.errors);
            }
            expanded = structReport.expanded;
        }
    }
    return {
        compatible,
        errors,
        expanded,
    };
};
const generateCompatibilityReport = (oldArtifact, oldArtifacts, newArtifact, newArtifacts) => {
    const oldLayout = (0, exports.getLayout)(oldArtifact, oldArtifacts);
    const newLayout = (0, exports.getLayout)(newArtifact, newArtifacts);
    const layoutReport = generateLayoutCompatibilityReport(oldLayout, newLayout);
    const structsReport = generateStructsCompatibilityReport(oldLayout, newLayout);
    return {
        contract: newArtifact.contractName,
        compatible: layoutReport.compatible && structsReport.compatible,
        errors: layoutReport.errors.concat(structsReport.errors),
        expanded: structsReport.expanded,
    };
};
exports.generateCompatibilityReport = generateCompatibilityReport;
const reportLayoutIncompatibilities = (oldArtifacts, newArtifacts) => {
    return newArtifacts.listArtifacts().map(newArtifact => {
        const oldArtifact = oldArtifacts.getArtifactByName(newArtifact.contractName);
        return oldArtifact !== undefined ? (0, exports.generateCompatibilityReport)(oldArtifact, oldArtifacts, newArtifact, newArtifacts) : {
            contract: newArtifact.contractName,
            compatible: true,
            errors: [],
        };
    });
};
exports.reportLayoutIncompatibilities = reportLayoutIncompatibilities;
