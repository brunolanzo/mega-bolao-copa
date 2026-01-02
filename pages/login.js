import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push('/') // 🔥 ISSO RESOLVE
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Entrar</button>
      </form>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  )
}
