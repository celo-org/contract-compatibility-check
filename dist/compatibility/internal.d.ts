import { Contract as ZContract } from "@openzeppelin/upgrades";
export declare function makeZContract(artifact: any): ZContract;
export interface Artifact {
    abi: any[];
    ast: any;
    bytecode: string;
    compiler: any;
    contractName: string;
    deployedBytecode: string;
    deployedSourceMap: string;
    fileName: string;
    legacyAST?: any;
    networks: any;
    schemaVersion: string;
    source: string;
    sourceMap: string;
    sourcePath: string;
    updatedAt: string;
}
export interface TypeInfo {
    id: string;
    kind: string;
    label: string;
    valueType?: string;
    length?: number;
    members?: StorageInfo[];
    src?: any;
}
export interface StorageInfo {
    label: string;
    astId: number;
    type: any;
    src: string;
    path?: string;
    contract?: string;
}
