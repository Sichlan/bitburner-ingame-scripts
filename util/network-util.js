/**
 * Recursively finds all nodes connected to the specified node.
 * @param {NS} ns The netscript standard library.
 * @param {string} node The node from which to start the search.
 * @param {string[]} nodes The list of nodes already discovered.
 * @returns A list of node names
 */
async function find_nodes(ns, node, nodes = null) {
    if (nodes == null)
        nodes = [];

    var next_nodes = ns.scan(node);

    next_nodes.forEach(element => {
        if (nodes.includes(element) === true)
            return;

        nodes.push(element);
        ns.print('[LOG] Added element ' + element);
        find_nodes(ns, element, nodes);
    });

    return nodes;
}

/**
 * Finds the path from the target server to the home machine.
 * @param {NS} ns The netscript standard library.
 * @param {string} target The name of the target.
 * @returns An array containing the path from the target to home.
 */
function find_path(ns, target) {
    let nestArr = [];
    nestArr.push(target);

    while (nestArr[nestArr.length - 1] != 'home') {
        nestArr.push(ns.scan(nestArr[nestArr.length - 1])[0]);
    }
    nestArr = nestArr.reverse();

    return nestArr;
}

export { find_nodes }