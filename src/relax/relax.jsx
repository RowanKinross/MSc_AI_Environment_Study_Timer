import { useState } from 'react'
import './relax.css'

function Relax() {
  const [items, setItems] = useState([
    { id: 1, text: 'Go for a run 1', done: false },
    { id: 2, text: 'Go for a run 2', done: false }
  ])
  const [newItem, setNewItem] = useState('')

  const handleAddItem = (event) => {
    event.preventDefault()

    const trimmed = newItem.trim()
    if (!trimmed) return

    setItems((currentItems) => [
      ...currentItems,
      { id: Date.now(), text: trimmed, done: false }
    ])
    setNewItem('')
  }

  const toggleItem = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    )
  }

  return (
    <section className="relax-section">
      <h2>Relax/Health</h2>

      <form className="relax-form" onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Add a task"
          className="relax-input"
        />
        <button type="submit" className="relax-add-button">Add</button>
      </form>

      <ul className="relax-list">
        {items.map((item) => (
          <li key={item.id} className="relax-item">
            <label className="relax-label">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.done ? 'relax-done' : ''}>{item.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Relax