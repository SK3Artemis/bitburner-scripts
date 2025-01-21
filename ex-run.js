/** @param {NS} ns */
export async function main(ns) {
// Exploit to enter and run the command on the terminal, must be on the terminal tab to work
try {
    const terminalInput = eval('document').getElementById("terminal-input");
    terminalInput.value = "nano ex-run.js"; // whatever command you want to run here
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({ target: terminalInput });
    terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
}
catch { }
}
