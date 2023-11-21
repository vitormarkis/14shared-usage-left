import { FarmService, SharedUsageLeft } from "~/types"

export function createPubsub() {
  const evensEmittedOnce = new Set()
  const handlersMapping = new Map<string, Set<Function>>()
  const on = (eventName: string, callback: Function) => {
    const handler = handlersMapping.get(eventName)
    if (!handler) {
      return handlersMapping.set(eventName, new Set<Function>().add(callback))
    }
    handler.add(callback)
  }

  const emit = (eventName: string, payload?: any) => {
    const handlers = handlersMapping.get(eventName)
    if (!handlers) return
    handlers.forEach(cb => {
      cb(payload)
    })
  }

  const emitOnce = (...args: [eventName: string, payload?: any]) => {
    const [eventName] = args
    if (evensEmittedOnce.has(eventName)) return
    evensEmittedOnce.add(eventName)
    emit(...args)
  }

  return {
    on,
    emit,
    emitOnce,
  }
}

const pubsub = createPubsub()

function createSharedUsageLeft(usageLeft: number): SharedUsageLeft {
  const __accountNamesFarmingOnThisPlan = new Set<string>()
  let __usageLeft = usageLeft
  let interval: NodeJS.Timeout

  const farm = (amount: number) => {
    const startedAt = new Date()
    interval = setInterval(() => {
      const discountedAmount = __accountNamesFarmingOnThisPlan.size * amount
      const usageLeftDiscounted = __usageLeft - discountedAmount
      if (usageLeftDiscounted <= usageLeft * 0.7) pubsub.emitOnce("70s")
      if (usageLeftDiscounted <= usageLeft * 0.5) pubsub.emitOnce("50s")
      if (usageLeftDiscounted < 0) return pubsub.emit("done", startedAt)
      __usageLeft -= discountedAmount
      console.log(`Discounting amount of ${discountedAmount}, usage left is: ${__usageLeft}.`)
    }, amount * 1000)
  }
  const stopFarm = (startedAt: Date) => {
    const durationInSeconds = Number((new Date().getTime() - startedAt.getTime()) / 1000).toFixed(2)
    console.log(`Ended farm with ${__usageLeft} time remaining`)
    console.log(`Farm lasted ${durationInSeconds} seconds.`)
    clearInterval(interval)
  }
  const append = (accountName: string) => __accountNamesFarmingOnThisPlan.add(accountName)
  const remove = (accountName: string) => __accountNamesFarmingOnThisPlan.delete(accountName)

  return {
    startFarm: farm,
    append,
    remove,
    stopFarm,
  }
}

function createFarmService(sharedUsageLeft: SharedUsageLeft): FarmService {
  const __sharedUsageLeft = sharedUsageLeft

  const addAccountToFarm = (accountName: string) => {
    console.log(`Adding account name ${accountName}`)
    __sharedUsageLeft.append(accountName)
  }

  const removeFarmingAccount = (accountName: string) => {
    console.log(`Removing account name ${accountName}`)
    __sharedUsageLeft.remove(accountName)
  }

  return {
    addAccountToFarm,
    removeFarmingAccount,
    startFarm: amount => __sharedUsageLeft.startFarm(amount),
    stopFarm: startedAt => __sharedUsageLeft.stopFarm(startedAt),
  }
}

const sharedUsageLeft = createSharedUsageLeft(120)
const farmService = createFarmService(sharedUsageLeft)
farmService.addAccountToFarm("vitor")
pubsub.on("70s", () => farmService.addAccountToFarm("igor"))
pubsub.on("70s", () => farmService.addAccountToFarm("joaquim"))
pubsub.on("70s", () => farmService.addAccountToFarm("soares"))
pubsub.on("50s", () => farmService.removeFarmingAccount("igor"))
pubsub.on("50s", () => farmService.addAccountToFarm("new"))
pubsub.on("done", (startedAt: Date) => farmService.stopFarm(startedAt))
farmService.startFarm(2)
