import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Menu from '../components/Menu'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Mega Bolão da Copa</h1>
        <p>Faça login para participar</p>
        <a href="/login">Ir para login</a>
      </div>
    )
  }

  return (
    <>
      <Menu />

      <div style={{ padding: 40 }}>
        <h1>Mega Bolão da Copa</h1>

        <p>
          Bem-vindo, <strong>{user.email}</strong>
        </p>

        <ul>
          <li>
            <a href="/games">Fazer / editar palpites</a>
          </li>
          <li>
            <a href="/ranking">Ver ranking</a>
          </li>
        </ul>
      </div>
    </>
  )
}
