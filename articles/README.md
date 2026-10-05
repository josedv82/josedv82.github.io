# Adding essays

Create one `.md` file per essay directly in this folder. Paste the article beneath a title starting with `#`:

```markdown
# Your essay title

Your opening paragraph. This also becomes the short introduction on the homepage.

## A section heading

More text, with **bold**, *italics*, or [a link](https://example.com).

![Describe the image](images/your-photo.jpg)
```

If your article starts with author information or you want a different homepage
introduction, add `<!-- excerpt: Your short introduction. -->` beneath the title.

Put images in `articles/images/`. Optional captions can use HTML:

```html
<figure>
  <img src="images/your-photo.jpg" alt="Describe the image" loading="lazy">
  <figcaption>Your caption.</figcaption>
</figure>
```

Use lowercase filenames with hyphens, such as `2026-10-05-coaching-decisions.md`.
Essays appear in reverse filename order, so date-prefixed names put newer essays first.
Each filename becomes its page URL: `essays/2026-10-05-coaching-decisions.html`.
Only `.md` files directly in this folder are published. `README.md` and files
starting with `_` are ignored, so `_draft.md` can hold an unpublished draft.

Commit and push the article and images to `main`. The included GitHub Actions
workflow builds and publishes the site. In GitHub repository **Settings → Pages**,
select **GitHub Actions** as the source once. No homepage edits are needed.

For local development, from the repository root:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/build_site.py
python3 -m http.server 8000 --bind 127.0.0.1 --directory _site
```

Rerun the build after editing articles or site files, then refresh the browser.
Generated files are written to `_site/`; do not commit them.
