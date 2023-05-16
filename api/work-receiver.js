export async function main(ns) {
    
    // Periodically check if work is available
    // This btw is the only script to ever run with an infinite loop,
    // all others are designed to be run once so the API can issue new calls after each execution.
    while (true) {
        try {
            // Try to reach the API
            const response = await fetch('http://127.0.0.1:5000/worker?worker-name=' + ns.getHostName(), {
                method: 'GET'
            });
            const data = await response.json();

            // If no data was received:
            if (!data)
                throw new Exception('Data contained no data')

            // Expected data structure: {
            //  script: 'scriptName.js',
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
                ns.killall(ns,getHostName(), true)
                continue;
            } else {
                if (!ns.fileExists(data['script'])) {
                    ns.wget()
                }

                ns.run()
            }

        } catch (exception) {
            // If API couldn't be reached, do autonomous work
            ns.tprint('Encountered an error: ' + error)
        }

        await ns.sleep(1000)
    }
}