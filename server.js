"use strict";

const path = require("path");
const express = require("express");
const morgan = require("morgan");

const server = express();

server.use(morgan('combined'));

server.use("/spellcheck/lf/giella3/ckgiella",
  express.static(path.join(__dirname, "public"))
);

server.use("/ckeditor",
  express.static(path.join(__dirname, "node_modules/ckeditor"))
);

server.use(express.static(
  path.join(__dirname, "client"),
  { index: ["index.html"] })
);

const routes = require("./server/index");
server.use(routes);

server.listen(3000, () => {
  process.stdout.write("Server started!");
});
