const fileMappings = [
    // utils. Do not execute them (threads = 0)
    ['util/network-util.js', 0, ''],

    // api worker
    ['api/send-hack-data.js', 1, ''],
    ['api/work-receiver.js', 1, ''],

    // background tasks
    ['terminal/auto-pen.js', 1, ''],
    ['terminal/stonks.js', 1, ''],
    ['terminal/infiltrate.js', 1, ''],
    ['terminal/purchase-server.js', 1, ''],
]

const git = 'https://raw.githubusercontent.com/Sichlan/bitburner-ingame-scripts/master/'

/**
 * Automatically downloads and runs all programs necessary for a working home environment.
 * @remarks IMPORTANT! This script does not use the file-downloader util to stay completely independent. This script is intended to be downloaded to an empty server 
 * @param {NS} ns The netscript standard library.
 */
export async function main(ns) {
    const flags = ns.flags([
        ['amnesia', false],
        ['help', false]
    ]);

    const host = ns.getHostname()

    if (flags.help) {
        ns.tprint('This script initializes all background functions, including sending data to the api and starting background tasks like auto penetration.');
        ns.tprint(`Usage: run ${ns.getScriptName()} [--help] [--amnesia]`);
        ns.tprint('Example:');
        ns.tprint(`> run ${ns.getScriptName()} --amnesia`);
        return;
    }

    if (flags.amnesia) {
        ns.killall(host, true);
    }

    for (let index = 0; index < fileMappings.length; index++) {
        const file = fileMappings[index];
        
        let filePath = file[0];
        let thread = file[1];
        let args = file[2];

        let filename = /[^/]*$/.exec(filePath)[0];
        let path = /^(.+\/)/.exec(filePath)[0];

        ns.print('INFO  Fetching file from ' + git + filePath);

        // download latest file
        await ns.wget(git + filePath, filename, host);

        // move file to directory
        ns.mv(host, filename, '/' + filePath)

        // run script if it is not a util function
        if (thread > 0)
            ns.exec(filePath, host, thread, args); 
    }
}