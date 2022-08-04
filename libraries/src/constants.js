import splash from './splash.json' assert { type: 'json' };
import packageJson from '../package.json' assert { type: 'json' };

export let constants = {
    version: packageJson.version,
    name: "Menuify",
    developer: "Microart inc.",
    url: "https://microart.cf/showroom/menuify",
    splash: splash.raw,
    regkey: "HKCR/SystemFileAssociations",
    directoryRegkey: "HKCR/Directory",
    ffmpegReleasesEndpoint: "https://api.github.com/repos/BtbN/FFmpeg-Builds/releases/latest"
}