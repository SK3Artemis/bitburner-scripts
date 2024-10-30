/**
 * Free NetScript!
 */
export class FNS {
  /** @param {NS} ns */
  constructor(ns, path="ns.") {
    return new Proxy(this, {
      get: function (target, property) {
        property = property.replace("$", "");

        let cost = NaN;
        try {
          cost = ns.getFunctionRamCost(path.slice(3) + property);
        } catch (e) {
          if (!(e.message && e.message.endsWith("invalid type"))) {
            if (typeof e === "string") {
              throw new Error(e);
            } else {
              throw e;
            }
          }
        }

        if (cost >= 0) { // this is a valid ns function
          return async (...args) => {
            return await runGhostScript(ns, path + property, args);
          }
        } else { // this is a valid ns object
          return new FNS(ns, path + property + ".");
        }
      }
    });
  }
}

/** @param {NS} ns */
async function runGhostScript(ns, func, args) {
  const expr = `${func}(${args.map(a => JSON.stringify(a))})`
  
  const resultPid = ns.run("fns/fns.js", {ramOverride: 1.6 + ns.getFunctionRamCost(func.slice(3))}, expr);
  if (resultPid === 0) {
    throw new Error("Unable to run ghost script!");
  } else {
    await ns.getPortHandle(resultPid).nextWrite();
  }
  
  const result = JSON.parse(ns.readPort(resultPid));
  if (typeof result === "number") {
    return result;
  } else if (result.error === null) {
    return JSON.parse(result.result);
  } else {
    const error = new Error("An error was thrown when handling a ghost script!");
    error.stack += "\n" + result.error.stack;
    throw error;
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const expr = ns.args[0];

  let result = null, error = null;
  try {
    result = await eval(expr);
  } catch (e) {
    error = JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e)));
  }

  ns.atExit(() => {
    if (typeof result === "number") {
      ns.writePort(ns.pid, result);
    } else {
      ns.writePort(ns.pid, JSON.stringify({result: JSON.stringify(result), error: error}));
    }
  })
}
