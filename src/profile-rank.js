export const calculateRank = (currentRanks, currentHistoryList) => {
  for (const rank of currentRanks) {
    if (currentHistoryList>=rank.low && currentHistoryList<=rank.high) {
      return rank.name;
    }
  }};
