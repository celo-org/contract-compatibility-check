"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportLibraryLinkingIncompatibilities = void 0;
const change_1 = require("./change");
const contract_dependencies_1 = require("./contract-dependencies");
const getChangedLinkedLibraries = (linkedLibraries, codeReport) => {
    const changedLinkedLibraries = new Set();
    for (const change of codeReport.getChanges()) {
        if (linkedLibraries.includes(change.getContract())) {
            changedLinkedLibraries.add(change.getContract());
        }
    }
    return changedLinkedLibraries;
};
const reportToChanges = (report) => {
    return Object.keys(report).flatMap(contract => {
        return report[contract].map(library => new change_1.LibraryLinkingChange(contract, library));
    });
};
const reportLibraryLinkingIncompatibilities = (linkedLibraries, codeReport) => {
    const dependencies = new contract_dependencies_1.ContractDependencies(linkedLibraries);
    const changedLinkedLibraries = getChangedLinkedLibraries(Object.keys(linkedLibraries), codeReport);
    const libraryLinkingReport = {};
    // To robustly handle the possibility of multiple layers of linking, we
    // iterate until `changedLinkedLibraries` stabilizes.
    let previousChangedLinkedLibrariesSize = 0;
    while (previousChangedLinkedLibrariesSize !== changedLinkedLibraries.size) {
        previousChangedLinkedLibrariesSize = changedLinkedLibraries.size;
        dependencies.dependencies.forEach((libraries, contract) => {
            const relevantChangedLibraries = libraries.filter(library => changedLinkedLibraries.has(library));
            if (relevantChangedLibraries.length > 0) {
                libraryLinkingReport[contract] = relevantChangedLibraries;
                // Is this contract is a linked library itself? If so, add it to the
                // set.
                if (linkedLibraries[contract]) {
                    changedLinkedLibraries.add(contract);
                }
            }
        });
    }
    return reportToChanges(libraryLinkingReport);
};
exports.reportLibraryLinkingIncompatibilities = reportLibraryLinkingIncompatibilities;
