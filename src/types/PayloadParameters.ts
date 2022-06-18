import type { PayloadType } from './PayloadType'

export interface PayloadParameters {
	data: Buffer;
	type: PayloadType | string;
	createdAt?: string;
	origin: string;
	duration: number;
	position: number;
}
export const isPayloadParameters = (value: unknown): value is PayloadParameters => {
	const candidate = value as PayloadParameters
	return candidate instanceof Object
		&& candidate.data instanceof Buffer
		&& typeof candidate.type === 'string'
		&& typeof candidate.createdAt === 'string'
		&& typeof candidate.origin === 'string'
		&& typeof candidate.duration === 'number'
		&& typeof candidate.position === 'number'
}
