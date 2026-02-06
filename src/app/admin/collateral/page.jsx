"use client";
import { useState, useEffect, useRef } from 'react';
import { useArticles } from '../ArticlesContext';
import { useWorkflow } from '../WorkflowContext';

// Marketing asset element defaults
const DEFAULT_ELEMENTS = {
  pimlicoLogo: { x: 0.06, y: 0.88, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  xhsLogo: { x: 0.22, y: 0.88, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  image: { x: 0.62, y: 0, scale: 100, opacity: 100, zoom: 100, visible: true, dx: 0, dy: 0 },
  title: { x: 0.06, y: 0.33, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  subtitle: { x: 0.06, y: null, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  badge: { x: 0.06, y: 0.25, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  cta: { x: 0.94, y: 0.88, scale: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  bottomBar: { height: 100, opacity: 100, visible: true, dx: 0, dy: 0 },
  accentLine: { opacity: 100, width: 100, visible: true, dx: 0, dy: 0 },
  premiumTag: { scale: 100, opacity: 100, visible: false, dx: 0, dy: 0 },
};
const BLANK_ELEMENTS = Object.fromEntries(Object.entries(DEFAULT_ELEMENTS).map(([k, v]) => [k, { ...v, visible: false, dx: 0, dy: 0 }]));
const MINIMAL_ELEMENTS = Object.fromEntries(Object.entries(DEFAULT_ELEMENTS).map(([k, v]) => [k, { ...v, visible: ['image','title','bottomBar','pimlicoLogo','xhsLogo'].includes(k), dx: 0, dy: 0 }]));

const MARKETING_TEMPLATES = {
  linkedin: { width: 1200, height: 627, label: 'LinkedIn Post', icon: '💼' },
  twitter: { width: 1200, height: 675, label: 'Twitter/X Post', icon: '🐦' },
  instagram: { width: 1080, height: 1080, label: 'Instagram Square', icon: '📸' },
  instagramStory: { width: 1080, height: 1920, label: 'Instagram Story', icon: '📱' },
  og: { width: 1200, height: 630, label: 'OG Image', icon: '🌐' },
  email: { width: 600, height: 300, label: 'Email Header', icon: '📧' },
};

const FONT_OPTIONS = {
  system: { label: 'System (Default)', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  serif: { label: 'Serif', family: 'Georgia, "Times New Roman", serif' },
  mono: { label: 'Monospace', family: '"SF Mono", "Fira Code", "Courier New", monospace' },
  inter: { label: 'Inter', family: '"Inter", -apple-system, sans-serif' },
};

export default function CollateralPage() {
  const { articles } = useArticles();
  const { items, updateItem } = useWorkflow();

  const canvasRef = useRef(null);
  const autoGenTimerRef = useRef(null);
  const elementBoundsRef = useRef({});
  const dragStartRef = useRef(null);

  const [article, setArticle] = useState(null);
  const [template, setTemplate] = useState('linkedin');
  const [theme, setTheme] = useState('dark');
  const [layout, setLayout] = useState('classic');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [cta, setCta] = useState('Read on pimlicosolutions.com');
  const [font, setFont] = useState('system');
  const [fontSize, setFontSize] = useState(100);
  const [fontWeight, setFontWeight] = useState('800');
  const [loading, setLoading] = useState(false);
  const [dragTarget, setDragTarget] = useState(null);
  const [postText, setPostText] = useState('');

  const [elements, setElements] = useState(() => {
    try {
      const saved = localStorage.getItem('xhs-marketing-elements-last');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = {};
        for (const k of Object.keys(DEFAULT_ELEMENTS)) merged[k] = { ...DEFAULT_ELEMENTS[k], ...(parsed[k] || {}) };
        return merged;
      }
    } catch {}
    return { ...DEFAULT_ELEMENTS };
  });

  const [panelOpen, setPanelOpen] = useState({ article: true, template: false, text: false, font: false, elements: true, presets: false });

  // Built-in default presets
  const BUILT_IN_PRESETS = {
    'Magazine Dark (Default)': {
      builtIn: true,
      elements: { ...DEFAULT_ELEMENTS },
      template: 'linkedin', theme: 'dark', layout: 'magazine',
      font: 'system', fontSize: 100, fontWeight: '800',
      title: '', subtitle: '', cta: 'Read on pimlicosolutions.com',
    },
    'Magazine Gradient': {
      builtIn: true,
      elements: { ...DEFAULT_ELEMENTS },
      template: 'linkedin', theme: 'gradient', layout: 'magazine',
      font: 'system', fontSize: 105, fontWeight: '800',
      title: '', subtitle: '', cta: 'Read on pimlicosolutions.com',
    },
    'Classic Dark': {
      builtIn: true,
      elements: { ...DEFAULT_ELEMENTS },
      template: 'linkedin', theme: 'dark', layout: 'classic',
      font: 'system', fontSize: 100, fontWeight: '800',
      title: '', subtitle: '', cta: 'Read on pimlicosolutions.com',
    },
    'Card Light': {
      builtIn: true,
      elements: { ...DEFAULT_ELEMENTS },
      template: 'linkedin', theme: 'light', layout: 'card',
      font: 'system', fontSize: 100, fontWeight: '700',
      title: '', subtitle: '', cta: 'Read on pimlicosolutions.com',
    },
    'Instagram Story': {
      builtIn: true,
      elements: { ...DEFAULT_ELEMENTS, premiumTag: { ...DEFAULT_ELEMENTS.premiumTag, visible: true } },
      template: 'instagramStory', theme: 'gradient', layout: 'magazine',
      font: 'system', fontSize: 110, fontWeight: '800',
      title: '', subtitle: '', cta: 'pimlicosolutions.com',
    },
    'Minimal Clean': {
      builtIn: true,
      elements: { ...MINIMAL_ELEMENTS },
      template: 'linkedin', theme: 'dark', layout: 'magazine',
      font: 'system', fontSize: 100, fontWeight: '700',
      title: '', subtitle: '', cta: '',
    },
  };

  // Presets — merge built-in + user-saved
  const [userPresets, setUserPresets] = useState({});
  const [presetName, setPresetName] = useState('');
  useEffect(() => { try { const s = localStorage.getItem('xhs-marketing-presets'); if (s) setUserPresets(JSON.parse(s)); } catch {} }, []);

  const allPresets = { ...BUILT_IN_PRESETS, ...userPresets };

  const savePreset = (name) => {
    if (!name.trim()) return;
    const preset = {
      elements, template, theme, layout, font, fontSize, fontWeight,
      title, subtitle, cta,
      savedAt: new Date().toISOString(),
    };
    const updated = { ...userPresets, [name.trim()]: preset };
    setUserPresets(updated);
    localStorage.setItem('xhs-marketing-presets', JSON.stringify(updated));
    setPresetName('');
  };

  const loadPreset = (name) => {
    const preset = allPresets[name];
    if (!preset) return;
    if (preset.elements) {
      const merged = { ...DEFAULT_ELEMENTS };
      for (const k of Object.keys(merged)) {
        if (preset.elements[k]) merged[k] = { ...merged[k], ...preset.elements[k] };
      }
      setElements(merged);
    }
    if (preset.template) setTemplate(preset.template);
    if (preset.theme) setTheme(preset.theme);
    if (preset.layout) setLayout(preset.layout);
    if (preset.font) setFont(preset.font);
    if (preset.fontSize) setFontSize(preset.fontSize);
    if (preset.fontWeight) setFontWeight(preset.fontWeight);
    if (preset.title !== undefined) setTitle(preset.title || (article?.title || ''));
    if (preset.subtitle !== undefined) setSubtitle(preset.subtitle || (article?.excerpt || ''));
    if (preset.cta !== undefined) setCta(preset.cta);
  };

  const deletePreset = (name) => {
    const updated = { ...userPresets };
    delete updated[name];
    setUserPresets(updated);
    localStorage.setItem('xhs-marketing-presets', JSON.stringify(updated));
  };

  // Auto-save elements
  useEffect(() => { try { localStorage.setItem('xhs-marketing-elements-last', JSON.stringify(elements)); } catch {} }, [elements]);

  // Compat wrapper
  const positions = { title: elements.title, subtitle: elements.subtitle, logo: elements.pimlicoLogo, cta: elements.cta, badge: elements.badge };

  // ---- Canvas helpers ----
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' '); let line = ''; let currentY = y; const lines = [];
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && i > 0) { lines.push({ text: line.trim(), y: currentY }); line = words[i] + ' '; currentY += lineHeight; } else { line = testLine; }
    }
    lines.push({ text: line.trim(), y: currentY }); return lines;
  };

  const loadImage = (src) => new Promise((resolve, reject) => {
    if (!src) return reject(new Error('No src'));
    if (src.startsWith('/') || src.startsWith('data:')) {
      const img = new window.Image(); img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img); img.onerror = () => reject(new Error('Failed')); img.src = src; return;
    }
    if (src.startsWith('http')) {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
      const img1 = new window.Image(); img1.crossOrigin = 'anonymous';
      img1.onload = () => resolve(img1);
      img1.onerror = () => { const img2 = new window.Image(); img2.crossOrigin = 'anonymous'; img2.onload = () => resolve(img2); img2.onerror = () => reject(new Error('Failed')); img2.src = src; };
      img1.src = proxyUrl; return;
    }
    const img = new window.Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('Failed')); img.src = src;
  });

  const drawImageCover = (ctx, img, dx, dy, dw, dh, alpha = 1) => {
    const imgR = img.width / img.height, destR = dw / dh;
    let sx, sy, sw, sh;
    if (imgR > destR) { sh = img.height; sw = sh * destR; sx = (img.width - sw) / 2; sy = 0; }
    else { sw = img.width; sh = sw / destR; sx = 0; sy = (img.height - sh) / 2; }
    ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); ctx.restore();
  };

  const drawPremiumTag = (ctx, tmpl, fFamily, fScale, x, y, _b) => {
    const el = elements; if (el.premiumTag.visible === false) return;
    const tagScale = (el.premiumTag.scale || 100) / 100, tagOp = (el.premiumTag.opacity ?? 100) / 100;
    const fs = Math.round(tmpl.width * 0.014 * fScale * tagScale); ctx.font = `700 ${fs}px ${fFamily}`;
    const textW = ctx.measureText('PREMIUM').width;
    const padH = Math.round(fs * 0.9), padV = Math.round(fs * 0.55);
    const tagW = textW + padH * 2 + fs * 1.2, tagH = fs + padV * 2;
    const tx = x + (el.premiumTag.dx || 0), ty = y + (el.premiumTag.dy || 0);
    ctx.save(); ctx.globalAlpha = tagOp;
    const grad = ctx.createLinearGradient(tx, ty, tx + tagW, ty + tagH);
    grad.addColorStop(0, '#b8860b'); grad.addColorStop(0.3, '#daa520'); grad.addColorStop(0.7, '#f0c040'); grad.addColorStop(1, '#daa520');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.roundRect(tx, ty, tagW, tagH, Math.round(tagH / 2)); ctx.fill();
    ctx.strokeStyle = 'rgba(255,215,0,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    const starX = tx + padH + fs * 0.15, starY = ty + tagH / 2, outerR = fs * 0.42, innerR = outerR * 0.4;
    ctx.fillStyle = '#1a0f00'; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5 - Math.PI / 2, r = i % 2 === 0 ? outerR : innerR; const px = starX + Math.cos(a) * r, py = starY + Math.sin(a) * r; i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a0f00'; ctx.fillText('PREMIUM', tx + padH + fs * 1.0, ty + padV + fs * 0.88);
    ctx.restore(); if (_b) _b.premiumTag = { x: tx, y: ty, w: tagW, h: tagH };
  };

  const drawBottomBar = async (ctx, tmpl, pad, isDark, isGrad, fFamily, fScale, pos, _b) => {
    const el = elements;
    const barScale = (el.bottomBar.height || 100) / 100, barOp = (el.bottomBar.opacity || 100) / 100;
    const bottomH = Math.round(tmpl.height * 0.13 * barScale), bottomY = tmpl.height - bottomH + (el.bottomBar.dy || 0);
    ctx.save(); ctx.globalAlpha = barOp;
    ctx.fillStyle = isDark || isGrad ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; ctx.fillRect(0, bottomY, tmpl.width, 1);
    ctx.fillStyle = isDark || isGrad ? 'rgba(0,0,0,0.35)' : 'rgba(249,250,251,0.92)'; ctx.fillRect(0, bottomY + 1, tmpl.width, bottomH);
    ctx.restore(); if (_b) _b.bottomBar = { x: 0, y: bottomY, w: tmpl.width, h: bottomH };
    const baseLogoH = bottomH * 0.65;
    if (el.pimlicoLogo.visible !== false) {
      const pS = (el.pimlicoLogo.scale || 100) / 100, pO = (el.pimlicoLogo.opacity ?? 100) / 100;
      const pX = Math.round(el.pimlicoLogo.x * tmpl.width) + (el.pimlicoLogo.dx || 0), pY = bottomY + bottomH * 0.15 + (el.pimlicoLogo.dy || 0), pH = baseLogoH * pS;
      try {
        const logo = await loadImage(isDark || isGrad ? '/Pimlico_Logo_Inverted.png' : '/Pimlico_Logo.png');
        const pW = (logo.width / logo.height) * pH;
        ctx.save(); ctx.globalAlpha = pO; ctx.drawImage(logo, pX, pY + (baseLogoH - pH) / 2, pW, pH); ctx.restore();
        if (_b) _b.pimlicoLogo = { x: pX, y: pY, w: pW, h: pH };
        const sepX = pX + pW + 18;
        ctx.fillStyle = isDark || isGrad ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'; ctx.fillRect(sepX, pY + 6, 1.5, baseLogoH - 12);
        if (el.xhsLogo.visible !== false) {
          const xS = (el.xhsLogo.scale || 100) / 100, xO = (el.xhsLogo.opacity ?? 100) / 100;
          const xhsLogo = await loadImage(isDark || isGrad ? '/XHS_Logo_White.png' : '/XHS Logo BLUE on WHITE.png');
          const xhsBaseH = baseLogoH * 1.5, xhsH = xhsBaseH * xS, xhsW = (xhsLogo.width / xhsLogo.height) * xhsH;
          const xX = sepX + 18 + (el.xhsLogo.dx || 0), xY = pY + (baseLogoH - xhsH) / 2 + (el.xhsLogo.dy || 0);
          ctx.save(); ctx.globalAlpha = xO; ctx.drawImage(xhsLogo, xX, xY, xhsW, xhsH); ctx.restore();
          if (_b) _b.xhsLogo = { x: xX, y: xY, w: xhsW, h: xhsH };
        }
      } catch {}
    }
    if (el.cta.visible !== false && cta) {
      const ctaOp = (el.cta.opacity ?? 100) / 100, ctaScale = (el.cta.scale || 100) / 100;
      const ctaSize = Math.round(tmpl.width * 0.018 * fScale * ctaScale);
      ctx.font = `600 ${ctaSize}px ${fFamily}`; ctx.save(); ctx.globalAlpha = ctaOp; ctx.fillStyle = '#3b82f6';
      const ctaW = ctx.measureText(cta).width;
      const ctaX = tmpl.width - pad - ctaW + (el.cta.dx || 0), ctaY = bottomY + bottomH / 2 + ctaSize * 0.35 + (el.cta.dy || 0);
      ctx.fillText(cta, ctaX, ctaY); ctx.restore();
      if (_b) _b.cta = { x: ctaX - 10, y: ctaY - ctaSize, w: ctaW + 20, h: ctaSize + 10 };
    }
  };

  // ---- Main generate function ----
  const generateAsset = async () => {
    if (!article) return;
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) { setLoading(false); return; }
    const tmpl = MARKETING_TEMPLATES[template];
    canvas.width = tmpl.width; canvas.height = tmpl.height;
    const ctx = canvas.getContext('2d');
    const el = elements;
    const _b = {};
    const isDark = theme === 'dark', isGrad = theme === 'gradient', isLight = theme === 'light';
    const fFamily = FONT_OPTIONS[font]?.family || FONT_OPTIONS.system.family;
    const fScale = fontSize / 100;
    const pad = Math.round(tmpl.width * 0.06);
    const pos2 = positions;

    // ===== CARD LAYOUT =====
    if (layout === 'card') {
      if (isGrad) { const g = ctx.createLinearGradient(0,0,tmpl.width,tmpl.height); g.addColorStop(0,'#0d4f4f'); g.addColorStop(1,'#0a3d3d'); ctx.fillStyle = g; }
      else ctx.fillStyle = isDark ? '#0f172a' : '#e2e8f0';
      ctx.fillRect(0,0,tmpl.width,tmpl.height);
      ctx.fillStyle = isDark||isGrad ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
      for (let i=0;i<tmpl.width;i+=40) ctx.fillRect(i,0,1,tmpl.height);
      const cp = Math.round(tmpl.width*0.05), isVert = template==='instagram'||template==='instagramStory';
      // Logos
      if (el.pimlicoLogo.visible!==false) {
        try { const logo=await loadImage(isDark||isGrad?'/Pimlico_Logo_Inverted.png':'/Pimlico_Logo.png');
        const s=(el.pimlicoLogo.scale||100)/100, o=(el.pimlicoLogo.opacity??100)/100;
        const lH=Math.round(tmpl.height*0.055*s), lW=(logo.width/logo.height)*lH;
        const _x=cp+(el.pimlicoLogo.dx||0), _y=cp+(el.pimlicoLogo.dy||0);
        ctx.save();ctx.globalAlpha=o;ctx.drawImage(logo,_x,_y,lW,lH);ctx.restore();_b.pimlicoLogo={x:_x,y:_y,w:lW,h:lH}; } catch{}
      }
      if (el.xhsLogo.visible!==false) {
        try { const xhsLogo=await loadImage(isDark||isGrad?'/XHS_Logo_White.png':'/XHS Logo BLUE on WHITE.png');
        const s=(el.xhsLogo.scale||100)/100, o=(el.xhsLogo.opacity??100)/100;
        const xH=Math.round(tmpl.height*0.07*s), xW=(xhsLogo.width/xhsLogo.height)*xH;
        const _x=tmpl.width-cp-xW+(el.xhsLogo.dx||0), _y=cp+(el.xhsLogo.dy||0);
        ctx.save();ctx.globalAlpha=o;ctx.drawImage(xhsLogo,_x,_y,xW,xH);ctx.restore();_b.xhsLogo={x:_x,y:_y,w:xW,h:xH}; } catch{}
      }
      drawPremiumTag(ctx,tmpl,fFamily,fScale,tmpl.width-cp-Math.round(tmpl.width*0.18),cp+Math.round(tmpl.height*0.08),_b);
      // Badge
      if (el.badge.visible!==false) {
        const cat=(article.category||'ARTICLE').toUpperCase(); const catFS=Math.round(tmpl.width*0.018*fScale);
        ctx.font=`700 ${catFS}px ${fFamily}`; const catTW=ctx.measureText(cat).width;
        const catBP=Math.round(tmpl.width*0.015), catBH=catFS+catBP*2, catBW=catTW+catBP*3, catBY=cp+Math.round(tmpl.height*0.075);
        const _bx=cp+(el.badge.dx||0),_by=catBY+(el.badge.dy||0);
        ctx.fillStyle='#ffffff';ctx.beginPath();ctx.roundRect(_bx,_by,catBW,catBH,8);ctx.fill();
        ctx.fillStyle='#0f172a';ctx.fillText(cat,_bx+catBP*1.5,_by+catBP+catFS*0.85);_b.badge={x:_bx,y:_by,w:catBW,h:catBH};
      }
      // Image
      const imgTopY=cp+Math.round(tmpl.height*0.075)+Math.round(tmpl.width*0.018*fScale)+Math.round(tmpl.width*0.015)*2+Math.round(tmpl.height*0.04);
      const imgH=(isVert?tmpl.height*0.42:tmpl.height*0.45)*((el.image.scale??100)/100);
      const imgW=tmpl.width-cp*2;
      if (el.image.visible!==false && article.image) {
        const _ix=cp+(el.image.dx||0),_iy=imgTopY+(el.image.dy||0);
        try { const img=await loadImage(article.image);
        ctx.save();ctx.beginPath();ctx.roundRect(_ix,_iy,imgW,imgH,14);ctx.clip();
        drawImageCover(ctx,img,_ix,_iy,imgW,imgH,(el.image.opacity??100)/100);ctx.restore();_b.image={x:_ix,y:_iy,w:imgW,h:imgH}; } catch{}
      }
      // Title box
      const titleBoxY=imgTopY+imgH+Math.round(tmpl.height*0.03), titleBoxH=tmpl.height-titleBoxY-cp, titleBoxW=tmpl.width-cp*2;
      if (el.title.visible!==false) {
        const _tx=cp+(el.title.dx||0),_ty=titleBoxY+(el.title.dy||0);
        ctx.fillStyle='#ffffff';ctx.beginPath();ctx.roundRect(_tx,_ty,titleBoxW,titleBoxH,10);ctx.fill();
        const tText=title||article.title, tFS=Math.round(tmpl.width*(isVert?0.04:0.028)*fScale);
        const tPad=Math.round(tmpl.width*0.025);
        ctx.fillStyle='#0f172a';ctx.font=`${fontWeight} ${tFS}px ${fFamily}`;
        const tLines=wrapText(ctx,tText,_tx+tPad,_ty+tPad+tFS,titleBoxW-tPad*2,tFS*1.25);
        tLines.slice(0,3).forEach(l=>ctx.fillText(l.text,_tx+tPad,l.y));_b.title={x:_tx,y:_ty,w:titleBoxW,h:titleBoxH};
      }
      if (el.cta.visible!==false && cta) {
        const ctaS=Math.round(tmpl.width*0.014*fScale);ctx.font=`600 ${ctaS}px ${fFamily}`;ctx.fillStyle='#3b82f6';
        const ctaW=ctx.measureText(cta).width;
        ctx.fillText(cta,cp+titleBoxW-Math.round(tmpl.width*0.025)-ctaW+(el.cta.dx||0),titleBoxY+titleBoxH-Math.round(tmpl.width*0.025)+(el.cta.dy||0));
      }
    // ===== MAGAZINE LAYOUT =====
    } else if (layout === 'magazine') {
      const magOp = (el.image.opacity??100)/100;
      if (el.image.visible!==false && article.image) {
        try { const img=await loadImage(article.image); drawImageCover(ctx,img,0+(el.image.dx||0),0+(el.image.dy||0),tmpl.width,tmpl.height,magOp); _b.image={x:0,y:0,w:tmpl.width,h:tmpl.height}; }
        catch{ ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,tmpl.width,tmpl.height); }
      } else { ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,tmpl.width,tmpl.height); }
      const oc=isGrad?[15,40,71]:isDark?[15,23,42]:[15,23,42];
      const g1=ctx.createLinearGradient(0,0,0,tmpl.height);
      g1.addColorStop(0,`rgba(${oc},0.1)`);g1.addColorStop(0.35,`rgba(${oc},0.4)`);g1.addColorStop(0.6,`rgba(${oc},0.75)`);g1.addColorStop(1,`rgba(${oc},0.95)`);
      ctx.fillStyle=g1;ctx.fillRect(0,0,tmpl.width,tmpl.height);
      const tg=ctx.createLinearGradient(0,0,0,tmpl.height*0.25);
      tg.addColorStop(0,`rgba(${oc},0.6)`);tg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=tg;ctx.fillRect(0,0,tmpl.width,tmpl.height*0.25);
      const isVert=template==='instagram'||template==='instagramStory', mp=Math.round(tmpl.width*0.06);
      // Logos
      if (el.pimlicoLogo.visible!==false) {
        try { const s=(el.pimlicoLogo.scale||100)/100,o=(el.pimlicoLogo.opacity??100)/100;
        const logo=await loadImage('/Pimlico_Logo_Inverted.png'); const lH=Math.round(tmpl.height*0.05*s), lW=(logo.width/logo.height)*lH;
        const _px=mp+(el.pimlicoLogo.dx||0),_py=mp+(el.pimlicoLogo.dy||0);
        ctx.save();ctx.globalAlpha=o;ctx.drawImage(logo,_px,_py,lW,lH);ctx.restore();_b.pimlicoLogo={x:_px,y:_py,w:lW,h:lH};
        if (el.xhsLogo.visible!==false) {
          const xs=(el.xhsLogo.scale||100)/100,xo=(el.xhsLogo.opacity??100)/100;
          const xhsLogo=await loadImage('/XHS_Logo_White.png'); const xhsH=lH*1.4*xs, xhsW=(xhsLogo.width/xhsLogo.height)*xhsH;
          const sepX=_px+lW+14; ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(sepX,_py+3,1.5,lH-6);
          const _xx=sepX+14+(el.xhsLogo.dx||0),_xy=_py+(lH-xhsH)/2+(el.xhsLogo.dy||0);
          ctx.save();ctx.globalAlpha=xo;ctx.drawImage(xhsLogo,_xx,_xy,xhsW,xhsH);ctx.restore();_b.xhsLogo={x:_xx,y:_xy,w:xhsW,h:xhsH};
        } } catch{}
      }
      // Badge
      if (el.badge.visible!==false) {
        const cat=article.category||''; if(cat) {
        const cfs=Math.round(tmpl.width*0.016*fScale);ctx.font=`700 ${cfs}px ${fFamily}`;const ct=cat.toUpperCase();
        const cw=ctx.measureText(ct).width,cph=16,cpv=10,_bx=mp+(el.badge.dx||0),_by=tmpl.height*(isVert?0.55:0.52)+(el.badge.dy||0),bW=cw+cph*2,bH=cfs+cpv*2;
        ctx.fillStyle='rgba(59,130,246,0.25)';ctx.beginPath();ctx.roundRect(_bx,_by,bW,bH,6);ctx.fill();
        ctx.fillStyle='#3b82f6';ctx.fillRect(_bx,_by,4,bH);ctx.fillText(ct,_bx+cph,_by+cpv+cfs*0.85);_b.badge={x:_bx,y:_by,w:bW,h:bH};
        }
      }
      drawPremiumTag(ctx,tmpl,fFamily,fScale,tmpl.width-mp-Math.round(tmpl.width*0.17),mp,_b);
      // Title
      if (el.title.visible!==false) {
        const tText=title||article.title, baseTSize=isVert?tmpl.width*0.065:tmpl.width*0.046;
        const tSize=Math.round(baseTSize*fScale);ctx.fillStyle='#ffffff';ctx.font=`${fontWeight} ${tSize}px ${fFamily}`;
        const maxTW=isVert?tmpl.width-mp*2:tmpl.width*0.7;
        const _tx=mp+(el.title.dx||0),tY=tmpl.height*(isVert?0.63:0.62)+(el.title.dy||0);
        const tLines=wrapText(ctx,tText,_tx,tY,maxTW,tSize*1.15);
        tLines.slice(0,4).forEach(l=>ctx.fillText(l.text,_tx,l.y));
        const lastTY=tLines.length>0?tLines[tLines.length-1].y:tY;
        _b.title={x:_tx,y:tY-tSize,w:maxTW,h:lastTY-tY+tSize*1.5};
        if (el.subtitle.visible!==false && subtitle) {
          const subSize=Math.round(tSize*0.45),_sx=mp+(el.subtitle.dx||0),_sy=lastTY+tSize*0.8+(el.subtitle.dy||0);
          ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font=`400 ${subSize}px ${fFamily}`;
          wrapText(ctx,subtitle,_sx,_sy,maxTW,subSize*1.5).slice(0,2).forEach(l=>ctx.fillText(l.text,_sx,l.y));
        }
      }
      // Bottom bar
      if (el.bottomBar.visible!==false) {
        const bH=Math.round(tmpl.height*0.1),bY=tmpl.height-bH+(el.bottomBar.dy||0);
        ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,bY,tmpl.width,bH);_b.bottomBar={x:0,y:bY,w:tmpl.width,h:bH};
      }
      if (el.cta.visible!==false && cta) {
        const bH=Math.round(tmpl.height*0.1),bY=tmpl.height-bH+(el.bottomBar.dy||0);
        const ctaS=Math.round(tmpl.width*0.018*fScale);ctx.font=`600 ${ctaS}px ${fFamily}`;ctx.fillStyle='#60a5fa';
        const ctaW=ctx.measureText(cta).width;
        ctx.fillText(cta,tmpl.width-mp-ctaW+(el.cta.dx||0),bY+bH/2+ctaS*0.35+(el.cta.dy||0));
      }
    // ===== CLASSIC LAYOUT =====
    } else {
      if (isGrad) { const g=ctx.createLinearGradient(0,0,tmpl.width,tmpl.height);g.addColorStop(0,'#1e3a5f');g.addColorStop(0.5,'#0f2847');g.addColorStop(1,'#1a1a2e');ctx.fillStyle=g; }
      else ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.fillRect(0,0,tmpl.width,tmpl.height);
      // Image
      if (el.image.visible!==false && article.image) {
        try { const img=await loadImage(article.image);
        const imgOp=(el.image.opacity??100)/100, imgS=(el.image.scale??100)/100;
        if (template==='instagram'||template==='instagramStory') {
          const imgH=tmpl.height*0.45*imgS, _iy=(el.image.dy||0);
          drawImageCover(ctx,img,0,_iy,tmpl.width,imgH,0.3*imgOp);
          const fg=ctx.createLinearGradient(0,_iy+imgH*0.3,0,_iy+imgH);fg.addColorStop(0,isDark||isGrad?'rgba(15,23,42,0)':'rgba(255,255,255,0)');fg.addColorStop(1,isDark?'#0f172a':isGrad?'#0f2847':'#ffffff');ctx.fillStyle=fg;ctx.fillRect(0,_iy,tmpl.width,imgH);_b.image={x:0,y:_iy,w:tmpl.width,h:imgH};
        } else {
          const imgW=tmpl.width*0.38*imgS, imgX=Math.round(el.image.x*tmpl.width)+(el.image.dx||0), _iy=(el.image.dy||0);
          drawImageCover(ctx,img,imgX,_iy,imgW,tmpl.height,imgOp);
          const fg=ctx.createLinearGradient(imgX-60,0,imgX+100,0);fg.addColorStop(0,isDark?'#0f172a':isGrad?'#0f2847':'#ffffff');fg.addColorStop(1,'rgba(15,23,42,0)');ctx.fillStyle=fg;ctx.fillRect(imgX-60,_iy,imgW+60,tmpl.height);_b.image={x:imgX,y:_iy,w:imgW,h:tmpl.height};
        } } catch{}
      }
      // Accent line
      if (el.accentLine.visible!==false) {
        const aOp=(el.accentLine.opacity??100)/100, aW=60*((el.accentLine.width??100)/100);
        ctx.save();ctx.globalAlpha=aOp;ctx.fillStyle='#3b82f6';
        const _ax=Math.round(pos2.badge.x*tmpl.width)+(el.accentLine.dx||0), aY=Math.round(pos2.badge.y*tmpl.height)-20+(el.accentLine.dy||0);
        ctx.fillRect(_ax,aY,aW,4);ctx.restore();_b.accentLine={x:_ax,y:aY,w:aW,h:4};
      }
      // Badge
      if (el.badge.visible!==false) {
        const bOp=(el.badge.opacity??100)/100,bS=(el.badge.scale??100)/100, cat=article.category||'';
        if(cat){ const bfs=Math.round(tmpl.width*0.016*fScale*bS);ctx.font=`700 ${bfs}px ${fFamily}`;
        const bt=cat.toUpperCase(),bm=ctx.measureText(bt),bph=14,bpv=8;
        const bx=Math.round(pos2.badge.x*tmpl.width)+(el.badge.dx||0),by=Math.round(pos2.badge.y*tmpl.height)+(el.badge.dy||0);
        const bw=bm.width+bph*2,bh=bfs+bpv*2;
        ctx.save();ctx.globalAlpha=bOp;ctx.fillStyle=isDark||isGrad?'rgba(59,130,246,0.15)':'rgba(59,130,246,0.1)';
        ctx.beginPath();ctx.roundRect(bx,by,bw,bh,6);ctx.fill();ctx.fillStyle='#3b82f6';ctx.fillText(bt,bx+bph,by+bpv+bfs*0.85);ctx.restore();_b.badge={x:bx,y:by,w:bw,h:bh}; }
      }
      drawPremiumTag(ctx,tmpl,fFamily,fScale,tmpl.width*0.42,pad,_b);
      // Title
      if (el.title.visible!==false) {
        const tOp=(el.title.opacity??100)/100, tS=(el.title.scale??100)/100;
        const tText=title||article.title, tColor=isDark||isGrad?'#ffffff':'#0f172a';
        const bts=template==='instagramStory'?tmpl.width*0.065:template==='instagram'?tmpl.width*0.058:tmpl.width*0.038;
        const tSize=Math.round(bts*fScale*tS);
        ctx.save();ctx.globalAlpha=tOp;ctx.fillStyle=tColor;ctx.font=`${fontWeight} ${tSize}px ${fFamily}`;
        const isV=template==='instagram'||template==='instagramStory', maxTW=isV?tmpl.width-pad*2:tmpl.width*0.55;
        const tX=Math.round(pos2.title.x*tmpl.width)+(el.title.dx||0), tY=Math.round(pos2.title.y*tmpl.height)+(el.title.dy||0);
        const tLines=wrapText(ctx,tText,tX,tY,maxTW,tSize*1.2);
        tLines.forEach(l=>ctx.fillText(l.text,tX,l.y));ctx.restore();
        const lastTL=tLines.length>0?tLines[tLines.length-1].y:tY;
        _b.title={x:tX,y:tY-tSize,w:maxTW,h:lastTL-tY+tSize*1.5};
        if (el.subtitle.visible!==false && subtitle) {
          const subOp=(el.subtitle.opacity??100)/100, lastTY=tLines.length>0?tLines[tLines.length-1].y:tY;
          const subSize=Math.round(tSize*0.5);
          ctx.save();ctx.globalAlpha=subOp;ctx.fillStyle=isDark||isGrad?'rgba(255,255,255,0.6)':'rgba(15,23,42,0.55)';ctx.font=`400 ${subSize}px ${fFamily}`;
          const sX=(pos2.subtitle.x!==undefined?Math.round((pos2.subtitle.x||pos2.title.x)*tmpl.width):tX)+(el.subtitle.dx||0);
          const sY=(pos2.subtitle.y?Math.round(pos2.subtitle.y*tmpl.height):lastTY+tSize*0.9)+(el.subtitle.dy||0);
          wrapText(ctx,subtitle,sX,sY,maxTW,subSize*1.5).slice(0,2).forEach(l=>ctx.fillText(l.text,sX,l.y));ctx.restore();
        }
      }
      // Bottom bar + logos (independent rendering)
      if (el.bottomBar.visible!==false) {
        await drawBottomBar(ctx,tmpl,pad,isDark,isGrad,fFamily,fScale,pos2,_b);
      } else {
        // Render logos independently when bottom bar is hidden
        const classicLogoY = tmpl.height * 0.87, classicLogoH = tmpl.height * 0.08;
        if (el.pimlicoLogo.visible!==false) {
          try { const logo=await loadImage(isDark||isGrad?'/Pimlico_Logo_Inverted.png':'/Pimlico_Logo.png');
          const pS=(el.pimlicoLogo.scale||100)/100, pO=(el.pimlicoLogo.opacity??100)/100;
          const pH=classicLogoH*pS, pW=(logo.width/logo.height)*pH;
          const _px=Math.round(el.pimlicoLogo.x*tmpl.width)+(el.pimlicoLogo.dx||0), _py=classicLogoY+(el.pimlicoLogo.dy||0);
          ctx.save();ctx.globalAlpha=pO;ctx.drawImage(logo,_px,_py,pW,pH);ctx.restore();_b.pimlicoLogo={x:_px,y:_py,w:pW,h:pH}; } catch{}
        }
        if (el.xhsLogo.visible!==false) {
          try { const xhsLogo=await loadImage(isDark||isGrad?'/XHS_Logo_White.png':'/XHS Logo BLUE on WHITE.png');
          const xS=(el.xhsLogo.scale||100)/100, xO=(el.xhsLogo.opacity??100)/100;
          const xH=classicLogoH*1.4*xS, xW=(xhsLogo.width/xhsLogo.height)*xH;
          const _xx=Math.round(el.xhsLogo.x*tmpl.width)+(el.xhsLogo.dx||0), _xy=classicLogoY+(el.xhsLogo.dy||0);
          ctx.save();ctx.globalAlpha=xO;ctx.drawImage(xhsLogo,_xx,_xy,xW,xH);ctx.restore();_b.xhsLogo={x:_xx,y:_xy,w:xW,h:xH}; } catch{}
        }
        if (el.cta.visible!==false && cta) {
          const ctaOp=(el.cta.opacity??100)/100, ctaScale=(el.cta.scale||100)/100;
          const ctaSize=Math.round(tmpl.width*0.018*fScale*ctaScale);
          ctx.font=`600 ${ctaSize}px ${fFamily}`;ctx.save();ctx.globalAlpha=ctaOp;ctx.fillStyle='#3b82f6';
          const ctaW=ctx.measureText(cta).width;
          ctx.fillText(cta,tmpl.width-pad-ctaW+(el.cta.dx||0),classicLogoY+classicLogoH*0.6+(el.cta.dy||0));ctx.restore();
        }
      }
    }
    elementBoundsRef.current = _b;
    setLoading(false);
  };

  // Auto-regenerate on settings change
  useEffect(() => {
    if (article && canvasRef.current) {
      if (dragTarget) return;
      if (autoGenTimerRef.current) clearTimeout(autoGenTimerRef.current);
      autoGenTimerRef.current = setTimeout(() => generateAsset(), 300);
      return () => { if (autoGenTimerRef.current) clearTimeout(autoGenTimerRef.current); };
    }
  }, [article, template, theme, layout, elements, title, subtitle, cta, font, fontSize, fontWeight]);

  // Drag handlers
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * sx, py = (e.clientY - rect.top) * sy;
    const bounds = elementBoundsRef.current;
    for (const key of ['premiumTag','cta','subtitle','title','badge','xhsLogo','pimlicoLogo','accentLine','bottomBar','image']) {
      const b = bounds[key]; if (!b || elements[key]?.visible === false) continue;
      if (px >= b.x-15 && px <= b.x+b.w+15 && py >= b.y-15 && py <= b.y+b.h+15) {
        setDragTarget(key); dragStartRef.current = { px, py, dx: elements[key]?.dx||0, dy: elements[key]?.dy||0 }; return;
      }
    }
  };
  const handleMouseMove = (e) => {
    if (!dragTarget || !dragStartRef.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), sx = canvas.width/rect.width, sy = canvas.height/rect.height;
    const px=(e.clientX-rect.left)*sx, py=(e.clientY-rect.top)*sy, ds=dragStartRef.current;
    setElements(prev => ({...prev,[dragTarget]:{...prev[dragTarget],dx:Math.round(ds.dx+(px-ds.px)),dy:Math.round(ds.dy+(py-ds.py))}}));
  };
  const handleMouseUp = () => { if (dragTarget) { setDragTarget(null); dragStartRef.current=null; setTimeout(()=>generateAsset(),50); } };

  const downloadAsset = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const link = document.createElement('a');
    const name = article?.slug || 'marketing-asset';
    link.download = `${name}-${layout}-${template}.png`;
    link.href = canvas.toDataURL('image/png'); link.click();
  };

  // Generate post text
  const generatePostText = () => {
    if (!article) return;
    const t = title || article.title;
    const hashtags = article.tags?.slice(0, 4).map(tag => `#${tag.replace(/[\s-]+/g, '')}`).join(' ') || '#regulation #compliance';
    const post = `${t}\n\n${subtitle || article.excerpt || ''}\n\n${hashtags}\n\nRead more on pimlicosolutions.com/insights/${article.slug}`;
    setPostText(post);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">🎨 Collateral</h1>
          <p className="text-sm text-gray-400 mt-0.5">Marketing images and social assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-2">
          {/* Article Selection */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setPanelOpen(p => ({...p, article: !p.article}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-semibold flex items-center gap-2 text-sm"><span>📄</span> Article {article && <span className="text-xs text-indigo-400 font-normal truncate max-w-[140px]">— {article.title}</span>}</h3>
              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${panelOpen.article?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {panelOpen.article && (
              <div className="px-4 pb-3 space-y-1 max-h-40 overflow-y-auto">
                {articles.map(a => (
                  <button key={a.id} type="button" onClick={() => { setArticle(a); setTitle(a.title); setSubtitle(a.excerpt || ''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${article?.id===a.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}>
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-[10px] text-gray-500">{a.category} · {a.date}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Template & Style */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setPanelOpen(p => ({...p, template: !p.template}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-semibold flex items-center gap-2 text-sm"><span>📐</span> Template & Style <span className="text-xs text-gray-400 font-normal">— {MARKETING_TEMPLATES[template].label} · {theme} · {layout}</span></h3>
              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${panelOpen.template?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {panelOpen.template && (
              <div className="px-4 pb-3 space-y-3 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  {Object.entries(MARKETING_TEMPLATES).map(([k,v]) => (
                    <button key={k} type="button" onClick={() => setTemplate(k)}
                      className={`py-2 text-[10px] font-medium rounded-lg border transition-colors ${template===k ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'text-gray-400 border-gray-700 hover:text-white'}`}>
                      <span className="block text-sm mb-0.5">{v.icon}</span>{v.label}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 mb-1 block">Theme</label>
                  <div className="flex gap-1.5">
                    {['dark','light','gradient'].map(t => (
                      <button key={t} type="button" onClick={() => setTheme(t)}
                        className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border transition-colors ${theme===t ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'text-gray-400 border-gray-700 hover:text-white'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 mb-1 block">Layout</label>
                  <div className="flex gap-1.5">
                    {['classic','card','magazine'].map(l => (
                      <button key={l} type="button" onClick={() => setLayout(l)}
                        className={`flex-1 py-1.5 text-[10px] font-medium rounded-lg border transition-colors ${layout===l ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30' : 'text-gray-400 border-gray-700 hover:text-white'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setPanelOpen(p => ({...p, text: !p.text}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-semibold flex items-center gap-2 text-sm"><span>✏️</span> Text Content</h3>
              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${panelOpen.text?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {panelOpen.text && (
              <div className="px-4 pb-3 space-y-2 border-t border-gray-700 pt-2">
                <div><label className="text-[10px] text-gray-500">Title</label><textarea value={title} onChange={e=>setTitle(e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs resize-none focus:outline-none focus:border-indigo-500"/></div>
                <div><label className="text-[10px] text-gray-500">Subtitle</label><textarea value={subtitle} onChange={e=>setSubtitle(e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs resize-none focus:outline-none focus:border-indigo-500"/></div>
                <div><label className="text-[10px] text-gray-500">Call to Action</label><input value={cta} onChange={e=>setCta(e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"/></div>
              </div>
            )}
          </div>

          {/* Font Settings */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setPanelOpen(p => ({...p, font: !p.font}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-semibold flex items-center gap-2 text-sm"><span>🔤</span> Font <span className="text-xs text-gray-400 font-normal">— {FONT_OPTIONS[font].label}, {fontWeight}, {fontSize}%</span></h3>
              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${panelOpen.font?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {panelOpen.font && (
              <div className="px-4 pb-3 space-y-2 border-t border-gray-700 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] text-gray-500">Family</label><select value={font} onChange={e=>setFont(e.target.value)} className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs">{Object.entries(FONT_OPTIONS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
                  <div><label className="text-[10px] text-gray-500">Weight</label><select value={fontWeight} onChange={e=>setFontWeight(e.target.value)} className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs"><option value="400">Regular</option><option value="600">Semi Bold</option><option value="700">Bold</option><option value="800">Extra Bold</option><option value="900">Black</option></select></div>
                </div>
                <div><label className="text-[10px] text-gray-500">Size: {fontSize}%</label><input type="range" min="50" max="150" value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value))} className="w-full accent-indigo-500 h-1"/></div>
              </div>
            )}
          </div>

          {/* Element Controls */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setPanelOpen(p => ({...p, elements: !p.elements}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-semibold flex items-center gap-2 text-sm"><span>🎛️</span> Elements <span className="text-xs text-gray-400 font-normal">— {Object.values(elements).filter(e=>e.visible!==false).length}/{Object.keys(elements).length} on</span></h3>
              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${panelOpen.elements?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {panelOpen.elements && (
              <div className="px-4 pb-4 space-y-2 border-t border-gray-700">
                <div className="flex gap-1.5 pt-2">
                  <button type="button" onClick={() => setElements({...DEFAULT_ELEMENTS})} className="flex-1 py-1.5 text-[10px] font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/50">✦ All On</button>
                  <button type="button" onClick={() => setElements({...MINIMAL_ELEMENTS})} className="flex-1 py-1.5 text-[10px] font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600/40">◐ Minimal</button>
                  <button type="button" onClick={() => setElements({...BLANK_ELEMENTS})} className="flex-1 py-1.5 text-[10px] font-semibold bg-gray-600/30 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-600/50">○ Blank</button>
                </div>
                {[
                  {key:'image',label:'🖼️ Image',hasScale:true,hasOpacity:true},
                  {key:'title',label:'📝 Title',hasScale:true,hasOpacity:true},
                  {key:'subtitle',label:'📄 Subtitle',hasOpacity:true},
                  {key:'badge',label:'🏷️ Category',hasScale:true,hasOpacity:true},
                  {key:'pimlicoLogo',label:'🏢 Pimlico Logo',hasScale:true,hasOpacity:true},
                  {key:'xhsLogo',label:'🔷 XHS Logo',hasScale:true,hasOpacity:true},
                  {key:'cta',label:'🔗 CTA',hasScale:true,hasOpacity:true},
                  {key:'bottomBar',label:'▬ Bottom Bar',hasHeight:true,hasOpacity:true},
                  {key:'accentLine',label:'━ Accent Line',hasOpacity:true,hasWidth:true},
                  {key:'premiumTag',label:'⭐ Premium Tag',hasScale:true,hasOpacity:true},
                ].map(item => {
                  const isVis = elements[item.key]?.visible !== false;
                  return (
                    <div key={item.key} className={`rounded-lg transition-all ${isVis ? 'bg-gray-700/40 border border-gray-600/50' : 'bg-gray-800/50 border border-gray-700/30'}`}>
                      <div className="flex items-center justify-between px-2.5 py-1.5">
                        <button type="button" onClick={() => setElements(p => ({...p,[item.key]:{...p[item.key],visible:!isVis}}))}
                          className={`flex items-center gap-2 text-[11px] font-semibold ${isVis?'text-white':'text-gray-500 hover:text-gray-300'}`}>
                          <span className={`w-2 h-2 rounded-full ${isVis?'bg-green-400':'bg-gray-600'}`}/>{item.label}
                        </button>
                        <div className="flex items-center gap-1">
                          {(elements[item.key]?.dx||elements[item.key]?.dy) ? (
                            <button type="button" onClick={() => setElements(p => ({...p,[item.key]:{...p[item.key],dx:0,dy:0}}))} className="p-0.5 text-gray-500 hover:text-yellow-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            </button>
                          ) : null}
                          <button type="button" onClick={() => setElements(p => ({...p,[item.key]:{...p[item.key],visible:!isVis}}))}
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${isVis?'text-red-400 hover:bg-red-500/20':'text-green-400 bg-green-500/10 hover:bg-green-500/20'}`}>
                            {isVis ? '✕' : '+ ADD'}
                          </button>
                        </div>
                      </div>
                      {isVis && (
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-2.5 pb-2">
                          {item.hasScale && <div><label className="text-[10px] text-gray-500">Scale {elements[item.key]?.scale??100}%</label><input type="range" min="30" max="200" value={elements[item.key]?.scale??100} onChange={e=>setElements(p=>({...p,[item.key]:{...p[item.key],scale:parseInt(e.target.value)}}))} className="w-full accent-indigo-500 h-1"/></div>}
                          {item.hasOpacity && <div><label className="text-[10px] text-gray-500">Opacity {elements[item.key]?.opacity??100}%</label><input type="range" min="0" max="100" value={elements[item.key]?.opacity??100} onChange={e=>setElements(p=>({...p,[item.key]:{...p[item.key],opacity:parseInt(e.target.value)}}))} className="w-full accent-indigo-500 h-1"/></div>}
                          {item.hasHeight && <div><label className="text-[10px] text-gray-500">Height {elements[item.key]?.height??100}%</label><input type="range" min="30" max="200" value={elements[item.key]?.height??100} onChange={e=>setElements(p=>({...p,[item.key]:{...p[item.key],height:parseInt(e.target.value)}}))} className="w-full accent-indigo-500 h-1"/></div>}
                          {item.hasWidth && <div><label className="text-[10px] text-gray-500">Width {elements[item.key]?.width??100}%</label><input type="range" min="20" max="300" value={elements[item.key]?.width??100} onChange={e=>setElements(p=>({...p,[item.key]:{...p[item.key],width:parseInt(e.target.value)}}))} className="w-full accent-indigo-500 h-1"/></div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Presets — save/load settings */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setPanelOpen(p => ({...p, presets: !p.presets}))} className="w-full px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-semibold flex items-center gap-2 text-sm"><span>💾</span> Presets {Object.keys(allPresets).length > 0 && <span className="text-xs text-gray-400 font-normal">— {Object.keys(BUILT_IN_PRESETS).length} built-in{Object.keys(userPresets).length > 0 ? `, ${Object.keys(userPresets).length} saved` : ''}</span>}</h3>
              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${panelOpen.presets ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {panelOpen.presets && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-700">
                {/* Save new preset */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && presetName.trim()) savePreset(presetName); }}
                    placeholder="Preset name..."
                    className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => savePreset(presetName)}
                    disabled={!presetName.trim()}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    💾 Save
                  </button>
                </div>

                {/* Built-in presets */}
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Built-in Presets</div>
                  <div className="space-y-1 max-h-44 overflow-y-auto">
                    {Object.entries(BUILT_IN_PRESETS).map(([name, preset]) => (
                      <div key={name} className="flex items-center gap-2 bg-gray-700/30 rounded-lg px-3 py-2 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-white font-medium truncate">{name}</div>
                          <div className="text-[10px] text-gray-400">{preset.layout} · {preset.theme} · {preset.template}{preset.elements?.premiumTag?.visible ? ' · ⭐' : ''}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => loadPreset(name)}
                          className="px-2.5 py-1 bg-indigo-600/80 text-white text-[10px] font-medium rounded hover:bg-indigo-500 transition-colors"
                        >
                          Load
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User-saved presets */}
                {Object.keys(userPresets).length > 0 && (
                  <div>
                    <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Your Presets</div>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {Object.entries(userPresets).map(([name, preset]) => (
                        <div key={name} className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-white font-medium truncate">{name}</div>
                            <div className="text-[10px] text-gray-400">{preset.layout} · {preset.theme} · {preset.template} · {preset.savedAt ? new Date(preset.savedAt).toLocaleDateString() : ''}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => loadPreset(name)}
                            className="px-2 py-1 bg-indigo-600/80 text-white text-[10px] font-medium rounded hover:bg-indigo-500 transition-colors"
                          >
                            Load
                          </button>
                          <button
                            type="button"
                            onClick={() => { if (confirm(`Delete preset "${name}"?`)) deletePreset(name); }}
                            className="px-1.5 py-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                            title="Delete preset"
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(userPresets).length === 0 && (
                  <p className="text-[11px] text-gray-500 text-center py-1">Adjust your settings then save a custom preset above.</p>
                )}
              </div>
            )}
          </div>

          {/* Generate */}
          <button type="button" onClick={generateAsset} disabled={!article||loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin">⏳</span> Generating...</> : '🎨 Generate Asset'}
          </button>
        </div>

        {/* Right: Canvas Preview */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              🔴 Preview <span className="text-xs text-gray-400 font-normal">— {MARKETING_TEMPLATES[template].label} ({MARKETING_TEMPLATES[template].width}×{MARKETING_TEMPLATES[template].height})</span>
            </h2>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setElements({...DEFAULT_ELEMENTS})} className="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs rounded-lg hover:bg-gray-600">↺ Reset</button>
              <button type="button" onClick={downloadAsset} className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-500 flex items-center gap-1">⬇ Download PNG</button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700/50">
            <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
              className="w-full rounded-lg cursor-crosshair" style={{ maxHeight: '600px', objectFit: 'contain' }} />
          </div>
          <p className="text-[11px] text-gray-500 mt-2 text-center">💡 Drag to reposition elements. Canvas updates live. Settings auto-saved.</p>

          {/* Post Text */}
          <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">📝 Post Text</h3>
              <button type="button" onClick={generatePostText} className="px-3 py-1 bg-indigo-600/80 text-white text-[10px] font-medium rounded-lg hover:bg-indigo-500">Generate</button>
            </div>
            <textarea value={postText} onChange={e => setPostText(e.target.value)} rows={5} placeholder="Generate or write post text..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none" />
            {postText && (
              <button type="button" onClick={() => { navigator.clipboard.writeText(postText); }} className="mt-2 px-3 py-1 text-[10px] text-indigo-400 hover:text-indigo-300">📋 Copy to clipboard</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
