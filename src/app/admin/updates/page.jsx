"use client";
import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const HORIZON_SCAN_PROMPT = `You are generating a Daily Horizon Scan email for Pimlico XHS™, a regulatory change and compliance tracking platform.

Produce a markdown document listing today's regulatory updates, structured strictly by jurisdiction. Each country section contains one or more regulatory update entries.

STRICT FORMAT RULES:
- Use ## for country headers with the correct flag emoji: ## 🇬🇧 United Kingdom
- Use ### for each update headline (concise, factual, no editorialising)
- Include **Authority:** line immediately after the headline (the issuing regulator or body)
- Follow with a one-line factual description (1-2 sentences, no commentary or opinion)
- Add **Tags:** line with vertical, category, and type separated by · (middle dot)
- Add a [Read more →](url) link to the source
- Order countries alphabetically
- Separate country sections with a blank line
- NO narrative summaries, impact assessments, or editorial commentary
- NO em dashes in descriptions
- Keep language compliance-focused and factual

REQUIRED STRUCTURE:
## [Flag] [Country Name]

### [Headline]
**Authority:** [Regulator Name]
[One-line factual description of the development]
**Tags:** [Vertical] · [Category] · [Type/Stage]
[Read more →](https://source-url)

COMMON VERTICALS: Payments, Crypto, AI, Banking, Insurance, Securities, Consumer Protection, Data Privacy, AML/KYC
COMMON TYPES: Publication, Consultation, Guideline, Implementation Measures, Register Update, Enforcement Action, Licence Requirement, Proposed Rule, Technical Standards

Generate the horizon scan for today, covering all jurisdictions with regulatory activity.`;

