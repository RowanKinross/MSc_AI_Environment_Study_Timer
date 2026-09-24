import './style.css'
import { useState } from 'react'
import Career from './career/career.jsx'
import Health from './health/health.jsx'
import PaperRead from './paper_read/paper_read.jsx'
import Relax from './relax/relax.jsx'
import StudyTimer from './study_timer/study_timer.jsx'
import Todo from './todo/todo.jsx'
import { formatWeekLabel, getStartOfWeek, shiftWeek } from './week.js'

function App() {
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()))

  const handleWeekChange = (direction) => {
    setWeekStart((currentWeek) => shiftWeek(currentWeek, direction))
  }

  return (
    <main className="shell">
      <header>
        <h1>
          MSc AI for Environment Study Organiser
        </h1>
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
          <Career />
          <Health />
          <PaperRead />
          <Relax />
          <StudyTimer />
          <Todo />
        </div>
      </div>
    </main>
  )
}

export default App