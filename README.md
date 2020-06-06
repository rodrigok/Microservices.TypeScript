# Micro-Services Interface proposal

## Introduction

This repository contains example of a microservices implementation using TypeScript and Moleculer.

The implementation was made using Classes, of course it doesn't need to follow this as a rule, the broker registration accepts raw objects or functions directly, but all the principles remains the same for all the example and both proposals.

## Structure

* `/sdk` -> Shared files among all services containing the interfaces and APIs for communication
  * `broker` -> Used to register and call remote methods
  * `definition` -> TypeScript Interfaces for the modules
  * `api-proposals` -> 2 different proposals of how to implement the APIs
* `/services` -> Sample services using the SDK to register and call methods

### API Proposals

This repository implements 2 proposals on how to register APIs inside the SDK to be called by the modules. The common reason for those proposals is keep the typings provided by TypeScript available when calling methods from remote modules. It does not validade the data transmitted but allow the compiler to validate the code and help on refactors or with a better autocomplete while developing.

#### Proposal 1: Proxy

This implementation uses [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to intercept any method call to an empty object and call the broker passing the method's name and parameters, since it's an abstraction it does not require to re implement all the methods. The forced typecast using TypeScript foce this empty object to be interpreted as an implementation of the informed Interface allowing the compiler to type check the usage and editors to help with auto complete.

Check `/sdk/api-proposals/proxy/`

Positive points
* Do not require to keep a seconde implementation only to call the broker
* Reduce the maintenance of the code
* Easy to implement the APIs
* Error free

Negative points
* Autocomplete only helps when using and Code Editor, a browser autocomplete will not help for example since there is no real class or function to call
* More abstract to understand how it works

Example
```typescript
import { IAuthorization } from '../../definition/IAuthorization';
import { proxify } from './proxify';

export const Authorization = proxify<IAuthorization>();
```

#### Proposal 2: Re-implementation of the interface

This implementation requires the Interfaces and re implement them to export them as APIs. The implementation is required just to call the broker.call method. Unfortunately it's necessary to reinform the method name as a string and the parameters as well, since this part is not checked by the compiler it may lead to errors.

Check `/sdk/api-proposals/implementation/`

Positive points
* It's normal JS classes or functions
* Easy to understand how it works

Negative points
* Require to re implement the interfaces for every method just to call the broker
* Increase the maintenance of refactors
* Boring to implement the APIs
* Need to inform method and parameters manually (not type check safe)

Example
```typescript
import { broker } from '../../broker';
import { IAuthorization } from '../../definition/IAuthorization';
import { Prom } from '../../definition/Types';

class AuthorizationClass implements Prom<IAuthorization> {
	hasPermission(permission: string, user: string): Promise<boolean> {
		return broker.call('hasPermission', [permission, user]);
	}

	hasPermission2(permission: string, user: string, bla: number): Promise<number> {
		return broker.call('hasPermission2', [permission, user, bla]);
	}
}

export const Authorization = new AuthorizationClass();
```

## How to test

### Before

There are 2 config files that affects how this example works.

`/skd/broker/index.ts` control if it calls an in memory broker or uses the moleculer module. It's configure to use the remote (moleculer) module via TCP by default, that config should work for both monolit or micro-services execution. The in memory broker does not work for the micro-services execution.

`/sdk/index.ts` controls which proposal will be used, just swipe the commented one to test both.

### Running

To run all the micro-services as a single process:
```shell
npm run monolit
```

To run each service as a separated process
```shell
npm run authorization
npm run cron
```
