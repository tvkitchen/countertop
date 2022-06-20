import type { ErrorObject } from 'ajv'

export class ValidationError extends Error {
	public errors?: ErrorObject[] | null

	public constructor(
		message?: string,
		errors?: ErrorObject[] | null,
	) {
		super(message)
		this.name = this.constructor.name
		this.errors = errors
	}
}
