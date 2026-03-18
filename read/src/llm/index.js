// =============================================
// LLM 工具模块 - 豆包 AI 接入
// =============================================

const DOUBAO_IMG_URL = '/api/doubao/images/generations'
const IMG_MODEL = import.meta.env.VITE_DOUBAO_IMG_MODEL || 'ep-20250812115635-bj7sx'
const API_KEY = import.meta.env.VITE_DOUBAO_API_KEY

// 基础 chat 调用（AI 聊天页面使用）
export async function chatCompletion(messages, options = {}) {
  const DOUBAO_CHAT_URL = '/api/doubao/chat/completions'
  const CHAT_MODEL = import.meta.env.VITE_DOUBAO_CHAT_MODEL || 'ep-20250812115635-bj7sx'
  const response = await fetch(DOUBAO_CHAT_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      max_tokens: options.maxTokens || 800,
      temperature: options.temperature || 0.7,
    }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

// AI 生成头像（文生图）
export const generateAvatar = async (
  prompt = '一只可爱的卡通猫咪头像，圆形构图，简洁风格，高清',
  api_url = DOUBAO_IMG_URL,
  api_key = API_KEY,
  model = IMG_MODEL
) => {
  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, prompt }),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return {
      code: 0,
      data: { imageUrl: data.data[0].url },
    }
  } catch (error) {
    console.error('[generateAvatar]', error)
    return { code: 1, msg: error.message || '生成图像时发生错误' }
  }
}
