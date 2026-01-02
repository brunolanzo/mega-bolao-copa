import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Menu from '../components/Menu'

export default function Ranking() {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRanking()
  }, [])

  async function fetchRanking() {
    const { data, error } = await supabase
      .from('ranking_view')
      .select('*')

    if (!error) setRanking(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <Menu />
        <p style={{ padding: 40 }}>Carregando ranking...</p>
      </>
    )
  }

  return (
    <>
      <Menu />

      <div style={{ padding: 40 }}>
        <h1>Ranking — Mega Bolão da Copa</h1>

        {ranking.length === 0 && (
          <p>Nenhum ponto computado ainda.</p>
        )}

        {ranking.map((r, index) => (
          <div key={r.user_id} style={{ marginBottom: 8 }}>
            <strong>{index + 1}.</strong> {r.name} —{' '}
            <strong>{r.total_points} pts</strong>
          </div>
        ))}
      </div>
    </>
  )
}
