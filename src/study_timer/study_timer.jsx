import { useEffect, useState } from 'react'
import './study_timer.css'

const CLASSES = [
  { id: 'python', name: 'Programming with Python' },
  { id: 'data-science', name: 'Intro to Data Science and Statistics' },
  { id: 'learning-from-data', name: 'Learning from Data' },
  { id: 'ai-environment', name: 'AI in Environment' }
]

const TOTALS_KEY = 'studyTimer.weeklyTotals'
const RUNNING_KEY = 'studyTimer.running'

function getWeekKey(weekStart) {
  return weekStart.toISOString().slice(0, 10)
}

function loadTotals() {
  try {
    return JSON.parse(localStorage.getItem(TOTALS_KEY)) ?? {}
  } catch {
    return {}
  }
}

function loadRunning() {
  try {
    return JSON.parse(localStorage.getItem(RUNNING_KEY)) ?? {}
  } catch {
    return {}
  }
}

function formatDuration(totalSeconds) {
  const seconds = Math.floor(totalSeconds)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [hours, minutes, secs].map((value) => String(value).padStart(2, '0')).join(':')
}

function StudyTimer({ weekStart }) {
  const weekKey = getWeekKey(weekStart)

  const [totals, setTotals] = useState(loadTotals)
  const [running, setRunning] = useState(loadRunning)
  const [now, setNow] = useState(() => Date.now())

  // tick every second while any class is running, to keep the display live
  useEffect(() => {
    if (Object.keys(running).length === 0) return undefined

    const intervalId = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(intervalId)
  }, [running])

  const handleStart = (classId) => {
    setRunning((current) => {
      const next = { ...current, [classId]: { weekKey, startedAt: Date.now() } }
      localStorage.setItem(RUNNING_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleStop = (classId) => {
    setRunning((currentRunning) => {
      const session = currentRunning[classId]
      if (!session) return currentRunning

      const elapsedSeconds = (Date.now() - session.startedAt) / 1000

      setTotals((currentTotals) => {
        const weekTotals = currentTotals[session.weekKey] ?? {}
        const nextTotals = {
          ...currentTotals,
          [session.weekKey]: {
            ...weekTotals,
            [classId]: (weekTotals[classId] ?? 0) + elapsedSeconds
          }
        }
        localStorage.setItem(TOTALS_KEY, JSON.stringify(nextTotals))
        return nextTotals
      })

      const nextRunning = { ...currentRunning }
      delete nextRunning[classId]
      localStorage.setItem(RUNNING_KEY, JSON.stringify(nextRunning))
      return nextRunning
    })
  }

  const getDisplaySeconds = (classId) => {
    const storedSeconds = totals[weekKey]?.[classId] ?? 0
    const session = running[classId]
    if (!session || session.weekKey !== weekKey) return storedSeconds

    return storedSeconds + (now - session.startedAt) / 1000
  }

  return (
    <section className="study-timer-section">
      <h2>Study Timer</h2>

      <ul className="study-timer-list">
        {CLASSES.map((studyClass) => {
          const isRunning = Boolean(running[studyClass.id])

          return (
            <li key={studyClass.id} className="study-timer-item">
              <div className="study-timer-info">
                <span className="study-timer-name">{studyClass.name}</span>
                <span className="study-timer-duration">
                  {formatDuration(getDisplaySeconds(studyClass.id))}
                </span>
              </div>

              <button
                type="button"
                className={isRunning ? 'study-timer-stop-button' : 'study-timer-start-button'}
                onClick={() => (isRunning ? handleStop(studyClass.id) : handleStart(studyClass.id))}
              >
                {isRunning ? 'Stop' : 'Start'}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default StudyTimer