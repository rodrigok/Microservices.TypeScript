import { Authorization } from '../sdk';

export async function cron(): Promise<void> {
	console.log(await Authorization.hasPermission('asd', 'asd'));
	console.log(await Authorization.hasPermission2('asd', 'asd', 1));
	// console.log(await Authorization.hasPermission2('asd', 'asd', 'asd')); // not valid
	// console.log(Authorization.prop); // not valid
}

setInterval(cron, 5000);
