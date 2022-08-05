import ytdl from "ytdl-core";
import { execSync } from "child_process";
import path from "path";

function getMaximum(formats, quality, isVideo) {
    if (isVideo) {
        let fmt = formats.find(x => x.hasVideo && !x.hasAudio && x.qualityLabel.includes(quality));
        if (fmt) {
            return fmt;
        } else {
            return ytdl.chooseFormat(formats, { quality: "highestvideo" });
        }
    } else {
        return ytdl.chooseFormat(formats, { quality: "highestaudio" });
    }
}

function getYoutubeUrl() {
    try {
        let text = execSync("powershell -command get-clipboard");
        if (text) {
            text = text.toString();
            if (text.startsWith('http') && text.includes('youtu')) {
                return text;
            }
        }
    } catch (e) {
        return null;
    }
}

(async () => {
    const c = (...a) => process.stdout.write(...a);
    c("\x1b]0m;Menuify - Javascript Command\x07");
    console.clear();
    c("\x1b[8;7;80t");
    let rawUrl = getYoutubeUrl();

    if (process.argv.length >= 3 && rawUrl) {
        let video = await ytdl.getInfo(rawUrl);
        let title = video.videoDetails.title.replaceAll(/[^A-Za-z0-9 \-\_\(\)\[\]]/g, "").substring(0, 255);
        let bestvideo = getMaximum(video.formats, '1080', true);
        let bestaudio = getMaximum(video.formats, '', false);
        c("\x1b[30;43m Downloading '" + video.videoDetails.title + "' \x1b[0m\n");
        let file = title += ".mp4";
        let filePath = path.join(process.argv[2], file);
        execSync(`ffmpeg -i "${bestvideo.url}" -i "${bestaudio.url}" -c copy "${filePath}" -loglevel quiet`, { stdio: 'inherit' });
    } else {
        c("\x07");
        c("\x1b[29;41m Error: This script requires a file parameter \x1b[0m\n");
        process.stdin.setRawMode(true);
        process.stdin.resume();
        await new Promise((r) => {
            process.stdin.once('data', () => {
                process.stdin.pause();
                r();
            });
        });
    }
})();