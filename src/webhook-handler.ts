import { Hono } from 'hono';
import crypto from 'node:crypto';

import type { FrontMessage } from './types';

const app = new Hono()

// Compare the sent signature with the data
// @see https://dev.frontapp.com/docs/webhooks-1#validating-data-integrity
function validateFrontSignature(data: any, signature: string) {
  if (!process.env.FRONT_WEBHOOK_SECRET) {
    throw new Error('FRONT_WEBHOOK_SECRET is not set')
  }
  var hash = crypto.createHmac('sha1', process.env.FRONT_WEBHOOK_SECRET)
    .update(JSON.stringify(data))
    .digest('base64');

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

// Middleware to check headers
const verifyIntegrity = async (c: any, next: () => Promise<void>) => {
  const frontSignature = c.req.header('X-Front-Signature')

  if (!frontSignature) {
    return c.json({ type: ErrorTypes.FORBIDDEN, message: 'Missing signature' }, 403)
  }

  // Extract the JSON Object request body.
  const requestBody = await c.req.json()

  // Validate the request signature to ensure the message was signed and sent by Front.
  if (!validateFrontSignature(requestBody, frontSignature)) {
    return c.json({ type: ErrorTypes.FORBIDDEN, message: 'Invalid signature' }, 403)
  }

  // If everything is okay, proceed to the route handler
  await next()
}

// Apply the middleware to all routes
app.use('*', verifyIntegrity)

/**
 * Set this endpoint as your custom channel's Outbound Webhook URL in Front.
 * Front will POST to this endpoint when messages are sent from your custom channel in Front.
 * @see https://dev.frontapp.com/docs/creating-a-custom-channel
 */
app.post('/front/send-message', async (c) => {
  try {
    // Parse and validate the request body
    const body = await c.req.json() as FrontMessage
    console.log('Received message:', JSON.stringify(body, null, 2))

    // You can now access typed properties of the message
    console.log(`Sending message from ${body.author.email} to ${body.recipients[0].handle}`)

    // TODO: Implement your message sending logic here
    // For example, you might want to call an external API or service
    console.log(`Sending message to ${body.recipients[0].handle}: ${body.body}`)

    // Return a success response
    // Note the acceptable response types for Front are:
    // { type: "success" | ErrorType, message?: string }
    return c.json({ type: "success" }, 200)
  } catch (error) {
    /*
     * Handle validation errors or other exceptions 
     * @see https://dev.frontapp.com/docs/creating-a-custom-channel#sending-messages-accepting-messages-sent-by-agents-in-front
     */
    console.error('Error processing message:', error)
    return c.json({ type: ErrorTypes.INTERNAL_ERROR, message: 'Internal server error' }, 500)
  }
})

type ErrorType =
  | 'bad_request'
  | 'authentication_required'
  | 'forbidden'
  | 'not_found'
  | 'request_timeout'
  | 'too_many_requests'
  | 'internal_error';

const ErrorTypes: Record<string, ErrorType> = {
  BAD_REQUEST: 'bad_request',
  AUTHENTICATION_REQUIRED: 'authentication_required',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  REQUEST_TIMEOUT: 'request_timeout',
  TOO_MANY_REQUESTS: 'too_many_requests',
  INTERNAL_ERROR: 'internal_error',
};

export default app