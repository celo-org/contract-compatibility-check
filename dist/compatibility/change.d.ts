/**
 * A code change detected from an old to a new version of a contract.
 */
export interface Change {
    getContract(): string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * Visitor pattern implementation for the {@link Change} hierarchy.
 */
export interface ChangeVisitor<T> {
    onMethodMutability(change: MethodMutabilityChange): T;
    onMethodReturn(change: MethodReturnChange): T;
    onMethodVisibility(change: MethodVisibilityChange): T;
    onMethodAdded(change: MethodAddedChange): T;
    onMethodRemoved(change: MethodRemovedChange): T;
    onContractKind(change: ContractKindChange): T;
    onNewContract(change: NewContractChange): T;
    onDeployedBytecode(change: DeployedBytecodeChange): T;
    onLibraryLinking(change: LibraryLinkingChange): T;
}
/**
 * Abstract implementation for the {@link Change} interface.
 */
declare abstract class ContractChange implements Change {
    private readonly contract;
    type: string | undefined;
    constructor(contract: string);
    getContract(): string;
    abstract accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * A 'New Contract' change detected during the compatibility report. A
 * contract was found in the new folder that was not present in the old
 * folder. The id which is used to do this comparison is the name of the
 * contract, therefore not only adding a contract, but a name change
 * would produce this change.
 */
export declare class NewContractChange extends ContractChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * Abstract class providing standard 'old value => new value' functionality
 * for {@link ContractChange}
 */
declare abstract class ContractValueChange extends ContractChange {
    readonly oldValue: string;
    readonly newValue: string;
    constructor(contract: string, oldValue: string, newValue: string);
}
/**
 * The deployedBytecode field in the built json artifact has changed, with
 * the exception of metadata, from the old folder to the new one. This is
 * due to an implementation change.
 *
 * To avoid false positives, compile both old and new folders in the same
 * full path.
 */
export declare class DeployedBytecodeChange extends ContractChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * The Kind of a contract changed. Kind examples are
 * 'contract' or 'library'.
 */
export declare class ContractKindChange extends ContractValueChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * Abstract implementation for the {@link Change} interface for
 * method changes.
 *
 * Since we use the {@link signature} as the id of the method, it's
 * the same value for the old and the new contract.
 */
declare abstract class MethodChange extends ContractChange {
    private readonly signature;
    constructor(contract: string, signature: string);
    getSignature(): string;
}
/**
 * A new method was found in the new version of the contract.
 */
export declare class MethodAddedChange extends MethodChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * A method from the old version is not present in the new version.
 */
export declare class MethodRemovedChange extends MethodChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * Abstract class providing standard 'old value => new value' functionality
 * for {@link MethodChange}
 */
declare abstract class MethodValueChange extends MethodChange {
    readonly oldValue: string;
    readonly newValue: string;
    constructor(contract: string, signature: string, oldValue: string, newValue: string);
}
/**
 * The visibility (public/external) of a method changed.
 */
export declare class MethodVisibilityChange extends MethodValueChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * The mutability (payable/pure/view...) of a method changed.
 */
export declare class MethodMutabilityChange extends MethodValueChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
/**
 * The return parameters of a method changed.
 */
export declare class MethodReturnChange extends MethodValueChange {
    type: string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
export declare class LibraryLinkingChange extends ContractChange {
    private readonly dependency;
    type: string;
    constructor(contract: string, dependency: string);
    getDependency(): string;
    accept<T>(visitor: ChangeVisitor<T>): T;
}
export {};
