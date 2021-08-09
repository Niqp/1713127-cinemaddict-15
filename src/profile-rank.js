export const calculateRank = (currentRanks, currentHistoryList) => {
  for (const rank of currentRanks) {
    if (currentHistoryList.length>=rank.low && currentHistoryList.length<=rank.high) {
      return rank.name;
    }
  }};
