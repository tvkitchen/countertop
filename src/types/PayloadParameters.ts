import { ajv } from '../tools/ajv'
import type { JSONSchemaType } from 'ajv'
import type { PayloadType } from './PayloadType'

export interface PayloadParameters {
	data: Buffer;
	type: PayloadType | string;
	createdAt?: string;
	origin: string;
	duration: number;
	position: number;
}

export const payloadParametersSchema: JSONSchemaType<PayloadParameters> = {
	type: 'object',
	properties: {
		data: {
			type: 'object',
			required: [],
			instanceof: 'Buffer',
		},
		type: {
			type: 'string',
		},
		createdAt: {
			type: 'string',
			nullable: true,
		},
		origin: {
			type: 'string',
		},
		duration: {
			type: 'integer',
		},
		position: {
			type: 'integer',
		},
	},
	required: [
		'data',
		'type',
		'origin',
		'duration',
		'position',
	],
}

export const isPayloadParameters = ajv.compile(payloadParametersSchema)
