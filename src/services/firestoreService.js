import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase/config'

// ─── Pantry ────────────────────────────────────────────────────────────────

function pantryRef(userId) {
  return collection(db, 'users', userId, 'pantry')
}

export function subscribePantry(userId, callback, onError) {
  const q = query(pantryRef(userId), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(items)
  }, (err) => {
    console.error('subscribePantry error:', err)
    onError?.(err)
  })
}

export async function addIngredient(userId, { name, quantity, unit }) {
  await addDoc(pantryRef(userId), {
    name,
    quantity,
    unit,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateIngredient(userId, ingredientId, fields) {
  const ref = doc(db, 'users', userId, 'pantry', ingredientId)
  await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
}

export async function deleteIngredient(userId, ingredientId) {
  const ref = doc(db, 'users', userId, 'pantry', ingredientId)
  await deleteDoc(ref)
}

// ─── Recipes ───────────────────────────────────────────────────────────────

function recipesRef(userId) {
  return collection(db, 'users', userId, 'recipes')
}

export function subscribeRecipes(userId, callback, onError) {
  const q = query(recipesRef(userId), orderBy('generatedAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(items)
  }, (err) => {
    console.error('subscribeRecipes error:', err)
    onError?.(err)
  })
}

export async function saveRecipe(userId, recipe, pantryIngredients) {
  const allAvailable = recipe.ingredients.every((ri) =>
    pantryIngredients.some((pi) =>
      pi.name.toLowerCase().includes(ri.name.toLowerCase()) ||
      ri.name.toLowerCase().includes(pi.name.toLowerCase())
    )
  )

  const docRef = await addDoc(recipesRef(userId), {
    ...recipe,
    favorited: false,
    allIngredientsAvailable: allAvailable,
    generatedFrom: pantryIngredients.map((i) => i.name),
    generatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function toggleFavorite(userId, recipeId, currentValue) {
  const ref = doc(db, 'users', userId, 'recipes', recipeId)
  await updateDoc(ref, { favorited: !currentValue })
}

export async function deleteRecipe(userId, recipeId) {
  const ref = doc(db, 'users', userId, 'recipes', recipeId)
  await deleteDoc(ref)
}
