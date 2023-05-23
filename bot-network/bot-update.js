/** 
 * Updates the bot script for each bot.
 * @param {NS} ns 
 */
export async function main(ns) {
	let victim = ns.args[0];
	const botScript = 'bot-script.js';
    const path = '/bot-network/' + botScript;

	if (!ns.hasRootAccess(victim)) {
		ns.alert('No root access to ' + victim);
		return;
	}

	for (let i = 0; i < 25; i++) {
		let target = 'pserv-' + i;

		ns.scriptKill(botScript, target);
        ns.killall(target)
		ns.scp(path, target, 'home');

		let threads = Math.floor((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam(path));
		ns.exec(path, target, threads, victim);
	}
}