import type { PayloadType } from './PayloadType'

export interface PayloadParameters {
	data: Buffer;
	type: PayloadType | string;
	createdAt?: string;
	origin: string;
	duration: number;
	position: number;
}
export const isPayloadParameters = (value: unknown): value is PayloadParameters => (
	value instanceof Object
	&& (value as PayloadParameters).data instanceof Buffer
	&& typeof (value as PayloadParameters).type === 'string'
	&& typeof (value as PayloadParameters).createdAt === 'string'
	&& typeof (value as PayloadParameters).origin === 'string'
	&& typeof (value as PayloadParameters).duration === 'number'
	&& typeof (value as PayloadParameters).position === 'number'
)
