// scripts/print-chrome-path.mjs
import puppeteer from 'puppeteer';

const executablePath = puppeteer.executablePath();
console.log('Executable path Puppeteer is using:', executablePath);
