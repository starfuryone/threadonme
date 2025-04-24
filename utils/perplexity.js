import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/starfury/puppeteer-test/.env' });

export async function getTrendingAIHeadline() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.CHROME_EXECUTABLE,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://www.perplexity.ai/search?q=latest+AI+news', { waitUntil: 'domcontentloaded' });

    // This may need adjustment depending on site structure
    const headline = await page.evaluate(() => {
      const h2 = document.querySelector('h2');
      return h2 ? h2.textContent.trim() : 'Latest AI trend';
    });

    return headline;
  } catch (error) {
    console.error('❌ Error scraping Perplexity:', error);
    return 'Latest AI trend';
  } finally {
    await browser.close();
  }
}
