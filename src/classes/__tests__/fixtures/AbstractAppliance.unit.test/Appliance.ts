import { PayloadArray } from '../../../PayloadArray'
import { AbstractAppliance } from '../../../AbstractAppliance'

// This is a dummy class simply for testing.  We aren't using "this" anywhere and we aren't using
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */

export class Appliance extends AbstractAppliance {
	protected static inputTypes: string[] | undefined = [
		'inputFoo1',
		'inputFoo2',
	]

	protected static outputTypes: string[] | undefined = [
		'outputFoo1',
		'outputFoo2',
	]

	public override async healthCheck(): Promise<boolean> {
		return true
	}

	public override async checkPayload(): Promise<boolean> {
		return true
	}

	public override async start(): Promise<boolean> {
		return true
	}

	public override async stop(): Promise<boolean> {
		return true
	}

	public override async invoke(payloadArray: PayloadArray): Promise<PayloadArray> {
		return new PayloadArray()
	}
}
