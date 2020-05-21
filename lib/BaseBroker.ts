type FunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type Prom<T> = {
	[K in FunctionPropertyNames<T>]: ReturnType<T[K]> extends Promise<any> ? T[K] : (...params: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
}


export abstract class BaseBroker {
	protected log(...args): void {
		console.log('BROKER:', ...args);
	}

	abstract register(name: string, method: Function): void;

	registerInstance(instance: object): void {
		for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
			if (method === 'constructor') {
				continue;
			}
			const i = instance as any;
			this.register(method, i[method]);
		}
	}

	private handler<T extends object>(): ProxyHandler<T> {
		return {
			get: (target: object, prop: string): any => (...params: any): Promise<any> => this.call(prop, params),
		};
	}

	abstract async call(method: string, data: any): Promise<any>;

	proxy<T>(): Prom<T> {
		return new Proxy({}, this.handler()) as unknown as Prom<T>;
	}
}
