import { Transform } from 'stream'
import {
	AbstractImplementationError,
	ProcessingError,
	ValidationError,
} from '../errors'
import { PayloadArray } from './PayloadArray'
import { Payload } from './Payload'
import type { TransformOptions } from 'stream'
import type { Logger } from '../types'

export interface ApplianceSettings extends TransformOptions {
	logger?: Logger;
	inputTypeFilter?: string[];
	outputTypeFilter?: string[];
}

// This nasty little type exists because TypeScript doesn't make it easy to specify
// class types that are restricted to non-abstract implementations of an abstract class.
// See this conversation for more information: https://github.com/microsoft/TypeScript/issues/33235
// The "Pick" portion of this keeps all static aspects of AbstractAppliance while discarding the
// abstract constructor signature.  The "new" portion indicates that constructor must exist.
export type ImplementedApplianceClass = (
	Pick<typeof AbstractAppliance, keyof typeof AbstractAppliance>
	& (new (settings?: ApplianceSettings) => AbstractAppliance)
)

export abstract class AbstractAppliance extends Transform {
	protected static readonly inputTypes?: string[]

	protected static readonly outputTypes?: string[]

	private payloads = new PayloadArray()

	readonly settings: ApplianceSettings

	#currentOrigin?: string

	public constructor(
		settings: ApplianceSettings = {},
	) {
		super({
			...settings,
			objectMode: true,
			transform: (chunk: Payload, encoding, callback) => {
				this.ingestPayload(chunk)
					.then(() => callback())
					.catch((error: unknown) => {
						if (error instanceof Error) {
							callback(error)
						} else {
							callback(new ProcessingError('The Appliance experienced an issue while processing the payload and failed to throw an Error with additional context.'))
						}
					})
			},
		})
		if ((this.constructor as typeof AbstractAppliance).inputTypes === undefined) {
			throw new AbstractImplementationError('Derivations of AbstractAppliance must define the inputTypes property.')
		}
		if ((this.constructor as typeof AbstractAppliance).outputTypes === undefined) {
			throw new AbstractImplementationError('Derivations of AbstractAppliance must define the outputTypes property.')
		}
		this.settings = settings
	}

	/**
	 * Checks to ensure that all necessary configuration and resources have been set up properly.
	 *
	 * If anything is missing or misconfigured the appliance should log an error explaining the
	 * corrective steps and return false.
	 *
	 * @return {boolean} Whether the dependencies and configurations properly exist.
	 */
	public abstract healthCheck(): Promise<boolean>

	/**
	 * Checks if a given payload is valid input for this appliance.
	 *
	 * @param  {Payload} payload The payload that we want to validate.
	 * @return {boolean}         The result of the validation check.
	 */
	public abstract checkPayload(payload: Payload): Promise<boolean>

	/**
	 * Prepares the Appliance to process data and starts data processing.
	 *
	 * @return {boolean} Whether the appliance successfully started.
	 */
	public abstract start(): Promise<boolean>

	/**
	 * Stops the appliance from processing data and cleans up the appliance.
	 *
	 * @return {boolean} Whether the appliance successfully stopped.
	 */
	public abstract stop(): Promise<boolean>

	/**
	 * Invokes the appliance on unprocessed data.
	 * This generally should not be called directly, but rather Payloads should be passed to the
	 * Appliance using the ingestPayload method.
	 *
	 * @param {PayloadArray} payloads A PayloadArray containing Payloads that should be processed.
	 * @return {PayloadArray}         Leftover Payloads that still need to be processed.
	 */
	protected abstract invoke(payloads: PayloadArray): Promise<PayloadArray>

	/**
	 * Called to pass data into the appliance. If the payload is valid, it is added
	 * to the buffer and the appliance is invoked.
	 *
	 * @param  {Payload} payload The payload to be ingested.
	 * @throws {AssertionError} when passed an invalid payload for this appliance.
	 */
	public async ingestPayload(payload: Payload): Promise<void> {
		const payloadIsValid = await this.checkPayload(payload)
		if (!payloadIsValid) {
			throw new ValidationError('Payload does not satisfy appliance ingestion conditions.')
		}
		this.payloads.insert(payload)
		this.#currentOrigin = payload.origin
		const remainingPayloads = await this.invoke(this.payloads)
		this.payloads = remainingPayloads
	}

	public push(payload: Payload): boolean {
		const origin = (payload.origin === undefined)
			? this.#currentOrigin
			: payload.origin

		return super.push(new Payload({
			...payload,
			origin,
		}))
	}

	public static getOutputTypes(settings: ApplianceSettings = {}): string[] {
		if (this.outputTypes === undefined) {
			throw new AbstractImplementationError('Derivations of AbstractAppliance must define the outputTypes property.')
		}
		return this.outputTypes.filter((outputType) => (
			settings.outputTypeFilter === undefined
			|| settings.outputTypeFilter.includes(outputType)
		))
	}

	public static getInputTypes(settings: ApplianceSettings = {}): string[] {
		if (this.inputTypes === undefined) {
			throw new AbstractImplementationError('Derivations of AbstractAppliance must define the outputTypes property.')
		}
		return this.inputTypes.filter((inputType) => (
			settings.inputTypeFilter === undefined
			|| settings.inputTypeFilter.includes(inputType)
		))
	}
}
