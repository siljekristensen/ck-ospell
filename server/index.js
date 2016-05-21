const path = require("path");
const express = require("express");
const morgan = require("morgan");

const App = require("./app");

/**
 * Check Query Params
 *
 * @param {string} paramName
 * @param {{code: number, error: string}}} error
 * @param {string} [value]
 * @return {express.RequestHandler}
 */
function checkQueryParams(paramName, error, value) {
  return (req, res, next) => {
    const param = req.query[paramName];
    const valid = value ? param === value : param;

    if (valid) {
      return next(null);
    }
    return res.send(error.code).send(error);
  };
}

/**
 * Match Command
 *
 * @param {string} cmd
 * @param {express.RequestHandler} fn
 * @return {express.RequestHandler}
 */
function matchCommand(cmd, fn) {
  return (req, res, next) => {
    if (req.query.cmd === cmd) {
      return fn(req, res, next);
    }
    return next(null);
  };
}

let server = express();

server.use(morgan('combined'));

server.use("/spellcheck/lf/scayt3/ckscayt",
  express.static(path.join(__dirname, "../public"))
);

server.get("/spellcheck/script/ssrv.cgi",
  checkQueryParams("cmd", { code: 400, error: "No command given" }),
  checkQueryParams("run_mode", { code: 400, error: "Invalid run mode" }, "web_service"),
  checkQueryParams("format", { code: 400, error: "Invalid format" }, "json"),
  matchCommand("getbanner", App.getBanner),
  matchCommand("get_lang_list", App.getLangList),
  matchCommand("check_spelling", App.checkSpelling)
);

server.listen(3000, () => {
  console.log("Server started!");
});
