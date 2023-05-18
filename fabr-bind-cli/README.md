# FABR Cloud Bind (Preview)

## Problem

Application code needs to be bound to backend services like DBs, Cache, or other services. Unless a project is using a fullstack framework of somekind like RedwoodJS or a fullstack PaaS, binding application code to backend infra involves manual work. It's a pain, at best, to do it securely and daunting at worst if you aren't familiar with infra strucuture, secret stores etc. Hours and days could get burt setting up and troubleshooting. The developer experience accessing these are clunky. If a secret needs changing that involves a bunch of copypasting. Many smaller systens don't need the complexity of sophisticated service discovery and centralise authentication. No one step is complicated but all of them together is time consuming. Most importantly this is undifferentiated work i.e. your customrs don't care.

Is this actually a burning problem?
How do you currently configure your application with details about various backends?
How time consuming and error prone is it?

## User Story

App devs can very simply and intuitively write code connecting to backends like DBs, Cache, Search etc without manually searching for and hooking up endpoint addresses and secrets.

## Principles

- Support incremental adoption - Users should be able to adopt this without CDF even. spec extends CDF but can be standalone. E.g. Vanilla cdk code can generate json or even hand roll a json file (even though this contradicts the user story the option for incremental adoption is very important).
- Not a third-party dependency - client lib are generated from a json file (meeting a spec)
- Support multiple languages - client lib generation need to support multiple popular app langs like TypeScript, Python, Java, C#, PHP, Ruby, Rust, and Golang
- Works in simple environments with static endpoint/connection string. Also with service discovery for more complicated use cases.

## Solution Design

### `params.fabr.json` (name TBD)

Parameter/secrets are input via a json file that conforms to something like the following interface. If `isSecret=true` value contains a ref to the secret store key. This is part of the API so user facing. On day one this interface implementation will be intented for internal use in the code gen tool and shared in user docs. In the future it might be useful to document interfaces in other languages, as a helper, for people to copy and paste so they can automate output file generation in the language of their choice.

```typescript
export interface IFabrParams {
  [key: string]: {
    value: string,
    isSecret: boolean,
  }
}
```

```json example params.fabr.json
{
  "database1": {
    "value": "database1secretkey",
    "isSecret": true
  },
  "api1": {
    "value": "https://api1.fabrdemo.com",
    "isSecret": false
  }
}
```

### Code Gen

The code genrator logic itself will be written in TypeScript. It will take `params.fabr.json` as input. Templates for libraries will be developed using the handlebar.js tempalating framework. Then use the handlebar engine to do the heavy lifting.

The base lib source like for the `Secrets` class should be coped into the bundle as part of the build step.

The end result is a class with an interface that looks like:

```typescript 
export class MySecrets extends Secrets {
  database1() { // 'key' from the params.fabr.json file 
    return this.getSecret("database1");
  }
}
```

```typescript example usage in application code
  import {MySecrets, MyParams } from './fabr-bind';
  const db1ConnectionString = new MySecrets(new FakeSecretService()).database1();
  const api1Endpoint = MyParams.api1;
```

`Secrets` abstract class - given the principle of avoiding third party deps we should try including this code in the generated client as opposed to an installed dependency. As long as we have integration tests there shouldn't be any wierd build time issues for users. This cloud be far simpler than managing package versions and upgrades. However if we need to version the abstract class and secret store adaptors things get more complicated. How do we distribute? One approah would be to peg the whole lot to the version of the generator cli.

## Secret Store Service Adaptors

Adapters for secret stores need to be implemented conforming to an interface like bellow. If we "bundle" some implementations is TBD, probably makes sense to have a few popular ones. The third-party dependency point applies and we cannot reasonably avoid cloud provider SDKs. Options:

- publish as a separate library in respective package registries
- publish as copypaste examples in a repo.

The secret store service argument is optional to allow user to choose if they want application code coupled directly to the secret store external service or not by using environment variable. In the latter case it's possible to use this library either inline in CD runs to pull the secrets or during CI/CD pipline setup IaC for example save values into GH secrets / params.

```typescript TBD
interface ISecretStore {
  getSecret(key: string): string;
}
```

See `/sample-output/binding.ts` for the abstract class and secret service implementation prototype.

Notes:

- Safely pass env vars to containter - this is a CD concern but and important one that is worth documenting. Maybe we can provide helper that can be used in CD.

