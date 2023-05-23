/** @param {NS} ns */
export async function main(ns) {
    
    // Periodically check if work is available
    // This btw is the only script to ever run with an infinite loop,
    // all others are designed to be run once so the API can issue new calls after each execution.
    while (true) {
        try {
            // Try to reach the API
            const response = await fetch('http://127.0.0.1:5000/worker?worker-name=' + ns.getHostname(), {
                method: 'GET'
            });
            const data = await response.json();

            // If no data was received:
            if (!data)
                throw new Exception('Data contained no data')

            // Expected data structure: {
            //  script: 'path/to/scriptName.js',
            //  parameters: [
            //      'param1',
            //      'param2'
            //  ],
            //  threads: 69
            // }

            if (!data['script']) {
                // data must contain a script name to execute
                throw new Exception('Data contained no script!\n' + data)
            } else if (data['script'] == 'idle') {
                // idle either signifies that no work is available 
                // or that this server is currently scheduled for other work it is already executing
                continue;
            } else if (data['script'] == 'killall') {
                // emergency killer that can terminate all scripts on the host except for this script
                ns.killall(ns.getHostname(), true)
                continue;
            } else {
                if (!ns.fileExists(data['script'])) {
                    ns.wget('https://github.com/Sichlan/bitburner-ingame-scripts/' + data['script'], data['script'])
                }

                // if the run fails, this returns pid 0
                const pid = ns.run(data['script'], (data['threads'] ? data['threads'] : 1), data['parameters'])

                // construct the status to send to the server
                const status = {
                    'script': data['script'],
                    'threads': data['threads'],
                    'parameters': data['parameters'],
                    'started': pid != 0
                }

                // post the status to the API
                const response = await fetch('http://127.0.0.1:5000/worker/start-work?worker-name=' + ns.getHostname(), {
                    method: 'POST',
                    body: JSON.stringify(status)
                });
            }

        } catch (exception) {
            // If API couldn't be reached, do autonomous work
            ns.print('Encountered an error: ' + exception)
        }

        await ns.sleep(1000)
    }
}