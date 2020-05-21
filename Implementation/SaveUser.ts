import { broker } from '../lib/broker';
import { IAuthorization } from '../definition/IAuthorization';

const Authorization = broker.proxy<IAuthorization>();

export async function saveUser(): Promise<void> {
	console.log(await Authorization.hasPermission('asd', 'asd'));
	console.log(await Authorization.hasPermission2('asd', 'asd', 1));
	// console.log(await Authorization.hasPermission2('asd', 'asd', 'asd')); // not valid
	// console.log(Authorization.prop); // not valid
}