>if you don't want to have the value on the command-line where it will be displayed by ps, etc., -e can pull in the value from the current environment if you just give it without the =

## CLI

`fabr-bind <command> <args> <options>`

- command: `client-gen` generates a client library with a class that binds to the param values (both secret and none-secrets). Secrets are not embeded. Includes a copy of the params file.
  - `[name]` (optional) name used for the class generated. Defaults to 'MySecrets'
  - `--language typescript` in the future golang | python | csharp | java
  - `--params-file` path to FABR format params file that conforms to the IFabrParams interface
  - `--secret-service` (optional) name of one of the support secret services. If omitted no secret service adpators are included with the client. You have to provide your own.

- command: `set-env` grabs the values from the secret store and sets them as environment variable. We need to know which secret store and how to auth. This typically for CI/CD pipelines, used to pass values securely env vars while decoupling the application from the secret store sevice for improved static stability.
  - `--params-file` path to FABR format params file that conforms to the IFabrParams interface
  - `--secret-service`

## Why choose TypeScript for the implementation?

At this point I don't see any advantage to using another language. TypeScript seems as good as any and it's what I'm most versed in at the moment, hence can be the most productive. If you know a reason like, lang X has a much better lib or tool chain to solve this sort of problem, hit me up. NPM is easy enough cross OS distribution mechanism for the CLI. I think most people have node installed.

## Alternatives

doppler.com - is a platform specifically around syncing secrets between systems. This is the closest I've come across that directly address this problem. The secrets portion definitely overlaps but this still leaves some glue to hook things up.

The other approach that eleminates this class of problem is Infra from Code as below and vertically integrated fullstack frameworks RedwoodJS. However they involve you making a much larger architectural change.

Projects like Winglang and Darklang strongly beleive that this problem can only be solved by developing a new application programming langugage with infra as first class constructs. Several other like Klotho and Encore.dev are using code annotations. Collectively this category is labelled Infra from Code (IfC). As I understand it, all of these tighly couple the deployment life cycle of the app code wtih infra (fact check) and is a fundamentally flawed approach. For one infra in stateful and app code shouldn't be. Also, unless this layer can completely gurantee cost and performance optimised infra customisation is required. Many organisations will continue to opt for a central infra team managing the platform. So they need to be able to define the details of the infra implementation.

Yet develops should have an experience that feels like infra is first class in app code. Code annotation aren't a great experience IMO. It is better becuase it's inline with code avoiding having to context switch out into a completely differnt stack. But it's second class still interms of programming languge, IDE integration etc. Winglangs approach is interesting. But I'm not sure if it's over engineering. It's quite possible I'm not seeing it yet. Did I think the same of CDK at first? sort of.

The three main IfC approaches:

- new programming language like Winglang and Darklang
- Langugage annotations like Envcore.dev, Klotho, and Shuttle
- SDK/Library like Ampt and Nitric

I believe it's better and simpler to derive the bind code from infra. For one this makes backward compatibility with declerative IaC more practical. This is closer to the SDK approach. But we aren't trying create an abstraction over the cloud resources them selves which is what all the IfC products are doing. Now you are back to lockin land unless there's an escape hatch, which I'm sure many of them have.

We should dig a bit more into how these frameworks work under the hood. iirc Elad @ Winglang also mention a library approach by somebody that had nuanced issues.

## User Guide

### app side

- install cli `npm i fabr-bind`
- change into the root of your app source code folder e.g. `src`
- run `fabr-bind client-gen --language=typescript --params-file=./params.fabr.json`
  - this will generate the fabr-bind client library source code in the a folder called `fabr-params`.
  - import and use in your application code as follow.
- TODO: figure out runtime authN/Z to the secret store. Maybe to start with only support secret stores in the same environment/context as the app code runtime. Look into Hashi Vault auth.

```typescript example usage in application code
  import {MySecrets, MyParams } from './fabr-bind';
  const db1ConnectionString = new MySecrets(new FakeSecretService()).database1();
  const api1Endpoint = MyParams.api1;
```

### IaC side

- generate a `params.fabr.json` with refs to secrets and other param values.
- in the future we will provide helpers to help with this for imperative IaC.

## Development

- `client-templates` - language specific templates used to generate idiomatic client class that's consumes in application code.
- `libs-src` - language specific secrets base library, types, and secrets store servie implementations.
- `src` - CLI source code.

TODO: source from bucket option. 