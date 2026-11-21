
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Download,
  Eye,
  Plus,
  Save,
  Trash2,
  X,
  ExternalLink,
  Award,
  BriefcaseBusiness,
  UserRound,
  Code2,
  Globe,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import '../App.css';

const KEY = 'teamflow.profile.v1';

const EMPTY = {
  fullName: '',
  email: '',
  countryCode: '+91',
  phone: '',
  bio: '',
  skills: '',
  alternateContact: '',
  role: '',
  team: '',
  location: '',
  language: 'English',
  visibility: 'Team',
  photo: '',
  emailVerified: false,
  phoneVerified: false,
  linkedin: '',
  github: '',
  leetcode: '',
  portfolioUrl: '',
  links: [],
  projects: [],
  certificates: []
};

const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || '{}');

    return {
      ...EMPTY,
      ...stored,
      skills: stored.skills || '',
      links: Array.isArray(stored.links) ? stored.links : [],
      projects: Array.isArray(stored.projects) ? stored.projects : [],
      certificates: Array.isArray(stored.certificates)
        ? stored.certificates
        : []
    };
  } catch {
    return { ...EMPTY };
  }
}

function loadHistory() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(`${KEY}.history`) || '[]'
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function ProfilePage({ onBack }) {
  const [saved, setSaved] = useState(loadProfile);
  const [form, setForm] = useState(loadProfile);
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [history, setHistory] = useState(loadHistory);

  const photoRef = useRef(null);

  const set = (key, value) => {
    setForm(previous => ({
      ...previous,
      [key]: value
    }));
  };

  const updateList = (key, id, patch) => {
    setForm(previous => ({
      ...previous,
      [key]: previous[key].map(item =>
        item.id === id ? { ...item, ...patch } : item
      )
    }));
  };

  const addList = key => {
    setForm(previous => ({
      ...previous,
      [key]: [
        ...previous[key],
        {
          id: uid(),
          name: '',
          description: '',
          url: '',
          repoUrl: '',
          organization: '',
          issueDate: '',
          expiryDate: '',
          credentialId: ''
        }
      ]
    }));
  };

  const removeList = (key, id) => {
    setForm(previous => ({
      ...previous,
      [key]: previous[key].filter(item => item.id !== id)
    }));
  };

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(''), 3500);

    return () => clearTimeout(timer);
  }, [notice]);

  const validate = () => {
    if (!form.fullName.trim()) {
      return 'Full name is required.';
    }

    const email = form.email.trim();

    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return 'Enter a valid email address.';
      }

      if (!form.emailVerified) {
        return 'Please verify your email using OTP.';
      }
    }

    if (!/^\d{10}$/.test(form.phone)) {
      return 'Phone number must contain exactly 10 digits.';
    }

    if (!form.phoneVerified) {
      return 'Please verify your phone number using OTP.';
    }

    const urls = [
      form.linkedin,
      form.github,
      form.leetcode,
      form.portfolioUrl,
      ...form.links.map(item => item.url),
      ...form.projects.flatMap(item => [
        item.url,
        item.repoUrl
      ]),
      ...form.certificates.map(item => item.url)
    ];

    if (
      urls.some(url =>
        url && !/^https?:\/\/.+/i.test(url.trim())
      )
    ) {
      return 'Links must start with http:// or https://.';
    }

    if (
      form.certificates.some(item =>
        item.issueDate &&
        item.expiryDate &&
        item.expiryDate < item.issueDate
      )
    ) {
      return 'Certificate expiry cannot be before issue date.';
    }

    return '';
  };

  const save = () => {
    const error = validate();

    if (error) {
      setNotice(error);
      return;
    }

    const cleanForm = {
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      skills: form.skills.trim(),
      emailVerified: Boolean(
        form.email.trim() && form.emailVerified
      )
    };

    const nextHistory = [
      {
        id: uid(),
        savedAt: new Date().toISOString(),
        profile: saved
      },
      ...history
    ].slice(0, 20);

    try {
      localStorage.setItem(KEY, JSON.stringify(cleanForm));

      localStorage.setItem(
        `${KEY}.history`,
        JSON.stringify(nextHistory)
      );

      setSaved(cleanForm);
      setForm(cleanForm);
      setHistory(nextHistory);
      setNotice('Profile saved on this device.');
    } catch {
      setNotice(
        'Could not save profile. Your photo or data may be too large.'
      );
    }
  };

  const cancel = () => {
    setForm({ ...saved });
    setNotice('Changes discarded.');
  };

  const verifyDemo = field => {
    if (field === 'emailVerified' && !form.email.trim()) {
      setNotice('Enter your email address first.');
      return;
    }

    if (
      field === 'phoneVerified' &&
      !/^\d{10}$/.test(form.phone)
    ) {
      setNotice('Enter a valid 10-digit phone number first.');
      return;
    }

    const code = window.prompt('Demo OTP: enter 123456');

    if (code === '123456') {
      set(field, true);
      setNotice(
        'Demo verification successful. No real email or SMS was sent.'
      );
    } else if (code !== null) {
      setNotice('Incorrect demo OTP.');
    }
  };

  const exportData = () => {
    try {
      const blob = new Blob(
        [JSON.stringify(form, null, 2)],
        { type: 'application/json' }
      );

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = 'teamflow-profile.json';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } catch {
      setNotice('Could not export profile.');
    }
  };

  const uploadPhoto = event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    ) {
      setNotice('Only JPG, PNG and WEBP images are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setNotice('Photo must be 3 MB or smaller.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      set('photo', reader.result);
      setNotice('Profile photo selected. Save to keep changes.');
    };

    reader.onerror = () => {
      setNotice('Could not read this image.');
    };

    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const restore = item => {
    const restored = {
      ...EMPTY,
      ...item.profile,
      skills: item.profile?.skills || '',
      links: item.profile?.links || [],
      projects: item.profile?.projects || [],
      certificates: item.profile?.certificates || []
    };

    setForm(restored);
    setNotice('Previous snapshot loaded. Save to keep it.');
  };

  const socialLinks = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      url: form.linkedin,
      icon: <BriefcaseBusiness size={17} />,
      className: 'linkedin'
    },
    {
      key: 'github',
      label: 'GitHub',
      url: form.github,
      icon: <Code2 size={17} />,
      className: 'github'
    },
    {
      key: 'leetcode',
      label: 'LeetCode',
      url: form.leetcode,
      icon: <Code2 size={17} />,
      className: 'leetcode'
    },
    {
      key: 'portfolio',
      label: 'Portfolio',
      url: form.portfolioUrl,
      icon: <Globe size={17} />,
      className: 'portfolio'
    },
    ...form.links
      .filter(item => item.url)
      .map(item => ({
        key: item.id,
        label: item.name || 'Other link',
        url: item.url,
        icon: <ExternalLink size={17} />,
        className: 'other'
      }))
  ].filter(item => item.url);

  const hasContact = Boolean(
    form.email.trim() || form.phone.trim()
  );

  return (
    <div className="tf-profile-page">

      <header className="tf-profile-top">
        <button
          type="button"
          className="tfp-back"
          onClick={() => onBack?.()}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div>
          <span className="tfp-eyebrow">ACCOUNT / PROFILE</span>
          <h1>Your Profile</h1>
          <p>Manage your professional identity.</p>
        </div>

        <div className="tfp-actions">
          <button
            type="button"
            className="tfp-btn secondary"
            onClick={() => setPreview(true)}
          >
            <Eye size={16} /> Preview
          </button>

          <button
            type="button"
            className="tfp-btn secondary"
            onClick={exportData}
          >
            <Download size={16} /> Export
          </button>

          <button
            type="button"
            className="tfp-btn primary"
            onClick={save}
          >
            <Save size={16} /> Save Profile
          </button>
        </div>
      </header>

      {notice && (
        <div className="tfp-notice" role="status">
          {notice}
        </div>
      )}

      <div className="tfp-layout">

        <aside className="tfp-sidecard">

          <div className="tfp-avatar-wrap">
            {form.photo ? (
              <img src={form.photo} alt="Profile" />
            ) : (
              <div className="tfp-avatar-fallback">
                <UserRound size={34} />
              </div>
            )}

            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              aria-label="Upload profile photo"
            >
              <Camera size={15} />
            </button>

            <input
              ref={photoRef}
              hidden
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={uploadPhoto}
            />
          </div>

          {form.photo && (
            <button
              type="button"
              className="tfp-text-btn"
              onClick={() => set('photo', '')}
            >
              Remove photo
            </button>
          )}

          <h2>{form.fullName || 'Your Name'}</h2>

          <p className="tfp-profile-role">
            {form.role || 'Add your role'}
          </p>

          {form.bio.trim() ? (
            <div className="tfp-bio-block">
              <h3>About</h3>
              <p>{form.bio}</p>
            </div>
          ) : (
            <div className="tfp-bio-fallback">
              <Mail size={18} />

              <div>
                <strong>Contact Details</strong>
                <p>
                  Add a bio to introduce yourself, or view your contact details.
                </p>

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                >
                  View contact details
                </button>
              </div>
            </div>
          )}

          {form.skills.trim() && (
            <div className="tfp-bio-block">
              <h3>Skills</h3>
              <p>{form.skills}</p>
            </div>
          )}

          <div className="tfp-social-area">
            <h3>Connect with me</h3>

            {socialLinks.length ? (
              <div className="tfp-social-links">
                {socialLinks.map(item => (
                  <a
                    key={item.key}
                    className={`tfp-social-link ${item.className}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.label}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="tfp-muted">
                Your added social and website links will appear here.
              </p>
            )}
          </div>

          <div className="tfp-status-list">
            {form.email.trim() && (
              <div className="tfp-status">
                <span className={form.emailVerified ? 'ok' : ''} />
                {form.emailVerified
                  ? 'Email verified'
                  : 'Email not verified'}
              </div>
            )}

            <div className="tfp-status">
              <span className={form.phoneVerified ? 'ok' : ''} />
              {form.phoneVerified
                ? 'Phone verified'
                : 'Phone not verified'}
            </div>
          </div>

          <div className="tfp-side-actions">
            <button
              type="button"
              className="tfp-btn primary full"
              onClick={save}
            >
              Save changes
            </button>

            <button
              type="button"
              className="tfp-btn secondary full"
              onClick={cancel}
            >
              Cancel changes
            </button>
          </div>
        </aside>

        <main className="tfp-main">

          <section className="tfp-contact-card">
            <button
              type="button"
              className="tfp-contact-toggle"
              onClick={() => setContactOpen(open => !open)}
              aria-expanded={contactOpen}
            >
              <span className="tfp-contact-heading">
                <span className="tfp-contact-icon">
                  <Mail size={19} />
                </span>

                <span>
                  <strong>Contact Details</strong>
                  <small>
                    View your email address and phone number
                  </small>
                </span>
              </span>

              {contactOpen
                ? <ChevronUp size={20} />
                : <ChevronDown size={20} />}
            </button>

            {contactOpen && (
              <div className="tfp-contact-details">

                <div>
                  <Mail size={17} />

                  <span>
                    <small>Email address</small>
                    <strong>
                      {form.email.trim() || 'No email added'}
                    </strong>
                  </span>

                  {form.email.trim() && (
                    <span
                      className={`tfp-contact-verified ${
                        form.emailVerified ? 'verified' : ''
                      }`}
                    >
                      {form.emailVerified
                        ? 'Verified'
                        : 'Not verified'}
                    </span>
                  )}
                </div>

                <div>
                  <Phone size={17} />

                  <span>
                    <small>Phone number</small>
                    <strong>
                      {form.phone
                        ? `${form.countryCode} ${form.phone}`
                        : 'No phone number added'}
                    </strong>
                  </span>

                  <span
                    className={`tfp-contact-verified ${
                      form.phoneVerified ? 'verified' : ''
                    }`}
                  >
                    {form.phoneVerified
                      ? 'Verified'
                      : 'Not verified'}
                  </span>
                </div>

              </div>
            )}

            {!hasContact && (
              <p className="tfp-contact-empty">
                Add your contact information in Basic Information.
              </p>
            )}
          </section>

          <section className="tfp-card">
            <div className="tfp-section-head">
              <div>
                <h2>Basic Information</h2>
                <p>Your personal information.</p>
              </div>
              <UserRound />
            </div>

            <div className="tfp-grid">

              <label>
                Full Name *
                <input
                  value={form.fullName}
                  onChange={e => set('fullName', e.target.value)}
                  placeholder="Your full name"
                />
              </label>

              <label>
                Job Title / Role
                <input
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                  placeholder="Product Designer"
                />
              </label>

              <label>
                Email Address (Optional)
                <input
                  type="email"
                  value={form.email}
                  onChange={e => {
                    setForm(previous => ({
                      ...previous,
                      email: e.target.value,
                      emailVerified:
                        e.target.value.trim() === previous.email.trim()
                          ? previous.emailVerified
                          : false
                    }));
                  }}
                  placeholder="you@example.com"
                />

                {form.email.trim() ? (
                  <button
                    type="button"
                    className="tfp-inline"
                    onClick={() => verifyDemo('emailVerified')}
                  >
                    {form.emailVerified
                      ? 'Verified ✓'
                      : 'Verify email (demo)'}
                  </button>
                ) : (
                  <small className="tfp-field-hint">
                    You can leave this field blank.
                  </small>
                )}
              </label>

              <label>
                Phone Number *

                <div className="tfp-phone">
                  <select
                    value={form.countryCode}
                    onChange={e => set('countryCode', e.target.value)}
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+971">+971</option>
                  </select>

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => {
                      const phone = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 10);

                      setForm(previous => ({
                        ...previous,
                        phone,
                        phoneVerified:
                          phone === previous.phone
                            ? previous.phoneVerified
                            : false
                      }));
                    }}
                    placeholder="10 digit number"
                  />
                </div>

                <button
                  type="button"
                  className="tfp-inline"
                  onClick={() => verifyDemo('phoneVerified')}
                >
                  {form.phoneVerified
                    ? 'Verified ✓'
                    : 'Verify phone (demo)'}
                </button>
              </label>

              <label>
                Alternate Contact
                <input
                  value={form.alternateContact}
                  onChange={e =>
                    set('alternateContact', e.target.value)
                  }
                />
              </label>

              <label>
                Team
                <input
                  value={form.team}
                  onChange={e => set('team', e.target.value)}
                />
              </label>

              <label>
                Location
                <input
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                />
              </label>

              <label>
                Language
                <select
                  value={form.language}
                  onChange={e => set('language', e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </label>

              <label>
                Profile Visibility
                <select
                  value={form.visibility}
                  onChange={e => set('visibility', e.target.value)}
                >
                  <option>Team</option>
                  <option>Everyone</option>
                  <option>Private</option>
                </select>
              </label>

              <label className="wide">
                Bio
                <textarea
                  rows="3"
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Write a short introduction about yourself..."
                />
              </label>

            </div>
          </section>

          <section className="tfp-card">
            <div className="tfp-section-head">
              <div>
                <h2>Professional Links</h2>
                <p>Your professional profiles and websites.</p>
              </div>
              <ExternalLink />
            </div>

            <div className="tfp-grid">
              {[
                ['LinkedIn URL', 'linkedin'],
                ['GitHub URL', 'github'],
                ['LeetCode URL', 'leetcode'],
                ['Portfolio Link', 'portfolioUrl']
              ].map(([label, key]) => (
                <label key={key}>
                  {label}
                  <input
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    placeholder="https://..."
                  />
                </label>
              ))}
            </div>

            <div className="tfp-list-head">
              <h3>Other Links</h3>

              <button
                type="button"
                className="tfp-btn secondary small"
                onClick={() => addList('links')}
              >
                <Plus size={14} /> Add Link
              </button>
            </div>

            {form.links.map(item => (
              <div className="tfp-repeat" key={item.id}>
                <input
                  placeholder="Link name"
                  value={item.name}
                  onChange={e =>
                    updateList('links', item.id, {
                      name: e.target.value
                    })
                  }
                />

                <input
                  placeholder="https://..."
                  value={item.url}
                  onChange={e =>
                    updateList('links', item.id, {
                      url: e.target.value
                    })
                  }
                />

                <button
                  type="button"
                  className="tfp-icon-btn danger"
                  onClick={() => removeList('links', item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </section>

          <section className="tfp-card">
            <div className="tfp-section-head">
              <div>
                <h2>Skills</h2>
                <p>Add your technical and professional skills.</p>
              </div>
              <Code2 />
            </div>

            <label>
              Your Skills
              <textarea
                rows="3"
                value={form.skills}
                onChange={e => set('skills', e.target.value)}
                placeholder="React, JavaScript, Python, UI/UX Design..."
              />
              <small className="tfp-field-hint">
                Separate multiple skills with commas.
              </small>
            </label>
          </section>

          <section className="tfp-card">
            <div className="tfp-section-head">
              <div>
                <h2>Projects</h2>
                <p>Showcase your work.</p>
              </div>
              <BriefcaseBusiness />
            </div>

            <button
              type="button"
              className="tfp-btn secondary small"
              onClick={() => addList('projects')}
            >
              <Plus size={14} /> Add Project
            </button>

            {form.projects.map(item => (
              <div className="tfp-repeat-block" key={item.id}>
                <div className="tfp-repeat">
                  <input
                    placeholder="Project name"
                    value={item.name}
                    onChange={e =>
                      updateList('projects', item.id, {
                        name: e.target.value
                      })
                    }
                  />

                  <input
                    placeholder="Live demo URL"
                    value={item.url}
                    onChange={e =>
                      updateList('projects', item.id, {
                        url: e.target.value
                      })
                    }
                  />

                  <button
                    type="button"
                    className="tfp-icon-btn danger"
                    onClick={() => removeList('projects', item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <textarea
                  placeholder="Project description"
                  value={item.description}
                  onChange={e =>
                    updateList('projects', item.id, {
                      description: e.target.value
                    })
                  }
                />

                <input
                  placeholder="GitHub repository URL"
                  value={item.repoUrl}
                  onChange={e =>
                    updateList('projects', item.id, {
                      repoUrl: e.target.value
                    })
                  }
                />
              </div>
            ))}
          </section>

          <section className="tfp-card">
            <div className="tfp-section-head">
              <div>
                <h2>Certificates</h2>
                <p>Your achievements and credentials.</p>
              </div>
              <Award />
            </div>

            <button
              type="button"
              className="tfp-btn secondary small"
              onClick={() => addList('certificates')}
            >
              <Plus size={14} /> Add Certificate
            </button>

            {form.certificates.map(item => (
              <div className="tfp-repeat-block" key={item.id}>
                <div className="tfp-repeat">
                  <input
                    placeholder="Certificate name"
                    value={item.name}
                    onChange={e =>
                      updateList('certificates', item.id, {
                        name: e.target.value
                      })
                    }
                  />

                  <input
                    placeholder="Issuing organization"
                    value={item.organization}
                    onChange={e =>
                      updateList('certificates', item.id, {
                        organization: e.target.value
                      })
                    }
                  />

                  <button
                    type="button"
                    className="tfp-icon-btn danger"
                    onClick={() =>
                      removeList('certificates', item.id)
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="tfp-grid">
                  <label>
                    Issue Date
                    <input
                      type="date"
                      value={item.issueDate}
                      onChange={e =>
                        updateList('certificates', item.id, {
                          issueDate: e.target.value
                        })
                      }
                    />
                  </label>

                  <label>
                    Expiry Date
                    <input
                      type="date"
                      value={item.expiryDate}
                      onChange={e =>
                        updateList('certificates', item.id, {
                          expiryDate: e.target.value
                        })
                      }
                    />
                  </label>

                  <label>
                    Credential ID
                    <input
                      value={item.credentialId}
                      onChange={e =>
                        updateList('certificates', item.id, {
                          credentialId: e.target.value
                        })
                      }
                    />
                  </label>

                  <label>
                    Certificate URL
                    <input
                      value={item.url}
                      onChange={e =>
                        updateList('certificates', item.id, {
                          url: e.target.value
                        })
                      }
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </div>
            ))}
          </section>

          <section className="tfp-card">
            <h2>Profile History</h2>

            {history.length === 0 ? (
              <p className="tfp-muted">
                No saved history yet.
              </p>
            ) : (
              history.map(item => (
                <div className="tfp-history" key={item.id}>
                  <span>
                    {new Date(item.savedAt).toLocaleString()}
                  </span>

                  <button
                    type="button"
                    className="tfp-btn secondary small"
                    onClick={() => restore(item)}
                  >
                    Restore
                  </button>
                </div>
              ))
            )}
          </section>

        </main>
      </div>

      {preview && (
        <div
          className="tfp-modal-backdrop"
          onClick={() => setPreview(false)}
        >
          <div
            className="tfp-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="tfp-close"
              onClick={() => setPreview(false)}
            >
              <X />
            </button>

            <div className="tfp-preview-avatar">
              {form.photo ? (
                <img src={form.photo} alt="Profile preview" />
              ) : (
                <UserRound />
              )}
            </div>

            <h2>{form.fullName || 'Your Name'}</h2>

            <p>
              {form.role}
              {form.team && ` · ${form.team}`}
            </p>

            {form.bio && <p>{form.bio}</p>}

            {form.skills.trim() && (
              <p>
                <strong>Skills:</strong> {form.skills}
              </p>
            )}

            {form.email.trim() && <p>{form.email}</p>}

            {form.phone && (
              <p>{form.countryCode} {form.phone}</p>
            )}

            {socialLinks.map(item => (
              <a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
