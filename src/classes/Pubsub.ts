export class Pubsub {
  evensEmittedOnce = new Set()
  handlersMapping = new Map<string, Set<Function>>()

  on(eventName: string, callback: Function) {
    const handler = this.handlersMapping.get(eventName)
    if (!handler) {
      return this.handlersMapping.set(eventName, new Set<Function>().add(callback))
    }
    handler.add(callback)
  }

  emit(eventName: string, payload?: any) {
    const handlers = this.handlersMapping.get(eventName)
    if (!handlers) return
    handlers.forEach(cb => {
      cb(payload)
    })
  }

  emitOnce(...args: [eventName: string, payload?: any]) {
    const [eventName] = args
    if (this.evensEmittedOnce.has(eventName)) return
    this.evensEmittedOnce.add(eventName)
    this.emit(...args)
  }
}
