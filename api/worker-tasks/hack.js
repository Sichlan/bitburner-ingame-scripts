/**
 * Executes the hack command on a specified server.
 * @param {NS} ns The netscript standard library.
 */
export async function main(ns) {
    const flags = ns.flags([
        ['server', '']
    ])

    ns.hack(flags.server);
}