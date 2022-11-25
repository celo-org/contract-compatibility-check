"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryLinkingChange = exports.MethodReturnChange = exports.MethodMutabilityChange = exports.MethodVisibilityChange = exports.MethodRemovedChange = exports.MethodAddedChange = exports.ContractKindChange = exports.DeployedBytecodeChange = exports.NewContractChange = void 0;
/**
 * Abstract implementation for the {@link Change} interface.
 */
class ContractChange {
    constructor(contract) {
        this.contract = contract;
        this.contract = contract;
    }
    getContract() {
        return this.contract;
    }
}
/**
 * A 'New Contract' change detected during the compatibility report. A
 * contract was found in the new folder that was not present in the old
 * folder. The id which is used to do this comparison is the name of the
 * contract, therefore not only adding a contract, but a name change
 * would produce this change.
 */
class NewContractChange extends ContractChange {
    constructor() {
        super(...arguments);
        this.type = "NewContract";
    }
    accept(visitor) {
        return visitor.onNewContract(this);
    }
}
exports.NewContractChange = NewContractChange;
/**
 * Abstract class providing standard 'old value => new value' functionality
 * for {@link ContractChange}
 */
class ContractValueChange extends ContractChange {
    constructor(contract, oldValue, newValue) {
        super(contract);
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}
/**
 * The deployedBytecode field in the built json artifact has changed, with
 * the exception of metadata, from the old folder to the new one. This is
 * due to an implementation change.
 *
 * To avoid false positives, compile both old and new folders in the same
 * full path.
 */
class DeployedBytecodeChange extends ContractChange {
    constructor() {
        super(...arguments);
        this.type = "DeployedBytecode";
    }
    accept(visitor) {
        return visitor.onDeployedBytecode(this);
    }
}
exports.DeployedBytecodeChange = DeployedBytecodeChange;
/**
 * The Kind of a contract changed. Kind examples are
 * 'contract' or 'library'.
 */
class ContractKindChange extends ContractValueChange {
    constructor() {
        super(...arguments);
        this.type = "ContractKind";
    }
    accept(visitor) {
        return visitor.onContractKind(this);
    }
}
exports.ContractKindChange = ContractKindChange;
/**
 * Abstract implementation for the {@link Change} interface for
 * method changes.
 *
 * Since we use the {@link signature} as the id of the method, it's
 * the same value for the old and the new contract.
 */
class MethodChange extends ContractChange {
    constructor(contract, signature) {
        super(contract);
        this.signature = signature;
    }
    getSignature() {
        return this.signature;
    }
}
/**
 * A new method was found in the new version of the contract.
 */
class MethodAddedChange extends MethodChange {
    constructor() {
        super(...arguments);
        this.type = "MethodAdded";
    }
    accept(visitor) {
        return visitor.onMethodAdded(this);
    }
}
exports.MethodAddedChange = MethodAddedChange;
/**
 * A method from the old version is not present in the new version.
 */
class MethodRemovedChange extends MethodChange {
    constructor() {
        super(...arguments);
        this.type = "MethodRemoved";
    }
    accept(visitor) {
        return visitor.onMethodRemoved(this);
    }
}
exports.MethodRemovedChange = MethodRemovedChange;
/**
 * Abstract class providing standard 'old value => new value' functionality
 * for {@link MethodChange}
 */
class MethodValueChange extends MethodChange {
    constructor(contract, signature, oldValue, newValue) {
        super(contract, signature);
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}
/**
 * The visibility (public/external) of a method changed.
 */
class MethodVisibilityChange extends MethodValueChange {
    constructor() {
        super(...arguments);
        this.type = "MethodVisibility";
    }
    accept(visitor) {
        return visitor.onMethodVisibility(this);
    }
}
exports.MethodVisibilityChange = MethodVisibilityChange;
/**
 * The mutability (payable/pure/view...) of a method changed.
 */
class MethodMutabilityChange extends MethodValueChange {
    constructor() {
        super(...arguments);
        this.type = "MethodMutability";
    }
    accept(visitor) {
        return visitor.onMethodMutability(this);
    }
}
exports.MethodMutabilityChange = MethodMutabilityChange;
/**
 * The return parameters of a method changed.
 */
class MethodReturnChange extends MethodValueChange {
    constructor() {
        super(...arguments);
        this.type = "MethodReturn";
    }
    accept(visitor) {
        return visitor.onMethodReturn(this);
    }
}
exports.MethodReturnChange = MethodReturnChange;
class LibraryLinkingChange extends ContractChange {
    constructor(contract, dependency) {
        super(contract);
        this.dependency = dependency;
        this.type = "LibraryLinkingChange";
    }
    getDependency() {
        return this.dependency;
    }
    accept(visitor) {
        return visitor.onLibraryLinking(this);
    }
}
exports.LibraryLinkingChange = LibraryLinkingChange;
