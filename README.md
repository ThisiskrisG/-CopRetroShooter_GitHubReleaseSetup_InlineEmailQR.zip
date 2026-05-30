# Cop Retro Shooter File Server

This project gives you a small server-side website for hosting Cop Retro Shooter game files while keeping the frontend static enough to publish on GitHub Pages.

## What it includes

- A Node.js file server with upload, list, download, health, and delete API routes.
- A blended static website in `public/` that combines advertisement previews, a player download portal, server connection status, setup guidance, and admin upload controls.
- A `game-files/` storage folder for local development. In production, set `STORAGE_DIR` to a persistent disk or mounted volume.

## Run locally

```bash
ADMIN_TOKEN=change-me npm start
```

Open <http://localhost:3000> to use the blended command hub. Preview reusable advertisements, paste the admin token in the upload section, and upload a build file such as a `.zip`, `.wasm`, `.png`, or `.mp3`.

## Publish the frontend on GitHub Pages

1. Deploy the Node server to your preferred host.
2. Set `CORS_ORIGIN` to your GitHub Pages URL, for example `https://your-user.github.io`.
3. Publish the `public/` folder to GitHub Pages.
4. In the website's **API base URL** field, enter your server URL and click **Save**.


## Request an issue and pull request action

Use the GitHub **PR action request** issue template when you want a change tracked as an issue and handled by a pull request. The included GitHub Actions workflow labels `[PR Action]` issues with `needs-pr` and comments with next steps for opening a linked PR.

See [`docs/pr-action-request.md`](docs/pr-action-request.md) for the exact workflow.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port for the Node server. |
| `STORAGE_DIR` | `./game-files` | Folder where uploaded game files are stored. Use persistent storage in production. |
| `ADMIN_TOKEN` | empty | Required for `PUT` uploads and `DELETE` deletes. The server refuses admin actions until this is set. |
| `PUBLIC_DOWNLOADS` | `true` | Set to `false` to require a download token. |
| `DOWNLOAD_TOKEN` | empty | Token accepted through `x-download-token` or `?token=` when private downloads are enabled. |
| `CORS_ORIGIN` | `*` | Browser origin allowed to call the API. Set this to your GitHub Pages origin in production. |
| `MAX_UPLOAD_BYTES` | `1073741824` | Maximum upload size in bytes. |

## API examples

Upload a file:

```bash
curl -X PUT \
  -H "x-admin-token: change-me" \
  --data-binary @build.zip \
  http://localhost:3000/api/files/build.zip
```

List files:

```bash
curl http://localhost:3000/api/files
```

Download a file:

```bash
curl -OJ http://localhost:3000/api/files/build.zip
```

Delete a file:

```bash
curl -X DELETE \
  -H "x-admin-token: change-me" \
  http://localhost:3000/api/files/build.zip
```

## Production notes

- Always set a strong `ADMIN_TOKEN` before exposing the server publicly.
- Put the server behind HTTPS so tokens and downloads are encrypted in transit.
- Mount `STORAGE_DIR` to persistent storage so game files survive deploys and container restarts.
- If GitHub Pages hosts the frontend, keep only lightweight site files there and store large builds on the server.
