# Validators

All Zod schema definitions should be stored here.

Each module should export a schema object, for example:

```js
// validators/userSchema.js
const { z } = require('zod')

const userSchema = {
  create: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
}

module.exports = { userSchema }
```
