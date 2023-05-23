import { find_nodes } from '/util/network-util.js'

/** @param {NS} ns */
export async function main(ns) {
    while(true) {
        let server = {}

        const nodes = await find_nodes(ns, 'home', []);

        nodes.forEach(node => {
            try {
                let s = ns.getServer(node)
                server[node] = s
                server[node].files = ns.ls(node)
                server[node].adjacent = ns.scan(node)
                server[node].worker_running = ns.scriptRunning('/api/work-receiver.js', node)
            } catch (exception) {
                ns.print('[ERR]: Skipped server ' + node + ': exception ' + exception)
            }            
        })

        try {
            var response = await fetch('http://127.0.0.1:5000/server', {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(server)
            })
        } catch (exception) {
            ns.tprint('Server unreachable')
        }

        // ns.tprint('Sent server data. Status: ' + response.status)

        await ns.sleep(1000)
    }
}