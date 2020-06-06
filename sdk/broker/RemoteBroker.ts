import { ServiceBroker } from 'moleculer';

import { BaseBroker } from './BaseBroker';

export class RemoteBroker extends BaseBroker {
	private broker = new ServiceBroker({
		transporter: 'TCP',
	});

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

	async call(service: string, data: any): Promise<any> {
		const method = `${ service }.call`;
		this.log('calling', method);
		await this.started;
		await this.broker.waitForServices(service);
		return this.broker.call(method, data);
	}
}
