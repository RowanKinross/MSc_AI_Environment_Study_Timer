import { useState } from 'react'
import './todo.css'

const TODO_KEY = 'todo.weeklyItems'

const DEFAULT_ITEMS = [
]

function getWeekKey(weekStart) {
  return weekStart.toISOString().slice(0, 10)
}

function loadWeeklyItems() {
  try {
    return JSON.parse(localStorage.getItem(TODO_KEY)) ?? {}
  } catch {
    return {}
  }
}

function Todo({ weekStart }) {
  const weekKey = getWeekKey(weekStart)

  const [weeklyItems, setWeeklyItems] = useState(loadWeeklyItems)
  const [newItem, setNewItem] = useState('')

  const items = weeklyItems[weekKey] ?? DEFAULT_ITEMS

  const persistItems = (updater) => {
    setWeeklyItems((currentWeeklyItems) => {
      const currentItems = currentWeeklyItems[weekKey] ?? DEFAULT_ITEMS
      const nextItems = updater(currentItems)
      const nextWeeklyItems = { ...currentWeeklyItems, [weekKey]: nextItems }
      localStorage.setItem(TODO_KEY, JSON.stringify(nextWeeklyItems))
      return nextWeeklyItems
    })
  }

  const handleAddItem = (event) => {
    event.preventDefault()

    const trimmed = newItem.trim()
    if (!trimmed) return

    persistItems((currentItems) => [
      ...currentItems,
      { id: Date.now(), text: trimmed, done: false }
    ])
    setNewItem('')
  }

  const toggleItem = (id) => {
    persistItems((currentItems) =>
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