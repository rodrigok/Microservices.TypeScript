import { Prom } from '../../definition/Types';
import { broker } from '../../broker/index';

function handler<T extends object>(): ProxyHandler<T> {
	return {
		get: (target: object, prop: string): any => (...params: any): Promise<any> => broker.call(prop, params),
	};
}

export function proxify<T>(): Prom<T> {
	return new Proxy({}, handler()) as unknown as Prom<T>;
}
