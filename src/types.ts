export interface SharedUsageLeft {
  startFarm(amount: number): void
  stopFarm(startedAt: Date): void
  append(accountName: string): void
  remove(accountName: string): void
}

export interface FarmService {
  addAccountToFarm(accountName: string): void
  removeFarmingAccount(accountName: string): void
  startFarm(amount: number): void
  stopFarm(startedAt: Date): void
}
