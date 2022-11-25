"use strict";
/**
 * Be careful when adding to this file or relying on this file.
 * The verification tooling uses the CeloContractName enum as a
 * source of truth for what contracts are considered "core" and
 * need to be checked for backwards compatability and bytecode on
 * an environment.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasEntryInRegistry = exports.usesRegistry = exports.CeloContractName = exports.celoRegistryAddress = void 0;
exports.celoRegistryAddress = "0x000000000000000000000000000000000000ce10";
var CeloContractName;
(function (CeloContractName) {
    CeloContractName["Accounts"] = "Accounts";
    CeloContractName["Attestations"] = "Attestations";
    CeloContractName["BlockchainParameters"] = "BlockchainParameters";
    CeloContractName["DoubleSigningSlasher"] = "DoubleSigningSlasher";
    CeloContractName["DowntimeSlasher"] = "DowntimeSlasher";
    CeloContractName["Election"] = "Election";
    CeloContractName["EpochRewards"] = "EpochRewards";
    CeloContractName["Escrow"] = "Escrow";
    CeloContractName["Exchange"] = "Exchange";
    CeloContractName["ExchangeEUR"] = "ExchangeEUR";
    CeloContractName["ExchangeBRL"] = "ExchangeBRL";
    CeloContractName["FederatedAttestations"] = "FederatedAttestations";
    CeloContractName["FeeCurrencyWhitelist"] = "FeeCurrencyWhitelist";
    CeloContractName["Freezer"] = "Freezer";
    CeloContractName["GasPriceMinimum"] = "GasPriceMinimum";
    CeloContractName["GoldToken"] = "GoldToken";
    CeloContractName["Governance"] = "Governance";
    CeloContractName["GovernanceSlasher"] = "GovernanceSlasher";
    CeloContractName["GovernanceApproverMultiSig"] = "GovernanceApproverMultiSig";
    CeloContractName["GrandaMento"] = "GrandaMento";
    CeloContractName["LockedGold"] = "LockedGold";
    CeloContractName["OdisPayments"] = "OdisPayments";
    CeloContractName["Random"] = "Random";
    CeloContractName["Reserve"] = "Reserve";
    CeloContractName["ReserveSpenderMultiSig"] = "ReserveSpenderMultiSig";
    CeloContractName["SortedOracles"] = "SortedOracles";
    CeloContractName["StableToken"] = "StableToken";
    CeloContractName["StableTokenEUR"] = "StableTokenEUR";
    CeloContractName["StableTokenBRL"] = "StableTokenBRL";
    CeloContractName["TransferWhitelist"] = "TransferWhitelist";
    CeloContractName["Validators"] = "Validators";
    CeloContractName["StableTokenRegistry"] = "StableTokenRegistry";
})(CeloContractName = exports.CeloContractName || (exports.CeloContractName = {}));
exports.usesRegistry = [
    CeloContractName.Reserve,
    CeloContractName.StableToken,
];
exports.hasEntryInRegistry = [
    CeloContractName.Accounts,
    CeloContractName.Attestations,
    CeloContractName.BlockchainParameters,
    CeloContractName.DoubleSigningSlasher,
    CeloContractName.DowntimeSlasher,
    CeloContractName.Election,
    CeloContractName.Escrow,
    CeloContractName.Exchange,
    CeloContractName.FederatedAttestations,
    CeloContractName.FeeCurrencyWhitelist,
    CeloContractName.Freezer,
    CeloContractName.GasPriceMinimum,
    CeloContractName.GoldToken,
    CeloContractName.GovernanceSlasher,
    CeloContractName.GrandaMento,
    CeloContractName.OdisPayments,
    CeloContractName.Random,
    CeloContractName.Reserve,
    CeloContractName.SortedOracles,
    CeloContractName.StableToken,
];
