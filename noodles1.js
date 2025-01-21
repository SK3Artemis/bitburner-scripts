function makeWayToNoodleBar() {
  let doc = eval('document');
  const mainGameButtons = doc.getElementsByClassName('MuiButtonBase-root');
  for (const button of mainGameButtons) { if (button.outerText === 'Travel') { button.click(); break; } }
  doc = eval('document');
  const travelPageSpans = doc.getElementsByTagName("SPAN")
  for (const span of travelPageSpans) { if (span.outerText === 'N') { span.click(); break; } }
  for (const button of mainGameButtons) { if (button.outerText === 'City') { button.click(); break; } }
  doc = eval('document');
  const newTokyoCityPageSpans = doc.getElementsByTagName("SPAN")
  for (const span of newTokyoCityPageSpans) { if (span.ariaLabel === "Noodle Bar") { span.click(); break; } }
}

function isNoodlesButton(){
  const doc = eval('document');
  const buttonsByTagName = doc.getElementsByClassName('MuiButtonBase-root');
  for (const button of buttonsByTagName) { 
    if (button.textContent === 'Eat noodles') { return true; }
  }
  return false;
}

function eatNoodles() {
  const doc = eval('document');
  const buttonsByTagName = doc.getElementsByClassName('MuiButtonBase-root');
  for (const button of buttonsByTagName) { 
    if (button.textContent === 'Eat noodles') { button.click(); return; }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  ns.tail();
  makeWayToNoodleBar();
  const startTime = Date.now();
  let lastSleep = startTime;
  let lastFocus = startTime;
  let fundsHistory = [];
  while (true) {
    if (isNoodlesButton()){
      eatNoodles(ns);
      if (Date.now() > lastSleep + 100) { // every 100ms...
        await ns.asleep(0);
        lastSleep = Date.now();
      }
      if (Date.now() > lastFocus + (1000 * 60 * 60)) { // every hour...
        makeWayToNoodleBar();
        await ns.asleep(0);
        lastFocus = Date.now();
      }
    } else {
      await ns.asleep(1000);
    }
  }
}
