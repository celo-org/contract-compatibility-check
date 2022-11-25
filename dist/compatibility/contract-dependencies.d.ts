export declare class ContractDependencies {
    dependencies: Map<string, string[]>;
    constructor(libraries: {
        [library: string]: string[];
    });
    get: (contract: string) => string[];
}
export declare const getCeloContractDependencies: () => ContractDependencies;
