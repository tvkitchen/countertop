import {
	AbstractAppliance,
} from '../../classes/AbstractAppliance'
import { BaseMockAppliance } from './BaseMockAppliance'
import type {
	ApplianceSettings,
	ImplementedApplianceClass,
} from '../../classes/AbstractAppliance'

// We truly want this utility type to work with functions having *any* types of
// Paramters or ReturnType, which is why we have to use `any` here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionSignature<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>

interface MockableApplianceAttributes {
	inputTypes?: string[];
	outputTypes?: string[];
	healthCheck?: FunctionSignature<AbstractAppliance['healthCheck']>;
	start?: FunctionSignature<AbstractAppliance['start']>;
	stop?: FunctionSignature<AbstractAppliance['stop']>;
	invoke?: FunctionSignature<AbstractAppliance['invoke']>;
	checkPayload?: FunctionSignature<AbstractAppliance['checkPayload']>;
}

/**
 * Creates a mock appliance class
 *
 * @return {Class}                        The resulting mock class.
 */
export const generateMockAppliance = (
	attributes: MockableApplianceAttributes = {},
): ImplementedApplianceClass => class extends BaseMockAppliance {
	static inputTypes = attributes.inputTypes

	static outputTypes = attributes.outputTypes

	constructor(settings?: ApplianceSettings) {
		super(settings)
		this.healthCheck = (attributes.healthCheck ?? this.healthCheck).bind(this)
		this.checkPayload = (attributes.checkPayload ?? this.checkPayload).bind(this)
		this.start = (attributes.start ?? this.start).bind(this)
		this.stop = (attributes.stop ?? this.stop).bind(this)
		this.invoke = (attributes.invoke ?? this.invoke).bind(this)
	}
	/* eslint-enable @typescript-eslint/unbound-method */
}
