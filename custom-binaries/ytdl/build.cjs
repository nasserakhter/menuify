const fs = require('fs');
const uuid = require('uuid');

console.log("Bundling project...");

let ytdAudio = fs.readFileSync("release/ytdl-audio.js").toString("base64");
let ytdVideo = fs.readFileSync("release/ytdl-video.js").toString("base64");
let ytIcon = fs.readFileSync("icon.ico").toString("base64");

console.log("Generating manifest...");

let manifest = {
    "name": "Youtube Download", 
    "description": "Download mp4 and mp3 files using a youtube link",
    "ext": "[dir]", 
    "cascade": true,
    "rawIcon": ytIcon,
    "id": "e69d4936-9a77-450c-abad-a4e25126ea4f",
    "buttons": [
        {
            "id": "ec3a75ac-67e8-4df6-a806-6cb166aa925b",
            "name": "Download mp4",
            "type": "precompiled",
            "action": {
                "data": ytdVideo,
                "type": {
                    "name": "javascript"
                },
                //"[signature]": "string" // (type=precompiled) The signature of the precompiled data.
            }
        },
        {
            "id": "ec3a75ac-67e8-4df6-a806-6cb166aa925c",
            "name": "Download mp3",
            "type": "precompiled",
            "action": {
                "data": ytdAudio,
                "type": {
                    "name": "javascript"
                },
                //"[signature]": "string" // (type=precompiled) The signature of the precompiled data.
            }
        }
    ],
    "certificate": {
        "issuer": "string", // Issuer or self
        "subjectKey": "string", 
        "encryptionKey": "string", 
        "validity": {
            "notBefore": "string<date>", 
            "notAfter": "string<date>"
        }
    }
}

fs.writeFileSync("release/ytdl.unsigned", JSON.stringify(manifest));