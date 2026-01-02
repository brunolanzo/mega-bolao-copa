export function calculatePoints(predA, predB, realA, realB) {
  const predAInt = Number(predA)
  const predBInt = Number(predB)
  const realAInt = Number(realA)
  const realBInt = Number(realB)

  // 1. Placar exato
  if (predAInt === realAInt && predBInt === realBInt) {
    return 7
  }

  const predIsDraw = predAInt === predBInt
  const realIsDraw = realAInt === realBInt

  const predWinner =
    predAInt > predBInt ? 'A' : predAInt < predBInt ? 'B' : 'D'
  const realWinner =
    realAInt > realBInt ? 'A' : realAInt < realBInt ? 'B' : 'D'

  const acertouGolTimeA = predAInt === realAInt
  const acertouGolTimeB = predBInt === realBInt

  // 4. Empate sem placar exato
  if (realIsDraw && predIsDraw) {
    return 3
  }

  // 2. Vencedor + gols de um time
  if (
    predWinner === realWinner &&
    (acertouGolTimeA || acertouGolTimeB)
  ) {
    return 4
  }

  // 3. Acertar vencedor, errar gols dos dois
  if (
    predWinner === realWinner &&
    !acertouGolTimeA &&
    !acertouGolTimeB
  ) {
    return 3
  }

  // 5. Acertar gol de um time, mas errar vencedor
  if (
    predWinner !== realWinner &&
    (acertouGolTimeA || acertouGolTimeB)
  ) {
    return 1
  }

  return 0
}
