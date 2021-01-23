const DEBUG_MODE = process.env.DEBUG_MODE || true;

const debug = () => {
  return {
    log: (args) => DEBUG_MODE && console.log(...args),
  };
};

module.exports = debug;
