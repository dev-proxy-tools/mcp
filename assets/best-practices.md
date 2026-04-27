# Best practices for configuring and using Dev Proxy

## Configuration files

- Dev Proxy configuration file is named devproxyrc.json or devproxyrc.jsonc (if you want to include comments)
- Dev Proxy also supports YAML configuration files named devproxyrc.yaml or devproxyrc.yml. When creating a YAML config, use `devproxy config new --format yaml`.
- To validate a configuration file before starting Dev Proxy, use `devproxy config validate`.
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
- The order of plugins in the configuration file matters. Dev Proxy executes plugins in the order they are listed. Use this order (top to bottom):
    1. RetryAfterPlugin (if simulating throttling — must be first to verify client backs off)
    2. LatencyPlugin (if simulating realistic response times — adds delay before responses)
    3. Other analysis/guidance plugins (e.g. GraphMinimalPermissionsGuidancePlugin)
    4. Response-simulating plugins (e.g. MockResponsePlugin, CrudApiPlugin)
    5. Reporter plugins (always last)
- If you need to simulate different scenarios, for example simulating latency for an LLM vs. a regular API, you can use multiple instances of the same plugin.
- If you use multiple instances of the same plugin, use a clear name for each plugin's configuration section to depict its purpose.

## Mocking

- When defining mock responses or CrudApiPlugin actions, put entries with the longest (most specific) URLs first. Entries are matched in the order they're defined, so you don't want a generic pattern like /{id} to override a more specific one like /category/{name}.
- Mocks with the nth property should be defined first, because they're considered more specific than mocks without that property.
- To return dynamic Retry-After header value in mock responses, use `@dynamic` as the header's value
- To return a dynamic Retry-After header value with a specific initial value, use `@dynamic=initialvalue` (e.g. `@dynamic=120`). Supported in GenericRandomErrorPlugin.
- When simulating APIs and their responses, consider using the LatencyPlugin to make the API responses feel more realistic. See the Plugins section for the correct plugin ordering.

## File paths

- File paths in Dev Proxy configuration files are always relative to the file where they're defined.

## Hot reload

- Dev Proxy supports hot reload of configuration files. When you modify a configuration file while Dev Proxy is running, it automatically detects the changes and restarts with the new configuration.
- Hot reload works for all configuration file types: the main configuration file (JSON, JSONC, or YAML) and plugin-specific configuration files (mock files, CRUD API data files, etc.).
- You don't need to manually restart Dev Proxy after making configuration changes - just save the file and the changes take effect automatically.
- To disable hot reload (e.g. in CI/CD or automated environments), use the `--no-watch` flag.

## Detached mode

- Dev Proxy can run in detached (background) mode. This is useful for CI/CD pipelines, automated testing, and agent-driven workflows where Dev Proxy needs to run without an interactive terminal.
- When running in detached mode, use `--output json` to get structured, machine-readable output that can be parsed by scripts and agents.
- For detached mode and CI/CD scenarios, set `port` to `0` in the configuration file (or use `--port 0` on the command line) to let the OS assign a random available port. This avoids port conflicts when running multiple Dev Proxy instances in parallel. Similarly, use `--api-port 0` for the Dev Proxy API port.
- Combine random ports with `asSystemProxy` set to `false` in the configuration file (or `--as-system-proxy false` on the command line) to prevent Dev Proxy from modifying system proxy settings. This way, each instance runs in isolation and only intercepts requests from applications explicitly configured to use its address and port.
- When `asSystemProxy` is `false`, multiple Dev Proxy instances can run in parallel on the same machine. Each instance should use its own random port and configuration file.
- When using random ports, use `devproxy status` to find the actual assigned port, API URL, PID, and other details of the running instance.
- The proxy URL is printed in the startup output. When using `--output json`, parse the proxy URL from the JSON output to configure your application.

## curl

- When asked for `curl` commands, include `-ikx http://127.0.0.1:<port>` to ignore SSL certificate errors and route through Dev Proxy. Replace `<port>` with the actual port Dev Proxy is running on (default: 8000). Example: `curl -ikx http://127.0.0.1:8000 https://jsonplaceholder.typicode.com/posts/1`.