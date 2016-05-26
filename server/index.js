const express = require("express");

const H = require('./helpers');
const App = require("./app");

let server = express.Router();

server.get(new RegExp("/spellcheck(31|)/script/ssrv.cgi"),
  H.asMiddleware(H.checkQueryParams("cmd", {
    status: 400, message: "No command given",
  })),
  H.asMiddleware(H.checkQueryParams("run_mode", {
    status: 400, message: "Invalid `run mode` param",
  }, "web_service")),
  // H.asMiddleware(H.checkQueryParams("format", {
  //   status: 400, message: "Invalid `format` param"
  // }, "json")),
  H.matchCommand("getbanner", App.getBanner),
  H.matchCommand("get_lang_list", App.getLangList),
  H.matchCommand("check_spelling", App.checkSpelling)
);

server.use(function notFound(req, res, next) {
  next({ status: 404, message: "Not found" });
});

server.use(H.errorHandler);

module.exports = server;

