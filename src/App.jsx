import './style.css'
import { useEffect, useState } from 'react'
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import Career from './career/career.jsx'
import PaperRead from './paper_read/paper_read.jsx'
import Relax from './relax/relax.jsx'
import StudyTimer from './study_timer/study_timer.jsx'
import Todo from './todo/todo.jsx'
import Journal from './journal/journal.jsx'

import { formatWeekLabel, getStartOfWeek, shiftWeek } from './week.js'
import { auth } from './firebase.js'

const AUTH_EMAIL = import.meta.env.VITE_AUTH_EMAIL ?? 'email@auth.co.uk'

function App() {
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()))
  const [user, setUser] = useState(null)
  const [authStatus, setAuthStatus] = useState('loading')
  const [code, setCode] = useState('')
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let unsubscribe = () => {}

    setPersistence(auth, browserLocalPersistence).then(() => {
      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser)
        setAuthStatus('ready')
      })
    }).catch((error) => {
      console.error('Unable to initialise authentication:', error)
      setAuthError('Unable to start authentication. Please refresh and try again.')
      setAuthStatus('ready')
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = async (event) => {
    event.preventDefault()
    setAuthError('')
    setAuthStatus('signing-in')

    try {
      await signInWithEmailAndPassword(auth, AUTH_EMAIL, code)
      setCode('')
    } catch (error) {
      console.error('Unable to sign in:', error)
      setAuthError('That code was not accepted.')
      setAuthStatus('ready')
    }
  }

  const handleWeekChange = (direction) => {
    setWeekStart((currentWeek) => shiftWeek(currentWeek, direction))
  }

  if (authStatus === 'loading') {
    return <main className="auth-page">Checking your session...</main>
  }

  if (!user) {
    return (
      <main className="auth-page">
        <form className="auth-form" onSubmit={handleSignIn}>
          <h1>Study Organiser</h1>
          <label htmlFor="access-code">Access code</label>
          <input
            id="access-code"
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="current-password"
            pattern="[0-9]{6}"
            maxLength="6"
            required
            autoFocus
          />
          {authError && <p className="auth-error" role="alert">{authError}</p>}
          <button type="submit" disabled={authStatus === 'signing-in' || code.length !== 6}>
            {authStatus === 'signing-in' ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="shell">
      <header>
        <h1>
          MSc AI for Environment Study Organiser
        </h1>
        <button type="button" className="sign-out-button" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </header>
      <div>
        <div className="week-nav">
          <button
            type="button"
            className="week-button"
            onClick={() => handleWeekChange(-1)}
            aria-label="View previous week"
          >
            ← Previous week
          </button>

          <h3>Week commencing: {formatWeekLabel(weekStart)}</h3>

          <button
            type="button"
            className="week-button"
            onClick={() => handleWeekChange(1)}
            aria-label="View next week"
          >
            Next week →
          </button>
        </div>

        <div className="sections">
          {/* <Career />
          <PaperRead />
          <Relax /> */}
          <StudyTimer weekStart={weekStart} />
          <Todo weekStart={weekStart} />
          <Journal />
        </div>
      </div>
    </main>
  )
}

export default App