
import { useEffect, useMemo, useState } from 'react'
import {
  Bell, CheckCheck, Trash2, Search, Clock, Filter,
  Check, MessageSquare, Briefcase, CalendarDays,
  ClipboardList, AlertCircle, Users, Star, Settings
} from 'lucide-react'

const initialNotifications = [
  { id: 1, title: 'Task assigned to you', message: 'You have been assigned a new project task.', category: 'Tasks', time: '10 minutes ago', read: false },
  { id: 2, title: 'New project comment', message: 'A teammate commented on your project.', category: 'Comments', time: '30 minutes ago', read: false },
  { id: 3, title: 'Upcoming meeting', message: 'Your team meeting is scheduled for tomorrow.', category: 'Meetings', time: '2 hours ago', read: true },
  { id: 4, title: 'Deadline approaching', message: 'A project deadline is approaching soon.', category: 'Deadlines', time: 'Yesterday', read: false },
  { id: 5, title: 'You were mentioned', message: 'You were mentioned in a team discussion.', category: 'Mentions', time: 'Yesterday', read: true },
  { id: 6, title: 'Project update', message: 'A project you follow has been updated.', category: 'Projects', time: '2 days ago', read: true },
  { id: 7, title: 'Review requested', message: 'A teammate requested your review.', category: 'Reviews', time: '2 days ago', read: false },
  { id: 8, title: 'New assignment', message: 'A new assignment is waiting for you.', category: 'Assignments', time: '3 days ago', read: true },
]

const categories = [
  'All categories', 'Tasks', 'Mentions', 'Projects', 'Meetings',
  'Deadlines', 'Reviews', 'Comments', 'Assignments'
]

const categoryIcons = {
  Tasks: ClipboardList,
  Mentions: MessageSquare,
  Projects: Briefcase,
  Meetings: CalendarDays,
  Deadlines: AlertCircle,
  Reviews: Star,
  Comments: MessageSquare,
  Assignments: Users,
}

function loadNotifications() {
  try {
    const saved = localStorage.getItem('teamflow-notifications')
    return saved ? JSON.parse(saved) : initialNotifications
  } catch {
    return initialNotifications
  }
}

const defaultPreferences = {
  inApp: true,
  email: false,
  push: false,
  desktop: false,
  quietHours: false,
  quietStart: '22:00',
  quietEnd: '08:00',
  dailyDigest: false,
  priorityOnly: false,
}

