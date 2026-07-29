import Anthropic from '@anthropic-ai/sdk'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'

let client: Anthropic | null = null
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return client
}

export interface PrioritizeInput {
  category: string
  subCategory: string
  subject: string
  description: string
  personsInvolved: string
  isConfidential: boolean
}

export interface PrioritizeResult {
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  reasoning: string
}

const ASSIGN_PRIORITY_TOOL: Anthropic.Tool = {
  name: 'assign_priority',
  description: 'Assign a triage priority and reasoning for an employee grievance.',
  input_schema: {
    type: 'object',
    properties: {
      priority: {
        type: 'string',
        enum: ['Low', 'Medium', 'High', 'Critical'],
        description:
          'Critical: safety, harassment, legal/compliance, or urgent financial harm. High: significant impact needing prompt action. Medium: real issue, not urgent. Low: minor or suggestion-type items.',
      },
      reasoning: {
        type: 'string',
        description: 'One or two sentences explaining the priority assignment, for an HR reviewer.',
      },
    },
    required: ['priority', 'reasoning'],
  },
}

function buildPrompt(input: PrioritizeInput) {
  return `You are an HR grievance triage assistant for Dalmia Cement (Bharat) Limited's Rajgangpur Plant. Review the following employee grievance and assign a priority.

Category: ${input.category}
Sub-category: ${input.subCategory}
Subject: ${input.subject}
Description: ${input.description}
Persons involved: ${input.personsInvolved || 'None specified'}
Confidential submission: ${input.isConfidential ? 'Yes' : 'No'}

Treat harassment, safety, discrimination, and compliance/ethics matters as high urgency by default. Weigh financial deadlines, health/safety risk, and repeat/escalating issues as increasing urgency.`
}

function fallback(input: PrioritizeInput): PrioritizeResult {
  const urgent = ['Harassment & Misconduct', 'Compliance & Ethics', 'Safety, Health & Environment (SHE)']
  const priority = urgent.includes(input.category) ? 'High' : 'Medium'
  return {
    priority,
    reasoning: 'AI service unavailable — defaulted based on category.',
  }
}

export async function prioritizeGrievance(input: PrioritizeInput): Promise<PrioritizeResult> {
  const anthropic = getClient()
  if (!anthropic) return fallback(input)

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      tools: [ASSIGN_PRIORITY_TOOL],
      tool_choice: { type: 'tool', name: 'assign_priority' },
      messages: [{ role: 'user', content: buildPrompt(input) }],
    })

    const toolUse = message.content.find((block) => block.type === 'tool_use')
    if (toolUse && toolUse.type === 'tool_use') {
      const result = toolUse.input as PrioritizeResult
      return result
    }
    return fallback(input)
  } catch (error) {
    console.error('AI prioritization failed:', error)
    return fallback(input)
  }
}
