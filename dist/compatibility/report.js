"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTDetailedVersionedReport = exports.ASTVersionedReport = exports.isLibrary = exports.CategorizedChanges = exports.ASTReports = void 0;
const tslib_1 = require("tslib");
const ContractAST_1 = tslib_1.__importDefault(require("@openzeppelin/upgrades/lib/utils/ContractAST"));
const ast_code_1 = require("./ast-code");
const categorizer_1 = require("./categorizer");
const internal_1 = require("./internal");
const version_1 = require("./version");
/**
 * Value object holding all uncategorized storage and code reports.
 */
class ASTReports {
    constructor(code, storage, libraryLinking) {
        this.code = code;
        this.storage = storage;
        this.libraryLinking = libraryLinking;
        /**
         * @return a new {@link ASTReports} with the same storage and code
         * reports, excluding all contract names that match the {@param exclude}
         * parameter.
         */
        this.excluding = (exclude) => {
            const included = (contract) => {
                if (exclude != null) {
                    return !exclude.test(contract);
                }
                return true;
            };
            const codeReport = new ast_code_1.ASTCodeCompatibilityReport(this.code.getChanges().filter(r => included(r.getContract())));
            const storageReports = this.storage.filter(r => included(r.contract));
            const libraryLinkingReport = this.libraryLinking.filter(change => included(change.getContract()));
            return new ASTReports(codeReport, storageReports, libraryLinkingReport);
        };
    }
}
exports.ASTReports = ASTReports;
/**
 * A {@link CategorizedChanges} builder pattern implementation.
 */
class CategorizedChangesBuilder {
    constructor() {
        this.storage = [];
        this.major = [];
        this.minor = [];
        this.patch = [];
        this.build = () => {
            return new CategorizedChanges(this.storage, this.major, this.minor, this.patch);
        };
    }
}
/**
 * A semantic versioning categorization of a list of contract storage
 * and code changes.
 */
class CategorizedChanges {
    /**
     * @returns a new {@link CategorizedChanges} according to
     * the {@link Categorizer} given.
     */
    static fromReports(reports, categorizer) {
        const storage = reports.storage.filter(r => !r.compatible);
        const storageExpandedReports = reports.storage.filter(r => r.expanded);
        const c = (0, categorizer_1.categorize)(reports.code.getChanges().concat(reports.libraryLinking), categorizer);
        const major = [...c[categorizer_1.ChangeType.Major], ...storageExpandedReports.map(r => ({ getContract: () => r.contract, accept: () => null }))];
        const minor = c[categorizer_1.ChangeType.Minor];
        const patch = c[categorizer_1.ChangeType.Patch];
        return new CategorizedChanges(storage, major, minor, patch);
    }
    constructor(storage, major, minor, patch) {
        this.storage = storage;
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        /**
         * @returns a mapping {contract name => {@link CategorizedChanges}}
         */
        this.byContract = () => {
            const builders = {};
            const builder = (contract) => {
                if (!builders.hasOwnProperty(contract)) {
                    builders[contract] = new CategorizedChangesBuilder();
                }
                return builders[contract];
            };
            this.storage.forEach((r) => builder(r.contract).storage.push(r));
            this.major.forEach((c) => builder(c.getContract()).major.push(c));
            this.minor.forEach((c) => builder(c.getContract()).minor.push(c));
            this.patch.forEach((c) => builder(c.getContract()).patch.push(c));
            const ret = {};
            Object.keys(builders).forEach((contract) => {
                ret[contract] = builders[contract].build();
            });
            return ret;
        };
    }
}
exports.CategorizedChanges = CategorizedChanges;
const isLibrary = (contract, artifacts) => {
    const artifact = artifacts.getArtifactByName(contract);
    const zContract = (0, internal_1.makeZContract)(artifact);
    const ast = new ContractAST_1.default(zContract, artifacts);
    const kind = ast.getContractNode().contractKind;
    return kind === "library";
};
exports.isLibrary = isLibrary;
/**
 * Backward compatibility report for a set of changes, based on
 * the abstract syntax tree analysis of both the storage layout, and code API.
 *
 * Holds {@link CategorizedChanges} and the calculated {@link ContractVersionDelta}.
 */
class ASTVersionedReport {
    constructor(changes, versionDelta) {
        this.changes = changes;
        this.versionDelta = versionDelta;
    }
}
exports.ASTVersionedReport = ASTVersionedReport;
/**
 * @returns a new {@link ASTVersionedReport} with the provided
 * {@link CategorizedChanges} and a calculated version delta
 * according to {@link ContractVersionDelta.fromChanges}.
 */
ASTVersionedReport.create = (changes) => {
    const versionDelta = version_1.ContractVersionDelta.fromChanges(changes.storage.length > 0, changes.major.length > 0, changes.minor.length > 0, changes.patch.length > 0);
    return new ASTVersionedReport(changes, versionDelta);
};
/**
 * @return a new {@link ASTVersionedReportIndex} defined by
 * {contract name => {@link ASTVersionedReport}}, each built
 * by the {@link CategorizedChanges} for each contract.
 */
ASTVersionedReport.createByContract = (changes, artifacts) => {
    const changesByContract = changes.byContract();
    const reportIndex = {
        contracts: {},
        libraries: {},
    };
    Object.keys(changesByContract).forEach((contract) => {
        if ((0, exports.isLibrary)(contract, artifacts)) {
            reportIndex.libraries[contract] = changesByContract[contract];
        }
        else {
            const report = ASTVersionedReport.create(changesByContract[contract]);
            reportIndex.contracts[contract] = report;
        }
    });
    return reportIndex;
};
/**
 * A report holding detailed {@link ASTVersionedReport} for each contract and library.
 */
class ASTDetailedVersionedReport {
    constructor(contracts, libraries) {
        this.contracts = contracts;
        this.libraries = libraries;
        this.versionDeltas = () => {
            const deltas = {};
            // eslint-disable-next-line array-callback-return
            Object.keys(this.contracts).map((contract) => {
                deltas[contract] = this.contracts[contract].versionDelta;
            });
            return deltas;
        };
    }
}
exports.ASTDetailedVersionedReport = ASTDetailedVersionedReport;
ASTDetailedVersionedReport.create = (fullReports, artifacts, categorizer) => {
    const changes = CategorizedChanges.fromReports(fullReports, categorizer);
    const reportIndex = ASTVersionedReport.createByContract(changes, artifacts);
    return new ASTDetailedVersionedReport(reportIndex.contracts, reportIndex.libraries);
};
