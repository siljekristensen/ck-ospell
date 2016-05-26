const path = require("path");
const express = require("express");
const morgan = require("morgan");

const server = express();

server.use(morgan('combined'));

server.use("/spellcheck/lf/scayt3/ckscayt",
  express.static(path.join(__dirname, "public"))
);

server.use("/ckeditor",
  express.static(path.join(__dirname, "node_modules/ckeditor"))
);

server.use(express.static(
  path.join(__dirname, "client"),
  { index: ["index.html"] })
);

const routes = require("./server");
server.use(routes);

server.listen(3000, () => {
  console.log("Server started!");
});
