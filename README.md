# FABR Cloud Bind

## Problem

Application code needs to be bound to backend services like DBs, Cache, or other services. Unless a project is using a fullstack framework of somekind like RedwoodJS or a fullstack PaaS, binding application code to backend infra involves manual work. It's a pain at best to do it securely and daunting at worst if you aren't familiar with infra strucuture, secret stores etc. Hours and days could get burt setting up and troubleshooting. The developer experience accessing these are clunky. If a secret needs changing that involves a bunch of copypasting. Many smaller systens don't need the complexity of sophisticated service discovery and centralise authentication.

Projects like Winglang and Darklang strongly beleive that this problem can only be solved by developing a new application programming langugage with infra as first class constructs. Several other like Klotho and Encore.dev are using code annotations. Collectively this category is labelled Infra from Code (IfC). As I understand it, all of these tighly couple the deployment life cycle of the app code wtih infra (fact check) and is a fundamentally flawed approach. For one infra in stateful and app code shouldn't be. Also, unless this layer can completely gurantee cost and performance optimised infra customisation is required. Many organisations will continue to opt for a central infra team managing the platform. So they need to be able to define the details of the infra implementation.

Yet develops should have an experience that feels like infra is first class in app code. Code annotation aren't a great experience IMO. It is better becuase it's inline with code avoiding having to context switch out into a completely differnt stack. But it's second class still interms of programming languge, IDE integration etc. Winglangs approach is interesting. But I'm not sure if it's over engineering. It's quite possible I'm not seeing it yet. Did I think the same of CDK at first? sort of.

The three main IfC approaches:

- new programming language like Winglang and Darklang
- Langugage annotations like Envcore.dev, Klotho, and Shuttle
- SDK/Library like Ampt and Nitric

I believe it's better and simpler to derive the bind code from infra. For one this makes backward compatibility with declerative IaC more practical. This is closer to the SDK approach. But we aren't trying create an abstraction over the cloud resources them selves which is what all the IfC products are doing. Now you are back to lockin land unless there's an escape hatch, which I'm sure many of them have.

We should dig a bit more into how these frameworks work under the hood. iirc Elad @ Winglang also mention a library approach by somebody that had nuanced issues.

## User Story

App devs can very simply and intuitively write code connecting to backends like DBs, Cache, Search etc without manually searching for and hooking up endpoint addresses and secrets.

- client lib are generated from a json file (meeting a spec)
- client lib generation need to support multiple popular app langs like TypeScript, Python, Java, C#, PHP, Ruby, Rust, and Golang
- Support incremental adoption so don't invent a new language. Users should be able to adopt this without CDF even. spec extends CDF but can be standalone. E.g. Vanilla cdk code can generate json
- Works in simple environments with static endpoint/connection string. Also with service discovery.

## Solution

Parameter/secrets are input via a json file that conforms to something like the following interface. If `isSecret=true` value contains a ref to the secret store key.

```typescript
export interface IFabrOutput {
  [name: string]: {
    value: string,
    isSecret: boolean,
  }
}
```

The code genrator logic itself will be written in TypeScript. It will take `fabr.outputs.json` as input. Tempate for libraries will be developed using handlebar.js tempalating language. Then use the handlebar engine to do the heavy lifting.

The end result is a class with an interface that looks like:

```typescript
export class MySecrets extends Secrets {
  database1() {
    return this.getSecret("database1");
  }
}
```

```typescript
  new MySecrets(new FakeSecretService()).database1();
```

Adapters for secret stores need to be implemented confirming to an interface like bellow. If we bundle some is TBD, probably makes sense to have a few popular ones. The secret store service argument is optional to allow user to choose if they want application code coupled directly to the secret store external service or not by using environment variable. In the latter case it's possible to use this library either inline in CD runs to pull the secrets or during CI/CD pipline setup IaC for example save values into GH secrets / params.

```typescript
interface ISecretStore {
  getSecret(key: string): string;
}
```

See `/sample-output/binding.ts` for the abstract class and secret service implementation prototype.