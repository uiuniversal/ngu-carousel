// This script is used as a runtime input for the Nx cache.
const os = require('os');
// Things like the version of NodeJS, whether we are running Windows or not, can affect
// the results of the computation but cannot be deduced statically.
console.log(os.type());
