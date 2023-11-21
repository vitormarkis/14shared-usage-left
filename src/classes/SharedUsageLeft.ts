import { Pubsub } from "~/classes/Pubsub"

export class SharedUsageLeft {
  accountNamesFarmingOnThisPlan = new Set<string>()
  usageLeft: number
  interval: NodeJS.Timeout | undefined

  constructor(
    usageLeft: number,
    private readonly pubsub: Pubsub
  ) {
    this.usageLeft = usageLeft
  }

  farm(amount: number) {
    const startedAt = new Date()
    this.interval = setInterval(() => {
      const discountedAmount = (this.accountNamesFarmingOnThisPlan ?? new Set()).size * amount
      if (this.usageLeft - discountedAmount < 0) return this.pubsub.emit("done", startedAt)
      this.usageLeft -= discountedAmount
      console.log(`Discounting amount of ${discountedAmount}, usage left is: ${this.usageLeft}.`)
    }, amount * 1000)
  }

  stopFarm(startedAt: Date) {
    const durationInSeconds = Number((new Date().getTime() - startedAt.getTime()) / 1000).toFixed(2)
    console.log(`Ended farm with ${this.usageLeft} time remaining`)
    console.log(`Farm lasted ${durationInSeconds} seconds.`)
    clearInterval(this.interval)
  }
  append(accountName: string) {
    this.accountNamesFarmingOnThisPlan.add(accountName)
  }
  remove(accountName: string) {
    this.accountNamesFarmingOnThisPlan.delete(accountName)
  }
}
