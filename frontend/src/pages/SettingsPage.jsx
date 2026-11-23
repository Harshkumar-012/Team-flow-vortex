import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../App.css';
import {
  UserRound, ShieldCheck, Bell, Palette, SlidersHorizontal, LayoutDashboard, Accessibility,
  Users, Plug, Workflow, LockKeyhole, Sparkles, Activity, Database, LifeBuoy, Info,
  Search, ChevronRight, Menu, X, RotateCcw, Download, Upload, Camera, Trash2,
  Eye, Monitor, Moon, Sun, Laptop, Mail, KeyRound, Shield, GitBranch, CalendarDays,
  Webhook, Plus, GripVertical, ExternalLink, AlertTriangle, History, FileText,
  MessageSquare, Save, Command, CircleHelp, Fingerprint, LogOut, UserPlus,
  ArrowUpRight, CheckCircle2, Check, Globe
} from 'lucide-react';

const STORE_KEY = 'teamflow-settings-v3';
const MAX_AVATAR = 3 * 1024 * 1024;
const NAV = [
  { group: 'PERSONAL', items: [
    ['profile', 'Profile & Identity', UserRound], ['security', 'Account & Security', ShieldCheck], ['notifications', 'Notifications & Communication', Bell],
  ]},
  { group: 'PREFERENCES', items: [
    ['appearance', 'Appearance & Themes', Palette], ['general', 'General Preferences', SlidersHorizontal], ['dashboard', 'Dashboard Customization', LayoutDashboard], ['accessibility', 'Accessibility & UX', Accessibility],
  ]},
  { group: 'WORKSPACE', items: [
    ['workspace', 'Workspace & Team', Users], ['integrations', 'Integrations & Connected Apps', Plug], ['automation', 'Automation & Productivity', Workflow],
  ]},
  { group: 'ADVANCED', items: [
    ['privacy', 'Privacy & Data', LockKeyhole], ['ai', 'AI & Personalization', Sparkles], ['activity', 'Activity & Audit', Activity], ['backup', 'Backup & Import/Export', Database], ['danger', 'Danger Zone', AlertTriangle],
  ]},
  { group: 'SUPPORT', items: [ ['support', 'Help & Support', LifeBuoy], ['about', 'About & Legal', Info] ] },
];
const TITLES = Object.fromEntries(NAV.flatMap(g => g.items.map(([id, label]) => [id, label])));
const DEFAULTS = {
  profile: { name: 'Jay Kishan', username: 'jaykishan', displayName: 'Jay Kishan', email: 'jay@example.com', phone: '', bio: '', location: '', website: '', linkedin: '', github: '', visibility: 'Workspace', online: true, avatar: '' },
  security: { loginAlerts: true, recoveryEmail: '', twoFactor: false, trustedDevice: true },
  notifications: { email: true, push: true, inApp: true, security: true, messages: true, mentions: true, replies: true, product: false, system: true, tasks: true, workspace: true, frequency: 'Instant', quiet: false, quietStart: '22:00', quietEnd: '08:00', sound: true },
  appearance: { theme: 'Dark', accent: '#20e69a', font: 'DM Sans', fontSize: 'Default', density: 'Comfortable', cards: 'Rounded', sidebar: 'Expanded', motion: true, reduceMotion: false },
  general: { language: 'English', timezone: 'Asia/Kolkata', dateFormat: 'DD MMM YYYY', timeFormat: '12-hour', currency: 'INR (₹)', landing: 'Overview', defaultView: 'List', autosave: true, focus: false, confirmActions: true },
  dashboard: { widgets: ['My tasks', 'Project progress', 'Team activity', 'Upcoming deadlines'], shortcuts: ['Create task', 'Open inbox'], layout: 'Balanced', defaultDashboard: 'Personal' },
  accessibility: { contrast: false, scale: '100%', keyboard: true, screenReader: true, focusRing: true, reduced: false, tooltips: true },
  workspace: { name: 'TeamFlow Workspace', description: 'A calm space for the team to plan and deliver.', visibility: 'Invite only', inviteEmail: '', logo: '' },
  integrations: { webhookUrl: '', apiBaseUrl: '', connected: [] },
  automation: { rules: [], shortcuts: [{ name: 'Open settings', keys: '⌘ K' }, { name: 'Create task', keys: '⌘ ⇧ N' }] },
  privacy: { profile: 'Workspace', activity: 'Team', online: true, analytics: false, personalization: true, cookies: 'Essential only' },
  ai: { enabled: true, language: 'Same as app', personalization: true, recommendations: true, history: true, dataUsage: 'Ask before using' },
  activity: { filter: 'All activity', range: '30 days', search: '' },
  backup: { auto: false, format: 'JSON', lastExport: '' },
  support: { topic: 'General question', message: '' },
  about: {},
  danger: {},
};
const clone = value => JSON.parse(JSON.stringify(value));
function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return clone(DEFAULTS);
    return Object.fromEntries(Object.keys(DEFAULTS).map(k => [k, { ...clone(DEFAULTS[k]), ...(raw[k] && typeof raw[k] === 'object' ? raw[k] : {}) }]));
  } catch { return clone(DEFAULTS); }
}
const descriptions = {
  profile: 'Manage how you appear to teammates across TeamFlow.', security: 'Protect your account and review access to your workspace.', notifications: 'Choose which updates you receive and when they arrive.',
  appearance: 'Make TeamFlow feel comfortable across your devices.', general: 'Set your regional, navigation and workflow defaults.', dashboard: 'Choose the information and shortcuts shown on your dashboard.', accessibility: 'Adjust controls and presentation to suit your needs.',
  workspace: 'Manage workspace details and prepare team access controls.', integrations: 'Connect the tools your team already uses.', automation: 'Design repeatable workflows and personal shortcuts.',
  privacy: 'Control visibility and preferences for product data.', ai: 'Choose how AI-assisted features behave in TeamFlow.', activity: 'Review available account and workspace activity.', backup: 'Export and import your non-sensitive preferences.', danger: 'Review sensitive account and workspace operations.', support: 'Find help or prepare feedback for the TeamFlow team.', about: 'Application information, release details and legal resources.'
};

