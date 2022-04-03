const child_process = require('child_process');

console.log('start')

child_process.exec(`${__dirname}/runner.but`, function(error, stdout, stderr) {
  console.log('runner')
  console.log(`${__dirname}/runner.but`);
  console.log(error);
  console.log(stdout);
  // console.log(stderr);
});
