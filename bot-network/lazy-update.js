import { find_nodes } from "/util/network-util.js";

/** @param {NS} ns */
export async function main(ns) {
    const nodes = await find_nodes(ns, 'home', []);

	const player_level = ns.getHackingLevel();
	const threshold = 5;
    const servers = [];

    nodes.forEach(node => {
            servers.push(ns.getServer(node))
        });

    ns.print(servers);
    const filteredNodes = servers.filter(node => node.purchasedByPlayer === false
                                    && node.hasAdminRights
									&& player_level / 2 >= (node.requiredHackingSkill + threshold));
    ns.print(filteredNodes);
	const toAttack = filteredNodes.reduce((prev, current) => prev.moneyMax > current.moneyMax ? prev : current);
    ns.print(toAttack);

	ns.run('bot-network/bot-update.js', 1, toAttack.hostname)
}