import type { Logger } from '../../types'

// This is a mock class used for testing; it's purpose is not functionality.
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-empty-function */

export class BaseMockLogger implements Logger {
	public error(message: string, metadata?: Record<string, unknown>): void {}

	public warn(message: string, metadata?: Record<string, unknown>): void {}

	public info(message: string, metadata?: Record<string, unknown>): void {}

	public debug(message: string, metadata?: Record<string, unknown>): void {}
}
