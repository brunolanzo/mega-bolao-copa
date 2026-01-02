import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { calculatePoints } from '../lib/scoring'
import Menu from '../components/Menu'

const ADMIN_EMAIL = 'bruno.lanzo@gmail.com'

export default function Admin() {
  const [games, setGames] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const { data } = await supabase.auth.getUser()
    const currentUser = data.user

    setUser(currentUser)

    if (!currentUser) {
      setLoading(false)
      return
    }

    if (currentUser.email === ADMIN_EMAIL) {
      setAuthorized(true)
      await fetchGames()
    }

    setLoading(false)
  }

  async function fetchGames() {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('match_date')

    setGames(data || [])
  }

  async function saveResult(gameId, scoreA, scoreB) {
    if (scoreA === '' || scoreB === '') return

    await supabase
      .from('matches')
      .update({
        score_a: Number(scoreA),
        score_b: Number(scoreB),
        status: 'finished'
      })
      .eq('id', gameId)

    const { data: preds } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_id', gameId)

    for (const p of preds) {
      const points = calculatePoints(
        p.pred_score_a,
        p.pred_score_b,
        scoreA,
        scoreB
      )

      await supabase
        .from('predictions')
        .update({ points })
        .eq('id', p.id)
    }

    alert('Resultado salvo e pontuação calculada')
    fetchGames()
  }

  if (loading) {
    return (
      <>
        <Menu />
        <p style={{ padding: 40 }}>Carregando...</p>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Menu />
        <div style={{ padding: 40 }}>
          <h1>Admin</h1>
          <p>Você precisa estar logado.</p>
          <a href="/login">Ir para login</a>
        </div>
      </>
    )
  }

  if (!authorized) {
    return (
      <>
        <Menu />
        <div style={{ padding: 40 }}>
          <h1>Acesso negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Menu />

      <div style={{ padding: 40 }}>
        <h1>Admin — Mega Bolão da Copa</h1>

        {games.map(game => (
          <div key={game.id} style={{ marginBottom: 20 }}>
            <strong>{game.team_a}</strong> x <strong>{game.team_b}</strong>

            <div>
              <input
                type="number"
                defaultValue={game.score_a ?? ''}
                placeholder="A"
                style={{ width: 40 }}
                onBlur={e =>
                  saveResult(game.id, e.target.value, game.score_b)
                }
              />
              {' x '}
              <input
                type="number"
                defaultValue={game.score_b ?? ''}
                placeholder="B"
                style={{ width: 40 }}
                onBlur={e =>
                  saveResult(game.id, game.score_a, e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
