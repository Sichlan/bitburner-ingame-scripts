const nodes = []

export async function main(ns) {
    await find_nodes(ns, 'home')

    while(true) {
        let server = {}
        nodes.forEach(node => {
            server[node] = ns.getServer(node)
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

async function find_nodes(ns, node) {
    var next_nodes = ns.scan(node)

    next_nodes.forEach(element => {
        if (nodes.includes(element))
            return;

        nodes.push(element);
        find_nodes(ns, element);
    });
}