import React, { useState, useRef, useEffect } from 'react'
import { Toast } from 'react-vant'
import { chatCompletion } from '@/llm'
import './index.css'

const SYSTEM_PROMPT = {
  role: 'system',
  content: '你是「智阅」阅读助手，专注于网络小说、书籍推荐、阅读陪伴。你熟悉玄幻、仙侠、武侠、悬疑等各类网文，能为用户推荐好书、解答剧情、分析人物、讨论书中世界观。回答简洁友好，每次不超过200字。'
}

const QUICK_QUESTIONS = [
  '推荐几本玄幻小说',
  '诡秘之主讲什么',
  '剑来好看吗',
  '有没有完本好书',
]

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`bubble-row ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && <div className="avatar-ai">智</div>}
      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
      {isUser && <div className="avatar-user">我</div>}
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是智阅 AI 助手 ✦\n可以问我书籍推荐、剧情分析、人物解读……有什么想聊的？' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const content = (text !== undefined ? text : input).trim()
    if (!content || loading) return
    setInput('')

    const userMsg = { role: 'user', content }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const history = nextMessages.map(m => ({ role: m.role, content: m.content }))
      const reply = await chatCompletion([SYSTEM_PROMPT, ...history], { maxTokens: 400 })
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      Toast.fail('网络异常，请稍后重试')
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我暂时无法回答，请稍后再试。' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-page">
      {/* 顶部栏 */}
      <div className="chat-header">
        <div className="chat-header-avatar">智</div>
        <div className="chat-header-info">
          <div className="chat-header-name">智阅 AI 助手</div>
          <div className="chat-header-status">
            <span className="status-dot" />在线
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
        {loading && (
          <div className="bubble-row assistant">
            <div className="avatar-ai">智</div>
            <div className="bubble bubble-ai typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 快捷提问 */}
      {messages.length <= 2 && (
        <div className="quick-questions">
          {QUICK_QUESTIONS.map((q) => (
            <button key={q} className="quick-btn" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 输入区 */}
      <div className="chat-input-bar">
        <textarea
          className="chat-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="问问 AI 助手..."
          rows={1}
          disabled={loading}
        />
        <button
          className={`send-btn ${loading || !input.trim() ? 'disabled' : ''}`}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className="send-loading">⟳</span>
          ) : (
            <span>发送</span>
          )}
        </button>
      </div>
    </div>
  )
}
