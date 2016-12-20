const exec = require('child_process').exec;
const path = require('path');

const nodeEnv = (process.argv[2] === 'production') ? 'production' : 'development';
const executable = (process.argv[3] === 'server') ? 'webpack-dev-server' : 'webpack';
const exePath = path.join('./node_modules/.bin/', executable);

let cmd = '';
if (process.platform === 'win32') {
  cmd = `set NODE_ENV=${nodeEnv}&&${exePath} --color`;
} else {
  cmd = `NODE_ENV=${nodeEnv} ${exePath}`;
}

const command = exec(cmd);

command.stdout.on('data', (data) => {
  process.stdout.write(data);
});
command.stderr.on('data', (data) => {
  process.stderr.write(data);
});
command.on('error', (err) => {
  process.stderr.write(err);
});
