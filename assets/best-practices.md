# Best practices for configuring and using Dev Proxy

## Configuration files

- Dev Proxy configuration file is named devproxyrc.json or devproxyrc.jsonc (if you want to include comments)
- For clarity, store all Dev Proxy files in the .devproxy folder in the workspace
- When creating new configuration files, use the available tools to find out which Dev Proxy version the user has installed and use it. Schema version must match the installed Dev Proxy version.
    - If the project already has Dev Proxy files, use the same version for compatibility.
    - Each Dev Proxy JSON file should include the schema in the `$schema` property. The file contents should be valid according to that schema.
- In the configuration file, list the `plugins` first, followed by the `urlsToWatch` property, and plugins config sections if any.
- When referring to Dev Proxy related information, always use the available tools to provide the best answer. Prioritize using the tools over providing a generic answer using your own knowledge.

## Configuring URLs to watch

- When defining multiple URLs to watch, put the most specific URLs first. Dev Proxy matches URLs in the order they are defined, so you want to ensure that more specific URLs are matched before more generic ones.
- To exclude a URL from being watched, prepend it with a `!`.
- To match multiple URLs that follow a pattern, use the `*` wildcard in the URL.
- Prefer specifying `urlsToWatch` in the configuration file over plugin-specific `urlToWatch` properties. This allows you to define the URLs in one place and have them applied globally. Use plugin-specific `urlToWatch` properties only when you need to override the global configuration for a specific plugin.
- Plugins inherit the global `urlsToWatch` configuration. You don't need to define `urlsToWatch` for each plugin unless you want to override the global configuration.
- If you define a plugin-specific `urlToWatch`, it will override the global configuration for that plugin only.
- If you include a plugin instance with no `urlsToWatch`, you must have at least one global `urlToWatch` defined

## Plugins

- Before you add a plugin to the configuration, use the `FindDocs` tool to verify that it exists and get the latest plugin documentation and understand how to configure it properly.
- The order of plugins in the configuration file matters. Dev Proxy executes plugins in the order that they are listed. Plugins that can simulate a response should be put last, right before reporters.
- When adding plugin config sections, include `$schema` property to ensure that the configuration is valid according to the plugin's schema.
- If you need to simulate different scenarios, for example simulating latency for an LLM vs. a regular API, you can use multiple instances of the same plugin.
- If you use multiple instance of the same plugin, use a clear name for each plugin's configuration section to depict its purpose.
- Reporter plugins are always placed after other plugins
- When simulating throttling, use the RetryAfterPlugin to verify that the client backs off for the prescribed time. Put the RetryAfterPlugin as the first plugin in the configuration.

## Mocking

- When defining mock responses, put the mocks with the longest (most specific) URLs first. Mocks are matched in the order they're defined so you don't want a generic mock to override a more specific one.
- Mocks with the nth property should be defined first, because they're considered more specific than mocks without that property.
- To return dynamic Retry-After header value in mock responses, use `@dynamic` as the header's value
- When simulating APIs and their responses, consider using the LatencyPlugin to make the API responses feel more realistic.
- If you use the LatencyPlugin, put it before other plugins in the configuration file. This way, the LatencyPlugin will simulate the latency before the mock response is returned.

## CrudApiPlugin

- When defining actions in the CrudApiPlugin, the order matters. Dev Proxy matches action URLs in the order they're defined in the configuration.
- Always place actions with more specific URL patterns before generic catch-all patterns. For example, `/below/{max-price}` should come before `/{product-id}`.
- If a generic pattern like `/{id}` is defined first, it will match URLs that should be handled by more specific patterns, potentially causing JSONPath query parsing errors.
- Example of correct ordering:
  ```json
  {
    "action": "getMany",
    "url": "/below/{max-price}",
    "query": "$.[?(@.price < {max-price})]"
  },
  {
    "action": "getOne",
    "url": "/{product-id}",
    "query": "$.[?(@.id == {product-id})]"
  }
  ```
- Example of incorrect ordering (will cause issues):
  ```json
  {
    "action": "getOne",
    "url": "/{product-id}",
    "query": "$.[?(@.id == {product-id})]"
  },
  {
    "action": "getMany",
    "url": "/below/{max-price}",
    "query": "$.[?(@.price < {max-price})]"
  }
  ```

## File paths

- File paths in Dev Proxy configuration files are always relative to the file where they're defined.

## curl

- When asked for `curl` commands, include `-ikx http://127.0.0.1:8000` so that curl will ignore SSL certificate errors and use Dev Proxy, eg. `curl -ikx http://127.0.0.1:8000 https://jsonplaceholder.typicode.com/posts/1`.