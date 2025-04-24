import puppeteer from 'puppeteer';
import { generateMidjourneyPrompt } from './generatePrompt.js'; // adjust if in same file

const DISCORD_TOKEN = '9_z2Tj6DilqzyrV-o2pKk3pd4aQsvCrv';
const DISCORD_CHANNEL_URL = 'https://discord.com/channels/1075839557574078474/1075839557574078477';
const CHROME_PATH = '/usr/local/puppeteer-chrome/chrome';

const prompt = await generateMidjourneyPrompt();
console.log('Prompt:', prompt);

const browser = await puppeteer.launch({
  headless: false,
  executablePath: CHROME_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

// Set token before Discord loads
await page.goto('about:blank');
await page.evaluateOnNewDocument((token) => {
  localStorage.setItem('token', `"${token}"`);
}, DISCORD_TOKEN);

await page.goto(DISCORD_CHANNEL_URL, { waitUntil: 'networkidle2' });
await page.waitForTimeout(5000);

// Send the prompt
await page.keyboard.type(`/imagine ${prompt}`);
await page.keyboard.press('Enter');

await page.waitForTimeout(15000); // Adjust for Midjourney render time
const imageUrl = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'));
  const match = imgs.find(img => img.src.includes('cdn.discordapp.com'));
  return match ? match.src : null;
});

console.log('🖼️ Image URL:', imageUrl);
await browser.close();
