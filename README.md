# Front Custom Channel

This project implements a [custom channel receiver](https://dev.frontapp.com/docs/creating-a-custom-channel) for [Front](https://front.com), a customer communication platform. It creates a webhook handler to process messages sent from Front and potentially relay them to another service or platform.

## Project Overview

The main components of this project are:

1. A webhook handler (`src/webhook-handler.ts`) that processes incoming messages from Front.
2. A type definition file (`src/types.ts`) that defines the structure of messages received from Front.
3. A main file (`src/index.ts`) that sets up and runs the server.

### Functionality

The webhook handler listens for POST requests on the `/front/send-message` endpoint. When a message is received:

1. It parses the incoming JSON payload as a `FrontMessage` type.
2. It logs the received message and some key details (sender and recipient contact handle).
3. It's set up to potentially send this message to another service (currently just logs a placeholder message).
4. It returns a success response if everything processes correctly, or an error response if something goes wrong.

### Technology Stack

- TypeScript
- Hono as the web framework
- tsx for running TypeScript directly
- env-cmd for managing environment variables in the dev environment

## Security

This project includes a middleware function that checks for a valid API key in the `X-Front-Signature` header of incoming requests. Make sure to set the `FRONT_WEBHOOK_SECRET` environment variable to the expected value.

## Getting Started

1. Clone the repo, and set the `FRONT_WEBHOOK_SECRET` environment variable in a `.env` file.

2. Install dependencies:
   ```
   pnpm install
   ```

3. Start the development server (runs on port 3000 by default):
   ```
   pnpm run dev
   ```

4. Serve your app; tools like [ngrok](https://ngrok.com/) or [localcan](https://localcan.dev/) are useful for this.

5. Configure your custom channel in Front to point to your URL + path (e.g. `https://abc123.ngrok-free.app/front/send-message`).

6. Test the integration by sending a message from Front via your custom channel.

## Next Steps

To complete this integration:

1. Implement the actual message sending logic in the webhook handler. 
2. Set up proper error handling and logging.
3. Configure environment variables for any sensitive information or configuration.
4. Set up proper testing for the webhook handler.
5. Deploy the service to a production environment.
