"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractVersionChecker = exports.ContractVersionDelta = exports.DeltaUtil = exports.Delta = exports.ContractVersion = exports.DEFAULT_VERSION_STRING = void 0;
/* eslint-disable unicorn/no-array-callback-reference */
// tslint:disable: max-classes-per-file
exports.DEFAULT_VERSION_STRING = "1.1.0.0";
class ContractVersion {
    constructor(storage, major, minor, patch) {
        this.storage = storage;
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.toString = () => {
            const deltas = [this.storage, this.major, this.minor, this.patch];
            return deltas.join(".");
        };
    }
}
exports.ContractVersion = ContractVersion;
ContractVersion.isValid = (version) => {
    const v = version.split(".");
    if (v.length !== 4) {
        return false;
    }
    const isNonNegativeNumber = (versionComponent) => {
        const number = Number(versionComponent);
        return !Number.isNaN(number) && number >= 0;
    };
    return v.every(isNonNegativeNumber);
};
ContractVersion.fromString = (version) => {
    if (!ContractVersion.isValid(version)) {
        throw new Error(`Invalid version format: ${version}`);
    }
    const v = version.split(".");
    return new ContractVersion(Number(v[0]), Number(v[1]), Number(v[2]), Number(v[3]));
};
/**
 * @param version A 128 byte buffer containing the 32 byte storage, major, minor, and patch
 * version numbers.
 */
ContractVersion.fromGetVersionNumberReturnValue = (version) => {
    if (version.length !== 4 * 32) {
        throw new Error(`Invalid version buffer: ${version.toString("hex")}`);
    }
    const versions = [
        version.toString("hex", 0, 32),
        version.toString("hex", 32, 64),
        version.toString("hex", 64, 96),
        version.toString("hex", 96, 128), // Patch
    ];
    return ContractVersion.fromString(versions.map(x => Number.parseInt(x, 16)).join("."));
};
var Delta;
(function (Delta) {
    Delta["None"] = "=";
    Delta["Increment"] = "+1";
    Delta["Reset"] = "0";
})(Delta = exports.Delta || (exports.Delta = {}));
exports.DeltaUtil = {
    applyToNumber: (delta, n) => {
        if (delta === Delta.None) {
            return n;
        }
        if (delta === Delta.Reset) {
            return 0;
        }
        if (delta === Delta.Increment) {
            return n + 1;
        }
        throw new Error(`Unexpected Delta instance: ${delta}`);
    },
};
class ContractVersionDelta {
    constructor(storage, major, minor, patch) {
        this.storage = storage;
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.appliedTo = (version) => {
            return new ContractVersion(exports.DeltaUtil.applyToNumber(this.storage, version.storage), exports.DeltaUtil.applyToNumber(this.major, version.major), exports.DeltaUtil.applyToNumber(this.minor, version.minor), exports.DeltaUtil.applyToNumber(this.patch, version.patch));
        };
        this.toString = () => {
            const deltas = [this.storage, this.major, this.minor, this.patch];
            return deltas.map(d => d.toString()).join(".");
        };
        this.isVersionIncremented = () => {
            return (this.storage === Delta.Increment ||
                this.major === Delta.Increment ||
                this.minor === Delta.Increment ||
                this.patch === Delta.Increment);
        };
    }
}
exports.ContractVersionDelta = ContractVersionDelta;
ContractVersionDelta.fromChanges = (storageChanged, majorChanged, minorChanged, patchChanged) => {
    const r = Delta.Reset;
    const n = Delta.None;
    if (storageChanged) {
        return new ContractVersionDelta(Delta.Increment, r, r, r);
    }
    if (majorChanged) {
        return new ContractVersionDelta(n, Delta.Increment, r, r);
    }
    if (minorChanged) {
        return new ContractVersionDelta(n, n, Delta.Increment, r);
    }
    if (patchChanged) {
        return new ContractVersionDelta(n, n, n, Delta.Increment);
    }
    return new ContractVersionDelta(n, n, n, n);
};
/**
 * A version checker for a specific contract.
 */
class ContractVersionChecker {
    constructor(oldVersion, newVersion, expectedDelta) {
        this.oldVersion = oldVersion;
        this.newVersion = newVersion;
        this.expectedDelta = expectedDelta;
        this.expectedVersion = () => {
            if (this.oldVersion === null) {
                // Newly added contracts should have version 1.1.0.0
                return ContractVersion.fromString(exports.DEFAULT_VERSION_STRING);
            }
            return this.expectedDelta.appliedTo(this.oldVersion);
        };
        this.matches = () => {
            return this.newVersion.toString() === this.expectedVersion().toString();
        };
    }
}
exports.ContractVersionChecker = ContractVersionChecker;
