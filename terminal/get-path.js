import { find_path } from '/util/network-util.js'

/**
 * Prints the path from home to the server giving in the args.
 * @param {NS} ns The netscript standard library.
 */
export async function main(ns) {
    ns.print(find_path(ns, ns.args[0]))
}