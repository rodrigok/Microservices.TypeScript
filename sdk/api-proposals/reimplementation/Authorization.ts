import { broker } from '../../broker';
import { IAuthorization } from '../../definition/IAuthorization';
import { Prom } from '../../definition/Types';

export class AuthorizationClass implements Prom<IAuthorization> {
	hasPermission(permission: string, user: string): Promise<boolean> {
		return broker.call('hasPermission', [permission, user]);
	}

	hasPermission2(permission: string, user: string, bla: number): Promise<number> {
		return broker.call('hasPermission2', [permission, user, bla]);
	}
}
