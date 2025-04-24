import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import { TwitterApi } from 'twitter-api-v2';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const hashtags = [
  '#AI', '#ChatGPT', '#FutureOfWork', '#TechNews', '#AIagents',
  '#MachineLearning', '#PromptEngineering', '#OpenAI', '#Automation', '#GPT4'
];

function getRandomHashtags() {
  const shuffled = hashtags.sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 1;
  return shuffled.slice(0, count).join(' ');
}

const karaPrompt = `
Write a sarcastic, sharp, opinionated tweet like a tech journalist commenting on the latest AI trends. Keep it under 260 characters. No hashtags, no emojis.
`;

(async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: karaPrompt }],
      temperature: 0.8,
    });

    let tweetContent = response.choices[0].message.content.trim();
    tweetContent += '\n\n' + getRandomHashtags();

    console.log('📢 Posting tweet:\n', tweetContent);

    const { data } = await twitterClient.v2.tweet(tweetContent);
    console.log('✅ Tweet posted:', `https://twitter.com/user/status/${data.id}`);
  } catch (err) {
    console.error('❌ Failed to tweet:', err);
  }
})();
