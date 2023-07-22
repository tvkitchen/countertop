import { AbstractAppliance } from '../../classes/AbstractAppliance'
import { PayloadArray } from '../../classes/PayloadArray'
import type { Payload } from '../../classes/Payload'

// This is used to construct mocked classes for testing.
// We need to be able to create useless implementations of methods.
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */

export class BaseMockAppliance extends AbstractAppliance {
	static inputTypes?: string[] = []

	static outputTypes?: string[] = []

	public override async healthCheck(): Promise<boolean> {
		return true
	}

	public override async checkPayload(payload: Payload): Promise<boolean> {
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
