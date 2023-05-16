
export async function main(ns) {
    try {
        const response = await fetch('http://127.0.0.1:5000/test')
        const data = await response.json()
        ns.tprint('Got response: ' + data.result.message)
    } catch (error) {
        ns.tprint('Encountered an error: ' + error)
    }
}