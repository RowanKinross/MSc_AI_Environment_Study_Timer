function PaperRead() {
  return (
    <section>
      <h2>Paper(s) Read</h2>
      <form>
         <input type="text" name="link" className="goal-input" placeholder="Link to the paper" />
         <input type="text" name="title" className="goal-input" placeholder="Title & Author" />
         <textarea name="notes" className="goal-input" rows="5" placeholder="Notes"/>
      </form>
      <button type="submit">Save</button>
    </section>
  )
}

export default PaperRead 