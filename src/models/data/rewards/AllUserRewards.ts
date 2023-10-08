// Represents an individual reward
export interface Reward {
  amount: number;
  sendDate: string;
  description: string;
  spent: boolean;
}

// Represents rewards specific to a company
export interface CompanyRewards {
  availableBalance: number;
  rewards: Reward[];
}

// Represents the entire API response structure
export interface AllUserRewards {
  success: boolean;
  message: string;
  userKey: string;
  companiesWithRewards: string[];
  rewardsByCompany: { [key: string]: CompanyRewards };
}
