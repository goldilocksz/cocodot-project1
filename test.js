// royaltyCasino: 카지노 로열티
// ggr: GGR (총 게임 수익)
// royaltyBetting: 베팅 로열티
// betting: 베팅
// finRoyalty: 금융 로열티
// finGGR: 금융 GGR
// casinoPromo: 카지노 프로모션
// depositsPayouts: 입금 및 지불
// affPercentage: 파트너 수수료 비율

function calculatePartnerIncome(
  royaltyCasino,
  ggr,
  royaltyBetting,
  betting,
  finRoyalty,
  finGGR,
  casinoPromo,
  depositsPayouts,
  affPercentage,
) {
  return (
    (((100 - royaltyCasino) / 100) * ggr +
      ((100 - royaltyBetting) / 100) * betting +
      ((100 - finRoyalty) / 100) * finGGR -
      casinoPromo -
      depositsPayouts * 0.1) *
    (affPercentage / 100)
  )
}
let partnerIncome = calculatePartnerIncome(
  15,
  100000,
  20,
  50000,
  20,
  30000,
  10000,
  20000,
  25,
)
console.log("Partner's income: $" + partnerIncome.toFixed(2))
