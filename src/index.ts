import { FarmService } from "~/classes/FarmService"
import { Pubsub } from "~/classes/Pubsub"
import { SharedUsageLeft } from "~/classes/SharedUsageLeft"

const pubsub = new Pubsub()
const sharedUsageLeft = new SharedUsageLeft(30, pubsub)
const farmService = new FarmService(sharedUsageLeft)
farmService.addAccountToFarm("vitor")
pubsub.on("70s", () => farmService.addAccountToFarm("igor"))
pubsub.on("70s", () => farmService.addAccountToFarm("joaquim"))
pubsub.on("70s", () => farmService.addAccountToFarm("soares"))
pubsub.on("50s", () => farmService.removeFarmingAccount("igor"))
pubsub.on("50s", () => farmService.addAccountToFarm("new"))
pubsub.on("done", (startedAt: Date) => farmService.stopFarm(startedAt))
farmService.startGame(1)
