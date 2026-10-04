import { useEffect, useState } from 'react'
import { getDoc, setDoc } from 'firebase/firestore'
import './todo.css'
import { backupDocument } from '../firebase.js'

const TODO_KEY = 'todo.weeklyItems'

const DEFAULT_ITEMS = [
]

function getWeekKey(weekStart) {
  return weekStart.toISOString().slice(0, 10)
}

function loadLegacyWeeklyItems() {
  try {
    return JSON.parse(localStorage.getItem(TODO_KEY)) ?? {}
  } catch {
    return {}
  }
}

function Todo({ weekStart }) {
  const weekKey = getWeekKey(weekStart)

  const [weeklyItems, setWeeklyItems] = useState({})
  const [newItem, setNewItem] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showAllItems, setShowAllItems] = useState(false)

  const items = weeklyItems[weekKey] ?? DEFAULT_ITEMS
  const orderedItems = [...items].sort((first, second) => Number(first.done) - Number(second.done))
  const visibleItems = showAllItems ? orderedItems : orderedItems.filter((item) => !item.done)

  useEffect(() => {
    let isCurrent = true

    getDoc(backupDocument).then((snapshot) => {
      if (!isCurrent) return

      const cloudItems = snapshot.data()?.weeklyTodos
      if (cloudItems) {
        setWeeklyItems(cloudItems)
        localStorage.removeItem(TODO_KEY)
        return
      }

      const legacyItems = loadLegacyWeeklyItems()
      setWeeklyItems(legacyItems)
      if (Object.keys(legacyItems).length > 0) {
        setDoc(backupDocument, { weeklyTodos: legacyItems }, { merge: true }).then(() => {
          localStorage.removeItem(TODO_KEY)
        }).catch((error) => {
          console.error('Unable to migrate to do items:', error)
        })
      }
    }).catch((error) => {
      console.error('Unable to load to do items:', error)
    }).finally(() => {
      if (isCurrent) setIsLoading(false)
    })

    return () => {
      isCurrent = false
    }
  }, [])

  const persistItems = (updater) => {
    setWeeklyItems((currentWeeklyItems) => {
      const currentItems = currentWeeklyItems[weekKey] ?? DEFAULT_ITEMS
      const nextItems = updater(currentItems)
      const nextWeeklyItems = { ...currentWeeklyItems, [weekKey]: nextItems }
      setDoc(backupDocument, { weeklyTodos: nextWeeklyItems }, { merge: true }).catch((error) => {
        console.error('Unable to save to do items:', error)
      })
      return nextWeeklyItems
    })
  }

  const handleAddItem = (event) => {
    event.preventDefault()

    const trimmed = newItem.trim()
    if (!trimmed) return

    persistItems((currentItems) => [
      { id: Date.now(), text: trimmed, done: false },
      ...currentItems
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
      <div className="todo-heading">
        <h2>To Do</h2>
      </div>

      <form className="todo-form" onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Add a task"
          className="todo-input"
          disabled={isLoading}
        />
        <button type="submit" className="todo-add-button" disabled={isLoading}>Add</button>
      </form>

      <ul className="todo-list">
        {visibleItems.map((item) => (
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
        <div
          className="todo-visibility-button"
          aria-label={showAllItems ? 'Show incomplete items only' : 'Show all items'}
          title={showAllItems ? 'Show incomplete items only' : 'Show all items'}
          onClick={() => setShowAllItems((current) => !current)}
        >
          {showAllItems ? '^' : '⌄'}
        </div>
      </ul>
    </section>
  )
}

export default Todo