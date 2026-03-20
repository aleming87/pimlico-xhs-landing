"use client";
import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

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
        setSubscribers(data.subscribers || []);
        setHistory(data.history || []);
        setScheduled(data.scheduled || []);
      }
    } catch (err) {
      console.error('Failed to load updates data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Compute org groups
  const orgList = [...new Set(subscribers.map(s => s.org || '').filter(Boolean))].sort();
  const subscribersByOrg = {};
  for (const s of subscribers) {
    const org = s.org || 'Ungrouped';
    if (!subscribersByOrg[org]) subscribersByOrg[org] = [];
    subscribersByOrg[org].push(s);
  }
  const filteredSubscribers = orgFilter === 'all'
    ? subscribers
    : subscribers.filter(s => (s.org || 'Ungrouped') === orgFilter);

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
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch && !subject) {
          setSubject(titleMatch[1]);
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
    if (!confirm(`Send this update to ${selectedRecipients === 'all' ? subscribers.length : checkedEmails.size} recipient(s)?`)) return;

    setSending(true);
    setSendResult(null);
    try {
      const recipientEmails = selectedRecipients === 'selected'
        ? Array.from(checkedEmails)
        : undefined;

      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', subject, markdown, recipientEmails }),
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

  /* ── Schedule update ── */
  async function handleSchedule() {
    if (!subject.trim() || !markdown.trim() || !scheduleDate) return;
    setScheduling(true);
    try {
      const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'schedule', subject, markdown, scheduledFor }),
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
    { key: 'history', label: 'History', icon: '📜' },
    { key: 'scheduled', label: 'Scheduled', icon: '⏰' },
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
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-violet-500/15 rounded-xl flex items-center justify-center text-lg">📧</span>
                Email Updates
              </h1>
              <p className="text-gray-400 text-sm mt-1">Send markdown-based email updates to subscribers</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            <StatCard icon="👥" label="Subscribers" value={subscribers.length} color="blue" />
            <StatCard icon="🏢" label="Organisations" value={orgList.length} color="purple" />
            <StatCard icon="📤" label="Updates Sent" value={history.length} color="green" />
            <StatCard icon="⏰" label="Scheduled" value={scheduled.filter(s => s.status === 'pending').length} color="amber" />
            <StatCard
              icon="📊"
              label="Total Emails"
              value={history.reduce((sum, h) => sum + (h.sent || 0), 0)}
              color="purple"
            />
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
                  All Subscribers ({subscribers.length})
                </button>
                {orgList.map(org => (
                  <button
                    key={org}
                    onClick={() => {
                      setSelectedRecipients('selected');
                      const orgEmails = subscribers.filter(s => s.org === org).map(s => s.email);
                      setCheckedEmails(new Set(orgEmails));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedRecipients === 'selected' && subscribers.filter(s => s.org === org).every(s => checkedEmails.has(s.email)) && subscribers.filter(s => s.org === org).length === checkedEmails.size
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'bg-gray-700/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    🏢 {org} ({subscribers.filter(s => s.org === org).length})
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
                  {subscribers.length === 0 ? (
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
                  All ({subscribers.length})
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
                  {orgFilter === 'all' ? `All Subscribers (${subscribers.length})` : `${orgFilter} (${filteredSubscribers.length})`}
                </h3>
                {subscribers.length > 0 && (
                  <button
                    onClick={() => {
                      const list = orgFilter === 'all' ? subscribers : filteredSubscribers;
                      const csv = 'Email,Name,Organisation,Added At,Source\n' + list.map(s =>
                        `"${s.email}","${s.name || ''}","${s.org || ''}","${s.addedAt || ''}","${s.source || 'manual'}"`
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

        {/* ════ HISTORY TAB ════ */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-12 text-center">
                <span className="text-4xl mb-4 block">📜</span>
                <h3 className="text-white font-semibold mb-2">No updates sent yet</h3>
                <p className="text-gray-400 text-sm">Your sent updates will appear here</p>
              </div>
            ) : (
              history.slice().reverse().map(h => (
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

            {scheduled.filter(s => s.status === 'pending').length === 0 ? (
              <div className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-12 text-center">
                <span className="text-4xl mb-4 block">⏰</span>
                <h3 className="text-white font-semibold mb-2">No scheduled updates</h3>
                <p className="text-gray-400 text-sm">Schedule updates from the Compose tab</p>
              </div>
            ) : (
              scheduled.filter(s => s.status === 'pending').reverse().map(s => (
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
                    {s.markdown.slice(0, 200)}...
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── History Card ── */
function HistoryCard({ item: h }) {
  const [expanded, setExpanded] = useState(false);

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
            <span className="text-green-400">✅ {h.sent}</span>
            {h.failed > 0 && <span className="text-red-400">❌ {h.failed}</span>}
            <span className="text-xs text-gray-500">to {h.recipientCount} recipient{h.recipientCount !== 1 ? 's' : ''}</span>
            {h.scheduled && <span className="text-xs bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full">Scheduled</span>}
            <span className={`text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-700/40 pt-4">
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400">
            <ReactMarkdown>{h.markdown}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Subscriber Row ── */
function SubscriberRow({ subscriber: s, onRemove, onUpdate, orgList }) {
  const [editing, setEditing] = useState(false);
  const [editOrg, setEditOrg] = useState(s.org || '');

  return (
    <div className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] group">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-white text-sm truncate">{s.name || s.email}</span>
        {s.name && <span className="text-gray-500 text-xs truncate">{s.email}</span>}
        {!editing && s.org && (
          <span className="text-xs bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full flex-shrink-0">{s.org}</span>
        )}
        {!editing && !s.org && (
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
                  onUpdate(s.email, { org: editOrg.trim() });
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
              onClick={() => { onUpdate(s.email, { org: editOrg.trim() }); setEditing(false); }}
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
        {!editing && s.org && (
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
