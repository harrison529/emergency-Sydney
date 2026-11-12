# Sydney Roleplay

A browser-based 3D Sydney city sandbox with six roles, role vehicles, dispatch jobs, and live world chat and player positions over WebSockets.

## Run

Requires Node.js 20+.

```sh
npm ci
npm start
```

The server listens on port 3000 (or `PORT`). Connect multiple browsers to the same server to share the city and chat. For public play, deploy the Node server on a host supporting WebSockets and HTTPS. No public deployment is included.

Choose a role and callsign. WASD/arrows move and steer; E enters/exits your nearby role vehicle; P opens dispatch; T focuses chat. Accept a job and reach its beacon to earn session money.

This is a prototype: procedural stylized city, destination-based jobs, no accounts, persistent economy, collisions, or production moderation. State resets when the server or browser restarts. Chat is length-limited, rate-limited, and rendered as text.
