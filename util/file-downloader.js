const git_address = 'https://raw.githubusercontent.com/Sichlan/bitburner-ingame-scripts/master/'

/**
 * Downloads a file from git to the specified path.
 * @param {NS} ns The netscript standard library.
 * @param {string} filePath The path to where the file will be placed. Must be relative to where the file is stored on git.
 * @param {string} host The host to which the file will be downloaded
 */
export async function download_file(ns, filePath, host) {
    let filename = /[^/]*$/.exec(filePath)[0];

    // download latest file
    await ns.wget(git + filePath, filename, host);

    // move file to directory
    ns.mv(host, filename, '/' + filePath)
}