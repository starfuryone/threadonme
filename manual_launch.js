import { spawn } from 'child_process';

const chromePath = '/usr/local/puppeteer-chrome/chrome';
const url = 'https://example.com';

const browser = spawn(chromePath, [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--new-window',
  url
]);

browser.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

browser.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

browser.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
