if (process.platform === 'win32') {
    module.exports = {
        registry: require('./lib/registry'),
        driveAlias: require('./lib/driveAlias'),
        runnable: require('./lib/runnable'),
        getFontNames: require('./lib/fonts').getNames,
        associations: require('./lib/associations').associations,
        fileTypes: require('./lib/associations').fileTypes,
        windowsSDK: require('./lib/winsdk'),
        Command: require('./lib/Command').Command,
        execSync: require('./lib/Command').execSync,
    };
} else {
    // return empty object on non-windows platforms
    module.exports = {
        registry: {},
        driveAlias: {},
        runnable: {},
        getFontNames: {},
        associations: {},
        fileTypes: {},
        windowsSDK: {},
        Command: {},
        execSync: {},
    };
}