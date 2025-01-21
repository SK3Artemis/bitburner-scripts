// run 1000 scripts at once Achievement
export async function main(ns) {
    let script = "export async function main(ns) { while(true){ await ns.sleep(100000); } }";
    let pids = [];
    for (let i = 0; i < 1000; i++) {
        await ns.write(`/k/script${i}.js`, script, "w");
        pids.push(ns.run(`/k/script${i}.js`));
    }
    await ns.sleep(2*60*1000);
    for (let i = 0; i < 1000; i++) {
        ns.kill(pids[i]);
        ns.rm(`/k/script${i}.js`);
    }
}
