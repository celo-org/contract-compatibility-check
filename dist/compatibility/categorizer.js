"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCategorizer = exports.categorize = exports.ChangeType = void 0;
/**
 * Change type categories according to semantic versioning standards
 */
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["Patch"] = 0] = "Patch";
    ChangeType[ChangeType["Minor"] = 1] = "Minor";
    ChangeType[ChangeType["Major"] = 2] = "Major";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
/**
 * @returns a mapping of {ChangeType => Change[]} according to the {@link categorizer} used
 */
function categorize(changes, categorizer) {
    const byCategory = [];
    for (const ct of Object.values(ChangeType)) {
        byCategory[ct] = [];
    }
    changes.map(c => byCategory[c.accept(categorizer)].push(c));
    return byCategory;
}
exports.categorize = categorize;
/**
 * Default implementation of {@link Categorizer}, where:
 *  Major:
 *    New contract, Mutability, Params, Return Params, Method Removed, Contract type changes
 *  Minor:
 *    Method Added
 *  Patch:
 *    Visibility, Bytecode (implementation) changes
 */
class DefaultCategorizer {
    constructor() {
        this.onNewContract = (_change) => ChangeType.Major;
        this.onMethodMutability = (_change) => ChangeType.Major;
        this.onMethodReturn = (_change) => ChangeType.Major;
        this.onMethodRemoved = (_change) => ChangeType.Major;
        this.onContractKind = (_change) => ChangeType.Major;
        this.onMethodAdded = (_change) => ChangeType.Minor;
        // Changing between public and external visibility has no impact.
        this.onMethodVisibility = (_change) => ChangeType.Patch;
        this.onDeployedBytecode = (_change) => ChangeType.Patch;
        this.onLibraryLinking = (_change) => ChangeType.Patch;
    }
}
exports.DefaultCategorizer = DefaultCategorizer;
