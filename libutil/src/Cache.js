var sharedConfig;

function setConfig(cfg) {
  sharedConfig = cfg;
}

function getConfig() {
  return sharedConfig;
}

module.exports = {
  setConfig: setConfig,
  getConfig: getConfig
};