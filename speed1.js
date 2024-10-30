/** @param {NS} ns */
export async function main(ns) {
    let win = eval("window");
    win.st = win.setTimeout;
    win.si = win.setInterval;
    win.setTimeout = (a, b) => win.st(a, 1);
    win.setInterval = (a, b) => win.si(a, 1);
    ns.atExit(() => {win.setTimeout = win.st; win.setInterval = win.si;});
    while (true) {await ns.sleep(1000);}
}
