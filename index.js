const express = require("express");
const cors = require("cors");
const url = require('url');
const proxy = require('express-http-proxy');
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const app = express();
app.use("*", cors());
app.use("/cdn", express.static('cdn'));

const apiProxy = proxy(config.ORIGIN_HOST, {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
});

const fmap = {};

function registApi (apiPath, dataPath) {
    if (apiPath.charAt(0) !== "/") {
        apiPath = "/" + apiPath;
    }
    fmap[apiPath] = dataPath;
}

app.use("*", (req, res, next) => {
    if (fmap[req.originalUrl]) {
        console.log("DUMMY ]", req.originalUrl);
        res.setHeader("Access-Control-Allow-Origin", "*");
        let file = fs.readFileSync(fmap[req.originalUrl]);
        let obj = JSON.parse(file);
        res.json({ data: obj })
    } else {
        console.log("ORIGIN]", req.originalUrl);
        apiProxy(req, res, next);
    }
});
function traval (dir) {
    for (let f of fs.readdirSync(dir)) {
        let apiPath = f.replace(/\.json$/, "").replaceAll(".", "/");
        let fp = path.resolve(path.join(dir, f));
        registApi(apiPath, fp);
    }

    let x = _.max(Object.keys(fmap).map((v) => v.length));
    console.log("+" + "-".repeat(x + 2) + "+")

    console.log("|", "Loaded dummy API".padEnd(x), "|")
    console.log("|" + "-".repeat(x + 2) + "|")
    _.each(_.sortBy(_.keys(fmap)), (k) => {
        console.log("|", k.padEnd(x), "|");
    })
    console.log("+" + "-".repeat(x + 2) + "+\n")

}

traval("./base");

app.listen(config.DUMMY_PORT, () => {
    console.log(` * Dummy API Server started.\n * DummyUrl : http://localhost:${config.DUMMY_PORT}\n * OriginUrl: ${config.ORIGIN_HOST}\n`);
});
