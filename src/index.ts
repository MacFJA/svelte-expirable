import type { Readable, Subscriber, Unsubscriber } from "svelte/store"

export type Message = {
	data
	id: number
	repeated: number
}
type InternalMessage = {
	data
	ttl: number
	id: number
	repeated: number
	timeoutId
}
export interface Expirable extends Readable<Array<Message>> {
	push(data, ttl: number): void
}

export const expirable = (): Expirable => {
	let subscribers: Array<Subscriber<Array<Message>>> = []
	let messages: Array<InternalMessage> = []
	let lastMessageId = 0

	const executeRun = () => {
		subscribers.forEach((run) => executeOneRun(run))
	}

	const executeOneRun = (run) => run(messages.map((message) => ({
		data: message.data,
		repeated: message.repeated,
		id: message.id
	})))

	return {
		subscribe(run: Subscriber<Array<Message>>): Unsubscriber {
			subscribers.push(run)
			executeOneRun(run)
			return () => {
				subscribers = subscribers.filter((runFunction) => runFunction !== run)
			}
		},
		push(data, ttl: number) {
			const existing = messages.find(msg => msg.data === data)

			if (existing) {
				clearTimeout(existing.timeoutId)
				existing.timeoutId = setTimeout(() => {
					messages = messages.filter(msg => msg.data !== data)
					executeRun()
				}, ttl * 1000)
				existing.ttl = ttl
				existing.repeated++
			} else {
				lastMessageId++
				const timeoutId = setTimeout(() => {
					messages = messages.filter(msg => msg.data !== data)
					executeRun()
				}, ttl * 1000)
				messages.push({
					data,
					ttl,
					id: lastMessageId,
					repeated: 0,
					timeoutId
				})
			}

			executeRun()
		}
	}
}
