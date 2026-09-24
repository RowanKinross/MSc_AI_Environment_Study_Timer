import { useState } from 'react'
import './todo.css'

function Todo() {
  const [items, setItems] = useState([
    { id: 1, text: 'Review lecture notes', done: false },
    { id: 2, text: 'Submit assignment draft', done: false }
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
    <section className="todo-section">
      <h2>To Do</h2>

      <form className="todo-form" onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Add a task"
          className="todo-input"
        />
        <button type="submit" className="todo-add-button">Add</button>
      </form>

      <ul className="todo-list">
        {items.map((item) => (
          <li key={item.id} className="todo-item">
            <label className="todo-label">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.done ? 'todo-done' : ''}>{item.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Todo