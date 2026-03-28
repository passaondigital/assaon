import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, ChatSession, ChatMessage } from '../lib/api';
import { getCurrentUser } from '../lib/auth';
import './Studio.scss';

export default function StudioPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project') || undefined;

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) { navigate('/login'); return; }
      const { sessions } = await api.chat.sessions();
      setSessions(sessions);
      if (sessions.length > 0) loadSession(sessions[0]);
    })();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  async function loadSession(session: ChatSession) {
    setActiveSession(session);
    const { messages } = await api.chat.messages(session.id);
    setMessages(messages);
  }

  async function newSession() {
    const { session } = await api.chat.createSession({ projectId });
    setSessions(prev => [session, ...prev]);
    setActiveSession(session);
    setMessages([]);
  }

  async function sendMessage() {
    if (!input.trim() || streaming) return;

    let session = activeSession;
    if (!session) {
      const { session: s } = await api.chat.createSession({ projectId });
      setSessions(prev => [s, ...prev]);
      setActiveSession(s);
      session = s;
    }

    const userMsg: ChatMessage = {
      id: 'tmp-' + Date.now(),
      session_id: session.id,
      role: 'user',
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStreaming(true);
    setStreamText('');

    const token = localStorage.getItem('assaon_token');
    const res = await fetch(`/api/chat/sessions/${session.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: userMsg.content }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';
    let assistantMsgId = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.text) {
            accumulated += data.text;
            setStreamText(accumulated);
          }
          if (data.done) {
            assistantMsgId = data.messageId;
          }
          if (data.error) {
            accumulated += `\n\n[Fehler: ${data.error}]`;
            setStreamText(accumulated);
          }
        } catch { /* skip */ }
      }
    }

    const assistantMsg: ChatMessage = {
      id: assistantMsgId || 'tmp-assistant-' + Date.now(),
      session_id: session.id,
      role: 'assistant',
      content: accumulated,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setStreamText('');
    setStreaming(false);

    // Update session title in list
    setSessions(prev => prev.map(s => s.id === session!.id ? { ...s, title: userMsg.content.slice(0, 60), updated_at: new Date().toISOString() } : s));
  }

  async function deleteSession(sessionId: string, e: React.MouseEvent) {
    e.stopPropagation();
    await api.chat.deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setMessages([]);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const QUICK_PROMPTS = [
    '🌐 Ich brauche eine Website für meine Tierarztpraxis',
    '📅 Baue einen Buchungskalender für Hundetraining',
    '🛒 Erstelle einen Shop für Tierprodukte',
    '🦁 Ich möchte eine Community für Wildlife-Enthusiasten',
  ];

  return (
    <div className="studio">
      {/* Sidebar */}
      <aside className={`studio-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="studio-sidebar-header">
          <a href="/dashboard" className="studio-back">← Dashboard</a>
          <button className="studio-new-btn" onClick={newSession}>+ Neu</button>
        </div>

        <div className="studio-sessions">
          {sessions.map(s => (
            <div
              key={s.id}
              className={`studio-session ${activeSession?.id === s.id ? 'active' : ''}`}
              onClick={() => loadSession(s)}
            >
              <span className="studio-session-title">{s.title || 'Neue Unterhaltung'}</span>
              <button className="studio-session-del" onClick={e => deleteSession(s.id, e)}>×</button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="studio-sessions-empty">Noch keine Unterhaltungen</div>
          )}
        </div>
      </aside>

      {/* Toggle sidebar */}
      <button className="studio-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {/* Main chat */}
      <main className="studio-main">
        <div className="studio-messages">
          {messages.length === 0 && !streaming && (
            <div className="studio-welcome">
              <div className="studio-welcome-icon">🌿</div>
              <h2>assaon Studio</h2>
              <p>Beschreibe was du bauen möchtest — ich helfe dir dabei.</p>
              <div className="studio-quick-prompts">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} className="studio-quick-prompt" onClick={() => { setInput(p); textareaRef.current?.focus(); }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`studio-msg studio-msg-${msg.role}`}>
              <div className="studio-msg-bubble">
                <pre>{msg.content}</pre>
              </div>
            </div>
          ))}

          {streaming && streamText && (
            <div className="studio-msg studio-msg-assistant">
              <div className="studio-msg-bubble">
                <pre>{streamText}<span className="studio-cursor">▋</span></pre>
              </div>
            </div>
          )}

          {streaming && !streamText && (
            <div className="studio-msg studio-msg-assistant">
              <div className="studio-msg-bubble studio-thinking">
                <span />  <span />  <span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="studio-input-area">
          <textarea
            ref={textareaRef}
            className="studio-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Beschreibe was du bauen möchtest... (Enter zum Senden)"
            rows={3}
            disabled={streaming}
          />
          <button className="studio-send" onClick={sendMessage} disabled={streaming || !input.trim()}>
            {streaming ? '⏳' : '→'}
          </button>
        </div>
      </main>
    </div>
  );
}