/* ── Stat Card ── */
function StatCard({ icon, label, value, sub, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-500/15 text-blue-300',
    green: 'bg-green-500/15 text-green-300',
    amber: 'bg-amber-500/15 text-amber-300',
    purple: 'bg-purple-500/15 text-purple-300',
  };
  return (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${colors[color]}`}>{icon}</span>
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminUpdatesPage() {
  const [activeTab, setActiveTab] = useState('compose');
  const [subscribers, setSubscribers] = useState([]);
  const [history, setHistory] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compose state
  const [subject, setSubject] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState('all'); // 'all' | 'selected'
  const [checkedEmails, setCheckedEmails] = useState(new Set());

  // Schedule state
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduling, setScheduling] = useState(false);

  // Template state
  const [templateType, setTemplateType] = useState('standard'); // 'standard' | 'horizon-scan'
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [emailTheme, setEmailTheme] = useState('light'); // 'light' | 'dark'

  // Test email state
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Data tab state
  const [dataMarkdown, setDataMarkdown] = useState('');

  // Add subscriber state
  const [newEmails, setNewEmails] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [orgFilter, setOrgFilter] = useState('all'); // 'all' | specific org name

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/updates');
      const data = await res.json();
      if (data.success) {
        setSubscribers(Array.isArray(data.subscribers) ? data.subscribers : []);
        setHistory(Array.isArray(data.history) ? data.history : []);
        setScheduled(Array.isArray(data.scheduled) ? data.scheduled : []);
        setOrganisations(Array.isArray(data.organisations) ? data.organisations : []);
      }
    } catch (err) {
      console.error('Failed to load updates data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Compute org groups
  const subs = Array.isArray(subscribers) ? subscribers : [];
  const orgList = [...new Set(subs.map(s => s.organisation || s.org || '').filter(Boolean))].sort();
  const subscribersByOrg = {};
  for (const s of subs) {
    const org = s.organisation || s.org || 'Ungrouped';
    if (!subscribersByOrg[org]) subscribersByOrg[org] = [];
    subscribersByOrg[org].push(s);
  }
  const filteredSubscribers = orgFilter === 'all'
    ? subs
    : subs.filter(s => (s.organisation || s.org || 'Ungrouped') === orgFilter);

  /* ── File upload ── */
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === 'string') {
        setMarkdown(content);
        // Try to extract title from first heading
        if (templateType !== 'horizon-scan') {
          const titleMatch = content.match(/^#\s+(.+)$/m);
          if (titleMatch && !subject) {
            setSubject(titleMatch[1]);
          }
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  /* ── Add subscribers ── */
  async function handleAddSubscribers(e) {
    e.preventDefault();
    if (!newEmails.trim()) return;
    setAdding(true);
    try {
      const emails = newEmails
        .split(/[,\n;]+/)
        .map(e => e.trim())
        .filter(Boolean)
        .map(e => {
          const match = e.match(/^(.+?)\s*<(.+?)>$/);
          if (match) return { name: match[1].trim(), email: match[2].trim() };
          return { email: e };
        });

      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-subscribers', emails, org: newOrg.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setNewEmails('');
        loadData();
      }
    } catch (err) {
      console.error('Failed to add subscribers:', err);
    } finally {
      setAdding(false);
    }
  }

  /* ── Import from onboarding ── */
  async function handleImportOnboarding() {
    setImporting(true);
    try {
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'import-from-onboarding' }),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
        alert(`Imported ${data.added} new subscriber${data.added !== 1 ? 's' : ''} from onboarding (${data.total} total)`);
      }
    } catch (err) {
      console.error('Failed to import:', err);
    } finally {
      setImporting(false);
    }
  }

  /* ── Remove subscriber ── */
  async function handleRemove(email) {
    try {
      await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-subscriber', email }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to remove subscriber:', err);
    }
  }

  /* ── Send update ── */
  async function handleSend() {
    if (!subject.trim() || !markdown.trim()) return;
    if (!confirm(`Send this update to ${selectedRecipients === 'all' ? subs.length : checkedEmails.size} recipient(s)?`)) return;

    setSending(true);
    setSendResult(null);
    try {
      const recipientEmails = selectedRecipients === 'selected'
        ? Array.from(checkedEmails)
        : undefined;

      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', subject, markdown, recipientEmails, template: templateType, theme: emailTheme }),
      });
      const data = await res.json();
      setSendResult(data);
      if (data.success) loadData();
    } catch (err) {
      setSendResult({ success: false, error: err.message });
    } finally {
      setSending(false);
    }
  }

  /* ── Send test email ── */
  async function handleSendTest() {
    if (!testEmail.trim()) return;
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-test', testEmail: testEmail.trim(), template: templateType, theme: emailTheme }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setSendingTest(false);
    }
  }

  /* ── Schedule update ── */
  async function handleSchedule() {
    if (!subject.trim() || !markdown.trim() || !scheduleDate) return;
    setScheduling(true);
    try {
      const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'schedule', subject, markdown, scheduledFor, template: templateType, theme: emailTheme }),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
        alert('Update scheduled successfully');
        setScheduleDate('');
      }
    } catch (err) {
      console.error('Failed to schedule:', err);
    } finally {
      setScheduling(false);
    }
  }

  /* ── Cancel scheduled ── */
  async function handleCancelScheduled(id) {
    if (!confirm('Cancel this scheduled update?')) return;
    try {
      await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel-scheduled', id }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to cancel:', err);
    }
  }

  /* ── Toggle subscriber checkbox ── */
  function toggleEmail(email) {
    setCheckedEmails(prev => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  const TABS = [
    { key: 'compose', label: 'Compose', icon: '✍️' },
    { key: 'subscribers', label: 'Subscribers', icon: '👥' },
    { key: 'organisations', label: 'Organisations', icon: '🏢' },
    { key: 'history', label: 'History', icon: '📜' },
    { key: 'scheduled', label: 'Scheduled', icon: '⏰' },
    { key: 'data', label: 'Data', icon: '📊' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-white">Email Communications</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* ════ COMPOSE TAB ════ */}
        {activeTab === 'compose' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Compose</h2>

            {/* Communication Type */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide">Communication Type</label>
                {/* Theme Toggle */}
                <div className="flex items-center gap-1 bg-gray-900/60 rounded-lg p-0.5 border border-gray-700/50">
                  <button
                    onClick={() => setEmailTheme('light')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      emailTheme === 'light'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    onClick={() => setEmailTheme('dark')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      emailTheme === 'dark'
                        ? 'bg-gray-700 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'horizon-scan', icon: '🌐', label: 'Daily Horizon Scan', primary: true },
                  { key: 'standard', icon: '✍️', label: 'Standard Update' },
                  { key: 'feature-update', icon: '🚀', label: 'Feature Update' },
                  { key: 'content-update', icon: '📰', label: 'Content Update' },
                  { key: 'product-update', icon: '⚙️', label: 'Product Update' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setTemplateType(t.key);
                      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                      const defaults = {
                        'horizon-scan': `XHS Daily Horizon Scan — ${today}`,
                        'feature-update': `XHS Feature Update — ${today}`,
                        'content-update': `XHS Content Update — ${today}`,
                        'product-update': `XHS Product Update — ${today}`,
                      };
                      if (defaults[t.key]) setSubject(defaults[t.key]);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      templateType === t.key
                        ? t.primary
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                          : 'bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-sm'
                        : 'bg-gray-800/40 text-gray-400 border border-gray-700 hover:text-white hover:border-gray-600'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizon Scan Format Guide & AI Prompt */}
            {templateType === 'horizon-scan' && (
              <div className="bg-indigo-500/5 rounded-xl border border-indigo-500/20 overflow-hidden">
                <button
                  onClick={() => setShowFormatGuide(!showFormatGuide)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-indigo-500/5 transition-colors"
                >
                  <span className="text-sm font-medium text-indigo-300">📋 Markdown Format Guide & AI Prompt</span>
                  <span className={`text-indigo-400 text-xs transition-transform ${showFormatGuide ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showFormatGuide && (
                  <div className="px-5 pb-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Required Markdown Format</h4>
                      <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">{`## 🇦🇷 Argentina

### BCRA publishes Comunicación A 8406 for recurring collections
BCRA published Comunicación A 8406/2026 approving Cobro con Transferencia as the only immediate-transfer modality for recurring collections.
**Tags:** Payments · Account To Account · Secondary Law
[Read more →](https://source-link.com)

## 🇧🇷 Brazil

### ANPD issues age assurance guidance for ECA Digital
The ANPD published preliminary guidance and an implementation timetable for reliable age-assurance mechanisms.
**Tags:** AI · AI Governance · Digital Identity · Guideline
[Read more →](https://source-link.com)

## 🇹🇭 Thailand

### SEC updates investor alert register with unlicensed digital asset pages
Thailand's SEC updated its official Investor Alert register with five crypto entries for Facebook pages.
**Tags:** Crypto · Registers Blocklists · Fraud Scams · Publication
[Read more →](https://source-link.com)`}</pre>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">AI Prompt to Generate This</h4>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(HORIZON_SCAN_PROMPT);
                            alert('Prompt copied to clipboard!');
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          📋 Copy Prompt
                        </button>
                      </div>
                      <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">{HORIZON_SCAN_PROMPT}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. XHS™ Product Update — March 2026"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Upload & Actions */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-violet-600/15 text-violet-300 border border-violet-500/30 rounded-xl cursor-pointer hover:bg-violet-600/25 transition-colors text-sm font-medium">
                📄 Upload Markdown
                <input type="file" accept=".md,.markdown,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  showPreview
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
                }`}
              >
                {showPreview ? '✏️ Editor' : '👁️ Preview'}
              </button>
              {markdown && (
                <span className="text-xs text-gray-500 ml-auto">
                  {markdown.length.toLocaleString()} chars · ~{Math.ceil(markdown.split(/\s+/).length / 200)} min read
                </span>
              )}
            </div>

            {/* Editor / Preview */}
            {showPreview ? (
              <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-8 min-h-[400px]">
                <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-white prose-li:text-gray-300 prose-code:text-violet-300 prose-code:bg-gray-700/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700">
                  {markdown ? (
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-500 italic">Nothing to preview. Write or upload some markdown content.</p>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                placeholder="# Your Update Title&#10;&#10;Write your update in markdown...&#10;&#10;## What's New&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Coming Soon&#10;Stay tuned for more exciting updates!"
                rows={18}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-violet-500 resize-y"
              />
            )}

            {/* Recipients */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-5">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Recipients</h3>
              <div className="flex gap-2 flex-wrap mb-3">
                <button
                  onClick={() => { setSelectedRecipients('all'); setCheckedEmails(new Set()); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedRecipients === 'all'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  All Subscribers ({subs.length})
                </button>
                {orgList.map(org => (
                  <button
                    key={org}
                    onClick={() => {
                      setSelectedRecipients('selected');
                      const orgEmails = subs.filter(s => (s.organisation || s.org) === org).map(s => s.email);
                      setCheckedEmails(new Set(orgEmails));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedRecipients === 'selected' && subs.filter(s => (s.organisation || s.org) === org).every(s => checkedEmails.has(s.email)) && subs.filter(s => (s.organisation || s.org) === org).length === checkedEmails.size
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'bg-gray-700/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    🏢 {org} ({subs.filter(s => (s.organisation || s.org) === org).length})
                  </button>
                ))}
                <button
                  onClick={() => setSelectedRecipients('selected')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedRecipients === 'selected'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  Custom {checkedEmails.size > 0 && `(${checkedEmails.size})`}
                </button>
              </div>

              {selectedRecipients === 'selected' && (
                <div className="max-h-48 overflow-y-auto space-y-1.5 mt-3 pr-2">
                  {subs.length === 0 ? (
                    <p className="text-gray-500 text-xs">No subscribers yet. Add some in the Subscribers tab.</p>
                  ) : (
                    Object.entries(subscribersByOrg).map(([org, subs]) => (
                      <div key={org}>
                        <div className="flex items-center gap-2 mb-1 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={subs.every(s => checkedEmails.has(s.email))}
                              onChange={() => {
                                const allChecked = subs.every(s => checkedEmails.has(s.email));
                                setCheckedEmails(prev => {
                                  const next = new Set(prev);
                                  for (const s of subs) {
                                    if (allChecked) next.delete(s.email);
                                    else next.add(s.email);
                                  }
                                  return next;
                                });
                              }}
                              className="rounded border-gray-600 text-violet-500 focus:ring-violet-500 bg-gray-700"
                            />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{org}</span>
                          </label>
                          <span className="text-xs text-gray-600">({subs.length})</span>
                        </div>
                        {subs.map(s => (
                          <label key={s.email} className="flex items-center gap-3 p-2 pl-6 rounded-lg hover:bg-white/[0.03] cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={checkedEmails.has(s.email)}
                              onChange={() => toggleEmail(s.email)}
                              className="rounded border-gray-600 text-violet-500 focus:ring-violet-500 bg-gray-700"
                            />
                            <span className="text-white">{s.name || s.email}</span>
                            {s.name && <span className="text-gray-500 text-xs">{s.email}</span>}
                          </label>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Send / Schedule */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleSend}
                disabled={sending || !subject.trim() || !markdown.trim() || (selectedRecipients === 'selected' && checkedEmails.size === 0)}
                className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? '⏳ Sending...' : `📤 Send Now`}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"
                />
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleSchedule}
                  disabled={scheduling || !subject.trim() || !markdown.trim() || !scheduleDate}
                  className="px-4 py-2.5 bg-amber-600/15 text-amber-300 border border-amber-500/30 rounded-lg text-sm font-medium hover:bg-amber-600/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {scheduling ? 'Scheduling...' : '⏰ Schedule'}
                </button>
              </div>
            </div>

            {/* Send Result */}
            {sendResult && (
              <div className={`p-4 rounded-xl border ${sendResult.success ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                {sendResult.success ? (
                  <p>✅ Sent to {sendResult.sent} recipient{sendResult.sent !== 1 ? 's' : ''}{sendResult.failed > 0 ? ` (${sendResult.failed} failed)` : ''}</p>
                ) : (
                  <p>❌ {sendResult.error}</p>
                )}
              </div>
            )}

            {/* ── Test Email ── */}
            <div className="bg-gray-800/40 rounded-xl border border-dashed border-gray-600/50 p-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">🧪 Send Test Email</h4>
              <p className="text-xs text-gray-500 mb-3">Send a sample email with mock regulatory data using the current theme ({emailTheme}) and template ({templateType}).</p>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleSendTest}
                  disabled={sendingTest || !testEmail.trim()}
                  className="px-4 py-2.5 bg-teal-600/15 text-teal-300 border border-teal-500/30 rounded-lg text-sm font-medium hover:bg-teal-600/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {sendingTest ? '⏳ Sending...' : '🧪 Send Test'}
                </button>
              </div>
              {testResult && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${testResult.success ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                  {testResult.success ? `✅ ${testResult.message}` : `❌ ${testResult.error}`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ SUBSCRIBERS TAB ════ */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            {/* Add new */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Add Subscribers</h3>
              <form onSubmit={handleAddSubscribers} className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Organisation / Group</label>
                    <input
                      type="text"
                      value={newOrg}
                      onChange={e => setNewOrg(e.target.value)}
                      placeholder="e.g. Mozzartbet, Internal, Partner"
                      list="org-suggestions"
                      className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
                    />
                    <datalist id="org-suggestions">
                      {orgList.map(o => <option key={o} value={o} />)}
                    </datalist>
                  </div>
                </div>
                <textarea
                  value={newEmails}
                  onChange={e => setNewEmails(e.target.value)}
                  placeholder="Enter emails separated by commas or new lines&#10;e.g. john@company.com, jane@company.com&#10;Or: John Doe <john@company.com>"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 resize-none"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={adding || !newEmails.trim()}
                    className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-40"
                  >
                    {adding ? 'Adding...' : '➕ Add Subscribers'}
                  </button>
                  <button
                    type="button"
                    onClick={handleImportOnboarding}
                    disabled={importing}
                    className="px-4 py-2 bg-blue-600/15 text-blue-300 border border-blue-500/30 text-sm font-medium rounded-lg hover:bg-blue-600/25 transition-colors disabled:opacity-40"
                  >
                    {importing ? 'Importing...' : '📥 Import from Onboarding'}
                  </button>
                </div>
              </form>
            </div>

            {/* Org filter */}
            {orgList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">Filter:</span>
                <button
                  onClick={() => setOrgFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    orgFilter === 'all'
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
                  }`}
                >
                  All ({subs.length})
                </button>
                {Object.entries(subscribersByOrg).map(([org, subs]) => (
                  <button
                    key={org}
                    onClick={() => setOrgFilter(org)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      orgFilter === org
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
                    }`}
                  >
                    {org} ({subs.length})
                  </button>
                ))}
              </div>
            )}

            {/* Grouped list */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-700/40 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {orgFilter === 'all' ? `All Subscribers (${subs.length})` : `${orgFilter} (${filteredSubscribers.length})`}
                </h3>
                {subs.length > 0 && (
                  <button
                    onClick={() => {
                      const list = orgFilter === 'all' ? subs : filteredSubscribers;
                      const csv = 'Email,Name,Organisation,Added At,Source\n' + list.map(s =>
                        `"${s.email}","${s.name || ''}","${s.organisation || s.org || ''}","${s.addedAt || ''}","${s.source || 'manual'}"`
                      ).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `subscribers${orgFilter !== 'all' ? '-' + orgFilter.replace(/[^a-z0-9]/gi, '-').toLowerCase() : ''}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    📥 Export CSV
                  </button>
                )}
              </div>

              {filteredSubscribers.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="text-4xl mb-4 block">👥</span>
                  <h3 className="text-white font-semibold mb-2">No subscribers yet</h3>
                  <p className="text-gray-400 text-sm">Add emails above or import from onboarding data</p>
                </div>
              ) : (
                orgFilter === 'all' && orgList.length > 0 ? (
                  // Grouped view
                  <div>
                    {Object.entries(subscribersByOrg).map(([org, subs]) => (
                      <div key={org}>
                        <div className="px-5 py-2.5 bg-gray-900/40 border-b border-gray-700/30 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400 tracking-wide uppercase">{org}</span>
                          <span className="text-xs text-gray-500">{subs.length} subscriber{subs.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="divide-y divide-gray-700/20">
                          {subs.map(s => (
                            <SubscriberRow key={s.email} subscriber={s} onRemove={handleRemove} onUpdate={async (email, updates) => {
                              await fetch('/api/updates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-subscriber', email, updates }) });
                              loadData();
                            }} orgList={orgList} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Flat view
                  <div className="divide-y divide-gray-700/30">
                    {filteredSubscribers.map(s => (
                      <SubscriberRow key={s.email} subscriber={s} onRemove={handleRemove} onUpdate={async (email, updates) => {
                        await fetch('/api/updates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update-subscriber', email, updates }) });
                        loadData();
                      }} orgList={orgList} />
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ════ ORGANISATIONS TAB ════ */}
        {activeTab === 'organisations' && (
          <OrganisationsTab
            organisations={organisations}
            setOrganisations={setOrganisations}
            subscribers={subs}
            loadData={loadData}
          />
        )}

        {/* ════ HISTORY TAB ════ */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {(Array.isArray(history) ? history : []).length === 0 ? (
              <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-12 text-center">
                <span className="text-4xl mb-4 block">📜</span>
                <h3 className="text-white font-semibold mb-2">No updates sent yet</h3>
                <p className="text-gray-400 text-sm">Your sent updates will appear here</p>
              </div>
            ) : (
              (Array.isArray(history) ? history : []).map(h => (
                <HistoryCard key={h.id} item={h} />
              ))
            )}
          </div>
        )}

        {/* ════ SCHEDULED TAB ════ */}
        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-200 text-sm">
              💡 Scheduled updates require a cron job calling <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">POST /api/updates</code> with <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">{`{"action": "send-scheduled"}`}</code> to be processed. Set up a Vercel Cron or external service to call this endpoint periodically.
            </div>

            {(Array.isArray(scheduled) ? scheduled : []).filter(s => !s.status || s.status === 'pending').length === 0 ? (
              <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-12 text-center">
                <span className="text-4xl mb-4 block">⏰</span>
                <h3 className="text-white font-semibold mb-2">No scheduled updates</h3>
                <p className="text-gray-400 text-sm">Schedule updates from the Compose tab</p>
              </div>
            ) : (
              (Array.isArray(scheduled) ? scheduled : []).filter(s => !s.status || s.status === 'pending').reverse().map(s => (
                <div key={s.id} className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{s.subject}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-full">
                        ⏰ {new Date(s.scheduledFor).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleCancelScheduled(s.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 line-clamp-3">
                    {(s.markdown || '').slice(0, 200)}...
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ════ DATA TAB ════ */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Data & Operations</h2>

            {/* System Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatCard icon="👥" label="Subscribers" value={subs.length} color="blue" />
              <StatCard icon="🏢" label="Organisations" value={orgList.length} color="purple" />
              <StatCard icon="📤" label="Updates Sent" value={(Array.isArray(history) ? history : []).length} color="green" />
              <StatCard icon="⏰" label="Scheduled" value={(Array.isArray(scheduled) ? scheduled : []).filter(s => !s.status || s.status === 'pending').length} color="amber" />
              <StatCard
                icon="📊"
                label="Total Emails"
                value={(Array.isArray(history) ? history : []).reduce((sum, h) => sum + (h.sent || 0), 0)}
                color="purple"
              />
            </div>

            {/* Markdown Source Inspector */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Markdown Source Inspector</h3>
              <p className="text-xs text-gray-400 mb-3">Paste or upload markdown to inspect its structure before composing an email.</p>
              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 px-3 py-2 bg-violet-600/15 text-violet-300 border border-violet-500/30 rounded-lg cursor-pointer hover:bg-violet-600/25 transition-colors text-xs font-medium">
                  📄 Upload File
                  <input type="file" accept=".md,.markdown,.txt,.json" onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => { if (typeof ev.target?.result === 'string') setDataMarkdown(ev.target.result); };
                    reader.readAsText(file);
                    e.target.value = '';
                  }} className="hidden" />
                </label>
                {dataMarkdown && (
                  <button onClick={() => setDataMarkdown('')} className="text-xs text-gray-500 hover:text-gray-300">Clear</button>
                )}
                {dataMarkdown && (
                  <span className="text-xs text-gray-500 ml-auto">{dataMarkdown.length.toLocaleString()} chars</span>
                )}
              </div>
              <textarea
                value={dataMarkdown}
                onChange={e => setDataMarkdown(e.target.value)}
                placeholder="Paste markdown content here to inspect..."
                rows={10}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 font-mono text-xs focus:outline-none focus:border-violet-500 resize-y"
              />
              {dataMarkdown && (
                <div className="mt-3 space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Parsed Structure</h4>
                  <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 text-xs text-gray-300 max-h-64 overflow-y-auto">
                    {(() => {
                      const countries = dataMarkdown.match(/^##\s+.+$/gm);
                      const updates = dataMarkdown.match(/^###\s+.+$/gm);
                      const tags = dataMarkdown.match(/\*\*Tags:\*\*\s*.+$/gm);
                      return (
                        <div className="space-y-2">
                          <p><span className="text-gray-500">Jurisdictions:</span> <span className="text-white font-medium">{countries?.length || 0}</span></p>
                          <p><span className="text-gray-500">Updates:</span> <span className="text-white font-medium">{updates?.length || 0}</span></p>
                          <p><span className="text-gray-500">Tagged entries:</span> <span className="text-white font-medium">{tags?.length || 0}</span></p>
                          {countries && (
                            <div className="mt-2 pt-2 border-t border-gray-700">
                              <p className="text-gray-500 mb-1">Jurisdictions found:</p>
                              {countries.map((c, i) => <p key={i} className="text-gray-300 pl-2">{c.replace(/^##\s+/, '')}</p>)}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* AI Prompt Reference */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">AI Prompt Reference</h3>
                <button
                  onClick={() => { navigator.clipboard.writeText(HORIZON_SCAN_PROMPT); alert('Prompt copied to clipboard!'); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  📋 Copy Prompt
                </button>
              </div>
              <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">{HORIZON_SCAN_PROMPT}</pre>
            </div>

            {/* Export Tools */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Export Tools</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const csv = 'Email,Name,Organisation,Added At,Source\n' + subs.map(s =>
                      `"${s.email}","${s.name || ''}","${s.organisation || s.org || ''}","${s.addedAt || ''}","${s.source || 'manual'}"`
                    ).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-blue-600/15 text-blue-300 border border-blue-500/30 text-sm font-medium rounded-lg hover:bg-blue-600/25 transition-colors"
                >
                  📥 Export Subscribers CSV
                </button>
                <button
                  onClick={() => {
                    const data = JSON.stringify({ subscribers: subs, organisations, history, scheduled }, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'xhs-data-export.json'; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 bg-gray-700/50 text-gray-300 border border-gray-600/50 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  📦 Export All Data (JSON)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── History Card ── */
function HistoryCard({ item: h }) {
  const [expanded, setExpanded] = useState(false);
  const sent = h.sent ?? h.results?.filter(r => r.success).length ?? h.recipientCount ?? 0;
  const failed = h.failed ?? h.results?.filter(r => !r.success).length ?? 0;

  return (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">{h.subject}</h3>
            <span className="text-xs text-gray-500">{new Date(h.sentAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="text-green-400">✅ {sent}</span>
            {failed > 0 && <span className="text-red-400">❌ {failed}</span>}
            <span className="text-xs text-gray-500">to {h.recipientCount ?? 0} recipient{h.recipientCount !== 1 ? 's' : ''}</span>
            {h.scheduled && <span className="text-xs bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full">Scheduled</span>}
            <span className={`text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-700/40 pt-4">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400">
            {h.markdown ? <ReactMarkdown>{h.markdown}</ReactMarkdown> : <p className="text-gray-500 italic">Content not available</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Subscriber Row ── */
function SubscriberRow({ subscriber: s, onRemove, onUpdate, orgList }) {
  const [editing, setEditing] = useState(false);
  const [editOrg, setEditOrg] = useState(s.organisation || s.org || '');
  const orgName = s.organisation || s.org || '';

  return (
    <div className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] group">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-white text-sm truncate">{s.name || s.email}</span>
        {s.name && <span className="text-gray-500 text-xs truncate">{s.email}</span>}
        {!editing && orgName && (
          <span className="text-xs bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full flex-shrink-0">{orgName}</span>
        )}
        {!editing && !orgName && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            + org
          </button>
        )}
        {editing && (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={editOrg}
              onChange={e => setEditOrg(e.target.value)}
              placeholder="Organisation"
              list="edit-org-suggestions"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onUpdate(s.email, { organisation: editOrg.trim() });
                  setEditing(false);
                }
                if (e.key === 'Escape') setEditing(false);
              }}
              className="px-2 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs text-white w-32 focus:outline-none focus:border-violet-500"
            />
            <datalist id="edit-org-suggestions">
              {orgList.map(o => <option key={o} value={o} />)}
            </datalist>
            <button
              onClick={() => { onUpdate(s.email, { organisation: editOrg.trim() }); setEditing(false); }}
              className="text-xs text-green-400 hover:text-green-300"
            >✓</button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-gray-500 hover:text-gray-300"
            >✕</button>
          </div>
        )}
        {s.source && <span className="text-xs text-gray-600 flex-shrink-0">({s.source})</span>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {!editing && orgName && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✏️
          </button>
        )}
        <span className="text-xs text-gray-600">{s.addedAt ? new Date(s.addedAt).toLocaleDateString() : ''}</span>
        <button
          onClick={() => onRemove(s.email)}
          className="text-xs text-red-400/60 hover:text-red-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/* ── Organisations Tab ── */
function OrganisationsTab({ organisations, setOrganisations, subscribers, loadData }) {
  const [editing, setEditing] = useState(null); // org id or 'new'
  const [form, setForm] = useState({ name: '', logoUrl: '', jurisdictions: '' });
  const [saving, setSaving] = useState(false);
  const [expandedOrg, setExpandedOrg] = useState(null); // org id to show members
  const [addingToOrg, setAddingToOrg] = useState(null); // org name currently adding to
  const [newSubEmails, setNewSubEmails] = useState('');
  const [addingSub, setAddingSub] = useState(false);

  const allSubs = Array.isArray(subscribers) ? subscribers : [];
  const orgs = Array.isArray(organisations) ? organisations : [];

  function startEdit(org) {
    setEditing(org?.id || 'new');
    setForm({
      name: org?.name || '',
      logoUrl: org?.logoUrl || '',
      jurisdictions: (org?.jurisdictions || []).join(', '),
    });
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const organisation = {
        ...(editing !== 'new' ? { id: editing } : {}),
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim(),
        jurisdictions: form.jurisdictions.split(',').map(j => j.trim()).filter(Boolean),
      };
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save-organisation', organisation }),
      });
      const data = await res.json();
      if (data.success) {
        setOrganisations(Array.isArray(data.organisations) ? data.organisations : []);
        setEditing(null);
      }
    } catch (err) {
      console.error('Failed to save organisation:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this organisation? Subscribers will not be removed.')) return;
    try {
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-organisation', organisationId: id }),
      });
      const data = await res.json();
      if (data.success) setOrganisations(Array.isArray(data.organisations) ? data.organisations : []);
    } catch (err) {
      console.error('Failed to delete organisation:', err);
    }
  }

  async function handleAddSubsToOrg(orgName) {
    if (!newSubEmails.trim()) return;
    setAddingSub(true);
    try {
      const emails = newSubEmails
        .split(/[,\n;]+/)
        .map(e => e.trim())
        .filter(Boolean)
        .map(e => {
          const match = e.match(/^(.+?)\s*<(.+?)>$/);
          if (match) return { name: match[1].trim(), email: match[2].trim() };
          return { email: e };
        });
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-subscribers', emails, org: orgName }),
      });
      const data = await res.json();
      if (data.success) {
        setNewSubEmails('');
        setAddingToOrg(null);
        loadData();
      }
    } catch (err) {
      console.error('Failed to add subscribers:', err);
    } finally {
      setAddingSub(false);
    }
  }

  async function handleRemoveSub(email) {
    try {
      await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-subscriber', email }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to remove subscriber:', err);
    }
  }

  async function handleReassignSub(email, newOrgName) {
    try {
      await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-subscriber', email, updates: { organisation: newOrgName } }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to reassign subscriber:', err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Organisations</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage organisations, their subscribers, logos, and tracked jurisdictions</p>
        </div>
        <button
          onClick={() => startEdit(null)}
          className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-500 transition-colors"
        >
          + Add Organisation
        </button>
      </div>

      {/* Edit / Add Form */}
      {editing && (
        <div className="bg-gray-800/60 rounded-xl border border-violet-500/30 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">{editing === 'new' ? 'New Organisation' : 'Edit Organisation'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Organisation Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Mozzartbet"
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Logo URL</label>
              <input
                type="url"
                value={form.logoUrl}
                onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
              />
              <p className="text-xs text-gray-500 mt-1">PNG or JPG hosted publicly. Will appear in email header alongside XHS icon.</p>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tracked Jurisdictions</label>
            <input
              type="text"
              value={form.jurisdictions}
              onChange={e => setForm(f => ({ ...f, jurisdictions: e.target.value }))}
              placeholder="e.g. United Kingdom, Serbia, Nigeria, Kenya"
              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated. Horizon Scan emails will filter to only these jurisdictions for this org&apos;s subscribers.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving...' : '💾 Save'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
          {form.logoUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
              <img src={form.logoUrl} alt="Logo preview" className="h-10 w-auto max-w-[120px] object-contain" onError={e => { e.target.style.display = 'none'; }} />
              <span className="text-xs text-gray-400">Logo preview</span>
            </div>
          )}
        </div>
      )}

      {/* Org List */}
      {orgs.length === 0 && !editing ? (
        <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-12 text-center">
          <span className="text-4xl mb-4 block">🏢</span>
          <h3 className="text-white font-semibold mb-2">No organisations configured</h3>
          <p className="text-gray-400 text-sm">Add organisations to enable personalised emails with client logos and jurisdiction filtering</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orgs.map(org => {
            const orgSubs = allSubs.filter(s => (s.organisation || s.org || '').toLowerCase() === (org.name || '').toLowerCase());
            const isExpanded = expandedOrg === org.id;
            const isAdding = addingToOrg === org.name;
            return (
              <div key={org.id} className="bg-gray-800/60 rounded-xl border border-gray-700/50 overflow-hidden">
                {/* Org Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => setExpandedOrg(isExpanded ? null : org.id)}
                      className="flex items-center gap-4 text-left group"
                    >
                      {org.logoUrl ? (
                        <img src={org.logoUrl} alt={org.name} className="h-10 w-auto max-w-[100px] object-contain rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-lg">🏢</div>
                      )}
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-violet-300 transition-colors">{org.name}</h3>
                        <p className="text-xs text-gray-500">{orgSubs.length} subscriber{orgSubs.length !== 1 ? 's' : ''}</p>
                      </div>
                      <span className={`text-xs text-gray-500 transition-transform ml-2 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setAddingToOrg(isAdding ? null : org.name); setNewSubEmails(''); }}
                        className={`text-xs px-2 py-1 rounded transition-colors ${isAdding ? 'bg-violet-600/20 text-violet-300' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >
                        👤+ Add User
                      </button>
                      <button
                        onClick={() => startEdit(org)}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/5"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="text-xs text-red-400/60 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Jurisdictions */}
                  {Array.isArray(org.jurisdictions) && org.jurisdictions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {org.jurisdictions.map(j => (
                        <span key={j} className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">{j}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Subscriber Form (inline) */}
                {isAdding && (
                  <div className="px-5 pb-4 border-t border-gray-700/30 pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSubEmails}
                        onChange={e => setNewSubEmails(e.target.value)}
                        placeholder="john@company.com, Jane Doe <jane@company.com>"
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubsToOrg(org.name); } }}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
                      />
                      <button
                        onClick={() => handleAddSubsToOrg(org.name)}
                        disabled={addingSub || !newSubEmails.trim()}
                        className="px-3 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-500 transition-colors disabled:opacity-40"
                      >
                        {addingSub ? '...' : '➕ Add'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Comma or newline separated. Use &quot;Name &lt;email&gt;&quot; format for named entries.</p>
                  </div>
                )}

                {/* Subscriber List (expanded) */}
                {isExpanded && (
                  <div className="border-t border-gray-700/30">
                    {orgSubs.length === 0 ? (
                      <div className="px-5 py-6 text-center">
                        <p className="text-gray-500 text-sm">No subscribers in this organisation yet.</p>
                        <button
                          onClick={() => { setAddingToOrg(org.name); setNewSubEmails(''); }}
                          className="text-xs text-violet-400 hover:text-violet-300 mt-2"
                        >
                          + Add the first subscriber
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-700/20">
                        {orgSubs.map(s => (
                          <div key={s.email} className="px-5 py-2.5 flex items-center justify-between group hover:bg-white/[0.02]">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                                {(s.name || s.email)[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="text-white text-sm truncate block">{s.name || s.email}</span>
                                {s.name && <span className="text-gray-500 text-xs truncate block">{s.email}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              {orgs.length > 1 && (
                                <select
                                  value=""
                                  onChange={e => { if (e.target.value) handleReassignSub(s.email, e.target.value); }}
                                  className="bg-gray-700 border border-gray-600 rounded text-xs text-gray-300 px-1.5 py-1 focus:outline-none cursor-pointer"
                                >
                                  <option value="">Move to...</option>
                                  {orgs.filter(o => o.name !== org.name).map(o => (
                                    <option key={o.id} value={o.name}>{o.name}</option>
                                  ))}
                                </select>
                              )}
                              <button
                                onClick={() => handleRemoveSub(s.email)}
                                className="text-xs text-red-400/60 hover:text-red-300 px-1"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Unassigned subscribers */}
      {(() => {
        const orgNames = new Set(orgs.map(o => (o.name || '').toLowerCase()));
        const unassigned = allSubs.filter(s => {
          const sOrg = (s.organisation || s.org || '').toLowerCase();
          return !sOrg || !orgNames.has(sOrg);
        });
        if (unassigned.length === 0) return null;
        return (
          <div className="bg-gray-800/60 rounded-xl border border-amber-500/20 overflow-hidden">
            <div className="px-5 py-3 bg-amber-500/5 border-b border-amber-500/20 flex items-center justify-between">
              <span className="text-sm font-medium text-amber-300">⚠️ Unassigned Subscribers ({unassigned.length})</span>
            </div>
            <div className="divide-y divide-gray-700/20">
              {unassigned.map(s => (
                <div key={s.email} className="px-5 py-2.5 flex items-center justify-between group hover:bg-white/[0.02]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                      {(s.name || s.email)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-white text-sm truncate block">{s.name || s.email}</span>
                      {s.name && <span className="text-gray-500 text-xs truncate block">{s.email}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {orgs.length > 0 && (
                      <select
                        value=""
                        onChange={e => { if (e.target.value) handleReassignSub(s.email, e.target.value); }}
                        className="bg-gray-700 border border-gray-600 rounded text-xs text-gray-300 px-1.5 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="">Assign to...</option>
                        {orgs.map(o => (
                          <option key={o.id} value={o.name}>{o.name}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => handleRemoveSub(s.email)}
                      className="text-xs text-red-400/60 hover:text-red-300 px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
