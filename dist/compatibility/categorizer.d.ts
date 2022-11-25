import { Change, ChangeVisitor, ContractKindChange, DeployedBytecodeChange, LibraryLinkingChange, MethodAddedChange, MethodMutabilityChange, MethodRemovedChange, MethodReturnChange, MethodVisibilityChange, NewContractChange } from "./change";
/**
 * Change type categories according to semantic versioning standards
 */
export declare enum ChangeType {
    Patch = 0,
    Minor = 1,
    Major = 2
}
/**
 * @returns the assigned {@link ChangeType} for each {@link Change}
 */
export type Categorizer = ChangeVisitor<ChangeType>;
/**
 * @returns a mapping of {ChangeType => Change[]} according to the {@link categorizer} used
 */
export declare function categorize(changes: Change[], categorizer: Categorizer): Change[][];
/**
 * Default implementation of {@link Categorizer}, where:
 *  Major:
 *    New contract, Mutability, Params, Return Params, Method Removed, Contract type changes
 *  Minor:
 *    Method Added
 *  Patch:
 *    Visibility, Bytecode (implementation) changes
 */
export declare class DefaultCategorizer implements Categorizer {
    onNewContract: (_change: NewContractChange) => ChangeType;
    onMethodMutability: (_change: MethodMutabilityChange) => ChangeType;
    onMethodReturn: (_change: MethodReturnChange) => ChangeType;
    onMethodRemoved: (_change: MethodRemovedChange) => ChangeType;
    onContractKind: (_change: ContractKindChange) => ChangeType;
    onMethodAdded: (_change: MethodAddedChange) => ChangeType;
    onMethodVisibility: (_change: MethodVisibilityChange) => ChangeType;
    onDeployedBytecode: (_change: DeployedBytecodeChange) => ChangeType;
    onLibraryLinking: (_change: LibraryLinkingChange) => ChangeType;
}
