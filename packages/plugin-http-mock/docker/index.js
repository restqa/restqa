const fs = require("fs");
const YAML = require("yaml");
const glob = require("glob");
const path = require("path");
const {Stubby} = require("stubby");

const { STUB_VARS } = process.env
const envs = (STUB_VARS && JSON.parse(STUB_VARS)) || {}

const options = {
  quiet: false,
  folder: path.resolve(__dirname, 'data'),
  envs,
  key: fs.readFileSync(path.resolve(__dirname, 'key.pem')).toString(),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')).toString(),
  data: []
}

for (const [, folder] of Object.entries(options.envs)) {
  const files = glob.sync(`${options.folder}/${folder}/**/*.+(yaml|yml)`);
  files.reduce((stubs, file) => {
    const stub = getStub(folder, file);
    stubs.push(stub);
    return stubs;
  }, options.data);
}

const server = new Stubby();
server.start(options);

function getStub(folder, file) {
  const content = fs.readFileSync(file).toString("utf-8");
  const stub = YAML.parse(content);
  stub.request.url = "/" + folder + stub.request.url;
  return stub;
}

