export declare const stripMetadata: (bytecode: string) => string;
export interface LibraryLinks {
    [name: string]: string;
}
export declare const linkLibraries: (bytecode: string, libraryLinks: LibraryLinks) => string;
export declare const verifyAndStripLibraryPrefix: (bytecode: string, address?: string) => string;
export declare class LibraryPositions {
    static libraryLinkRegExpString: string;
    positions: {
        [library: string]: number[];
    };
    constructor(bytecode: string);
    private addPosition;
}
export declare class LibraryAddresses {
    addresses: {
        [library: string]: string;
    };
    constructor();
    collect: (bytecode: string, libraryPositions: LibraryPositions) => void;
    private addAddress;
}
