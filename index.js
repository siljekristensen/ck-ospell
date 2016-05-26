const path = require("path");
const express = require("express");
const morgan = require("morgan");

const server = express();

server.use(morgan('combined'));

server.use("/spellcheck/lf/scayt3/ckscayt",
  express.static(path.join(__dirname, "public"))
);

const routes = require("./server");
server.use(routes);

server.listen(3000, () => {
  console.log("Server started!");
});
