import OpenAI from 'openai'

const AI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-5.4'

const apiKey = process.env.OPEN_AI_API_KEY
const openAiClient = new OpenAI({
  apiKey: apiKey,
})

const SUMMARIZE_PROMPT = (
  article: string,
  url: string
) => `You are an expert technical editor writing summaries for software engineers who browse Hacker News.

Your task is to summarize the article provided below.

Requirements:

- Write a concise but information-dense summary.
- Focus on the core ideas, technical insights, discoveries, arguments, or lessons from the article.
- Ignore marketing language, self-promotion, and unnecessary storytelling.
- Preserve important context and nuance.
- Highlight surprising findings, tradeoffs, limitations, and risks when present.
- If the article discusses software engineering, AI, infrastructure, security, startups, databases, distributed systems, programming languages, or product development, emphasize the practical implications for engineers.
- Do not copy large portions of the article.
- Do not mention that you are an AI.
- Do not include phrases like "the article discusses" or "the author explains." Write directly.
- If the article is given to you as a text, read and summarize the text. 
- If a url is passed to you, open the url, crawl its contents, then summarize.
- If both url and text are given to you summarize the text and crawl the url and the article in the url if it exists.


Output format:

Title: <article title>

TL;DR:
<2-4 sentence executive summary>

Key Points:
- <point 1>
- <point 2>
- <point 3>
- <point 4>
- <point 5>

Notable Insights:
- <interesting or unexpected takeaway>
- <interesting or unexpected takeaway>

Potential Criticisms or Limitations:
- <limitation or criticism>
- <limitation or criticism>

Takeaway for Engineers:
<1-3 sentences describing why this matters and how it could influence engineering decisions>

Article Content:
${{ article }}
URL to crawl"
${url}

`

const CLASSIFY_PROMPT = (title: string, url: string, text: string) => `
  - Analyze the title, url and text and generate tags for the artcile.
  - Return the response in this format { "topicTags": ["technical_deep_dive", "ai_ml"] } 
  - title, url, and text below:
  ${title} | ${url} | ${text}
`

// might not need to stream this?
export async function summarize(text: string, url: string) {
  const stream = await openAiClient.responses.stream({
    model: AI_MODEL,
    input: SUMMARIZE_PROMPT(text, url),
  })
  return stream
}

/**
 * Generate tags for a story based on the title, url, and text
 * @param url - The url of the story
 * @param title - The title of the story
 * @param text - The text of the story
 * @returns The tags for the story
 */
export async function generateTags(url: string, title: string, text: string) {
  const response = await openAiClient.responses.create({
    model: AI_MODEL,
    input: CLASSIFY_PROMPT(title, url, text),
    text: {
      format: {
        type: 'json_schema',
        name: 'article_tags',
        schema: {
          type: 'object',
          properties: {
            topicTags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          required: ['topicTags'],
          additionalProperties: false,
        },
      },
    },
  })
  return JSON.parse(response.output_text) as { topicTags: string[] }
}
