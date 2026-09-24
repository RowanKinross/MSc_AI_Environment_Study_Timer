import { createRoot } from 'react-dom/client'
import './style.css'

export default function StudyTimer() {

  return (
    <main className="shell">
      <header>
        <h1>
          MSc AI for Environment Study Organiser
        </h1>
      </header>
      <body>
        
      </body>
    </main>
  )
}

createRoot(document.querySelector('#app')).render(<StudyTimer />)