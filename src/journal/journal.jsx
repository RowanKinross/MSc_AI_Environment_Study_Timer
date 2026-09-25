import { useEffect, useState } from 'react'
import { getDoc, setDoc } from 'firebase/firestore'
import './journal.css'
import { backupDocument } from '../firebase.js'

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatEntryDate(dateKey) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${dateKey}T00:00:00`))
}

function Journal() {
  const [todayKey, setTodayKey] = useState(() => getDateKey(new Date()))
  const [entries, setEntries] = useState({})
  const [entryText, setEntryText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const updateToday = () => setTodayKey(getDateKey(new Date()))
    const now = new Date()
    const nextDay = new Date(now)
    nextDay.setHours(24, 0, 0, 0)
    const timeoutId = setTimeout(updateToday, nextDay - now)

    return () => clearTimeout(timeoutId)
  }, [todayKey])

  useEffect(() => {
    let isCurrent = true

    getDoc(backupDocument).then((snapshot) => {
      if (!isCurrent) return
      const savedEntries = snapshot.data()?.journalEntries ?? {}
      setEntries(savedEntries)
      setEntryText(savedEntries[todayKey]?.text ?? '')
    }).catch((loadError) => {
      console.error('Unable to load journal entries:', loadError)
      setError('Unable to load your journal entries.')
    }).finally(() => {
      if (isCurrent) setIsLoading(false)
    })

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    if (!isLoading) setEntryText(entries[todayKey]?.text ?? '')
  }, [todayKey])

  const handleSave = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    const nextEntries = {
      ...entries,
      [todayKey]: { text: entryText, date: todayKey }
    }

    try {
      await setDoc(backupDocument, { journalEntries: nextEntries }, { merge: true })
      setEntries(nextEntries)
    } catch (saveError) {
      console.error('Unable to save journal entry:', saveError)
      setError('Unable to save your journal entry.')
    } finally {
      setIsSaving(false)
    }
  }

  const previousEntries = Object.entries(entries)
    .filter(([dateKey]) => dateKey !== todayKey)
    .sort(([firstDate], [secondDate]) => secondDate.localeCompare(firstDate))

  return (
    <section className="journal-section">
      <h2>Journal</h2>
      <p className="journal-date">{formatEntryDate(todayKey)}</p>
      <form className="journal-form" onSubmit={handleSave}>
        <textarea
          name="journalEntry"
          className="journal-input"
          value={entryText}
          onChange={(event) => setEntryText(event.target.value)}
          placeholder="Today I have been thinking about..."
          rows="5"
          disabled={isLoading || isSaving}
        />
        <button type="submit" className="journal-save-button" disabled={isLoading || isSaving}>
          {isSaving ? 'Saving...' : 'Save entry'}
        </button>
      </form>
      {error && <p className="journal-error" role="alert">{error}</p>}

      {previousEntries.length > 0 && (
        <div className="journal-history">
          <h3>Earlier entries</h3>
          {previousEntries.map(([dateKey, entry]) => (
            <article key={dateKey} className="journal-entry">
              <h4>{formatEntryDate(dateKey)}</h4>
              <p>{entry.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Journal