export interface PrizePool {
  readonly places: number;
  readonly amount: number;
  readonly currency: string;
  readonly items: string[];
  readonly site_rate: number;
  readonly creator_rate: number;
}