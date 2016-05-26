const express = require("express");

const H = require('./helpers');
const App = require("./app");

let server = express.Router();

server.get("/spellcheck/script/ssrv.cgi",
  H.asMiddleware(H.checkQueryParams("cmd", {
    status: 400, message: "No command given"
  })),
  H.asMiddleware(H.checkQueryParams("run_mode", {
    status: 400, message: "Invalid run mode"
  }, "web_service")),
  H.asMiddleware(H.checkQueryParams("format", {
    status: 400, message: "Invalid format"
  }, "json")),
  H.matchCommand("getbanner", App.getBanner),
  H.matchCommand("get_lang_list", App.getLangList),
  H.matchCommand("check_spelling", App.checkSpelling)
);

server.use(function notFound(req, res, next) {
  next({ status: 404, message: "Not found" });
});

server.use(H.errorHandler);

module.exports = server;

