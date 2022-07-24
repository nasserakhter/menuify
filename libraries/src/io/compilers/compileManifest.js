import compileCommand from './commandCompiler.js';
import { init, compileFile, writeManifest } from './fileCompiler.js';

export default async function compileManifest(manifest) {
    init();
    let compiledButtons = {};

    if (manifest.cascade)

    manifest.buttons.forEach(button => {
        if (button.type === "command") {
            compiledButtons[button.id] = compileFile(manifest.id, button.id, compileCommand(button.action, {
                project_id: manifest.id,
                button_id: button.id
            }));
        }
    });



    let rawManifest = JSON.stringify(manifest);
    writeManifest(manifest.id, rawManifest);
}