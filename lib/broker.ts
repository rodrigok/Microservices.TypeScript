type F = (...args: any) => any;

type FunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type Prom<T> = {
	[K in FunctionPropertyNames<T>]: ReturnType<T[K]> extends Promise<any> ? T[K] : (...params: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
}


class Broker {
	private methods = new Map<string, F>();

	register(name: string, method: F): void {
		console.log('registering', name);
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

	handler<T extends object>(): ProxyHandler<T> {
		return {
			get: (target: object, prop: string, receiver: any): any => {
				console.log('get', { target, prop, receiver });

				return (...params: any): Promise<any> => this.call(prop, params);
			},
		};
	}

	async call(method: string, data: any): Promise<any> {
		console.log('calling', method, { exists: this.methods.has(method) });
		return this.methods.get(method)?.(...data);
	}

	proxy<T>(): Prom<T> {
		return new Proxy({}, this.handler()) as unknown as Prom<T>;
	}
}

export const broker = new Broker();
