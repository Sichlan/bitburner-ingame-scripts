import { find_nodes } from "/util/network-util.js"

/**
 * Starts a background thread that automatically checks all network nodes if they can be nuked.
 * @param {NS} ns The netscript standard library.
 */
export async function main(ns) {
    ns.disableLog('getServer')
    ns.disableLog('getServerNumPortsRequired')
    ns.disableLog('getServerRequiredHackingLevel')
    ns.disableLog('getHackingLevel')
    ns.disableLog('getServerMaxRam')
    ns.disableLog('getServerUsedRam')

    const portOpenerMap = [
        [`BruteSSH.exe`, `sshPortOpen`, ns.brutessh],
        [`FTPCrack.exe`, `ftpPortOpen`, ns.ftpcrack],
        [`relaySMTP.exe`, `smtpPortOpen`, ns.relaysmtp],
        [`HTTPWorm.exe`, `httpPortOpen`, ns.httpworm],
        [`SQLInject.exe`, `sqlPortOpen`, ns.sqlinject],
    ]

    while (true) {
        const nodes = await find_nodes(ns, 'home', [])

        const player_level = ns.getHackingLevel()

        nodes.forEach(target => {
            let serverObject = ns.getServer(target);
            let openPorts = serverObject.openPortCount;
            let requiredPorts = ns.getServerNumPortsRequired(target)

            ns.print('[LOG]: Inspecting server ' + target);

            if (openPorts == null)
                openPorts = 0;

            if (!ns.hasRootAccess(target)) {
                let server_level = ns.getServerRequiredHackingLevel(target)
                if (server_level > player_level) {
                    ns.print('[LOG]: - Skipping server ' + target + ' (Level insufficient: ' + player_level + '/' + server_level + ')');
                    return;
                }


                for (const line of portOpenerMap) {
                    let program = line[0]
                    let property = line[1]
                    let fun = line[2]

                    if (openPorts >= requiredPorts) {
                        ns.print('[LOG]: - Enough ports opened.')
                        break;
                    }

                    if (!serverObject[property] && ns.fileExists(program, 'home')) {
                        fun(target)
                        ns.print('[LOG]: - Executing ' + program);
                        ++openPorts;
                    }
                }
            }

            if (!ns.hasRootAccess(target)) {
                ns.print('[LOG]: - Ports open: ' + openPorts);
                ns.print('[LOG]: - Ports required: ' + requiredPorts);

                if (openPorts >= requiredPorts) {
                    ns.print('[LOG]: - Enough ports open. Attempting nuke');
                    ns.nuke(target);
                    ns.alert('INFO Gained Access to ' + target);
                }
                
                if (ns.hasRootAccess(target) 
                    && serverObject.purchasedByPlayer == false
                    && ns.getServerRequiredHackingLevel(target) <= ns.getHackingLevel()) {
                    const scriptName = 'early-hack-template.js'
                    ns.killall(target)
                    let threads = Math.floor((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam(scriptName));

                    if (threads > 0) {
                        ns.scp(scriptName, target)
                        ns.exec(scriptName, target, threads, target)
                    }
                } else if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
                    ns.print('[ERR]: - Cannot run auto hacker on ' + target + ' due to insufficient skill!');
                }
            }
        })
        
        await ns.sleep(1000)
    }
}