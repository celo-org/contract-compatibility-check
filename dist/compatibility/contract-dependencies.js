"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCeloContractDependencies = exports.ContractDependencies = void 0;
/* eslint-disable unicorn/no-array-for-each */
const migrations_config_1 = require("./migrations-config");
class ContractDependencies {
    constructor(libraries) {
        this.get = (contract) => {
            var _a;
            return (_a = this.dependencies.get(contract)) !== null && _a !== void 0 ? _a : [];
        };
        this.dependencies = new Map();
        Object.keys(libraries).forEach((lib) => {
            libraries[lib].forEach((contract) => {
                if (this.dependencies.has(contract)) {
                    this.dependencies.get(contract).push(lib);
                }
                else {
                    this.dependencies.set(contract, [lib]);
                }
            });
        });
    }
}
exports.ContractDependencies = ContractDependencies;
const getCeloContractDependencies = () => {
    return new ContractDependencies(migrations_config_1.linkedLibraries);
};
exports.getCeloContractDependencies = getCeloContractDependencies;
