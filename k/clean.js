// delete these 1000 scripts if they remain....
export async function main(ns) {
    let pids = [];
    for (let i = 0; i < 1000; i++) {
        ns.kill(pids[i]);
        ns.rm(`/k/script${i}.js`);
    }
}
