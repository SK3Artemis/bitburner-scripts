/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("asleep");
    const svgEl = render(template);
    logHTML(ns, svgEl);

    await ns.asleep(1000);
    for (let i=0; i < 100; i++) {
        await ns.asleep(100);
        setValues(svgEl, {circ: Math.random()*100});
        svgEl.appendChild(render(`
            <rect x="-400" width="100%" height="100%" fill="gray">
        `))
    }
    await ns.asleep(60*1000);
}

const template = `
<svg version="1.1"
     width="300" height="200"
     xmlns="http://www.w3.org/2000/svg">

  <rect width="100%" height="100%" fill="red" />

  <circle name="circ" data-target="r" cx="150" cy="100" r="80" fill="green" />

  <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>

</svg>
`;

const template2 = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="10" height="800" style="width:800" viewBox="-400 0 800 800"><rect x="-400" width="100%" height="100%" fill="gray"></rect><rect x="-2884.8020703125" y="4" width="182.3993104452544" height="2" fill="lightgreen"></rect><rect x="-3206.080546875" y="8" width="583.6777934248142" height="2" fill="cyan"></rect><rect x="-3272" y="12" width="729.5972417810176" height="2" fill="yellow"></rect><rect x="-2371.95130859375" y="16" width="182.11652081665713" height="2" fill="lightgreen"></rect><rect x="-2692.60765625" y="20" width="582.772866613303" height="2" fill="cyan"></rect><rect x="-2758.300859375" y="24" width="728.4660832666285" height="2" fill="yellow"></rect><rect x="-1859.38333984375" y="28" width="182.11652081665713" height="2" fill="lightgreen"></rect><rect x="-2180.0396875" y="32" width="582.772866613303" height="2" fill="cyan"></rect><rect x="-2245.732890625" y="36" width="728.4660832666285" height="2" fill="yellow"></rect><rect x="-1346.81537109375" y="40" width="182.11652081665713" height="2" fill="lightgreen"></rect><rect x="-1667.47171875" y="44" width="582.772866613303" height="2" fill="cyan"></rect><rect x="-1733.164921875" y="48" width="728.4660832666285" height="2" fill="yellow"></rect><rect x="-834.24740234375" y="52" width="182.11652081665713" height="2" fill="lightgreen"></rect><rect x="-1154.90375" y="56" width="582.772866613303" height="2" fill="cyan"></rect><rect x="-1220.596953125" y="60" width="728.4660832666285" height="2" fill="yellow"></rect><rect x="-321.39751953125" y="64" width="181.8346066977459" height="2" fill="lightgreen"></rect><rect x="-641.43365234375" y="68" width="581.8707414327869" height="2" fill="cyan"></rect><rect x="-706.901328125" y="72" width="727.3384267909836" height="2" fill="yellow"></rect><rect x="191.17044921875" y="76" width="181.8346066977459" height="2" fill="lightgreen"></rect><rect x="-128.86568359375" y="80" width="581.8707414327869" height="2" fill="cyan"></rect><rect x="-194.333359375" y="84" width="727.3384267909836" height="2" fill="yellow"></rect></svg>`;

export function logHTML(ns, el) {
    ns.tail();
    const doc = eval('document');
    const command = ns.getScriptName() + ' ' + ns.args.join(' ');
    const logEl = doc.querySelector(`[title="${command}"]`).parentElement.nextElementSibling.querySelector('span');
    logEl.appendChild(el);
}

export function render(template='', globals, locals) {
    const context = Object.assign({}, globals, locals);

    const doc = eval('document');
    const container = doc.createElement('div');
    const html = template.innerHTML || template;
    container.innerHTML = html.trim();
    const el = container.firstChild;

    setValues(el, context);

    return el;
}

function setValues(el, context) {
    Object.keys(context).forEach(function(name){
        const value = context[name];
        const selector = '[name="'+name+'"]'; // e.g.: [name="team1_color"]
        for (const item of el.querySelectorAll(selector)) {
            setValue(item, value);
        }
        if (el.matches(selector)) {
            setValue(el, value);
        }
    });
}

function setValue(el, value) {
    // TODO: consider supporting 'data-index' for compound values
    var target = el.getAttribute('data-target') || 'value';
    if (target == 'value') {
        // when no 'data-target' is given, set the 'value' which varies by tag
        if (el.tagName == 'INPUT') {
            if (el.type == 'checkbox') {
                el.checked = !!value;
            }
            else {
                el.value = value;
            }
        }
        else {
            if ('textContent' in el) {
                el.textContent = value;
            }
            else {
                el.innerText = value; // IE8 support
            }
        }
    }
    else {
        var parts = target.split('.');
        if (parts.length == 1) {
            // when some 'data-target' is given, set that attribute
            // e.g.: <name="banner_size" data-target="width"> would run
            //       el.width = value;
            el.setAttribute(target, value);
        }
        else {
            // but if 'data-target' has more than one part, drill down to set it
            // e.g.: <name="banner_size" data-target="style.width"> would run
            //       el.style.width = value;
            var cursor = el;
            while (parts.length > 1) {
                cursor = cursor[parts.shift()];
            }
            cursor[parts[0]] = value;
        }
    }
}
