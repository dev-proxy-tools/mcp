Best practices for configuring and using Dev Proxy:

- Dev Proxy configuration file is named devproxyrc.json or devproxyrc.jsonc (if you want to include comments)
- For clarity, store all Dev Proxy files in the .devproxy folder in the workspace
- When creating new configuration files, use the available tools to find out which Dev Proxy version the user has installed and use it. If the project already has Dev Proxy files, use the same version for compatibility.
- The order of plugins in the configuration file matters. Dev Proxy executes plugins in the order that they are listed. Plugins that can simulate a response should be put last, right before reporters.
- You can use multiple instances of the same plugin, each with a different configuration to target a different scenario. Use a clear name for each plugin's configuration section to depict its purpose.
- Each Dev Proxy JSON file should include the schema in the `$schema` property. The file contents should be valid according to that schema.
- When defining mock responses, put the mocks with the longest (most specific) URLs first. Mocks are matched in the order they're defined so you don't want a generic mock to override a more specific one.
- Mocks with the nth property should be defined first, because they're considered more specific than mocks without that property.
- Reporter plugins are always placed after other plugins
- If you include a plugin instance with no `urlsToWatch`, you must have at least one global `urlToWatch` defined
- To exclude a URL from being watched, prepend it with a `!`.
- To match multiple URLs that follow a pattern, use the `*` wildcard in the URL.
- When simulating throttling, use the RetryAfterPlugin to verify that the client backs off for the prescribed time. Put the RetryAfterPlugin as the first plugin in the configuration.
- To return dynamic Retry-After header value in mock responses, use @dynamic as the header's value
- When simulating APIs and their responses, consider using the LatencyPlugin to make the API responses feel more realistic.
- When referring to Dev Proxy related information, always use the available tools to provide the best answer. Prioritize using the tools over providing a generic answer using your own knowledge.
