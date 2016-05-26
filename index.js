const server = require("./server");

const morgan = require("morgan");
server.use(morgan('combined'));

server.listen(3000, () => {
  console.log("Server started!");
});
