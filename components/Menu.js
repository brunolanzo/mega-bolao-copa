import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

const ADMIN_EMAIL = 'bruno.lanzo@gmail.com'

export default function Menu() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return null

  return (
    <nav style={{
      padding: 20,
      borderBottom: '1px solid #ddd',
      marginBottom: 30
    }}>
      <a href="/" style={{ marginRight: 15 }}>Home</a>
      <a href="/games" style={{ marginRight: 15 }}>Jogos</a>
      <a href="/ranking" style={{ marginRight: 15 }}>Ranking</a>

      {user.email === ADMIN_EMAIL && (
        <a href="/admin" style={{ marginRight: 15 }}>Admin</a>
      )}

      <button onClick={logout}>Sair</button>
    </nav>
  )
}
