"use client";
import { useState } from 'react';
import { useWorkflow, STAGES } from '../WorkflowContext';

const PRIORITIES = [
  { key: 'high', label: 'High', color: 'text-red-400 bg-red-500/15 border-red-500/30' },
  { key: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30' },
  { key: 'low', label: 'Low', color: 'text-gray-400 bg-gray-500/15 border-gray-500/30' },
];

const IDEA_CATEGORIES = [
  'AI Regulation', 'Payments', 'Gambling', 'Crypto', 'Cross-sector',
  'Enforcement Action', 'New Legislation', 'Consultation', 'Market Trend', 'Opinion Piece',
];

export default function IdeasPage() {
  const { items, addItem, updateItem, deleteItem, moveToStage, getByStage } = useWorkflow();
  const ideas = getByStage('ideas');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', tags: [], notes: '' });
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [mdImportCount, setMdImportCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const LLM_PROMPT = `You are helping me generate ideas for Pimlico XHS, a cross-border regulatory intelligence platform covering AI Regulation, Payments, Crypto, and Gambling.

For each idea, provide:
- TITLE: Specific headline (max 120 chars) — include regulation name, jurisdiction, and angle
- PRIORITY: high (breaking/urgent) | medium (ongoing developments) | low (background/evergreen)
- TAGS: From [AI Regulation, Payments, Gambling, Crypto, Cross-sector, Enforcement Action, New Legislation, Consultation, Market Trend, Opinion Piece]
- DESCRIPTION: 2-4 sentences — the angle, why it matters, key points to cover
- NOTES: Source links, related regulations, cross-references

Example:
TITLE: EU AI Act — First Enforcement Actions Expected Q1 2026
PRIORITY: high
TAGS: AI Regulation, Enforcement Action
DESCRIPTION: The EU AI Act prohibited practices provisions took effect 2 Feb 2025. Regulators expected to issue first actions in Q1 2026. Analyse likely targets, national authority coordination, and practical compliance steps.
NOTES: Source: EU AI Office press release (Jan 2026)`;

  const resetForm = () => {
    setForm({ title: '', description: '', priority: 'medium', tags: [], notes: '' });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateItem(editingId, form);
    } else {
      addItem({ ...form, stage: 'ideas' });
    }
    resetForm();
  };

  const startEdit = (item) => {
    setForm({ title: item.title, description: item.description, priority: item.priority, tags: item.tags, notes: item.notes });
    setEditingId(item.id);
    setShowAdd(true);
  };

  // PDF upload handler
  const handlePdfUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    let imported = 0;

    // Dynamically load pdf.js from CDN if not already loaded
    if (!window.pdfjsLib) {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch {
        alert('Failed to load PDF reader. Please check your internet connection.');
        e.target.value = '';
        return;
      }
    }

    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        if (!fullText.trim()) continue;

        // Split on double newlines to get sections, or treat as one idea
        const paragraphs = fullText.split(/\n{2,}/).filter(p => p.trim());
        if (paragraphs.length <= 3) {
          // Treat whole PDF as one idea
          const title = paragraphs[0]?.trim().slice(0, 120) || file.name.replace(/\.pdf$/i, '');
          const description = paragraphs.slice(1).join('\n').trim();
          const detectedTags = [];
          const lowerContent = fullText.toLowerCase();
          for (const cat of IDEA_CATEGORIES) {
            if (lowerContent.includes(cat.toLowerCase())) detectedTags.push(cat);
          }
          addItem({ title, description, priority: 'medium', tags: detectedTags, notes: `Imported from PDF: ${file.name} (${pdf.numPages} pages)`, stage: 'ideas' });
          imported++;
        } else {
          // Multiple sections — each major section becomes an idea
          for (let j = 0; j < paragraphs.length; j++) {
            const para = paragraphs[j].trim();
            if (para.length < 10) continue; // skip tiny fragments
            const title = para.split(/[.!?\n]/)[0].trim().slice(0, 120);
            const description = para.length > title.length ? para.slice(title.length).trim() : '';
            const detectedTags = [];
            const lowerContent = para.toLowerCase();
            for (const cat of IDEA_CATEGORIES) {
              if (lowerContent.includes(cat.toLowerCase())) detectedTags.push(cat);
            }
            addItem({ title, description, priority: 'medium', tags: detectedTags, notes: `Imported from PDF: ${file.name} (section ${j + 1})`, stage: 'ideas' });
            imported++;
          }
        }
      } catch (err) {
        console.error('Failed to parse PDF file:', file.name, err);
        alert(`Could not read ${file.name}. Make sure it's a valid PDF.`);
      }
    }

    setMdImportCount(imported);
    setTimeout(() => setMdImportCount(0), 3000);
    e.target.value = '';
  };

  // Markdown upload → auto-fill form (single idea, review before saving)
  const handleMdAutoFill = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n');

      // Extract title: first # heading or first non-empty line
      let extractedTitle = '';
      let titleLineIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (/^#{1,3}\s+/.test(trimmed)) {
          extractedTitle = trimmed.replace(/^#{1,3}\s+/, '').trim();
          titleLineIdx = i;
          break;
        }
      }
      if (!extractedTitle) {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim()) {
            extractedTitle = lines[i].trim().replace(/^#+\s*/, '');
            titleLineIdx = i;
            break;
          }
        }
      }

      // Extract description: body text after title (skip headings & dividers)
      let descLines = [];
      for (let i = (titleLineIdx >= 0 ? titleLineIdx + 1 : 0); i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (/^#{1,3}\s+/.test(trimmed) && descLines.length > 0) break; // stop at next heading
        if (/^[-*_]{3,}$/.test(trimmed)) continue; // skip dividers
        if (trimmed) descLines.push(trimmed.replace(/^[-*+]\s+/, ''));
      }
      const extractedDesc = descLines.join('\n').trim();

      // Detect priority from keywords
      const lowerText = text.toLowerCase();
      let detectedPriority = 'medium';
      if (lowerText.includes('urgent') || lowerText.includes('critical') || lowerText.includes('breaking') || lowerText.includes('high priority')) {
        detectedPriority = 'high';
      } else if (lowerText.includes('low priority') || lowerText.includes('minor') || lowerText.includes('background')) {
        detectedPriority = 'low';
      }

      // Detect category tags from content
      const detectedTags = [];
      for (const cat of IDEA_CATEGORIES) {
        if (lowerText.includes(cat.toLowerCase())) detectedTags.push(cat);
      }
      // Also grab #hashtags and match against categories
      const hashTags = text.match(/#(\w{3,})/g);
      if (hashTags) {
        for (const ht of hashTags) {
          const clean = ht.replace('#', '');
          const match = IDEA_CATEGORIES.find(c => c.toLowerCase().replace(/\s+/g, '') === clean.toLowerCase() || c.toLowerCase() === clean.toLowerCase());
          if (match && !detectedTags.includes(match)) detectedTags.push(match);
        }
      }

      // Auto-fill the form and open it
      setForm({
        title: extractedTitle || file.name.replace(/\.(md|markdown|txt)$/i, ''),
        description: extractedDesc.slice(0, 1000),
        priority: detectedPriority,
        tags: detectedTags.slice(0, 6),
        notes: `Imported from ${file.name}`,
      });
      setEditingId(null);
      setShowAdd(true);

      setMdImportCount(1);
      setTimeout(() => setMdImportCount(0), 3000);
    } catch (err) {
      console.error('Failed to parse markdown file:', file.name, err);
    }
    e.target.value = '';
  };

  // Markdown bulk upload handler (multiple ideas at once)
  const handleMdUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    let imported = 0;

    for (const file of files) {
      try {
        const text = await file.text();
        // Parse markdown: # headings become idea titles, following text becomes description
        const lines = text.split('\n');
        let currentTitle = '';
        let currentDesc = '';
        let currentTags = [];
        const flush = () => {
          if (currentTitle.trim()) {
            // Auto-detect category tags from content
            const detectedTags = [];
            const lowerContent = (currentTitle + ' ' + currentDesc).toLowerCase();
            for (const cat of IDEA_CATEGORIES) {
              if (lowerContent.includes(cat.toLowerCase())) detectedTags.push(cat);
            }
            addItem({
              title: currentTitle.trim(),
              description: currentDesc.trim(),
              priority: 'medium',
              tags: detectedTags.length > 0 ? detectedTags : currentTags,
              notes: `Imported from ${file.name}`,
              stage: 'ideas',
            });
            imported++;
          }
          currentTitle = '';
          currentDesc = '';
          currentTags = [];
        };

        for (const line of lines) {
          const trimmed = line.trim();
          // # or ## headings start new ideas
          if (/^#{1,3}\s+/.test(trimmed)) {
            flush();
            currentTitle = trimmed.replace(/^#{1,3}\s+/, '');
          }
          // --- or *** separators also start new sections
          else if (/^[-*_]{3,}$/.test(trimmed)) {
            flush();
          }
          // Bullet points or text becomes description
          else if (trimmed) {
            const cleaned = trimmed.replace(/^[-*+]\s+/, '');
            currentDesc += (currentDesc ? '\n' : '') + cleaned;
            // Check for tags like [tag] or #tag
            const tagMatches = cleaned.match(/#(\w+)/g);
            if (tagMatches) currentTags.push(...tagMatches.map(t => t.replace('#', '')));
          }
        }
        flush(); // Don't forget the last section

        // If no headings found, treat the whole file as one idea
        if (imported === 0 && text.trim()) {
          const firstLine = text.trim().split('\n')[0].replace(/^#+\s*/, '').trim();
          addItem({
            title: firstLine || file.name.replace(/\.md$/i, ''),
            description: text.trim(),
            priority: 'medium',
            tags: [],
            notes: `Imported from ${file.name}`,
            stage: 'ideas',
          });
          imported = 1;
        }
      } catch (err) {
        console.error('Failed to parse markdown file:', file.name, err);
      }
    }

    setMdImportCount(imported);
    setTimeout(() => setMdImportCount(0), 3000);
    e.target.value = ''; // Reset file input
  };

  const filtered = ideas.filter(idea => {
    if (filterPriority !== 'all' && idea.priority !== filterPriority) return false;
    if (searchQ && !idea.title.toLowerCase().includes(searchQ.toLowerCase()) && !idea.description.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">💡 Ideas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Capture regulatory intelligence ideas and topics to develop</p>
        </div>
        <div className="flex items-center gap-2">
          {mdImportCount > 0 && <span className="px-3 py-1.5 bg-green-500/15 text-green-300 text-xs font-medium rounded-lg animate-pulse">✓ {mdImportCount} idea{mdImportCount !== 1 ? 's' : ''} imported</span>}
          <button onClick={() => setShowPrompt(p => !p)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${showPrompt ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            🤖 LLM Prompt
          </button>
          <label className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 cursor-pointer">
            � Upload PDF
            <input type="file" accept=".pdf" multiple onChange={handlePdfUpload} className="hidden" />
          </label>
          <label className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 cursor-pointer">
            📄 Bulk .md
            <input type="file" accept=".md,.markdown,.txt" multiple onChange={handleMdUpload} className="hidden" />
          </label>
          <label className="px-4 py-2 bg-emerald-600/80 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2 cursor-pointer">
            📄 Import .md → Auto-fill
            <input type="file" accept=".md,.markdown,.txt" onChange={handleMdAutoFill} className="hidden" />
          </label>
          <button onClick={() => { resetForm(); setShowAdd(true); }}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2">
            + New Idea
          </button>
        </div>
      </div>

      {/* LLM Prompt Panel */}
      {showPrompt && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">🤖 LLM Prompt — Copy this into ChatGPT / Claude / Copilot</h3>
            <button onClick={() => { navigator.clipboard.writeText(LLM_PROMPT); }}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-lg hover:bg-amber-500/30 transition-colors">
              📋 Copy Prompt
            </button>
          </div>
          <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[400px] overflow-y-auto border border-gray-700/50">{LLM_PROMPT}</pre>
          <p className="text-[11px] text-amber-400/60">Paste this prompt into your LLM, then provide your topic. Copy the output back here using "Import .md → Auto-fill" or "+ New Idea".</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAdd && (
        <div className="bg-gray-800 rounded-xl border border-purple-500/30 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-purple-300">{editingId ? '✏️ Edit Idea' : '💡 New Idea'}</h3>
          <input
            type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Idea title — e.g. 'EU AI Act enforcement trends Q1 2026'"
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
            autoFocus
          />
          <textarea
            value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="What's the angle? Key points to cover, sources, regulatory context..."
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
          />
          {/* Priority */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button key={p.key} type="button" onClick={() => setForm(prev => ({ ...prev, priority: p.key }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    form.priority === p.key ? p.color : 'text-gray-500 bg-gray-700/50 border-gray-600 hover:text-gray-300'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {/* Category Tags */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Categories</label>
            <div className="flex flex-wrap gap-1.5">
              {IDEA_CATEGORIES.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors ${
                    form.tags.includes(tag) ? 'text-purple-300 bg-purple-500/20 border-purple-500/40' : 'text-gray-500 bg-gray-700/50 border-gray-600/50 hover:text-gray-300'
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {/* Notes */}
          <textarea
            value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Additional notes, source links, references..."
            rows={2}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
          />
          <div className="flex items-center gap-2 justify-end">
            <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.title.trim()}
              className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 disabled:opacity-40 transition-colors">
              {editingId ? 'Update' : 'Save Idea'}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search ideas..."
          className="flex-1 max-w-xs px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500" />
        <div className="flex gap-1">
          <button onClick={() => setFilterPriority('all')}
            className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${filterPriority === 'all' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>All</button>
          {PRIORITIES.map(p => (
            <button key={p.key} onClick={() => setFilterPriority(p.key)}
              className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors ${filterPriority === p.key ? p.color : 'text-gray-500 hover:text-gray-300'}`}>
              {p.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-auto">{filtered.length} idea{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Ideas List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(idea => {
            const pri = PRIORITIES.find(p => p.key === idea.priority);
            const status = idea.status || 'pending'; // pending | accepted | rejected
            const statusStyles = {
              pending: 'border-gray-700/50',
              accepted: 'border-emerald-500/40 bg-emerald-500/5',
              rejected: 'border-red-500/30 bg-red-500/5 opacity-60',
            };
            return (
              <div key={idea.id} className={`bg-gray-800/70 border rounded-xl p-4 hover:border-gray-600/70 transition-colors group ${statusStyles[status]}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {/* Inline priority dropdown */}
                      <select
                        value={idea.priority || 'medium'}
                        onChange={e => updateItem(idea.id, { priority: e.target.value })}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border appearance-none cursor-pointer focus:outline-none ${pri?.color || 'text-gray-400 bg-gray-700 border-gray-600'}`}
                        style={{ paddingRight: '18px', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                      >
                        {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                      </select>
                      {/* Status badge */}
                      {status === 'accepted' && <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 rounded-full border border-emerald-500/30">✓ Accepted</span>}
                      {status === 'rejected' && <span className="px-2 py-0.5 text-[10px] font-semibold text-red-300 bg-red-500/20 rounded-full border border-red-500/30">✗ Rejected</span>}
                      {idea.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 text-[10px] text-purple-300/70 bg-purple-500/10 rounded-full">{t}</span>
                      ))}
                    </div>
                    <h3 className={`text-sm font-semibold ${status === 'rejected' ? 'text-gray-500 line-through' : 'text-white'}`}>{idea.title}</h3>
                    {idea.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{idea.description}</p>}
                    {idea.notes && <p className="text-[11px] text-gray-500 mt-1 italic">📎 {idea.notes}</p>}
                    <p className="text-[10px] text-gray-600 mt-2">{new Date(idea.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Accept / Reject buttons */}
                    {status !== 'accepted' && (
                      <button onClick={() => updateItem(idea.id, { status: 'accepted' })} title="Accept Idea"
                        className="p-1.5 text-emerald-400/70 hover:text-emerald-300 rounded-lg hover:bg-emerald-500/10 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </button>
                    )}
                    {status !== 'rejected' && (
                      <button onClick={() => updateItem(idea.id, { status: 'rejected' })} title="Reject Idea"
                        className="p-1.5 text-orange-400/70 hover:text-orange-300 rounded-lg hover:bg-orange-500/10 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                    {(status === 'accepted' || status === 'rejected') && (
                      <button onClick={() => updateItem(idea.id, { status: 'pending' })} title="Reset to Pending"
                        className="p-1.5 text-gray-400/70 hover:text-gray-300 rounded-lg hover:bg-gray-500/10 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                    )}
                    <button onClick={() => startEdit(idea)} title="Edit"
                      className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    {status === 'accepted' && (
                      <button onClick={() => moveToStage(idea.id, 'drafting')} title="Move to Drafting"
                        className="p-1.5 text-blue-400/70 hover:text-blue-300 rounded-lg hover:bg-blue-500/10 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </button>
                    )}
                    <button onClick={() => { if (confirm('Delete this idea?')) deleteItem(idea.id); }} title="Delete"
                      className="p-1.5 text-red-400/50 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/30">
          <div className="text-4xl mb-3">💡</div>
          <p className="text-gray-400 text-sm font-medium">No ideas yet</p>
          <p className="text-gray-500 text-xs mt-1 max-w-md mx-auto">Capture ideas about regulatory developments, market trends, enforcement actions, or opinion pieces to develop into content.</p>
          <button onClick={() => { resetForm(); setShowAdd(true); }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 transition-colors">
            + Capture First Idea
          </button>
        </div>
      )}
    </div>
  );
}
