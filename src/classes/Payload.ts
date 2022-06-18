import { isPayloadParameters } from '../types'
import type {
	PayloadParameters,
	PayloadType,
} from '../types'

interface JsonDeserializedBuffer {
	type: string;
	data: string;
}
const isJsonDeserializedBuffer = (value: unknown): value is JsonDeserializedBuffer => (
	value instanceof Object
	&& 'type' in value
	&& 'data' in value
)

export class Payload {
	public readonly data: Buffer

	public readonly type: PayloadType | string

	public readonly createdAt: string

	public readonly origin: string

	public readonly duration: number

	public readonly position: number

	public constructor(parameters: PayloadParameters) {
		this.data = parameters.data
		this.type = parameters.type
		this.createdAt = parameters.createdAt ?? (new Date()).toISOString()
		this.origin = parameters.origin
		this.duration = parameters.duration
		this.position = parameters.position
	}

	public static serialize(payload: Payload): string {
		return JSON.stringify(payload)
	}

	public static deserialize(serializedPayload: string): Payload {
		const deserializedPayload: unknown = JSON.parse(serializedPayload, (_, value: unknown) => {
			if (isJsonDeserializedBuffer(value)
				&& value.type === 'Buffer') {
				return Buffer.from(value.data)
			}
			return value
		})
		if (isPayloadParameters(deserializedPayload)) {
			return new Payload(deserializedPayload)
		}
		throw new Error(`Invalid payload serialiation: ${serializedPayload}`)
	}
}
