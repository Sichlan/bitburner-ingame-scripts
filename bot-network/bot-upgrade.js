/** 
 * Upgrades all bots to the desired ram value
 * @param {NS} ns 
 */
export async function main(ns, args) {
	let newRam = 128; //ns.getPurchasedServerMaxRam();

	for (let i = 0; i < 25; i++) {
		let target = 'pserv-' + i;
        
        if (ns.getServerMaxRam(target) < newRam) {
            let upgradeMoney = ns.getPurchasedServerUpgradeCost(target, newRam);

            while (ns.getServerMoneyAvailable('home') < upgradeMoney) {
                await ns.sleep(1000);
            }

            ns.upgradePurchasedServer(target, newRam);
        }

		ns.print('[LOG]: Server ' + target + ' now has ' + newRam)
	}
}