const fs = require('fs');
const path = require('path');

console.log("Signing project...");

if (process.argv.length > 2) {
    let manifest = JSON.parse(fs.readFileSync(process.argv[2]).toString());

    if (manifest.certificate === undefined) {
        // sign the manifest with a new certificate
        manifest.certificate = {
            "issuer": "self",
            "subjectKey": "", // Encrypted public key for the digital signatures
            "validity": {
                "notBefore": "", // Date before which the certificate is not valid.
                "notAfter": "string<date>" // Date after which the certificate is not valid.
            }
        };
    } else {
        // use provided certificate
        let key = manifest.certificate.encryptionKey;
        delete manifest.certificate.encryptionKey;

        manifest.buttons.filter(x => x.type === "precompiled").forEach(x => {
            x.action.signature = "(SIGNED)"
        });
    }

    let file = path.parse(process.argv[2]);
    let output = path.join(file.dir, file.name + ".signed.menu");

    fs.writeFileSync(output, JSON.stringify(manifest));

    console.log("Signed.");
}