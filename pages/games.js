import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Menu from '../components/Menu'

export default function Games() {
  const [games, setGames] = useState([])
  const [user, setUser] = useState(null)
  const [preds, setPreds] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchPredictions(data.user.id)
    })
    fetchGames()
  }, [])

  async function fetchGames() {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('match_date')

    setGames(data || [])
  }

  async function fetchPredictions(userId) {
    const { data } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)

    const map = {}
    data?.forEach(p => {
      map[p.match_id] = {
        id: p.id,
        pred_score_a: p.pred_score_a,
        pred_score_b: p.pred_score_b
      }
    })

    setPreds(map)
  }

  function updatePrediction(matchId, field, value) {
    setPreds(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value
      }
    }))
  }

  async function saveAllPredictions() {
    setSaving(true)
    setMessage('')

    for (const match of games) {
      const pred = preds[match.id]

      if (
        pred &&
        pred.pred_score_a !== '' &&
        pred.pred_score_b !== ''
      ) {
        const locked = new Date() >= new Date(match.match_date)
        if (locked) continue

        if (pred.id) {
          await supabase
            .from('predictions')
            .update({
              pred_score_a: pred.pred_score_a,
              pred_score_b: pred.pred_score_b
            })
            .eq('id', pred.id)
        } else {
          await supabase
            .from('predictions')
            .insert({
              user_id: user.id,
              match_id: match.id,
              pred_score_a: pred.pred_score_a,
              pred_score_b: pred.pred_score_b
            })
        }
      }
    }

    await fetchPredictions(user.id)
    setSaving(false)
    setMessage('Palpites salvos com sucesso')
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Mega Bolão da Copa</h1>
        <p>Faça login para palpitar</p>
        <a href="/login">Ir para login</a>
      </div>
    )
  }

  return (
    <>
      <Menu />

      <div style={{ padding: 40 }}>
        <h1>Mega Bolão da Copa</h1>

        {games.map(game => {
          const pred = preds[game.id] || {}
          const locked = new Date() >= new Date(game.match_date)

          return (
            <div key={game.id} style={{ marginBottom: 20 }}>
              <strong>{game.team_a}</strong> x <strong>{game.team_b}</strong>

              <div>
                <input
                  type="number"
                  value={pred.pred_score_a ?? ''}
                  disabled={locked}
                  onChange={e =>
                    updatePrediction(
                      game.id,
                      'pred_score_a',
                      e.target.value
                    )
                  }
                  style={{ width: 40 }}
                />
                {' x '}
                <input
                  type="number"
                  value={pred.pred_score_b ?? ''}
                  disabled={locked}
                  onChange={e =>
                    updatePrediction(
                      game.id,
                      'pred_score_b',
                      e.target.value
                    )
                  }
                  style={{ width: 40 }}
                />
                {locked && <span> 🔒</span>}
              </div>
            </div>
          )
        })}

        <button onClick={saveAllPredictions} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar palpites'}
        </button>

        {message && <p>{message}</p>}
      </div>
    </>
  )
}
