# Database Backups

Encrypted database backups live in this folder.

- `*.sql.enc` files are encrypted and can be committed.
- `*.sql` files are plaintext exports and are ignored.
- `*.key` files contain local decryption passphrases and are ignored.

Keep the matching `.key` file private. Without it, the encrypted backup cannot be restored.
