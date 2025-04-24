import dotenv from 'dotenv';
dotenv.config({ path: '/home/starfury/puppeteer-test/.env' }); // adjust if needed

import OpenAI from 'openai';
import { TwitterApi } from 'twitter-api-v2';
import { getTrendingAIHeadline } from '../utils/perplexity.js';
import fs from 'fs';

console.log("Checking Chrome binary accessibility:");
console.log(fs.existsSync(process.env.CHROME_EXECUTABLE)); // should be true
console.log(fs.accessSync(process.env.CHROME_EXECUTABLE, fs.constants.X_OK)); // should not throw

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const style = process.env.USER_STYLE || 'kara';

const stylePrompts = {
  kara: `Write a sharp, opinionated tweet like a tech journalist.`,
  genZ: `Write a spicy, lowercase tweet like a Gen Z AI influencer. Add some humor. Short and bold.`,
  optimistic: `Write a tweet about this topic that feels inspiring and highlights opportunity.`,
  cynical: `Write a skeptical tweet about this topic that calls out hype or BS.`,
  neutral: `Write a factual, concise summary of the topic in the tone of a research analyst.`,
};

const hashtags = [
  '#AI', '#ChatGPT', '#FutureOfWork', '#TechNews', '#AIagents',
  '#MachineLearning', '#PromptEngineering', '#OpenAI', '#Automation', '#GPT4', '#Deepseek', '#Gemini'
];

function getRandomHashtags() {
  const shuffled = hashtags.sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 1;
  return shuffled.slice(0, count).join(' ');
}

(async () => {
  try {
    const topic = await getTrendingAIHeadline();
    console.log('📰 Trending topic:', topic);

    const prompt = `${stylePrompts[style] || stylePrompts.kara}
Topic: "${topic}"
Keep it under 280 characters. No hashtags or emojis.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    let tweetContent = response.choices[0].message.content.trim();
    tweetContent += '\n\n' + getRandomHashtags();

    console.log('📢 Posting tweet:\n', tweetContent);

    const { data } = await twitterClient.v2.tweet(tweetContent);
    console.log('✅ Tweet posted:', `https://twitter.com/user/status/${data.id}`);
  } catch (err) {
    console.error('❌ Error posting tweet:', err);
  }
})();
