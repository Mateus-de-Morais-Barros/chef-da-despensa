import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { usePantry } from '../../hooks/usePantry'
import {
  addIngredient,
  updateIngredient,
  deleteIngredient,
} from '../../services/firestoreService'
import PetMascot from '../../components/ui/PetMascot'
import Spinner from '../../components/ui/Spinner'
import styles from './PantryPage.module.css'

const UNITS = ['unidades', 'g', 'kg', 'ml', 'L', 'xícaras', 'colheres']

export default function PantryPage() {
  const { user } = useAuth()
  const { ingredients, loading, error } = usePantry()

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editQty, setEditQty] = useState(1)
  const [editUnit, setEditUnit] = useState('unidades')

  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState(1)
  const [newUnit, setNewUnit] = useState('unidades')
  const [saving, setSaving] = useState(false)

  function startEdit(ing) {
    setEditingId(ing.id)
    setEditName(ing.name)
    setEditQty(ing.quantity)
    setEditUnit(ing.unit)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id) {
    setSaving(true)
    await updateIngredient(user.uid, id, { name: editName, quantity: editQty, unit: editUnit })
    setSaving(false)
    setEditingId(null)
  }

  async function handleDelete(id) {
    await deleteIngredient(user.uid, id)
  }

  async function handleQtyChange(ing, delta) {
    const newQty = Math.max(0, ing.quantity + delta)
    await updateIngredient(user.uid, ing.id, { quantity: newQty })
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    await addIngredient(user.uid, { name: newName.trim(), quantity: newQty, unit: newUnit })
    setSaving(false)
    setNewName('')
    setNewQty(1)
    setNewUnit('unidades')
    setShowAdd(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <PetMascot mood="olhandoGeladeira" size={70} />
        <h1 className={styles.title}>Despensa</h1>
      </div>

      {error && (
        <p style={{ color: '#C0392B', fontWeight: 700, textAlign: 'center', fontSize: '0.88rem' }}>
          Erro ao carregar despensa: {error}
        </p>
      )}
      {loading ? (
        <div className={styles.center}><Spinner size={40} /></div>
      ) : (
        <div className={styles.list}>
          {ingredients.map((ing) =>
            editingId === ing.id ? (
              <div key={ing.id} className={styles.editRow}>
                <input
                  className={styles.editInput}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Nome"
                />
                <div className={styles.editMeta}>
                  <input
                    className={styles.editQtyInput}
                    type="number"
                    min="0"
                    value={editQty}
                    onChange={e => setEditQty(Number(e.target.value))}
                  />
                  <select
                    className={styles.unitSelect}
                    value={editUnit}
                    onChange={e => setEditUnit(e.target.value)}
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className={styles.editActions}>
                  <button className={styles.saveBtn} onClick={() => saveEdit(ing.id)} disabled={saving}>
                    Salvar
                  </button>
                  <button className={styles.cancelBtn} onClick={cancelEdit}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div key={ing.id} className={styles.row}>
                <button className={styles.editIcon} onClick={() => startEdit(ing)} aria-label="Editar">
                  <EditIcon />
                </button>
                <span className={styles.ingName}>{ing.name}</span>
                <div className={styles.qtyControls}>
                  <button className={styles.qtyBtn} onClick={() => handleQtyChange(ing, -1)}>−</button>
                  <span className={styles.qty}>{ing.quantity}</span>
                  <button className={styles.qtyBtn} onClick={() => handleQtyChange(ing, 1)}>+</button>
                </div>
                <span className={styles.unit}>{ing.unit}</span>
                <button className={styles.deleteIcon} onClick={() => handleDelete(ing.id)} aria-label="Excluir">
                  <TrashIcon />
                </button>
              </div>
            )
          )}

          {showAdd ? (
            <form className={styles.addForm} onSubmit={handleAdd}>
              <input
                className={styles.editInput}
                placeholder="Nome do ingrediente"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                autoFocus
                required
              />
              <div className={styles.editMeta}>
                <input
                  className={styles.editQtyInput}
                  type="number"
                  min="0"
                  value={newQty}
                  onChange={e => setNewQty(Number(e.target.value))}
                />
                <select
                  className={styles.unitSelect}
                  value={newUnit}
                  onChange={e => setNewUnit(e.target.value)}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className={styles.editActions}>
                <button className={styles.saveBtn} type="submit" disabled={saving}>
                  Salvar
                </button>
                <button
                  className={styles.cancelBtn}
                  type="button"
                  onClick={() => setShowAdd(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
              <PlusIcon /> Adicionar ingrediente
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function EditIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function TrashIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2"/></svg>
}
function PlusIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
}
