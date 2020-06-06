export type FunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type Prom<T> = {
	[K in FunctionPropertyNames<T>]: ReturnType<T[K]> extends Promise<any> ? T[K] : (...params: Parameters<T[K]>) => Promise<ReturnType<T[K]>>;
}
