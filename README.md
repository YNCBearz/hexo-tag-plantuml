## Introduction

This is a [hexo](https://github.com/tommy351/hexo)
tag plugin which allows you to render plantuml code in you blog.

Hexo is a static blogging system written in Node.js.
But hexo no support plantuml tag

## Installation

To install, run the following command in the root directory of hexo:
```
npm install hexo-tag-plantuml --save
```

And add this plugin in your ``_config.yml``.

## Usage

_config.yml add config:

	tag_plantuml:
		type: static
		maxRetries: 3
		retryDelay: 1000
		timeout: 10000

**static**: download svg image into html file, "data:image/svg+xml;utf8";
**dynamic**: use http://www.plantuml.com/plantuml/svg dynamic produce

### Configuration Options

- `type`: `static` or `dynamic` - How to handle PlantUML rendering
- `maxRetries`: Number of retry attempts for failed requests (default: 3)
- `retryDelay`: Delay between retry attempts in milliseconds (default: 1000)
- `timeout`: Request timeout in milliseconds (default: 10000)

### Error Handling

The plugin now includes robust error handling for common issues:

- **HTTP 520 Errors**: Automatically retries failed requests
- **Server Errors (5xx)**: Implements exponential backoff retry strategy
- **Network Timeouts**: Configurable timeout settings
- **Graceful Degradation**: Shows error message when all retries fail

Specify the code filetype, and whether to use line number in your markdown source file, in the common format of tag plugins:

	{% plantuml %}
        Bob->Alice : hello
	{% endplantuml %}

## Testing

This project includes comprehensive tests to ensure reliability:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Test individual functions in `plantuml.js` and `deflate.js`
- **Integration Tests**: Test Hexo tag registration and rendering
- **Coverage**: Comprehensive test coverage for all modules

### Test Files

- `__tests__/plantuml.test.js` - Tests for PlantUML compression
- `__tests__/deflate.test.js` - Tests for deflate compression
- `__tests__/integration.test.js` - Tests for Hexo integration

