function getKeys(e, t) {
    if (null != e)
        if (e.constructor === [].constructor) for (let n of e) "object" == typeof n && getKeys(n, t);
        else {
            if (e.constructor !== {}.constructor) throw "Error : Wrong JSON format";
            for (let n of Object.keys(e)) "object" == typeof e[n] && ((void 0 !== t[n] && "" !== t[n]) || (t[n] = {}), getKeys(e[n], t[n])), (t[n] = ("{}" === JSON.stringify(t[n]) ? "" : t[n]) || "");
        }
}

function jsonKeys2Array(e, t, n) {
    n = 0 === n.length ? [0, 0] : n;
    let r = Object.keys(e);
    for (let o = 0; o < r.length; o++) (t[n[0]] = t[n[0]] || []), (t[n[0]][n[1]] = r[o]), e[r[o]].constructor === {}.constructor && (n[0]++, jsonKeys2Array(e[r[o]], t, n)), n[1]++;
    n[1]--;
}

function generateRows(e, t, n, r) {
    let o = (r = 0 === r.length ? [0, 0] : r)[0],
        l = r[1];
    if (null == e) generateRows(t, t, n, r);
    else if (e.constructor === [].constructor) {
        for (let o of e) (r[1] = l), generateRows(o, t, n, r), r[0]++;
        r[0]--;
    } else if (e.constructor === {}.constructor)
        for (let l of Object.keys(t)) (e[l] ||= t[l]), (n[r[0]] ||= []), e[l].constructor === [].constructor || e[l].constructor === {}.constructor ? ((r[0] = o), generateRows(e[l], t[l], n, r)) : (n[r[0]][r[1]++] = e[l]);
    else (n[r[0]] ||= []), (n[r[0]][r[1]++] = e);
}

function generateTable(e) {
    if (null == e || 0 === e.length) throw "No data input";
    let t = document.createElement("table");
    t.setAttribute("class", "table table-light table-striped table-bordered justify-content-center");
    let n = t.createTHead(),
        r = [[]],
        o = {};
    getKeys(e, o), jsonKeys2Array(o, r, []);
    let l = 0;
    r.forEach((e) => (l = Math.max(l, e.length)));
    for (let e = 0; e < r.length; e++) {
        let t = n.insertRow(-1),
            o = document.createElement("th"),
            c = !1;
        for (let n = 0; n < l; n++)
            "" !== r[e][n] && void 0 !== r[e][n]
                ? ((c = !0), (o = document.createElement("th")), (o.innerHTML = r[e][n]), r.length === e + 1 || ("" !== r[e + 1][n] && void 0 !== r[e + 1][n]) || o.setAttribute("rowspan", "" + r.length - e))
                : e + 1 === r.length || (0 != e && "" !== r[e - 1][n] && void 0 !== r[e - 1][n]) || o.setAttribute("colspan", "" + ((+o.getAttribute("colspan") || 1) + 1)),
                "" !== r[e][n + 1] && void 0 !== r[e][n + 1] && c && t.appendChild(o.cloneNode(!0));
        t.appendChild(o.cloneNode(!0));
    }
    let c = [];
    if ((generateRows(e, o, c, []), c === [])) throw "No data output";
    let s = t.createTBody();
    (l = 0), r.forEach((e) => (l = Math.max(l, e.length)));
    for (let e = 0; e < c.length; e++) {
        let t = s.insertRow(-1);
        for (let n = 0; n < l; n++) {
            let r = t.insertCell(-1);
            if (((r.innerHTML = c[e][n] || ""), r.innerText.endsWith(".jpg") || r.innerText.endsWith(".png"))) {
                let t = document.createElement("img");
                t.setAttribute("src", c[e][n]), (t.style.width = "200px"), (r.innerHTML = ""), r.appendChild(t);
            } else r.innerText.length > 10 && (r.style.minWidth = 25 * Math.ceil(r.innerText.length / 25) + "px");
        }
    }
    return t;
}

function runOnclickFromURL(e) {
    url = e.parentElement.querySelector("input").value;
    let t = document.querySelector(".json-result");
    t.innerHTML = "";
    fetch(url, { method: "GET", redirect: "follow" })
        .then((e) => e.text())
        .then((e) => t.appendChild(generateTable(JSON.parse(e))))
        .catch((e) => { });
}

function runOnclickFromComputer(e) {
    let t = "",
        n = new FileReader();
    n.readAsDataURL(e.parentElement.querySelector("input").files[0]),
        (n.onloadend = function (e) {
            t = e.target.result;
            let n = document.querySelector(".json-result");
            (n.innerHTML = ""),
                fetch(t)
                    .then((e) => e.text())
                    .then((e) => n.appendChild(generateTable(JSON.parse(e))))
                    .catch((e) => { });
        });
}

document.querySelectorAll("#myTab>li>button").forEach((e,t)=>e.onclick=function(){this.parentElement.parentElement.querySelectorAll("#myTab>li>button").forEach(e=>e.classList.remove("active")),this.classList.add("active"),document.querySelectorAll("#myTabContent>div").forEach((e,l)=>{t===l?e.classList.remove("d-none"):e.classList.add("d-none")})});