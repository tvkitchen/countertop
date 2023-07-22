export interface Logger {
	error(message: string, metadata?: Record<string, unknown>): void;
	warn(message: string, metadata?: Record<string, unknown>): void;
	info(message: string, metadata?: Record<string, unknown>): void;
	debug(message: string, metadata?: Record<string, unknown>): void;
}
