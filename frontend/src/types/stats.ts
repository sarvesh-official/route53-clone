export interface UserStats {
  total_zones: number;
  public_zones: number;
  private_zones: number;
  total_records: number;
}

export interface DailyBucket {
  day: string;
  records_created: number;
}

export interface Activity {
  buckets: DailyBucket[];
}
