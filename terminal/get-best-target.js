import { find_nodes } from "/util/network-util.js";

/** @param {NS} ns */
export async function main(ns) {
	const nodes = await find_nodes(ns, 'home', [])
    const hack_threshold = ns.getHackingLevel()

	let target = null;

	nodes.forEach(node => {
		let serverObject = ns.getServer(node);
        ns.print('INFO  Inspecting ' + serverObject.hostname + '\t' + serverObject.hackDifficulty + '\t' + serverObject.moneyMax)
		
		if (serverObject.hasAdminRights === false) {
            ns.print('WARN  Skipping ' + serverObject.hostname + ' because of invalid rights.')
			return;
        }

		if (serverObject.hackDifficulty > hack_threshold) {
            ns.print('WARN  Skipping ' + serverObject.hostname + ' because of difficulty ' + serverObject.hackDifficulty + ' exceeds threshold ' + hack_threshold + '.')
            return;
        }

        if (target == null) {
            target = serverObject;
        } else if (serverObject.moneyMax > target.moneyMax) {
            target = serverObject;
        } else {
            ns.print('DEBG  target: ' + target.moneyMax + ' > node: ' + serverObject.moneyMax)
        }
	});

    ns.tprint('INFO Best target: ' + target.hostname);
}