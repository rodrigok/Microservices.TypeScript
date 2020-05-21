import { ServiceBroker } from 'moleculer';

import { BaseBroker } from './BaseBroker';

export class RemoteBroker extends BaseBroker {
	private broker = new ServiceBroker();

	private started: Promise<void>;

	constructor() {
		super();
		this.started = this.broker.start();
	}

	register(name: string, method: Function): void {
		this.log('registering', name);
		this.broker.createService({
			name,
			actions: {
				call(ctx): any {
					return method(...ctx.params);
				},
			},
		});
	}

	async call(method: string, data: any): Promise<any> {
		this.log('calling', method);
		await this.started;
		return this.broker.call(`${ method }.call`, data);
	}
}
