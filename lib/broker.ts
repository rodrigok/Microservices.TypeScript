type F = (...args: any) => any;

type FunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type Prom<T> = {
	[K in FunctionPropertyNames<T>]: ReturnType<T[K]> extends Promise<any> ? T[K] : (...params: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
}

const delay = (ms: number): Promise<number> => new Promise((resolve) => setTimeout(resolve, ms));

class Broker {
	private methods = new Map<string, F>();

	private log(...args): void {
		console.log('BROKER:', ...args);
	}

	register(name: string, method: F): void {
		this.log('registering', name);
		this.methods.set(name, method);
	}

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

	async call(method: string, data: any): Promise<any> {
		this.log('calling', method);
		// Simulate network;
		await delay(500);
		const result = this.methods.get(method)?.(...data);
		await delay(500);
		return result;
	}

	proxy<T>(): Prom<T> {
		return new Proxy({}, this.handler()) as unknown as Prom<T>;
	}
}

export const broker = new Broker();
