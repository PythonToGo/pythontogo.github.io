<div align="center">

# PythonToGo

### The way to live like a hedgehog.

[![Live Site](https://img.shields.io/badge/Live%20Site-pythontogo.github.io-1f6feb?style=for-the-badge)](https://pythontogo.github.io)
[![Jekyll](https://img.shields.io/badge/Jekyll-4.x-cc0000?style=for-the-badge&logo=jekyll)](https://jekyllrb.com)
[![Theme](https://img.shields.io/badge/Theme-Chirpy-2ea44f?style=for-the-badge)](https://github.com/cotes2020/jekyll-theme-chirpy)
[![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](./LICENSE)

Personal study blog by **Taey**, built with **Jekyll** and the **Chirpy** theme.  
Notes, experiments, and write-ups on **Python**, **Go**, **ML/DL**, **Dynamic Systems**, **Robotics**, and **AI**.

</div>

## Preview

- Live: https://pythontogo.github.io
- Timezone: `Europe/Berlin`
- Default language: `en`

## Highlights

| Area     | Summary                                                    |
| -------- | ---------------------------------------------------------- |
| Content  | Study notes, blog posts, quizzes, PDFs, and custom visuals |
| Platform | Jekyll site powered by `jekyll-theme-chirpy`               |
| Hosting  | GitHub Pages with automated deployment                     |
| Focus    | Consistent long-form technical learning archive            |

## What Lives Here

This repository is more than a simple blog starter. It is an actively organized knowledge base with:

- Study notes for Machine Learning, Deep Learning, Dynamic Systems, Robotics, and AI
- Custom assets such as diagrams, PDFs, quizzes, and interactive components
- GitHub Pages deployment through GitHub Actions
- A Chirpy-based Jekyll setup customized for personal publishing

## Project Structure

```text
.
├── _config.yml          # Site configuration
├── _posts/              # Blog posts and study notes
│   ├── blogging/
│   └── Study/
├── _tabs/               # Top-level navigation pages
├── _includes/           # Reusable layout fragments and widgets
├── assets/              # Images, CSS, JavaScript, favicons
├── api/                 # Small API-related utilities/assets
├── tools/               # Local helper scripts
└── .github/workflows/   # Build and deploy pipeline
```

## Local Development

### 1. Install dependencies

```bash
bundle install
```

### 2. Run the site locally

```bash
bundle exec jekyll s
```

Then open `http://127.0.0.1:4000`.

## Writing Posts

Add new posts under [`_posts`](/Users/taeyoungkim/workspace/blog/_posts) using Jekyll's filename format:

```text
YYYY-MM-DD-title.md
```

This blog currently groups content into areas such as:

- `blogging`
- `Study/Machine Learning`
- `Study/Deep Learning`
- `Study/Dynamic System`
- `Study/Roboterdynamik`
- `Study/FunAI`

## Deployment

Pushes to `main` or `master` trigger the GitHub Pages workflow in [`.github/workflows/pages-deploy.yml`](/Users/taeyoungkim/workspace/blog/.github/workflows/pages-deploy.yml).

The pipeline:

1. Checks out the repository
2. Builds the Jekyll site
3. Runs `htmlproofer`
4. Deploys the generated site to GitHub Pages

## Stack

- Jekyll
- `jekyll-theme-chirpy`
- Ruby `3.3` in CI
- GitHub Pages
- `html-proofer` for static validation

## Notes

- `README.md` is excluded from the generated site build
- PWA is disabled in [`_config.yml`](/Users/taeyoungkim/workspace/blog/_config.yml)
- The site title is `PythonToGo`
- The current description is `Taey's blog about Python and Go.`

## License

Published under the [MIT License](./LICENSE).
