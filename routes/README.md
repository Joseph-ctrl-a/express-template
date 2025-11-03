# Routes

All Express route modules live here.

Each route file must export a function that:

- Accepts the shared `helpers` object.
- Returns an Express `Router` instance.

The loader (`loaders/loadRoutes.js`) automatically registers all `.js` files
in this directory as routes. The route path matches the filename.

### Example

A file named `example.js` becomes available at `/example`.

### Template Example

```js
module.exports = helpers => {
  const { route, response, error } = helpers

  route.get('/', (req, res) => {
    response.ok({ res, data: { message: 'Hello World' } })
  })

  return route.router
}
```
