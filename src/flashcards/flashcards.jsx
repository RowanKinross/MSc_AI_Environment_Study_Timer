import { useEffect, useState } from 'react'
import { getDoc, setDoc } from 'firebase/firestore'
import './flashcards.css'
import { backupDocument } from '../firebase.js'
import { AI_ENVIRONMENT_CARDS } from './ai_environment_cards.js'

const DECKS = [
  { id: 'python', name: 'Programming with Python' },
  { id: 'data-science', name: 'Intro to Data Science and Statistics' },
  { id: 'learning-from-data', name: 'Learning from Data' },
  { id: 'ai-environment', name: 'AI in Environment' }
]

const CONFIDENCE = [
  { id: 'confident', label: 'Super confident' },
  { id: 'unsure', label: 'Not confident' },
  { id: 'clueless', label: 'Clueless' }
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unrated', label: 'Unrated' },
  ...CONFIDENCE
]

function Flashcards() {
  const [cards, setCards] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [deckId, setDeckId] = useState(DECKS[0].id)
  const [filter, setFilter] = useState('all')
  const [mode, setMode] = useState('study')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editFront, setEditFront] = useState('')
  const [editBack, setEditBack] = useState('')
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const deckCards = cards[deckId] ?? []
  const filtered = deckCards.filter((card) => {
    if (filter === 'all') return true
    if (filter === 'unrated') return !card.confidence
    return card.confidence === filter
  })
  const safeIndex = Math.min(index, Math.max(filtered.length - 1, 0))
  const current = filtered[safeIndex]

  useEffect(() => {
    let isCurrent = true

    getDoc(backupDocument).then((snapshot) => {
      if (isCurrent) setCards(snapshot.data()?.flashcards ?? {})
    }).catch((error) => {
      console.error('Unable to load flashcards:', error)
    }).finally(() => {
      if (isCurrent) setIsLoading(false)
    })

    return () => {
      isCurrent = false
    }
  }, [])

  const persistDeck = (updater) => {
    setCards((currentCards) => {
      const nextCards = { ...currentCards, [deckId]: updater(currentCards[deckId] ?? []) }
      setDoc(backupDocument, { flashcards: nextCards }, { merge: true }).catch((error) => {
        console.error('Unable to save flashcards:', error)
      })
      return nextCards
    })
  }

  const selectDeck = (id) => {
    setDeckId(id)
    setIndex(0)
    setShowBack(false)
  }

  const selectFilter = (id) => {
    setFilter(id)
    setIndex(0)
    setShowBack(false)
  }

  const handleAdd = (event) => {
    event.preventDefault()
    const question = front.trim()
    const answer = back.trim()
    if (!question || !answer) return

    persistDeck((deck) => [...deck, { id: Date.now(), front: question, back: answer, confidence: null }])
    setFront('')
    setBack('')
  }

  const rate = (confidence) => {
    persistDeck((deck) => deck.map((card) => (card.id === current.id ? { ...card, confidence } : card)))
    setShowBack(false)
    // A rated card may leave the active filter, which shifts the next card into place
    if (filter === 'all' || filter === confidence) setIndex(safeIndex + 1 >= filtered.length ? 0 : safeIndex + 1)
  }

  const move = (step) => {
    setShowBack(false)
    setIndex((safeIndex + step + filtered.length) % filtered.length)
  }

  const missingStarterCards = deckId === 'ai-environment'
    ? AI_ENVIRONMENT_CARDS.filter((starter) => !deckCards.some((card) => card.front === starter.front))
    : []

  const handleImportStarter = () => {
    persistDeck((deck) => {
      const existing = new Set(deck.map((card) => card.front))
      const baseId = Date.now()
      const added = AI_ENVIRONMENT_CARDS
        .filter((starter) => !existing.has(starter.front))
        .map((starter, offset) => ({ ...starter, id: baseId + offset, confidence: null }))
      return [...deck, ...added]
    })
  }

  const startEdit = (card) => {
    setEditingId(card.id)
    setEditFront(card.front)
    setEditBack(card.back)
  }

  const saveEdit = (event) => {
    event.preventDefault()
    const question = editFront.trim()
    const answer = editBack.trim()
    if (!question || !answer) return
    persistDeck((deck) => deck.map((card) => (
      card.id === editingId ? { ...card, front: question, back: answer } : card
    )))
    setEditingId(null)
  }

  const handleDelete = (id) => {
    persistDeck((deck) => deck.filter((card) => card.id !== id))
    setShowBack(false)
  }

  return (
    <section className="flashcards-section">
      <h2>Flashcards</h2>

      <div className="flashcards-tabs" role="tablist">
        {DECKS.map((deck) => (
          <button
            key={deck.id}
            type="button"
            role="tab"
            aria-selected={deck.id === deckId}
            className={`flashcards-tab ${deck.id === deckId ? 'active' : ''}`}
            onClick={() => selectDeck(deck.id)}
          >
            {deck.name} ({(cards[deck.id] ?? []).length})
          </button>
        ))}
      </div>

      <div className="flashcards-tabs">
        <button
          type="button"
          className={`flashcards-tab ${mode === 'study' ? 'active' : ''}`}
          onClick={() => setMode('study')}
        >
          Study
        </button>
        <button
          type="button"
          className={`flashcards-tab ${mode === 'manage' ? 'active' : ''}`}
          onClick={() => setMode('manage')}
        >
          Add / manage
        </button>
      </div>

      {mode === 'manage' ? (
        <>
          <form className="flashcards-form" onSubmit={handleAdd}>
            <input
              type="text"
              className="flashcards-input"
              value={front}
              onChange={(event) => setFront(event.target.value)}
              placeholder="Question"
              disabled={isLoading}
            />
            <input
              type="text"
              className="flashcards-input"
              value={back}
              onChange={(event) => setBack(event.target.value)}
              placeholder="Answer"
              disabled={isLoading}
            />
            <button type="submit" className="flashcards-button" disabled={isLoading}>Add card</button>
          </form>
          <ul className="flashcards-list">
            {deckCards.map((card) => (
              <li key={card.id} className="flashcards-list-item">
                {editingId === card.id ? (
                  <form className="flashcards-form" onSubmit={saveEdit}>
                    <input
                      type="text"
                      className="flashcards-input"
                      value={editFront}
                      onChange={(event) => setEditFront(event.target.value)}
                      aria-label="Edit question"
                    />
                    <input
                      type="text"
                      className="flashcards-input"
                      value={editBack}
                      onChange={(event) => setEditBack(event.target.value)}
                      aria-label="Edit answer"
                    />
                    <button type="submit" className="flashcards-button">Save</button>
                    <button type="button" className="flashcards-button" onClick={() => setEditingId(null)}>Cancel</button>
                  </form>
                ) : (
                <>
                <span>
                  {card.front} — {card.back}
                  {card.confidence && (
                    <em className={`flashcards-badge ${card.confidence}`}>
                      {CONFIDENCE.find((level) => level.id === card.confidence)?.label}
                    </em>
                  )}
                </span>
                <button
                  type="button"
                  className="flashcards-button"
                  onClick={() => startEdit(card)}
                  aria-label={`Edit card ${card.front}`}
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="flashcards-button"
                  onClick={() => handleDelete(card.id)}
                  aria-label={`Delete card ${card.front}`}
                >
                  ✕
                </button>
                </>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="flashcards-tabs">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`flashcards-tab ${option.id === filter ? 'active' : ''}`}
                onClick={() => selectFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {current ? (
            <>
              <button
                type="button"
                className="flashcards-card"
                onClick={() => setShowBack((value) => !value)}
              >
                <small>{showBack ? 'Answer' : 'Question'} · {safeIndex + 1}/{filtered.length}</small>
                <span>{showBack ? current.back : current.front}</span>
              </button>

              <div className="flashcards-actions">
                <button type="button" className="flashcards-button" onClick={() => move(-1)}>←</button>
                {CONFIDENCE.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    className={`flashcards-button ${level.id} ${current.confidence === level.id ? 'selected' : ''}`}
                    onClick={() => rate(level.id)}
                  >
                    {level.label}
                  </button>
                ))}
                <button type="button" className="flashcards-button" onClick={() => move(1)}>→</button>
              </div>
            </>
          ) : (
            <p>{isLoading ? 'Loading...' : 'No cards match this filter.'}</p>
          )}
        </>
      )}
    </section>
  )
}

export default Flashcards
