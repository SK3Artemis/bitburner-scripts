/** @param {NS} ns */
export async function main(ns) {
  const chunk = webpackChunkbitburner;
  if (!chunk.some(m => m.some(i => i[0] == -1))) {
    let requireCache;
    chunk.push([[-1], {}, r => (requireCache = requireCache ?? r, requireCache)]);
  }
  return chunk.find(m => m.some(i => i[0] == -1))[2]();
}
