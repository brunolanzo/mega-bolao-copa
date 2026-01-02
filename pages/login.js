import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) alert(error.message)
    else alert('Logado com sucesso')
  }

  async function handleSignup() {
  setLoading(true)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (!error && data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      name: email.split('@')[0], // provisório
    })
  }

  setLoading(false)

  if (error) alert(error.message)
  else alert('Conta criada! Agora faça login.')
}


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial'
    }}>
      <div style={{ width: 300 }}>
        <h1>Mega Bolão da Copa</h1>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Senha"
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
        <br /><br />

        <button onClick={handleLogin} disabled={loading}>
          Entrar
        </button>
        {' '}
        <button onClick={handleSignup} disabled={loading}>
          Criar conta
        </button>
      </div>
    </div>
  )
}
