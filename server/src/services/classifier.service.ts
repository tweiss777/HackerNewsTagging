import type { HNStory } from '../types/HNStory.js'
import type { TopicTag } from '../types/StoryRecord.js'
import { generateTags } from './openai.service.js'

export async function assignTags(story: HNStory): Promise<TopicTag[]> {
  const tags = new Set<TopicTag>()
  const title = (story.title || '').toLowerCase()
  const url = (story.url || '').toLowerCase()
  const text = (story.text || '').toLowerCase()
  const domain = extractDomain(url)

  // --- Show HN / Ask HN / Launch HN ---
  if (/^show hn/i.test(story.title)) tags.add('show_hn')
  if (/^ask hn/i.test(story.title)) tags.add('ask_hn')
  if (/^launch hn/i.test(story.title)) tags.add('announcement')
  if (/^tell hn/i.test(story.title)) tags.add('personal_story')

  // --- GitHub / new tools ---
  if (url.includes('github.com') || url.includes('gitlab.com')) {
    tags.add('new_tool_or_library')
  }

  // --- ArXiv → paper + ai_ml if relevant ---
  if (url.includes('arxiv.org')) {
    tags.add('paper_research')
    if (
      /llm|transformer|diffusion|neural|model|inference|agent|embedding|gpt|bert|attention|reinforcement|fine.?tun/i.test(
        title
      )
    ) {
      tags.add('ai_ml')
    } else {
      tags.add('science_research')
    }
  }

  // --- AI / ML ---
  if (
    /\b(llm|gpt|claude|openai|anthropic|gemini|mistral|llama|hugging.?face|langchain|rag|vector.?db|embedding|fine.?tun|inference|agent|copilot|diffusion|stable.?diffusion|midjourney|dall.e|transformer|neural.?net|machine.?learning|deep.?learning|ai\b|artificial.?intel)/i.test(
      title + ' ' + url
    )
  ) {
    tags.add('ai_ml')
  }

  // --- Security / Privacy ---
  if (
    /\b(exploit|vulnerabilit|cve|hack|breach|malware|ransomware|phishing|zero.?day|xss|sql.?inject|auth|cryptograph|encrypt|privacy|surveillance|leak|backdoor|pentest|ctf|security)\b/i.test(
      title + ' ' + url + ' ' + text
    )
  ) {
    tags.add('security_privacy')
  }

  // --- Company / Startup news ---
  const companyNewsDomains = [
    'techcrunch.com',
    'bloomberg.com',
    'reuters.com',
    'wsj.com',
    'ft.com',
    'businessinsider.com',
    'cnbc.com',
    'forbes.com',
  ]
  if (companyNewsDomains.includes(domain)) {
    tags.add('company_or_startup_news')
  }
  if (
    /\b(raised|acquired|acqui|layoff|funding|series [a-e]|ipo|valuation|merger|shut.?down|bankrupt|pivot|launch|revenue|profit|loss|growth|unicorn|runway)\b/i.test(
      title
    )
  ) {
    tags.add('company_or_startup_news')
  }

  // --- Policy / Regulation / Law ---
  if (
    /\b(regulation|congress|senate|court|law|legal|antitrust|gdpr|copyright|patent|government|policy|legislation|ruling|ban|fine|lawsuit|compliance|eu|fcc|ftc|doj|nist)\b/i.test(
      title
    )
  ) {
    tags.add('policy_regulation_law')
  }

  // --- Science / Research ---
  if (
    /\b(study|research|paper|journal|biology|physics|chemistry|medicine|climate|space|nasa|quantum|genome|crispr|neuroscience|psychology|experiment|findings|discovery)\b/i.test(
      title
    )
  ) {
    tags.add('science_research')
  }
  const scienceDomains = [
    'nature.com',
    'science.org',
    'pubmed.ncbi.nlm.nih.gov',
    'quantamagazine.org',
    'biorxiv.org',
    'medrxiv.org',
    'sciencedaily.com',
  ]
  if (scienceDomains.includes(domain)) {
    tags.add('science_research')
  }

  // --- Technical deep dive ---
  const techDomains = [
    'lwn.net',
    'jvns.ca',
    'matklad.github.io',
    'without.boats',
    'fasterthanli.me',
    'hacks.mozilla.org',
    'brendangregg.com',
  ]
  if (techDomains.includes(domain)) {
    tags.add('technical_deep_dive')
  }
  if (
    /\b(architecture|compiler|kernel|syscall|runtime|garbage.?collect|memory.?model|concurren|async|tcp|http|database|postgres|sqlite|redis|benchm|profil|latency|throughput|implement|deep.?dive|internals|how.+works|under.+hood)\b/i.test(
      title
    )
  ) {
    tags.add('technical_deep_dive')
  }

  // --- Career / Work culture ---
  if (
    /\b(hiring|interview|salary|compensation|remote|layoff|burnout|management|productivity|career|job|work.?life|culture|onboarding|promotion|performance.?review|1.?on.?1|eng.?manager)\b/i.test(
      title
    )
  ) {
    tags.add('career_work_culture')
  }

  // --- Opinion / Analysis / Essay ---
  if (
    /\b(why|opinion|essay|thought|reflec|argument|disagree|problem with|case for|case against|defense of|critique|hot.?take|unpopular|contrarian|manifesto)\b/i.test(
      title
    )
  ) {
    tags.add('opinion_analysis')
  }
  const opinionDomains = [
    'paulgraham.com',
    'danluu.com',
    'scattered-thoughts.net',
    'rachelbythebay.com',
    'lethain.com',
  ]
  if (opinionDomains.includes(domain)) {
    tags.add('opinion_analysis')
  }

  // --- Historical / Retrospective ---
  if (
    /\b(\d{4}s?|history|origin|retrospective|postmortem|how.+used.?to|back.?in|classic|legacy|vintage|old|nostalg|decade|anniversary|memoir)\b/i.test(
      title
    )
  ) {
    tags.add('historical_or_retrospective')
  }

  // --- Tutorial ---
  if (
    /\b(how.?to|tutorial|guide|introduction|getting.?started|step.?by.?step|walkthrough|learn|course|beginner|101\b|from.?scratch|build.?your.?own|implement.?your.?own)\b/i.test(
      title
    )
  ) {
    tags.add('tutorial')
  }

  // --- Reference ---
  if (
    /\b(cheat.?sheet|reference|documentation|docs|spec|glossary|overview|summary|handbook|cookbook|list of|comparison)\b/i.test(
      title
    )
  ) {
    tags.add('reference')
  }

  // --- Benchmark ---
  if (
    /\b(benchmark|evaluat|performance|comparison|vs\.?|versus|ranking|leaderboard|score|faster.?than|slower.?than)\b/i.test(
      title
    )
  ) {
    tags.add('benchmark')
  }

  // --- Postmortem ---
  if (
    /\b(postmortem|incident|outage|bug|failure|root.?cause|lessons.?learned|what.?went.?wrong|retrospective|downtime)\b/i.test(
      title
    )
  ) {
    tags.add('postmortem')
  }

  // --- Discussion prompt (Ask HN) ---
  if (/^ask hn/i.test(story.title)) {
    tags.add('discussion_prompt')
  }

  // --- Personal story ---
  if (
    /\b(my|i |i'|i've|i built|i made|i wrote|i learned|i spent|i left|i joined|founder|journey|story|experience)\b/i.test(
      title
    )
  ) {
    tags.add('personal_story')
  }

  // --- Demo / project ---
  if (
    /^show hn/i.test(story.title) ||
    url.includes('github.com') ||
    url.includes('codepen.io') ||
    url.includes('glitch.me')
  ) {
    tags.add('demo_project')
  }

  // --- Investigation ---
  const investigationDomains = [
    'propublica.org',
    'theintercept.com',
    '404media.co',
    'bellingcat.com',
    'icij.org',
  ]
  if (investigationDomains.includes(domain)) {
    tags.add('investigation')
  }
  if (/\b(investigat|expos|reveal|leak|whistleblow|report|found|discover|uncov)\b/i.test(title)) {
    tags.add('investigation')
  }

  // --- Fallback ---
  if (tags.size === 0) {
    const { topicTags } = await generateTags(url, title, text)
    return topicTags as TopicTag[]
  }

  return Array.from(tags)
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
