import avro from 'avsc'
import { ajv } from '../tools/ajv'
import { isPayloadParameters } from '../types'
import { ValidationError } from '../errors'
import type { JSONSchemaType } from 'ajv'
import type {
	PayloadParameters,
	PayloadType,
} from '../types'

interface JsonDeserializedBuffer {
	type: string;
	data: number[];
}
const jsonDeserializedBufferSchema: JSONSchemaType<JsonDeserializedBuffer> = {
	type: 'object',
	properties: {
		type: {
			type: 'string',
			pattern: 'Buffer',
		},
		data: {
			type: 'array',
			items: {
				type: 'integer',
			},
		},
	},
	required: [
		'type',
		'data',
	],
}
const isJsonDeserializedBuffer = ajv.compile(jsonDeserializedBufferSchema)

export class Payload {
	private static readonly avroType = avro.Type.forSchema({
		name: 'Payload',
		type: 'record',
		fields: [
			{
				name: 'data',
				type: 'bytes',
			},
			{
				name: 'type',
				type: 'string',
			},
			{
				name: 'createdAt',
				type: 'string',
			},
			{
				name: 'origin',
				type: 'string',
			},
			{
				name: 'duration',
				type: 'long',
			},
			{
				name: 'position',
				type: 'long',
			},
		],
	})

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
			if (isJsonDeserializedBuffer(value)) {
				return Buffer.from(value.data)
			}
			return value
		})
		if (isPayloadParameters(deserializedPayload)) {
			return new Payload(deserializedPayload)
		}
		throw new ValidationError(
			'Invalid payload serialization',
			isPayloadParameters.errors,
		)
	}

	public static getAvroType(): avro.Type {
		return Payload.avroType
	}

	public static byteSerialize(payload: Payload): Buffer {
		return Payload.getAvroType().toBuffer(payload)
	}

	public static byteDeserialize(serializedPayload: Buffer): Payload {
		const deserializedPayload: unknown = Payload.getAvroType().fromBuffer(
			serializedPayload,
		)
		if (isPayloadParameters(deserializedPayload)) {
			return new Payload(deserializedPayload)
		}
		throw new Error('TV Kitchen defined a Avro Type which deserialized to an invalid Payload.')
	}
}
