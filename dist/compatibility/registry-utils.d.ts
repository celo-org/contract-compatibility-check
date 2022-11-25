/**
 * Be careful when adding to this file or relying on this file.
 * The verification tooling uses the CeloContractName enum as a
 * source of truth for what contracts are considered "core" and
 * need to be checked for backwards compatability and bytecode on
 * an environment.
 */
export declare const celoRegistryAddress = "0x000000000000000000000000000000000000ce10";
export declare enum CeloContractName {
    Accounts = "Accounts",
    Attestations = "Attestations",
    BlockchainParameters = "BlockchainParameters",
    DoubleSigningSlasher = "DoubleSigningSlasher",
    DowntimeSlasher = "DowntimeSlasher",
    Election = "Election",
    EpochRewards = "EpochRewards",
    Escrow = "Escrow",
    Exchange = "Exchange",
    ExchangeEUR = "ExchangeEUR",
    ExchangeBRL = "ExchangeBRL",
    FederatedAttestations = "FederatedAttestations",
    FeeCurrencyWhitelist = "FeeCurrencyWhitelist",
    Freezer = "Freezer",
    GasPriceMinimum = "GasPriceMinimum",
    GoldToken = "GoldToken",
    Governance = "Governance",
    GovernanceSlasher = "GovernanceSlasher",
    GovernanceApproverMultiSig = "GovernanceApproverMultiSig",
    GrandaMento = "GrandaMento",
    LockedGold = "LockedGold",
    OdisPayments = "OdisPayments",
    Random = "Random",
    Reserve = "Reserve",
    ReserveSpenderMultiSig = "ReserveSpenderMultiSig",
    SortedOracles = "SortedOracles",
    StableToken = "StableToken",
    StableTokenEUR = "StableTokenEUR",
    StableTokenBRL = "StableTokenBRL",
    TransferWhitelist = "TransferWhitelist",
    Validators = "Validators",
    StableTokenRegistry = "StableTokenRegistry"
}
export declare const usesRegistry: CeloContractName[];
export declare const hasEntryInRegistry: string[];
