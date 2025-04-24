import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: process.env.CHROME_EXECUTABLE,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
console.log('✅ Browser launched!');
await browser.close();
