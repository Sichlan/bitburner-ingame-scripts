const nodes = []


export async function main(ns) {
    await find_nodes(ns, 'home')
    ns.disableLog('getServer')
    ns.disableLog('getServerNumPortsRequired')
    ns.disableLog('getServerMaxRam')
    ns.disableLog('getServerUsedRam')

    const portOpenerMap = [
        [`BruteSSH.exe`, `sshPortOpen`, ns.brutessh],
        [`FTPCrack.exe`, `ftpPortOpen`, ns.ftpcrack],
        [`relaySMTP.exe`, `smtpPortOpen`, ns.relaysmtp],
        [`HTTPWorm.exe`, `httpPortOpen`, ns.httpworm],
        [`SQLInject.exe`, `sqlPortOpen`, ns.sqlinject],
    ]

    nodes.forEach(target => {
        let serverObject = ns.getServer(target);
        let openPorts = serverObject.openPortCount;
        let requiredPorts = ns.getServerNumPortsRequired(target)

        if (openPorts == null)
            openPorts = 0;

        if (!ns.hasRootAccess(target)) {

            // if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
            //     ns.print('[LOG]: Skipping server ' + target + ' (Level insufficient)');
            //     return;
            // }


            for (const line of portOpenerMap) {
                let program = line[0]
                let property = line[1]
                let fun = line[2]

                if (openPorts >= requiredPorts)
                    return;

                if (!serverObject[property] && ns.fileExists(program, 'home')) {
                    fun(target)
                    ++openPorts;
                }
            }
        }

        if (!ns.hasRootAccess(target)) {
            ns.print('[LOG]: Ports open: ' + openPorts)
            ns.print('[LOG]: Ports required: ' + requiredPorts)
            ns.nuke(target)
        }

        if (ns.hasRootAccess(target) && serverObject.purchasedByPlayer == false) {
            const scriptName = 'early-hack-template.js'
            ns.killall(target)
            let threads = Math.floor((ns.getServerMaxRam(target) - ns.getServerUsedRam(target)) / ns.getScriptRam(scriptName));

            if (threads > 0) {
                ns.scp(scriptName, target)
                ns.exec(scriptName, target, threads, target)
            }
        }
    })
}

async function find_nodes(ns, node) {
    var next_nodes = ns.scan(node)

    next_nodes.forEach(element => {
        if (nodes.includes(element))
            return;

        nodes.push(element);
        find_nodes(ns, element);
    });
}