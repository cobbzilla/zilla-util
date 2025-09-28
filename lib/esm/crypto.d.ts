export declare enum CryptoParam {
    RSA_MODULUS_LENGTH = "RSA_MODULUS_LENGTH",
    RSA_PUBLIC_EXPONENT = "RSA_PUBLIC_EXPONENT",
    OAEP_HASH = "OAEP_HASH"
}
export type CryptoKeyPair = {
    publicKey: string;
    privateKey: string;
};
export declare const CryptoUtil: {
    generateKeyPair: (parameters?: Partial<Record<CryptoParam, string>>) => Promise<CryptoKeyPair>;
    encrypt: (publicKey: string | CryptoKeyPair, plaintext: string, parameters?: Partial<Record<CryptoParam, string>>) => Promise<string>;
    decrypt: (privateKey: string | CryptoKeyPair, ciphertext: string, parameters?: Partial<Record<CryptoParam, string>>) => Promise<string>;
};
