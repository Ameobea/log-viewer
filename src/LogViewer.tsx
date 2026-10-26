import React, { useState } from 'react'

const PAGE_SIZE = 50

interface Item {
  id: string
  text: string
}

interface FancyDataCellProps {
  data: { text: string; id: string; i: number }
  onDelete: () => void
}

const FancyDataCell: React.FC<FancyDataCellProps> = ({ data: { text, i }, onDelete }) => {
  const [expanded, setExpanded] = useState(false)

  const start = performance.now()
  while (performance.now() - start < 1.5) {}

  return (
    <li style={{ padding: '4px', borderBottom: '1px solid #ccc' }}>
      <span onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', marginRight: 8 }}>
        {expanded ? '▼' : '▶'}
      </span>
      {i}: {text} <button onClick={onDelete}>Delete</button>
      {expanded && <div style={{ fontSize: '0.85em', color: '#666' }}>Details for {text}</div>}
    </li>
  )
}

interface ListProps {
  data: Item[]
  search?: string
  pageIx: number
  onDelete: (itemID: string) => void
}

const List: React.FC<ListProps> = ({ data, search, pageIx, onDelete }) => {
  const [deletedSessionCount, setDeletedSessionCount] = useState(0)

  const handleDelete = (id: string) => {
    onDelete(id)
    setDeletedSessionCount(deletedSessionCount + 1)
  }

  const visibleItems = data.filter((d) => d.text.includes(search))
  const pageItems = visibleItems.slice(PAGE_SIZE * pageIx, PAGE_SIZE * (pageIx + 1))

  return (
    <div>
      <p>Items deleted this session: {deletedSessionCount}</p>
      <ul>
        {pageItems.map((item, index) => (
          <FancyDataCell
            data={{ ...item, i: PAGE_SIZE * pageIx + index }}
            key={index}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </ul>
    </div>
  )
}

const INITIAL_DATA: Item[] = Array.from({ length: 500 }, (_, i) => ({
  id: `item-${i}`,
  text: `Item ${i} - ${Math.random().toString(36).substring(7)}`,
}))

export function App() {
  const [data, setData] = useState<Item[]>(INITIAL_DATA)

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id))
  }

  return (
    <div style={{ padding: 20 }}>
      <List data={data} pageIx={0} onDelete={handleDelete} />
    </div>
  )
}