function loadPreferences() {
  try {
    const saved = localStorage.getItem('teamflow-notification-preferences')
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences
  } catch {
    return defaultPreferences
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(loadNotifications)
  const [preferences, setPreferences] = useState(loadPreferences)
  const [activeTab, setActiveTab] = useState('All')
  const [category, setCategory] = useState('All categories')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('teamflow-notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('teamflow-notification-preferences', JSON.stringify(preferences))
  }, [preferences])

  const unreadCount = notifications.filter(item => !item.read).length

  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      const matchesTab =
        activeTab === 'All' ||
        (activeTab === 'Unread' && !item.read) ||
        (activeTab === 'Read' && item.read)

      const matchesCategory =
        category === 'All categories' || item.category === category

      const matchesSearch =
        `${item.title} ${item.message} ${item.category}`
          .toLowerCase()
          .includes(search.toLowerCase())

      return matchesTab && matchesCategory && matchesSearch
    })
  }, [notifications, activeTab, category, search])

  const updateNotification = (id, changes) => {
    setNotifications(prev =>
      prev.map(item => item.id === id ? { ...item, ...changes } : item)
    )
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })))
    setMessage('All notifications marked as read.')
  }

  const deleteNotification = id => {
    setNotifications(prev => prev.filter(item => item.id !== id))
    setMessage('Notification deleted.')
  }

  const deleteRead = () => {
    setNotifications(prev => prev.filter(item => !item.read))
    setMessage('Read notifications deleted.')
  }

  const snoozeNotification = id => {
    const item = notifications.find(notification => notification.id === id)
    if (!item) return

    setNotifications(prev => prev.filter(notification => notification.id !== id))
    setMessage(`"${item.title}" snoozed for later. Note: timed reminders require backend scheduling.`)
  }

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    setMessage('')
  }

  const requestDesktopPermission = async () => {
    if (!('Notification' in window)) {
      setMessage('Browser notifications are not supported.')
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      updatePreference('desktop', true)
      setMessage('Browser notification permission granted.')
    } else {
      updatePreference('desktop', false)
      setMessage('Browser notification permission was not granted.')
    }
  }

  const savePreferences = () => {
    localStorage.setItem('teamflow-notification-preferences', JSON.stringify(preferences))
    setMessage('Notification preferences saved.')
  }

  const PreferenceToggle = ({ label, description, value, onChange }) => (
    <div className="tf-notif-toggle-row">
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        className={`tf-notif-switch ${value ? 'active' : ''}`}
        onClick={() => onChange(!value)}
      >
        <span />
      </button>
    </div>
  )

  return (
    <main className="tf-notifications">
      <header className="tf-notif-header">
        <div>
          <div className="tf-notif-title-row">
            <h1>Notifications</h1>
            <span className="tf-notif-count">{unreadCount} unread</span>
          </div>
          <p>Stay updated with your tasks, projects and team activity.</p>
        </div>
        <div className="tf-notif-header-icon"><Bell size={23} /></div>
      </header>

      {message && <div className="tf-notif-message">{message}</div>}

      <section className="tf-notif-stats">
        <div className="tf-notif-stat-card">
          <span>Total notifications</span>
          <strong>{notifications.length}</strong>
        </div>
        <div className="tf-notif-stat-card">
          <span>Unread</span>
          <strong>{unreadCount}</strong>
        </div>
        <div className="tf-notif-stat-card">
          <span>Read</span>
          <strong>{notifications.length - unreadCount}</strong>
        </div>
      </section>

      <section className="tf-notif-card">
        <div className="tf-notif-toolbar">
          <div className="tf-notif-tabs">
            {['All', 'Unread', 'Read'].map(tab => (
              <button
                type="button"
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab === 'Unread' && <span>{unreadCount}</span>}
              </button>
            ))}
          </div>

          <div className="tf-notif-toolbar-actions">
            <button type="button" onClick={markAllRead}>
              <CheckCheck size={15} /> Mark all read
            </button>
            <button type="button" onClick={deleteRead}>
              <Trash2 size={15} /> Delete read
            </button>
          </div>
        </div>

        <div className="tf-notif-filters">
          <label className="tf-notif-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search notifications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>

          <label className="tf-notif-category">
            <Filter size={16} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(item => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="tf-notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="tf-notif-empty">
              <Bell size={30} />
              <strong>No notifications found</strong>
              <p>Try changing your search or filters.</p>
            </div>
          ) : (
            filteredNotifications.map(item => {
              const Icon = categoryIcons[item.category] || Bell

              return (
                <article className={`tf-notif-item ${!item.read ? 'unread' : ''}`} key={item.id}>
                  <div className="tf-notif-item-icon"><Icon size={19} /></div>

                  <div className="tf-notif-item-content">
                    <div className="tf-notif-item-heading">
                      <strong>{item.title}</strong>
                      {!item.read && <span className="tf-notif-unread-dot" />}
                    </div>
                    <p>{item.message}</p>
                    <div className="tf-notif-item-meta">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span><Clock size={12} /> {item.time}</span>
                    </div>
                  </div>

                  <div className="tf-notif-item-actions">
                    <button
                      type="button"
                      title={item.read ? 'Mark unread' : 'Mark read'}
                      aria-label={item.read ? 'Mark unread' : 'Mark read'}
                      onClick={() => updateNotification(item.id, { read: !item.read })}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      title="Snooze"
                      aria-label="Snooze notification"
                      onClick={() => snoozeNotification(item.id)}
                    >
                      <Clock size={16} />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      aria-label="Delete notification"
                      onClick={() => deleteNotification(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      <section className="tf-notif-card tf-notif-preferences">
        <div className="tf-notif-section-heading">
          <div>
            <h2><Settings size={19} /> Notification Preferences</h2>
            <p>Choose how and when you want to receive updates.</p>
          </div>
        </div>

        <h3>Delivery channels</h3>
        <PreferenceToggle label="In-app notifications" description="Show notifications inside TeamFlow." value={preferences.inApp} onChange={v => updatePreference('inApp', v)} />
        <PreferenceToggle label="Email notifications" description="Email delivery requires a connected email service." value={preferences.email} onChange={v => updatePreference('email', v)} />
        <PreferenceToggle label="Push notifications" description="Push delivery requires a configured service worker and backend." value={preferences.push} onChange={v => updatePreference('push', v)} />
        <PreferenceToggle label="Desktop notifications" description="Use browser notification permission on this device." value={preferences.desktop} onChange={requestDesktopPermission} />

        <div className="tf-notif-divider" />

        <h3>Notification schedule</h3>
        <PreferenceToggle label="Quiet hours" description="Set a time window when notifications should be paused." value={preferences.quietHours} onChange={v => updatePreference('quietHours', v)} />

        {preferences.quietHours && (
          <div className="tf-notif-time-fields">
            <label>Start time<input type="time" value={preferences.quietStart} onChange={e => updatePreference('quietStart', e.target.value)} /></label>
            <label>End time<input type="time" value={preferences.quietEnd} onChange={e => updatePreference('quietEnd', e.target.value)} /></label>
          </div>
        )}

        <PreferenceToggle label="Daily digest" description="Receive a daily summary of activity (backend delivery required)." value={preferences.dailyDigest} onChange={v => updatePreference('dailyDigest', v)} />
        <PreferenceToggle label="High-priority only" description="Preference for important notifications." value={preferences.priorityOnly} onChange={v => updatePreference('priorityOnly', v)} />

        <div className="tf-notif-save-row">
          <button type="button" className="tf-notif-save-btn" onClick={savePreferences}>
            <CheckCheck size={16} /> Save preferences
          </button>
        </div>
      </section>
    </main>
  )
}
