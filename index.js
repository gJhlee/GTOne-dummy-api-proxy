const express = require("express");
const cors = require("cors");
const url = require('url');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const app = express();
app.use("*", cors());
app.use("/cdn", express.static('cdn'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const apiProxy = proxy(config.ORIGIN_HOST, {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
});

const jsonMap = {};
const scriptMap = {};

function registScript (path, func) {
    scriptMap[path] = func;
}

function registJson (apiPath, dataPath) {
    jsonMap[apiPath] = dataPath;
}

app.use("*", (req, res, next) => {
    if (jsonMap[req.originalUrl]) {
        console.log("DUMMY ]", req.originalUrl);
        res.setHeader("Access-Control-Allow-Origin", "*");
        let file = fs.readFileSync(jsonMap[req.originalUrl]);
        let obj = JSON.parse(file);
        res.json({ data: obj })
    } else if (scriptMap[req.originalUrl]) {
        console.log("DUMMY ]", req.originalUrl);
        res.setHeader("Access-Control-Allow-Origin", "*");
        let obj = scriptMap[req.originalUrl](req.body);
        res.json({ data: obj })
    } else {
        if (!config.LOG_ONLY_DUMMY) console.log("ORIGIN]", req.originalUrl);
        apiProxy(req, res, next);
    }
});
function traval (dir) {
    for (let f of fs.readdirSync(dir)) {
        let isScript = /\.js$/.test(f);
        let isJson = /\.json$/.test(f);
        let apiPath = f.replace(/\.(js|json)$/, "").replaceAll(".", "/");

        if (apiPath.charAt(0) !== "/") {
            apiPath = "/" + apiPath;
        }


        if (_.find(config.INGORES, (ignore) => { return apiPath.startsWith(ignore) })) {
            console.log(" * ingore", apiPath)
        } else if (isScript) {
            let func = require(dir + "/" + f).default;
            registScript(apiPath, func);
        } else if (isJson) {
            let filepath = path.resolve(path.join(dir, f));
            registJson(apiPath, filepath);
        }
    }

    let width = 8 + _.max(Object.keys(jsonMap).map((v) => v.length), Object.keys(scriptMap).map((v) => v.length),);
    console.log("+" + "-".repeat(width + 2) + "+")

    console.log("|", "Loaded dummy API".padEnd(width), "|")
    console.log("|" + "-".repeat(width + 2) + "|")
    _.each(_.sortBy(_.keys(jsonMap)), (k) => {
        console.log("| [JSON]", k.padEnd(width - 7), "|");
    })
    _.each(_.sortBy(_.keys(scriptMap)), (k) => {
        console.log("| [ JS ]", k.padEnd(width - 7), "|");
    })
    console.log("+" + "-".repeat(width + 2) + "+\n")

}

traval("./base");

app.listen(config.DUMMY_PORT, () => {
    console.log(` * Dummy API Server started.\n * DummyUrl : http://localhost:${config.DUMMY_PORT}\n * OriginUrl: ${config.ORIGIN_HOST}\n`);
});
