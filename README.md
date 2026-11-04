# PromptPay

Pay-per-prompt AI on Arc. Connect a wallet, pay a small amount of USDC per question, and get an answer once the payment confirms onchain.

Built with [Arc Studio](https://studio.arc.io)

## Tech stack

- React, Vite, TypeScript, Tailwind CSS
- wagmi, viem, ConnectKit for wallet and contract access
- Solidity (Foundry, OpenZeppelin) payment contract on Arc Testnet
- Bun HTTP server that verifies payments and returns answers

## Development

Prerequisites: Bun and Foundry.

```bash
bun install
bun run server   # API on port 3001
bun run dev      # app on port 5173, proxies /api to the server
```

The site has a public landing page at `/` and the app itself at `/app`.

Production: `bun run start` builds the site and serves the pages and the API from one server (port from `PORT`, default 7860).

Other commands: `bun run build`, `bun run check` (lint and typecheck), `bun run contracts:build`, `bun run contracts:test`.

### Environment variables

- `VITE_PROMPTPAY_ADDRESS`: address of the deployed PromptPay contract (used by the app and the server).
- `AI_API_KEY`: key for an OpenAI-compatible chat API. Optional; without it the server answers in demo mode.
- `AI_BASE_URL`: base URL of that API. Optional, defaults to the OpenAI endpoint.
- `AI_MODEL`: model name. Optional.
- `PORT`: API port. Optional, defaults to 3001.
- `RPC_PROXY_BASE_URL`, `RPC_PROXY_TOKEN`, `RPC_PROXY_CHAINS`: RPC proxy settings provisioned by Arc Studio. Optional outside Arc Studio; the server falls back to the public Arc Testnet RPC.
