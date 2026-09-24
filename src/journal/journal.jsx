import './journal.css'

function Journal() {
  return (
    <section>
      <h2>Journal</h2>
      <form>
         <textarea name="journalGoal" className="goal-input" rows="5" />
      </form>
      <button type="submit">Save</button>
    </section>
  )
}

export default Journal