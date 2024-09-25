import { serve } from '@hono/node-server'
import app from './webhook-handler'

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})