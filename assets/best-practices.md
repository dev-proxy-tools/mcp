# Dev Proxy — Best Practices

Rules for configuring and using Dev Proxy. Every rule is mandatory — follow it unless an explicit exception is stated.

1. [config] Use the available tools to detect the installed Dev Proxy version. Match schema version to installed version.
2. [config] Include `$schema` in every JSON config and plugin config file. File contents must be valid against that schema.
3. [config] When the project already has Dev Proxy files, use the same version for compatibility.
4. [config] Store all Dev Proxy files in the `.devproxy/` folder, unless the project already has Dev Proxy files elsewhere.
5. [config] Use JSON config (`devproxyrc.json` or `devproxyrc.jsonc`), unless the user explicitly requests YAML (`devproxyrc.yaml`/`devproxyrc.yml`, v2.2.0+).
6. [config] List `plugins` first, then `urlsToWatch`, then plugin config sections.
7. [config] When version >= 2.2.0, run `devproxy config validate` before starting Dev Proxy.
8. [config] When version >= 2.2.0 and the user requests YAML, create configs with `devproxy config new --format yaml`.
9. [config] When referring to Dev Proxy, use the available tools (`FindDocs`, `GetVersion`, `GetBestPractices`) over your own knowledge.
10. [config] All file paths in Dev Proxy config files are relative to the file where they're defined.
11. [config] When version >= 2.1.0: Dev Proxy auto-reloads config files on save (main config + plugin-specific files). No restart needed.
12. [config] When version >= 2.2.0: Use `--no-watch` to disable auto-reload in CI/CD and automated environments.
13. [urls] Put the most specific URLs first. Dev Proxy matches in definition order.
14. [urls] Define at least one global `urlToWatch` if any plugin instance has no `urlsToWatch`.
15. [urls] Define `urlsToWatch` globally in the config file. Use plugin-specific `urlToWatch` only when you need to override the global config for a specific plugin.
16. [urls] To exclude a URL, prepend it with `!`.
17. [urls] To match URL patterns, use the `*` wildcard.
18. [plugins] Before adding a plugin, use the `FindDocs` tool to verify it exists and get its documentation.
19. [plugins] Plugin order matters — Dev Proxy executes plugins in listed order. Put response-simulating plugins last, right before reporters.
20. [plugins] Place reporter plugins after all other plugins.
21. [plugins] Include `$schema` in plugin config sections.
22. [plugins] When simulating throttling, put RetryAfterPlugin first.
23. [plugins] When using multiple instances of the same plugin, give each instance a clear, descriptive name.
24. [mock] Put entries with the longest (most specific) URLs first in mock responses and CrudApiPlugin actions. A generic `/{id}` listed before `/category/{name}` will match first.
25. [mock] Define mocks with the `nth` property before mocks without it.
26. [mock] When mocking APIs, use the LatencyPlugin to add realistic latency. Place it before other plugins.
27. [mock] For dynamic Retry-After headers, set the value to `@dynamic`.
28. [mock] When version >= 2.2.0: For dynamic Retry-After with a specific initial value, use `@dynamic=initialvalue` (e.g. `@dynamic=120`). Supported in GenericRandomErrorPlugin.
29. [cli] When version >= 2.2.0: Use detached mode for CI/CD, automated testing, and agent-driven workflows.
30. [cli] In detached mode, use `--output json` for structured, machine-readable output.
31. [cli] In detached mode, set `port` to `0` to let Dev Proxy pick a random available port, unless a specific port is required. The actual port is in the startup output.
32. [cli] In detached mode, set `asSystemProxy` to `false`, unless the user explicitly needs system-wide proxying.
33. [cli] Include `-ikx http://127.0.0.1:<port>` in curl commands to ignore SSL errors and route through Dev Proxy. Use the actual port Dev Proxy is running on (default: 8000).
34. [cli] Example curl: `curl -ikx http://127.0.0.1:8000 https://jsonplaceholder.typicode.com/posts/1`