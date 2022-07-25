import splash from './splash.json' assert { type: 'json' };

export let constants = {
    version: 1.0,
    name: "Menuify",
    developer: "Microart inc.",
    url: "https://microart.cf/showroom/menuify",
    splash: splash.raw,
    regkey: "HKCR/SystemFileAssociations",
    ffmpegReleasesEndpoint: "https://api.github.com/repos/BtbN/FFmpeg-Builds/releases/latest"
}