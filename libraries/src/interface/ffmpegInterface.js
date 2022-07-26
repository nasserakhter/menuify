import filesystem from "../filesystem.js";
import fs from "fs";
import tmp from 'tmp';
import path from "path";
import { constants } from "../constants.js";
import chalk from "chalk";
import { execSync } from "child_process";
import MenuifyError from "../menuifyError.js";

export default class FfmpegInterface {
    static isFfmpegInstalled() {
        let installed = false;
        if (filesystem.rootFileExists("ffmpeg.json")) {
            let _ffmpegManifest = filesystem.readRootFile("ffmpeg.json");
            try {
                let ffmpegManifest = JSON.parse(_ffmpegManifest);
                if (ffmpegManifest.version &&
                    ffmpegManifest.location) {
                    installed = true;
                }
            } catch (e) { }
        }
        return installed;
    }

    static async installFfmpeg() {
        console.log(chalk.yellow("Getting latest version..."));
        let githubReleases = await filesystem.httpGet(constants.ffmpegReleasesEndpoint);
        let ffmpegRelease = githubReleases.assets.find(release => release.name === "ffmpeg-master-latest-win64-lgpl.zip");

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
        try {
            let version = this.getFfmpegVersion();
            if (version) {
                let manifest = {
                    version: version,
                    location: ffmpeg
                };
                filesystem.writeRootFile("ffmpeg.json", JSON.stringify(manifest));
                console.log(chalk.green("Successfully installed ffmpeg v" + version));
            }
        } catch (e) {
            throw new MenuifyError("Failed to install ffmpeg.", 4012);
        }
    }


    static getFfmpegVersion() {
        // exec
        let output = execSync(`${path.join(filesystem.rootDir, "ffmpeg", "ffmpeg.exe")} -version`).toString();
        let version = output.split("\n")[0].split(" ")[2];
        return version;
    }
}