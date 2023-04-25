// MRFM Model Railroad File Manager
// This is a Hapi application that stores files on the server (POST). The images stored on
// the server are also available for reterival (GET).

const Hapi = require("@hapi/hapi");
const fs = require("fs");
const Path = require("path");
const Inert = require("@hapi/inert");

const init = async () => {
  const server = Hapi.server({
    port: process.env.MRFM_TCP_PORT,
    host: process.env.MRFM_TCP_ADDR,
    routes: {
      cors: true,
    },
  });

  await server.register(require("@hapi/inert"));

  server.route({
    method: "GET",
    path: "/{path*}",
    handler: {
      directory: {
        path: __dirname + "/uploads/"
      }
    },
  });
  server.route({
    method: "POST",
    path: "/uploadimg",
    options: {
      payload: {
        maxBytes: 209715200,
        output: "file",
        parse: true,
        multipart: true,
        uploads: "./src/tmp",
      },
    },
    handler: async (request, h) => {
      let data = request.payload;
      if (data.file) {
        let name = data.file.filename;
        let file = data.file;
        let path = file.path;
        let newPath = path.slice(path.indexOf("tmp") - 1, path.length);
        fs.rename(
          __dirname + newPath,
          __dirname + "/uploads/" + name,
          function (err) {
            if (err) {
              throw err;
            } else {
              console.log("File Renamed.");
            }
          }
        );
        return "File uploaded successfully";
      } else {
        return "No file uploaded";
      }
    },
  });
  await server.start();
  console.log("MRFM v2.0.5, Started")
  console.log("MRFM running on %s", server.info.uri);
};
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
