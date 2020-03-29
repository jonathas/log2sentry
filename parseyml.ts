/* eslint-disable */
const fs = require("fs");
const yaml = require("js-yaml");

const packaged = yaml.safeLoad(fs.readFileSync("./packaged.yaml", "utf8"));

console.log(packaged.Resources.Log2Sentry.Properties.CodeUri.split("/").pop());
