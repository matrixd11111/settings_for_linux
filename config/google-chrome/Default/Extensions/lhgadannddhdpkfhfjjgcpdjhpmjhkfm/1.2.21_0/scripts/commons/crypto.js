function AESCryptoProvider() {
    const self = this;
    const _iv_length = 16;

    const _utils = {
        byte_to_char: (b) => String.fromCharCode(b),
        char_to_byte: (c) => c.charCodeAt(0)
    };

    self.generate_key_from_password = async function(algorithm, password, usages=['encrypt']) {
        let password_raw = new TextEncoder().encode(password);
        const hash = await crypto.subtle.digest('SHA-256', password_raw);
        // console.log(`Key: ${raw_data_to_hex(hash)} (password is '${password}')`);
        return crypto.subtle.importKey('raw', hash, algorithm, false, usages);
    };

    self.encrypt = async function(plaintext, password) {
        const IV = crypto.getRandomValues(new Uint8Array(_iv_length));
        const algorithm = {
            name: 'AES-CBC',
            iv: IV
        };
        const encryption_key = await self.generate_key_from_password(algorithm, password);

        const data = new TextEncoder().encode(plaintext);
        const cipher_raw = await crypto.subtle.encrypt(algorithm, encryption_key, data);
        const cipher_bytes = new Uint8Array(cipher_raw);

        return btoa(
            Array.from(
                IV.concat(cipher_bytes),
                _utils.byte_to_char
            ).join('')
        );
    };

    self.decrypt = async function(ciphertext, password) {
        const ciphertext_bytes = Uint8Array.from(
            atob(ciphertext.replace(/\n/g, '').trim()), // in order to decrypt OpenSSL output (splitted in lines)
            _utils.char_to_byte
        );
        const IV = ciphertext_bytes.slice(0, _iv_length);
        const algorithm = {
            name: 'AES-CBC',
            iv: IV
        };

        const decryption_key = await self.generate_key_from_password(algorithm, password, ['decrypt']);
        const cipher_bytes = ciphertext_bytes.slice(_iv_length);
        const plaintext_raw = await crypto.subtle.decrypt(algorithm, decryption_key, cipher_bytes);
        return new TextDecoder().decode(plaintext_raw);
    };
}
