export function calculatePoints(predA, predB, realA, realB) {
  const pA = Number(predA)
  const pB = Number(predB)
  const rA = Number(realA)
  const rB = Number(realB)

  // 1. Placar exato
  if (pA === rA && pB === rB) {
    return 7
  }

  const predIsDraw = pA === pB
  const realIsDraw = rA === rB

  const predWinner = pA > pB ? 'A' : pA < pB ? 'B' : 'D'
  const realWinner = rA > rB ? 'A' : rA < rB ? 'B' : 'D'

  const acertouGolA = pA === rA
  const acertouGolB = pB === rB

  // 4. Empate sem placar exato
  if (realIsDraw && predIsDraw) {
    return 3
  }

  // 2. Vencedor + gols de um time
  if (
    predWinner === realWinner &&
    (acertouGolA || acertouGolB)
  ) {
    return 4
  }

  // 3. Só vencedor (errar gols dos dois)
  if (
    predWinner === realWinner &&
    !acertouGolA &&
    !acertouGolB
  ) {
    return 3
  }

  // 5. Acertar gol de um time, errar vencedor
  if (
    predWinner !== realWinner &&
    (acertouGolA || acertouGolB)
  ) {
    return 1
  }

  return 0
}
