const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function generateRecipe(ingredients) {
  if (!ingredients || ingredients.length === 0) {
    throw new Error('Adicione ingredientes à sua despensa primeiro!')
  }

  const ingredientList = ingredients
    .map((i) => `${i.name} (${i.quantity} ${i.unit})`)
    .join(', ')

  const prompt = `Você é um chef criativo e especialista em receitas práticas do dia a dia.
Com base nos ingredientes disponíveis na despensa do usuário, crie UMA receita completa, rápida e fácil.
Use apenas os ingredientes listados (pode usar temperos básicos como sal, azeite e pimenta como extras).

Ingredientes disponíveis: ${ingredientList}

Responda APENAS com JSON válido, sem texto adicional, sem markdown, no seguinte formato exato:
{
  "name": "Nome da receita",
  "time_minutes": 30,
  "difficulty": "Fácil",
  "servings": 2,
  "description": "Breve descrição apetitosa da receita.",
  "ingredients": [
    { "name": "Ingrediente", "quantity": "quantidade e unidade" }
  ],
  "steps": [
    "Passo 1 descrito de forma clara.",
    "Passo 2 descrito de forma clara."
  ]
}`

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const msg = errData?.error?.message || `HTTP ${response.status}`
    throw new Error(`Erro da IA: ${msg}`)
  }

  const data = await response.json()
  const rawText = data?.choices?.[0]?.message?.content

  if (!rawText) {
    throw new Error('A IA não retornou uma receita. Tente novamente.')
  }

  return parseRecipeJson(rawText)
}

function parseRecipeJson(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error('Não foi possível interpretar a receita gerada. Tente novamente.')
  }
}