function Field({ label, hint, children }) { return <label className="tf-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
function TextInput({ value, onChange, ...props }) { return <input value={value ?? ''} onChange={e => onChange(e.target.value)} {...props}/>; }
function Select({ value, onChange, options }) { return <select value={value} onChange={e => onChange(e.target.value)}>{options.map(v => <option key={v} value={v}>{v}</option>)}</select>; }
function Toggle({ checked, onChange, label, description }) { return <div className="tf-toggle-row"><div><strong>{label}</strong>{description && <p>{description}</p>}</div><button type="button" role="switch" aria-checked={!!checked} className={`tf-switch ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}><span/></button></div>; }
function Notice({ children, tone = 'info' }) { return <div className={`tf-notice ${tone}`}><Info size={16}/><span>{children}</span></div>; }
function ActionRow({ icon: Icon = ChevronRight, title, description, action = 'Manage', onClick, danger = false }) { return <div className={`tf-action-row ${danger ? 'danger' : ''}`}><div className="tf-action-copy">{Icon && <span className="tf-action-icon"><Icon size={17}/></span>}<span><strong>{title}</strong>{description && <small>{description}</small>}</span></div><button className="tf-btn secondary small" onClick={onClick}>{action}<ChevronRight size={14}/></button></div>; }
function SectionCard({ title, description, children, className = '' }) { return <section className={`tf-card ${className}`}><div className="tf-card-heading"><div><h3>{title}</h3>{description && <p>{description}</p>}</div></div>{children}</section>; }

export default function SettingsPage() {
  const [saved, setSaved] = useState(loadSettings);
  const [draft, setDraft] = useState(() => clone(saved));
  const [active, setActive] = useState('profile');
  const [search, setSearch] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [importCandidate, setImportCandidate] = useState(null);
  const [profilePreview, setProfilePreview] = useState(false);
  const [localEvents, setLocalEvents] = useState([]);
  const searchRef = useRef(null);
  const avatarRef = useRef(null);
  const importRef = useRef(null);
  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);
  const currentGroup = NAV.find(g => g.items.some(i => i[0] === active))?.group || 'PERSONAL';
  const notify = useCallback((message, type = 'success') => { setToast({ message, type }); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => setToast(null), 3000); }, []);
  const update = useCallback((section, key, value) => setDraft(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } })), []);
  const event = useCallback((label) => setLocalEvents(prev => [{ id: Date.now() + Math.random(), label, time: new Date().toISOString() }, ...prev].slice(0, 30)), []);

  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setMobileNav(false); setModal(null); setImportCandidate(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    const selected = draft.appearance.theme;
    const mode = selected === 'System' ? (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : selected.toLowerCase();
    root.dataset.tfSettingsTheme = mode;
    root.style.setProperty('--tf-settings-accent', draft.appearance.accent);
    root.style.setProperty('--tf-settings-scale', draft.appearance.fontSize === 'Large' ? '1.08' : draft.appearance.fontSize === 'Small' ? '.94' : '1');
    root.dataset.tfSettingsMotion = !draft.appearance.motion || draft.appearance.reduceMotion || draft.accessibility.reduced ? 'reduced' : 'normal';
    root.dataset.tfSettingsContrast = draft.accessibility.contrast ? 'high' : 'normal';
    root.dataset.tfSettingsFocus = draft.accessibility.focusRing ? 'visible' : 'standard';
    return () => { delete root.dataset.tfSettingsTheme; delete root.dataset.tfSettingsMotion; delete root.dataset.tfSettingsContrast; delete root.dataset.tfSettingsFocus; root.style.removeProperty('--tf-settings-accent'); root.style.removeProperty('--tf-settings-scale'); };
  }, [draft.appearance, draft.accessibility.reduced]);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  const setField = (section, key) => value => update(section, key, value);
  const save = () => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(draft));
      setSaved(clone(draft)); event('Settings saved on this device'); notify('Your preferences have been saved on this device.');
    } catch { notify('Could not save settings. Check browser storage permissions.', 'error'); }
  };
  const cancel = () => { if (!dirty) return; setDraft(clone(saved)); notify('Unsaved changes discarded.'); };
  const resetSection = () => setModal({ title: `Reset ${TITLES[active]}?`, message: 'This restores this section to its default values. Other sections will remain unchanged.', confirm: () => { setDraft(p => ({ ...p, [active]: clone(DEFAULTS[active]) })); event(`${TITLES[active]} reset to defaults`); notify('Section reset. Save to keep this change.'); } });
  const navigate = id => {
    if (dirty && !window.confirm('You have unsaved changes. Discard them and continue?')) return;
    setDraft(clone(saved)); setActive(id); setMobileNav(false); setSearch('');
  };
  const filteredNav = NAV.map(g => ({ ...g, items: g.items.filter(([id, label]) => `${label} ${id} ${g.group}`.toLowerCase().includes(search.toLowerCase())) })).filter(g => g.items.length);
  const updateList = (section, key, item, enabled) => update(section, key, enabled ? [...draft[section][key], item] : draft[section][key].filter(x => x !== item));
  const exportSettings = () => {
    const payload = { product: 'TeamFlow', schemaVersion: 3, exportedAt: new Date().toISOString(), settings: draft };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `teamflow-settings-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
    update('backup', 'lastExport', new Date().toISOString()); event('Settings exported'); notify('Settings export downloaded.');
  };
  const handleImport = async file => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { notify('Import file is too large (maximum 2 MB).', 'error'); return; }
    try {
      const data = JSON.parse(await file.text()); const source = data.settings || data;
      if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Invalid settings structure.');
      const next = {};
      Object.keys(DEFAULTS).forEach(k => { if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) next[k] = { ...clone(DEFAULTS[k]), ...source[k] }; });
      if (!Object.keys(next).length) throw new Error('No supported TeamFlow settings were found.');
      setImportCandidate(next);
    } catch (err) { notify(err.message || 'Could not read this file.', 'error'); }
  };
  const applyImport = () => { setDraft(p => ({ ...p, ...importCandidate })); event('Settings import staged for review'); setImportCandidate(null); notify('Imported settings added to the draft. Review and save to apply.'); };
  const uploadAvatar = file => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { notify('Use a PNG, JPG or WebP image.', 'error'); return; }
    if (file.size > MAX_AVATAR) { notify('Profile image must be 3 MB or smaller.', 'error'); return; }
    const reader = new FileReader(); reader.onload = () => update('profile', 'avatar', String(reader.result)); reader.onerror = () => notify('Could not read this image.', 'error'); reader.readAsDataURL(file);
  };
  const backend = label => notify(`${label} needs the TeamFlow backend/authentication service. No server action was performed.`, 'info');

  const renderSection = () => {
    const d = draft[active];
    switch (active) {
      case 'profile': return <>
        <SectionCard title="Profile photo" description="Use a clear image so teammates can recognize you.">
          <div className="tf-profile-photo"><div className="tf-avatar">{d.avatar ? <img src={d.avatar} alt="Profile preview"/> : (d.name || 'T').slice(0, 1).toUpperCase()}</div><div className="tf-profile-photo-copy"><strong>{d.name || 'Your name'}</strong><span>PNG, JPG or WebP · up to 3 MB</span><div className="tf-inline-actions"><button className="tf-btn secondary small" onClick={() => avatarRef.current?.click()}><Camera size={14}/> Upload photo</button>{d.avatar && <button className="tf-btn ghost small" onClick={() => update('profile', 'avatar', '')}>Remove</button>}</div><input ref={avatarRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e => { uploadAvatar(e.target.files?.[0]); e.target.value = ''; }}/></div><button className="tf-btn ghost small tf-preview-action" onClick={() => setProfilePreview(v => !v)}><Eye size={14}/>{profilePreview ? 'Hide preview' : 'Preview'}</button></div>
          {profilePreview && <div className="tf-profile-preview"><div className="tf-avatar mini">{d.avatar ? <img src={d.avatar} alt=""/> : (d.name || 'T').slice(0, 1).toUpperCase()}</div><div><strong>{d.displayName || d.name}</strong><span>@{d.username} · {d.visibility}</span><p>{d.bio || 'Your profile bio will appear here.'}</p></div></div>}
        </SectionCard>
        <SectionCard title="Personal information" description="These details form your TeamFlow identity."><div className="tf-form-grid"><Field label="Full name"><TextInput value={d.name} onChange={setField('profile', 'name')} placeholder="Your full name"/></Field><Field label="Username"><TextInput value={d.username} onChange={setField('profile', 'username')} placeholder="username"/></Field><Field label="Display name"><TextInput value={d.displayName} onChange={setField('profile', 'displayName')} placeholder="Name shown to teammates"/></Field><Field label="Email address"><TextInput type="email" value={d.email} onChange={setField('profile', 'email')} placeholder="you@example.com"/></Field><Field label="Phone number"><TextInput type="tel" value={d.phone} onChange={setField('profile', 'phone')} placeholder="Optional"/></Field><Field label="Location"><TextInput value={d.location} onChange={setField('profile', 'location')} placeholder="City, country"/></Field><Field label="Website"><TextInput type="url" value={d.website} onChange={setField('profile', 'website')} placeholder="https://"/></Field><Field label="LinkedIn"><TextInput value={d.linkedin} onChange={setField('profile', 'linkedin')} placeholder="LinkedIn profile URL"/></Field><Field label="GitHub"><TextInput value={d.github} onChange={setField('profile', 'github')} placeholder="GitHub profile URL"/></Field><Field label="Profile visibility"><Select value={d.visibility} onChange={setField('profile', 'visibility')} options={['Public', 'Workspace', 'Private']}/></Field></div><Field label="Bio"><textarea rows="3" maxLength={240} value={d.bio} onChange={e => update('profile', 'bio', e.target.value)} placeholder="A short introduction..."/><small className="tf-char-count">{d.bio.length}/240</small></Field><Toggle label="Show online status" description="Let teammates see when you are available." checked={d.online} onChange={setField('profile', 'online')}/><div className="tf-verified"><ShieldCheck size={17}/><span><strong>Email verification</strong><small>Verification status is supplied by your account service.</small></span><button className="tf-btn secondary small" onClick={() => backend('Email verification')}>Check status</button></div></SectionCard>
      </>;
      case 'security': return <>
        <SectionCard title="Sign-in security" description="Sensitive changes are completed by the authenticated account service."><div className="tf-security-banner"><div className="tf-security-icon"><ShieldCheck/></div><div><strong>Your account security</strong><p>Review security controls and manage your sign-in methods.</p></div><span className="tf-status-pill">Backend managed</span></div><ActionRow icon={KeyRound} title="Change password" description="Update your account password securely." action="Change" onClick={() => backend('Password change')}/><ActionRow icon={Fingerprint} title="Passkeys" description="Use a device passkey for passwordless sign-in." action="Manage" onClick={() => backend('Passkey management')}/><ActionRow icon={Shield} title="Two-factor authentication" description="Add a second verification step to sign-in." action={d.twoFactor ? 'Manage' : 'Set up'} onClick={() => backend('Two-factor authentication')}/><ActionRow icon={Mail} title="Recovery email" description="Set a recovery address for account access." action="Configure" onClick={() => backend('Recovery email')}/><Field label="Recovery email preference"><TextInput type="email" value={d.recoveryEmail} onChange={setField('security', 'recoveryEmail')} placeholder="recovery@example.com"/></Field><Toggle label="Login alerts" description="Save your preference for sign-in notifications." checked={d.loginAlerts} onChange={setField('security', 'loginAlerts')}/><Toggle label="Remember this device preference" description="Preference only; trusted-device registration is server-managed." checked={d.trustedDevice} onChange={setField('security', 'trustedDevice')}/></SectionCard>
        <SectionCard title="Sessions & devices" description="Live sessions must be loaded from your account API."><ActionRow icon={Monitor} title="Active sessions" description="View browsers and devices currently signed in." action="View sessions" onClick={() => backend('Active session list')}/><ActionRow icon={History} title="Login history" description="Review recent sign-in events and locations." action="View history" onClick={() => backend('Login history')}/><ActionRow icon={LogOut} title="Sign out of all devices" description="Revoke all sessions after secure re-authentication." action="Sign out all" danger onClick={() => setModal({ title: 'Sign out of all devices?', message: 'This requires secure re-authentication and a server response. Continue to the account security flow?', confirm: () => backend('Sign out of all devices') })}/></SectionCard>
        <Notice>Passwords, passkeys, recovery secrets and session tokens are never stored in this page's local storage.</Notice>
      </>;
      case 'notifications': return <>
        <SectionCard title="Delivery channels" description="Choose where TeamFlow can notify you."><Toggle label="Email notifications" checked={d.email} onChange={setField('notifications', 'email')}/><Toggle label="Push notifications" checked={d.push} onChange={setField('notifications', 'push')}/><Toggle label="In-app notifications" checked={d.inApp} onChange={setField('notifications', 'inApp')}/></SectionCard>
        <SectionCard title="What you receive" description="Manage notification categories independently.">{[['security','Security alerts'],['messages','Messages'],['mentions','Mentions'],['replies','Replies'],['tasks','Task updates'],['workspace','Workspace activity'],['system','System updates'],['product','Product announcements']].map(([key,label]) => <Toggle key={key} label={label} checked={d[key]} onChange={setField('notifications', key)}/>)}</SectionCard>
        <SectionCard title="Schedule & sound"><div className="tf-form-grid"><Field label="Notification frequency"><Select value={d.frequency} onChange={setField('notifications', 'frequency')} options={['Instant', 'Hourly digest', 'Daily digest', 'Weekly digest']}/></Field><Field label="Quiet hours start"><TextInput type="time" value={d.quietStart} onChange={setField('notifications', 'quietStart')}/></Field><Field label="Quiet hours end"><TextInput type="time" value={d.quietEnd} onChange={setField('notifications', 'quietEnd')}/></Field></div><Toggle label="Enable quiet hours" description="Store your preferred do-not-disturb window." checked={d.quiet} onChange={setField('notifications', 'quiet')}/><Toggle label="Notification sounds" checked={d.sound} onChange={setField('notifications', 'sound')}/></SectionCard>
        <Notice>These are saved delivery preferences. Actual email, push and in-app delivery must be configured by the notification service.</Notice>
      </>;
      case 'appearance': return <>
        <SectionCard title="Theme" description="Dark is the default to match the TeamFlow workspace website."><div className="tf-theme-options">{[['Dark',Moon],['Light',Sun],['System',Laptop]].map(([name, Icon]) => <button key={name} className={`tf-theme-option ${d.theme === name ? 'selected' : ''}`} onClick={() => update('appearance', 'theme', name)}><Icon size={21}/><strong>{name}</strong>{d.theme === name && <Check size={15}/>}</button>)}</div></SectionCard>
        <SectionCard title="Color & typography"><div className="tf-form-grid"><Field label="Accent color"><div className="tf-color-field"><input type="color" value={d.accent} onChange={e => update('appearance', 'accent', e.target.value)}/><code>{d.accent}</code></div></Field><Field label="Font family"><Select value={d.font} onChange={setField('appearance', 'font')} options={['DM Sans', 'Manrope', 'System']}/></Field><Field label="Font size"><Select value={d.fontSize} onChange={setField('appearance', 'fontSize')} options={['Small', 'Default', 'Large']}/></Field><Field label="Layout density"><Select value={d.density} onChange={setField('appearance', 'density')} options={['Comfortable', 'Compact', 'Spacious']}/></Field><Field label="Card style"><Select value={d.cards} onChange={setField('appearance', 'cards')} options={['Rounded', 'Soft', 'Square']}/></Field><Field label="Sidebar"><Select value={d.sidebar} onChange={setField('appearance', 'sidebar')} options={['Expanded', 'Compact']}/></Field></div><div className="tf-preview-swatch"><span/><span/><span/><div><strong>TeamFlow preview</strong><small>Emerald accents · calm workspace</small></div><button className="tf-btn primary small">Action</button></div><Toggle label="Enable subtle animations" checked={d.motion} onChange={setField('appearance', 'motion')}/><Toggle label="Reduce motion" checked={d.reduceMotion} onChange={setField('appearance', 'reduceMotion')}/></SectionCard>
      </>;
      case 'general': return <>
        <SectionCard title="Regional preferences"><div className="tf-form-grid"><Field label="Language"><Select value={d.language} onChange={setField('general', 'language')} options={['English', 'Hindi', 'Spanish', 'French', 'German']}/></Field><Field label="Time zone"><Select value={d.timezone} onChange={setField('general', 'timezone')} options={['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai']}/></Field><Field label="Date format"><Select value={d.dateFormat} onChange={setField('general', 'dateFormat')} options={['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}/></Field><Field label="Time format"><Select value={d.timeFormat} onChange={setField('general', 'timeFormat')} options={['12-hour', '24-hour']}/></Field><Field label="Currency"><Select value={d.currency} onChange={setField('general', 'currency')} options={['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)']}/></Field></div></SectionCard>
        <SectionCard title="Workspace behavior"><div className="tf-form-grid"><Field label="Landing page"><Select value={d.landing} onChange={setField('general', 'landing')} options={['Overview', 'My space', 'Tasks', 'Projects']}/></Field><Field label="Default view"><Select value={d.defaultView} onChange={setField('general', 'defaultView')} options={['List', 'Board', 'Calendar']}/></Field></div><Toggle label="Auto-save preference" description="Store your preference for supported editable forms." checked={d.autosave} onChange={setField('general', 'autosave')}/><Toggle label="Focus mode preference" description="Requests a reduced-distraction layout where supported." checked={d.focus} onChange={setField('general', 'focus')}/><Toggle label="Confirm important actions" checked={d.confirmActions} onChange={setField('general', 'confirmActions')}/></SectionCard>
      </>;
      case 'dashboard': return <>
        <SectionCard title="Dashboard widgets" description="Choose the cards you want to see on your dashboard."><div className="tf-widget-list">{['My tasks', 'Project progress', 'Team activity', 'Upcoming deadlines', 'Recent files', 'Messages summary', 'Workload overview', 'Quick notes'].map((w, i) => <label className="tf-widget-option" key={w}><input type="checkbox" checked={d.widgets.includes(w)} onChange={e => updateList('dashboard', 'widgets', w, e.target.checked)}/><span>{w}</span><GripVertical size={15}/></label>)}</div><Field label="Dashboard layout"><Select value={d.layout} onChange={setField('dashboard', 'layout')} options={['Balanced', 'Focus', 'Analytics']}/></Field><Field label="Default dashboard"><Select value={d.defaultDashboard} onChange={setField('dashboard', 'defaultDashboard')} options={['Personal', 'Workspace', 'Project']}/></Field><Notice>Widget visibility and layout preferences are stored locally. Drag-and-drop placement and resizing require the dashboard layout engine.</Notice></SectionCard>
        <SectionCard title="Quick shortcuts"><div className="tf-chip-list">{d.shortcuts.map(s => <span className="tf-chip" key={s}>{s}<button aria-label={`Remove ${s}`} onClick={() => update('dashboard', 'shortcuts', d.shortcuts.filter(x => x !== s))}><X size={12}/></button></span>)}</div><button className="tf-btn secondary small" onClick={() => { const v = window.prompt('Shortcut name'); if (v?.trim()) update('dashboard', 'shortcuts', [...d.shortcuts, v.trim()]); }}><Plus size={14}/> Add shortcut</button></SectionCard>
      </>;
      case 'accessibility': return <>
        <SectionCard title="Visual accessibility"><Toggle label="High contrast" description="Increase separation between text and surfaces." checked={d.contrast} onChange={setField('accessibility', 'contrast')}/><Field label="Text scaling"><Select value={d.scale} onChange={setField('accessibility', 'scale')} options={['90%', '100%', '110%', '125%', '150%', '175%', '200%']}/></Field><Toggle label="Visible focus indicators" checked={d.focusRing} onChange={setField('accessibility', 'focusRing')}/><Toggle label="Reduce motion" checked={d.reduced} onChange={setField('accessibility', 'reduced')}/></SectionCard>
        <SectionCard title="Assistive technology"><Toggle label="Keyboard navigation support" checked={d.keyboard} onChange={setField('accessibility', 'keyboard')}/><Toggle label="Screen reader descriptions" checked={d.screenReader} onChange={setField('accessibility', 'screenReader')}/><Toggle label="Helpful tooltips" checked={d.tooltips} onChange={setField('accessibility', 'tooltips')}/><Notice>Preferences are applied to this Settings interface where supported. The full app must consume the same accessibility settings for global behavior.</Notice></SectionCard>
      </>;
      case 'workspace': return <>
        <SectionCard title="Workspace profile"><div className="tf-form-grid"><Field label="Workspace name"><TextInput value={d.name} onChange={setField('workspace', 'name')}/></Field><Field label="Visibility"><Select value={d.visibility} onChange={setField('workspace', 'visibility')} options={['Invite only', 'Private', 'Public']}/></Field></div><Field label="Description"><textarea rows="3" value={d.description} onChange={e => update('workspace', 'description', e.target.value)}/></Field><Field label="Workspace logo"><input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={e => { const f = e.target.files?.[0]; if (f) { if (f.size > MAX_AVATAR) notify('Logo must be 3 MB or smaller.', 'error'); else { const reader = new FileReader(); reader.onload = () => update('workspace', 'logo', String(reader.result)); reader.readAsDataURL(f); } } }}/></Field></SectionCard>
        <SectionCard title="Members & permissions" description="Member lists and roles are loaded from the workspace service."><Field label="Invite by email"><TextInput type="email" value={d.inviteEmail} onChange={setField('workspace', 'inviteEmail')} placeholder="teammate@example.com"/></Field><button className="tf-btn primary" onClick={() => backend('Workspace invitation')}><UserPlus size={15}/> Send invitation</button><ActionRow icon={Users} title="Manage members" description="View, remove or update workspace members." onClick={() => backend('Member management')}/><ActionRow icon={Shield} title="Roles & permissions" description="Review built-in and custom workspace roles." onClick={() => backend('Role and permission management')}/><ActionRow icon={ArrowUpRight} title="Transfer ownership" description="Transfer workspace ownership to another member." danger onClick={() => backend('Workspace ownership transfer')}/><ActionRow icon={LogOut} title="Leave or delete workspace" description="Requires owner/administrator authorization." danger onClick={() => backend('Leave or delete workspace')}/></SectionCard>
      </>;
      case 'integrations': return <>
        <SectionCard title="Connected apps" description="Connectors use OAuth and secure server-side token storage.">{[['Google',Globe],['GitHub',GitBranch],['Microsoft',Monitor],['Slack',MessageSquare],['Calendar',CalendarDays]].map(([name, Icon]) => { const connected = d.connected.includes(name); return <div className="tf-integration" key={name}><div className="tf-integration-logo"><Icon size={20}/></div><div><strong>{name}</strong><small>{connected ? 'Marked in local preferences' : 'Not connected'}</small></div><button className={`tf-btn ${connected ? 'ghost' : 'secondary'} small`} onClick={() => backend(`${name} OAuth ${connected ? 'disconnect' : 'connect'}`)}>{connected ? 'Manage' : 'Connect'}</button></div>; })}</SectionCard>
        <SectionCard title="API & webhooks"><Field label="Webhook endpoint URL"><TextInput type="url" value={d.webhookUrl} onChange={setField('integrations', 'webhookUrl')} placeholder="https://your-service.example/webhook"/></Field><Field label="API base URL (optional)"><TextInput type="url" value={d.apiBaseUrl} onChange={setField('integrations', 'apiBaseUrl')} placeholder="https://api.your-domain.com"/></Field><button className="tf-btn secondary" onClick={() => backend('Webhook registration')}><Webhook size={15}/> Configure webhook</button><Notice>Never paste API secrets or access tokens here. Secret storage and webhook signing belong on the backend.</Notice></SectionCard>
      </>;
      case 'automation': return <>
        <SectionCard title="Automation rules" description="Create and manage local rule drafts. Execution requires a workflow service.">{d.rules.length === 0 && <div className="tf-empty"><Workflow size={23}/><strong>No automation rules</strong><span>Create a rule draft to define a trigger and action.</span></div>}{d.rules.map((r, i) => <div className="tf-rule" key={r.id}><div><strong>{r.name}</strong><small>{r.trigger} → {r.action}</small></div><label className="tf-mini-toggle"><input type="checkbox" checked={r.enabled} onChange={e => update('automation', 'rules', d.rules.map((x,j) => i === j ? {...x, enabled:e.target.checked} : x))}/><span>{r.enabled ? 'On' : 'Off'}</span></label><button className="tf-icon-button danger" aria-label="Delete rule" onClick={() => update('automation', 'rules', d.rules.filter((_,j) => j !== i))}><Trash2 size={15}/></button></div>)}<button className="tf-btn primary" onClick={() => setModal({ title: 'Create automation rule', fields: true, confirm: values => { if (!values.name.trim()) return notify('Enter a rule name.', 'error'); update('automation', 'rules', [...d.rules, { id: Date.now(), name: values.name.trim(), trigger: values.trigger, action: values.action, enabled: true }]); notify('Rule draft created. Save settings to keep it.'); } })}><Plus size={15}/> Create rule</button><Notice>These rules are local drafts only. Scheduling, trigger evaluation, action execution and run history require a backend worker.</Notice></SectionCard>
        <SectionCard title="Personal shortcuts">{d.shortcuts.map(s => <div className="tf-shortcut-row" key={s.name}><span>{s.name}</span><kbd>{s.keys}</kbd></div>)}</SectionCard>
      </>;
      case 'privacy': return <>
        <SectionCard title="Profile & activity visibility"><Field label="Profile visibility"><Select value={d.profile} onChange={setField('privacy', 'profile')} options={['Public', 'Workspace', 'Private']}/></Field><Field label="Activity visibility"><Select value={d.activity} onChange={setField('privacy', 'activity')} options={['Everyone', 'Team', 'Only me']}/></Field><Toggle label="Show online status" checked={d.online} onChange={setField('privacy', 'online')}/></SectionCard>
        <SectionCard title="Data preferences"><Field label="Cookie preference"><Select value={d.cookies} onChange={setField('privacy', 'cookies')} options={['Essential only', 'Essential + analytics', 'All cookies']}/></Field><Toggle label="Usage analytics" description="Save your analytics preference for the application." checked={d.analytics} onChange={setField('privacy', 'analytics')}/><Toggle label="Personalized experience" checked={d.personalization} onChange={setField('privacy', 'personalization')}/><ActionRow icon={Download} title="Request personal data export" description="Request a copy of account data held by TeamFlow." action="Request" onClick={() => backend('Personal data export')}/><ActionRow icon={LockKeyhole} title="Connected app permissions" description="Review and revoke external app access." action="Review" onClick={() => backend('Connected app permissions')}/></SectionCard>
        <Notice>Changing these preferences here does not itself change server-side collection, cookie consent or connected-app permissions until the corresponding services are integrated.</Notice>
      </>;
      case 'ai': return <>
        <SectionCard title="AI assistant"><Toggle label="Enable AI assistant" description="Store your preference for AI-assisted features." checked={d.enabled} onChange={setField('ai', 'enabled')}/><Field label="Response language"><Select value={d.language} onChange={setField('ai', 'language')} options={['Same as app', 'English', 'Hindi', 'Spanish', 'French', 'German']}/></Field><Toggle label="Personalized responses" checked={d.personalization} onChange={setField('ai', 'personalization')}/><Toggle label="Smart recommendations" checked={d.recommendations} onChange={setField('ai', 'recommendations')}/></SectionCard>
        <SectionCard title="AI privacy & history"><Toggle label="Conversation history preference" checked={d.history} onChange={setField('ai', 'history')}/><Field label="Data usage preference"><Select value={d.dataUsage} onChange={setField('ai', 'dataUsage')} options={['Ask before using', 'Use workspace content', 'Do not use workspace content']}/></Field><ActionRow icon={History} title="Manage AI history" description="Review or delete stored AI conversations." action="Manage" onClick={() => backend('AI history management')}/><Notice>AI memory, history retention, model data usage and deletion must be enforced by the AI service, not this browser preference.</Notice></SectionCard>
      </>;
      case 'activity': return <>
        <SectionCard title="Activity & audit log" description="Local preference changes are shown separately from authoritative server audit records."><div className="tf-form-grid"><Field label="Activity type"><Select value={d.filter} onChange={setField('activity', 'filter')} options={['All activity', 'Account changes', 'Login activity', 'Profile changes', 'Security changes', 'Workspace activity', 'Permission changes', 'Integration activity']}/></Field><Field label="Date range"><Select value={d.range} onChange={setField('activity', 'range')} options={['7 days', '30 days', '90 days', 'All time']}/></Field></div><Field label="Search activity"><div className="tf-input-icon"><Search size={15}/><TextInput value={d.search} onChange={setField('activity', 'search')} placeholder="Search local events..."/></div></Field><div className="tf-timeline">{localEvents.filter(x => !d.search || x.label.toLowerCase().includes(d.search.toLowerCase())).map(x => <div className="tf-timeline-item" key={x.id}><i/><div><strong>{x.label}</strong><small>{new Date(x.time).toLocaleString()}</small></div><span>Local</span></div>)}{localEvents.length === 0 && <div className="tf-empty"><Activity size={22}/><strong>No local activity yet</strong><span>Changes made in this settings session will be recorded here.</span></div>}</div><button className="tf-btn secondary" onClick={() => backend('Server audit log export')}><Download size={15}/> Export server audit report</button></SectionCard>
        <Notice>Local events are not a substitute for server audit records, login history or permission-change logs.</Notice>
      </>;
      case 'backup': return <>
        <SectionCard title="Export settings" description="Download a portable copy of your non-sensitive TeamFlow preferences."><div className="tf-export-panel"><div className="tf-export-icon"><Database/></div><div><strong>Settings backup</strong><span>JSON · Includes saved preference sections</span></div><button className="tf-btn primary" onClick={exportSettings}><Download size={15}/> Export JSON</button></div><Field label="Preferred format"><Select value={d.format} onChange={setField('backup', 'format')} options={['JSON']}/></Field><Toggle label="Automatic backup preference" description="A scheduled cloud backup is not active until a backup service is connected." checked={d.auto} onChange={setField('backup', 'auto')}/>{d.lastExport && <p className="tf-muted">Last export: {new Date(d.lastExport).toLocaleString()}</p>}</SectionCard>
        <SectionCard title="Import settings" description="Preview the contents before applying anything."><input ref={importRef} type="file" accept=".json,application/json" hidden onChange={e => { handleImport(e.target.files?.[0]); e.target.value = ''; }}/><button className="tf-btn secondary" onClick={() => importRef.current?.click()}><Upload size={15}/> Choose JSON file</button>{importCandidate && <div className="tf-import-preview"><strong>Import preview</strong><p>Sections found: {Object.keys(importCandidate).map(k => TITLES[k] || k).join(', ')}</p><div className="tf-inline-actions"><button className="tf-btn primary small" onClick={applyImport}>Apply to draft</button><button className="tf-btn ghost small" onClick={() => setImportCandidate(null)}>Discard</button></div></div>}</SectionCard>
        <Notice>Import only updates the unsaved draft. Nothing is persisted until you review and press Save.</Notice>
      </>;
      case 'danger': return <>
        <SectionCard title="Sensitive account actions" description="These operations require backend authorization and identity re-verification." className="tf-danger-card"><ActionRow icon={UserRound} title="Deactivate account" description="Temporarily disable account access." danger action="Review" onClick={() => backend('Account deactivation')}/><ActionRow icon={Trash2} title="Delete account" description="Permanently delete your account and associated data." danger action="Review" onClick={() => backend('Account deletion')}/></SectionCard>
        <SectionCard title="Workspace actions" className="tf-danger-card"><ActionRow icon={LogOut} title="Leave workspace" description="Remove your membership from this workspace." danger action="Review" onClick={() => backend('Leave workspace')}/><ActionRow icon={Trash2} title="Delete workspace" description="Permanently remove a workspace and its content." danger action="Review" onClick={() => backend('Delete workspace')}/><ActionRow icon={ArrowUpRight} title="Transfer ownership" description="Assign workspace ownership to another eligible member." danger action="Review" onClick={() => backend('Transfer ownership')}/><ActionRow icon={Shield} title="Revoke all sessions" description="Sign out all devices after re-authentication." danger action="Review" onClick={() => backend('Revoke all sessions')}/></SectionCard>
        <Notice tone="danger">No destructive action is executed by this frontend. A secure backend flow must confirm identity and permissions first.</Notice>
      </>;
      case 'support': return <>
        <SectionCard title="Help & resources"><div className="tf-resource-grid">{[['Help center','Browse product guidance',LifeBuoy],['FAQs','Common questions',CircleHelp],['Documentation','How TeamFlow works',FileText],['System status','Service availability',Activity],['What’s new','Product updates',Sparkles]].map(([title, desc, Icon]) => <button className="tf-resource" key={title} onClick={() => notify(`Configure the real ${title} URL in your app before enabling this link.`, 'info')}><Icon size={19}/><strong>{title}</strong><small>{desc}</small><ExternalLink size={13}/></button>)}</div></SectionCard>
        <SectionCard title="Contact & feedback"><Field label="Topic"><Select value={d.topic} onChange={setField('support', 'topic')} options={['General question', 'Bug report', 'Feature request', 'Suggestion']}/></Field><Field label="Message"><textarea rows="4" value={d.message} onChange={e => update('support', 'message', e.target.value)} placeholder="Describe what you need help with..."/></Field><button className="tf-btn primary" onClick={() => backend('Support request submission')}><MessageSquare size={15}/> Submit feedback</button><Notice>Feedback submission, contact support and live chat need a configured support endpoint.</Notice></SectionCard>
      </>;
      case 'about': return <>
        <SectionCard title="About TeamFlow"><div className="tf-about-brand"><div className="tf-brand-mark">T</div><div><h3>TeamFlow</h3><p>Work together. Move forward.</p></div></div><div className="tf-about-details"><span>Product</span><strong>TeamFlow</strong><span>Version</span><strong>Provided by application build</strong><span>Theme</span><strong>Emerald workspace</strong><span>Copyright</span><strong>© TeamFlow</strong></div></SectionCard>
        <SectionCard title="Legal & release information">{['Release notes', 'Terms and Conditions', 'Privacy Policy', 'Cookie Policy'].map(x => <ActionRow key={x} icon={FileText} title={x} action="Open" onClick={() => notify(`Set the official ${x} URL in your application configuration.`, 'info')}/>)}</SectionCard>
      </>;
      default: return null;
    }
  };

  const effectiveTheme = draft.appearance.theme === 'System' ? (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : draft.appearance.theme.toLowerCase();
  const fontScale = draft.accessibility.scale === '90%' ? '.9' : draft.accessibility.scale === '110%' ? '1.1' : draft.accessibility.scale === '125%' ? '1.25' : draft.accessibility.scale === '150%' ? '1.5' : draft.accessibility.scale === '175%' ? '1.75' : draft.accessibility.scale === '200%' ? '2' : draft.appearance.fontSize === 'Large' ? '1.08' : draft.appearance.fontSize === 'Small' ? '.94' : '1';

  return <div className="tf-settings-page" data-theme={effectiveTheme} data-font={draft.appearance.font} data-density={draft.appearance.density.toLowerCase()} data-sidebar={draft.appearance.sidebar.toLowerCase()} style={{ '--tf-settings-scale': fontScale }}>
    <header className="tf-settings-topbar"><div className="tf-brand-lockup"><span className="tf-brand-mark">T</span><strong>TeamFlow</strong><span className="tf-top-divider">/</span><span>Settings</span></div><div className="tf-topbar-actions"><button className="tf-search-trigger" onClick={() => searchRef.current?.focus()}><Search size={15}/> Search settings <kbd><Command size={11}/> K</kbd></button><button className="tf-icon-button tf-mobile-trigger" aria-label="Open settings navigation" onClick={() => setMobileNav(v => !v)}><Menu size={18}/></button><div className="tf-top-avatar">{(draft.profile.name || 'T').slice(0,1).toUpperCase()}</div></div></header>
    <div className="tf-settings-container"><div className="tf-page-intro"><div><p className="tf-eyebrow">TEAM WORKSPACE · PREFERENCES</p><h1>Settings <span>Control Center</span></h1><p>Manage your account, workspace, and preferences in one place.</p></div><div className={`tf-save-indicator ${dirty ? 'pending' : ''}`}><i/>{dirty ? 'Unsaved changes' : 'All changes saved'}</div></div>
      <div className="tf-settings-layout"><aside className={`tf-settings-sidebar ${mobileNav ? 'mobile-open' : ''}`}><div className="tf-sidebar-search"><Search size={15}/><input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search settings..."/><kbd>⌘K</kbd>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={13}/></button>}</div><nav>{filteredNav.map(group => <div className="tf-nav-group" key={group.group}><p>{group.group}</p>{group.items.map(([id, label, Icon]) => <button key={id} className={`tf-nav-item ${active === id ? 'active' : ''} ${id === 'danger' ? 'danger-link' : ''}`} onClick={() => navigate(id)}><Icon size={16}/><span>{label}</span>{active === id && <ChevronRight size={14}/>}</button>)}</div>)}{filteredNav.length === 0 && <div className="tf-no-results">No matching settings found.</div>}</nav><div className="tf-sidebar-foot"><ShieldCheck size={15}/><span>Preferences stored on this device</span></div></aside>
        {mobileNav && <button className="tf-mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>}
        <section className="tf-settings-content"><div className="tf-breadcrumb"><span>Settings</span><ChevronRight size={13}/><span>{currentGroup}</span><ChevronRight size={13}/><strong>{TITLES[active]}</strong></div><div className="tf-content-heading"><div><span className="tf-section-kicker">{currentGroup}</span><h2>{TITLES[active]}</h2><p>{descriptions[active]}</p></div><button className="tf-btn ghost small" onClick={resetSection}><RotateCcw size={14}/> Reset section</button></div><div className="tf-section-stack">{renderSection()}</div><footer className="tf-settings-footer"><div><span className="tf-footer-dot"/>{dirty ? 'You have changes waiting to be saved.' : 'Your preferences are up to date.'}</div><div className="tf-footer-actions"><button className="tf-btn ghost" onClick={cancel} disabled={!dirty}>Cancel</button><button className="tf-btn primary" onClick={save} disabled={!dirty}><Save size={15}/> Save changes</button></div></footer></section>
      </div>
    </div>
    {toast && <div className={`tf-toast ${toast.type}`} role="status"><CheckCircle2 size={16}/>{toast.message}</div>}
    {modal && <div className="tf-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null); }}><div className="tf-modal" role="dialog" aria-modal="true" aria-labelledby="tf-modal-title"><div className="tf-modal-icon"><AlertTriangle size={20}/></div><h3 id="tf-modal-title">{modal.title}</h3>{modal.fields ? <RuleForm onCancel={() => setModal(null)} onCreate={values => { modal.confirm(values); setModal(null); }}/>:<><p>{modal.message}</p><div className="tf-modal-actions"><button className="tf-btn ghost" onClick={() => setModal(null)}>Cancel</button><button className="tf-btn primary" onClick={() => { modal.confirm?.(); setModal(null); }}>Continue</button></div></>}</div></div>}
  </div>;
}

function RuleForm({ onCancel, onCreate }) {
  const [name, setName] = useState(''); const [trigger, setTrigger] = useState('When a task is overdue'); const [action, setAction] = useState('Send a notification');
  return <div className="tf-rule-form"><Field label="Rule name"><TextInput value={name} onChange={setName} placeholder="e.g. Overdue task reminder"/></Field><Field label="Trigger"><Select value={trigger} onChange={setTrigger} options={['When a task is overdue', 'When a task is assigned', 'When a project changes status', 'When someone mentions me']}/></Field><Field label="Action"><Select value={action} onChange={setAction} options={['Send a notification', 'Create a follow-up task', 'Notify project owner', 'Add a review reminder']}/></Field><div className="tf-modal-actions"><button className="tf-btn ghost" onClick={onCancel}>Cancel</button><button className="tf-btn primary" onClick={() => onCreate({ name, trigger, action })}>Create draft rule</button></div></div>;
}
