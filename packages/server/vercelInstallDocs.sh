pnpm install
pnpm --workspace-root run build
pnpm -r --workspace-root --filter=lowdefy start build --config-directory ../docs --server-directory ../server --no-next-build
