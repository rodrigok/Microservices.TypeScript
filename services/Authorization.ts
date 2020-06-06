import { broker } from '../sdk/broker';
import { IAuthorization } from '../sdk/definition/IAuthorization';

// Register as class
class Authorization implements IAuthorization {
	hasPermission(permission: string, user: string): boolean {
		console.log('hasPermission called');
		return permission === 'createUser' && user != null;
	}

	hasPermission2(permission: string, user: string, bla: number): number {
		console.log('hasPermission2 called');
		return permission === 'createUser' && user != null && bla === 1 ? 1 : 0;
	}
}

broker.registerInstance(new Authorization());

// Register as object
// const Authorization: IAuthorization = {
// 	hasPermission(permission: string, user: string): boolean {
// 		console.log('hasPermission called');
// 		return permission === 'createUser' && user != null;
// 	},

// 	hasPermission2(permission: string, user: string, bla: number): number {
// 		console.log('hasPermission2 called');
// 		return permission === 'createUser' && user != null && bla === 1 ? 1 : 0;
// 	},
// };

// broker.registerInstance(Authorization);
