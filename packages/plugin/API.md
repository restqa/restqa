# API

If you're familiar with TypeScript you could check the `index.d.ts`.

> 💡 Note: If you're not familiar with step definition, hooks and state (world), you should take a look into the [Cucumber documentation](https://cucumber.io/docs/cucumber/step-definitions/).

Where `const pf = new PluginFactory("your-plugin-name")`;

## pf.name: string

Return the plugin name.

## pf.addState(key: string, value: any): PluginFactory

Add a state property to the current state. You can consume it in your handlers using this API:
```js
cons state = this.state.key;
```

## pf.addGivenStep(stepDefinition: string, handler: (...args: any[]), description: string, tags?: string[]): PluginFactory

Add a Given step.

> 💡 Note: all handler functions **SHOULD BE** function expressions and **NOT** arrow functions (aiming to access to this).

## pf.addWhenStep(stepDefinition: string, handler: (...args: any[]), description: string, tags?: string[]): PluginFactory

Add a When step.

## pf.addThenStep(stepDefinition: string, handler: (...args: any[]), description: string, tags?: string[]): PluginFactory

Add a Then step.

## pf.addBeforeHook(handler: (...args: any[]): PluginFactory

Add a Before hook.

If you want to use tags you could use these interfaces:
- pf.addBeforeHook(tags: string, handler: (...args: any[]): PluginFactory
- pf.addBeforeHook(options: { tags: string }, handler: (...args: any[]): PluginFactory

## pf.addAfterHook(handler: (...args: any[]): PluginFactory

Add a After hook.

If you want to use tags you could use these interfaces:
- pf.addAfterHook(tags: string, handler: (...args: any[]): PluginFactory
- pf.addAfterHook(options: { tags: string }, handler: (...args: any[]): PluginFactory

## pf.addBeforeAllHook(handler: (...args: any[]): PluginFactory

Add a BeforeAll hook.

## pf.addAfterAllHook(handler: (...args: any[]): PluginFactory

Add a AfterAll hook.

## this.getConfig(pluginName: string): {[key: string]: any} - (only in handlers)

Return the plugin config. (We use the plugin name to avoid collision in case of multiple plugins)