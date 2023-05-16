// class Queue {
//     constructor() {
//         this.elements = {};
//         this.head = 0;
//         this.tail = 0;
//     }

//     enqueue(element) {
//         this.elements[this.tail] = element;
//         this.tail++;
//     }

//     dequeue() {
//         const item = this.elements[this.head];
//         delete this.elements[this.head];
//         this.head++;
//         return item;
//     }

//     peek() {
//         return this.elements[this.head];
//     }

//     get length() {
//         return this.tail - this.head;
//     }
    
//     get isEmpty() {
//         return this.length === 0;
//     }
// }

// let queue = new Queue()
const port = 1;

export async function main(ns) {
    if (ns.args.includes('master')) {
        await master(ns);
    } else if (ns.args.includes('slave')) {
        await slave(ns);
    } else {
        ns.alert('mode not recognized!')
    }
}

async function master(ns) {
    let portHandle = ns.getPortHandle(port);

    while (true) {
        if (!portHandle.empty()) {
            let item = portHandle.read();
            ns.print(item);
        }
        ns.sleep(1000);
    }
}

async function slave(ns) {
    for (let i = 0; i < 10; i++) {
        while (!ns.tryWritePort(port)) {
            await ns.sleep(1000);
        }        
    }
}