import { SharedUsageLeft } from "~/classes/SharedUsageLeft"

export class FarmService {
  constructor(private readonly sharedUsageLeft: SharedUsageLeft) {}

  addAccountToFarm(accountName: string) {
    console.log(`Adding account name ${accountName}`)
    this.sharedUsageLeft.append(accountName)
  }

  removeFarmingAccount(accountName: string) {
    console.log(`Removing account name ${accountName}`)
    this.sharedUsageLeft.remove(accountName)
  }

  stopFarm(startedAt: Date) {
    this.sharedUsageLeft.stopFarm(startedAt)
  }

  startGame(amount: number) {
    this.sharedUsageLeft.farm(amount)
  }
}
