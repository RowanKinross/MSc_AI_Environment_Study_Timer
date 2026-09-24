import './career.css'
import { useState } from 'react'

function Career() {
  const [careerDone, setCareerDone] = useState('')

  return (
    <section>
      <h2>
        Career
        {careerDone.trim() && <span className="career-done-tick" aria-label="Career completed">✓</span>}
      </h2>
      <form>
         <textarea
           name="careerDone"
           className="goal-input"
           rows="5"
           placeholder="Did this week"
           value={careerDone}
           onChange={(event) => setCareerDone(event.target.value)}
         />
         <textarea name="careerGoal" className="goal-input" rows="5" placeholder="Want to do next" />
      </form>
      <button type="submit">Save</button>
    </section>
  )
}

export default Career