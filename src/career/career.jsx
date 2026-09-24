import './career.css'

function Career() {
  return (
    <section>
      <h2>Career</h2>
      <p className="career-question"> What was something career-related that you worked on this week?</p>
      <form>
         <textarea name="careerGoal" className="career-input" rows="5" />
      </form>
      <button type="submit">Save</button>
    </section>
  )
}

export default Career