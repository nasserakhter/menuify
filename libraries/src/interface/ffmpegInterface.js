import filesystem from "../filesystem.js";
import fs from "fs";
import tmp, { file } from 'tmp';
import path from "path";
import { constants } from "../constants.js";
import chalk from "chalk";
import { execSync } from "child_process";
import MenuifyError from "../menuifyError.js";
import which from "which";
import { logVerbose } from "../logger.js";

export default class FfmpegInterface {
    static isFfmpegInstalled() {
        return this.isInstalled;
    }

    static ffmpegLocation;
    static ffmpegVersion;
    static isInstalled = 0;

    static async initialize() {
        logVerbose("Initializing ffmpeg interface...");
        if (!filesystem.rootFileExists("ffmpeg.json")) {
            // If not installed, check if system has ffmpeg
            //return;
            try {
                let ffmpeg = await which("ffmpeg");

                logVerbose("Found ffmpeg at " + ffmpeg);
                let manifest = {
                    version: this.getFfmpegVersion(ffmpeg),
                    location: ffmpeg,
                    manageable: false
                }
                this.isInstalled = 2;
                this.ffmpegLocation = ffmpeg;
                filesystem.writeRootFile("ffmpeg.json", JSON.stringify(manifest));
            } catch (e) { }
        } else {
            // Is already installed, get info
            logVerbose("Ffmpeg is already installed.");
            let _ffmpegManifest = filesystem.readRootFile("ffmpeg.json");
            try {
                let ffmpegManifest = JSON.parse(_ffmpegManifest);
                if (ffmpegManifest.version && ffmpegManifest.location) {
                    this.ffmpegLocation = ffmpegManifest.location;
                    this.ffmpegVersion = ffmpegManifest.version;
                    this.isInstalled = ffmpegManifest.manageable ? 1 : 2;
                }
            } catch (e) { }
        }
    }

    static async installFfmpeg() {
        // 0 = not installed, 1 = installed, 2 = installed via system
        let installed = this.isFfmpegInstalled();

        if (installed === 0 || installed === 1) {
            await this._installFfmpeg();
        }
    }

    static async _installFfmpeg() {
        console.log(chalk.yellow("Getting latest version..."));
        let githubReleases = await filesystem.httpGet(constants.ffmpegReleasesEndpoint);
        let ffmpegRelease = githubReleases.assets.find(release => release.name === "ffmpeg-master-latest-win64-gpl.zip");

        let tmpFile = tmp.fileSync({ postfix: ".zip" });
        console.log(chalk.yellow("Downloading ffmpeg..."));
        await filesystem.visualDownloadFile(
            ffmpegRelease.browser_download_url,
            tmpFile.name
        );
        console.log(chalk.yellow("Done."));

        if (!fs.existsSync(path.join(filesystem.rootDir, "ffmpeg"))) {
            fs.mkdirSync(path.join(filesystem.rootDir, "ffmpeg"));
        }

        let ffmpeg = path.join(filesystem.rootDir, "ffmpeg", "ffmpeg.exe");
        console.log(chalk.yellow("Extracting ffmpeg..."));
        await filesystem.visualExtractOneFileFromZip(
            tmpFile.name,
            ffmpeg,
            /ffmpeg\.exe/
        );
        console.log("Done.");
        console.log(chalk.yellow("Verifying..."));
        console.log(chalk.green("Ffmpeg is installed."));
        try {
            let version = this.getFfmpegVersion(ffmpeg);
            if (version) {
                let manifest = {
                    version: version,
                    location: ffmpeg,
                    manageable: true
                };
                filesystem.writeRootFile("ffmpeg.json", JSON.stringify(manifest));
                console.log(chalk.green("Successfully installed ffmpeg v" + version));
            }
        } catch (e) {
            throw new MenuifyError("Failed to install ffmpeg.", 4012);
        }
    }

    static getFfmpegLocation() {
        return this.ffmpegLocation;
    }


    static getFfmpegVersion(location) {
        // exec
        if (location) {
            logVerbose("Getting ffmpeg version from " + location);
            let output = execSync(`"${location}" -version`).toString();
            let version = output.split("\n")[0].split(" ")[2];
            this.ffmpegVersion = version;
            return version;
        } else if (this.ffmpegVersion) {
            logVerbose("Getting ffmpeg version from cache");
            return this.ffmpegVersion;
        } else {
            logVerbose("Getting ffmpeg version from system");
            if (location === undefined) location = this.getFfmpegLocation();
            if (location) {
                let output = execSync(`"${location}" -version`).toString();
                let version = output.split("\n")[0].split(" ")[2];
                this.ffmpegVersion = version;
                return version;
            } else {
                return false;
            }
        }
    }
}