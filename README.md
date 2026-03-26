# Wedding Album

A minimal wedding gallery built with Astro, Tailwind CSS, and a restrained amount of Framer Motion. The photo pipeline is reproducible: source images live in `drive-download-20260326T151214Z-1-001`, and `npm run sync:gallery` copies them into `public/photos` while regenerating `src/data/gallery.ts`.

## Commands

- `npm install`: install dependencies
- `npm run dev`: sync photos and start the local server
- `npm run build`: sync photos and build for production
- `npm run preview`: preview the production build

## Deployment

The repository includes [deploy.yml](/home/hello/projects/wedding_web/.github/workflows/deploy.yml) for GitHub Pages. Once the repo is pushed to GitHub and Pages is set to `GitHub Actions`, every push to `main` will build and deploy the site automatically.

`astro.config.mjs` derives the `site` and `base` values from `GITHUB_REPOSITORY`, so project pages under `https://<user>.github.io/<repo>/` work without hardcoding your GitHub username.
