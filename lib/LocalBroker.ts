import { BaseBroker } from './BaseBroker';

const delay = (ms: number): Promise<number> => new Promise((resolve) => setTimeout(resolve, ms));

export class LocalBroker extends BaseBroker {
	private methods = new Map<string, Function>();

	register(name: string, method: Function): void {
		this.log('registering', name);
		this.methods.set(name, method);
	}

	async call(method: string, data: any): Promise<any> {
		this.log('calling', method);
		// Simulate network;
		await delay(500);
		const result = this.methods.get(method)?.(...data);
		await delay(500);
		return result;
	}
}
