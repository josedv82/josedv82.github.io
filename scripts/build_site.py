"""Build the static homepage and Markdown essays without editing source files."""

from html import escape
from html.parser import HTMLParser
from datetime import date
from pathlib import Path
import re
import shutil
from hashlib import sha256

import markdown

ROOT = Path(__file__).resolve().parents[1]


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def plain(html):
    parser = Text()
    parser.feed(html)
    return " ".join("".join(parser.parts).split())


def build(root=ROOT):
    def version_assets(html):
        # Static hosting can cache CSS separately from newly deployed HTML/JS.
        for asset in ('css/style.css', 'js/theme.js', 'js/reader.js'):
            path = root / 'static' / asset
            if path.exists():
                digest = sha256(path.read_bytes()).hexdigest()[:12]
                html = html.replace(f'static/{asset}"', f'static/{asset}?v={digest}"')
        return html

    articles = []
    for path in sorted((root / "articles").glob("*.md"), reverse=True):
        if path.name.lower() == "readme.md" or path.name.startswith("_"):
            continue
        source = path.read_text(encoding="utf-8")
        heading = re.match(r"\A\s*# ([^\n]+)\n?", source)
        if not heading:
            raise ValueError(f"{path.name}: start the essay with '# Your title'")
        title = plain(markdown.markdown(heading.group(1))).strip()
        if not title:
            raise ValueError(f"{path.name}: essay title must not be empty")
        body = markdown.markdown(source[heading.end():], extensions=["extra", "sane_lists"])
        excerpt = re.search(r"<!--\s*excerpt:\s*(.*?)\s*-->", source, re.S)
        summary = plain(excerpt.group(1)) if excerpt else next(
            (plain(p) for p in re.findall(r"<p>(.*?)</p>", body, re.S) if plain(p)), ""
        )
        if len(summary) > 180:
            summary = summary[:177].rsplit(" ", 1)[0] + "…"
        metadata = re.search(
            r'<div class="item-desc">Published: <time datetime="([^"]+)">[^<]*</time><br>'
            r'<a href="([^"]+)">Original article on X</a></div>', body
        )
        date_prefix = re.match(r'\d{4}-\d{2}-\d{2}(?=-)', path.stem)
        published = date.fromisoformat(metadata[1] if metadata else date_prefix[0]) if metadata or date_prefix else None
        source_url = metadata[2] if metadata else None
        if metadata:
            body = body[:metadata.start()] + body[metadata.end():]
        articles.append((path.stem + ".html", title, summary, body, published, source_url))

    homepage = (root / "index.html").read_text(encoding="utf-8")
    template = (root / "scripts/essay.html").read_text(encoding="utf-8")
    listing = '<p class="item-desc">Coming soon.</p>'
    if articles:
        items = []
        for filename, title, _, _, published, _ in articles:
            stamp = (f'<time class="essay-date" datetime="{published.isoformat()}" '
                     f'aria-label="Published {published.strftime("%d %B %Y")}">'
                     f'{published.strftime("%b %d")}</time>') if published else ''
            items.append(
                '<li class="essay-row"><a class="essay-link" href="essays/'
                + escape(filename, quote=True) + '"><span class="item-name">'
                + escape(title) + '</span>' + stamp + '</a></li>'
            )
        listing = '<ul class="essay-list">\n' + '\n'.join(items) + '\n</ul>'
    homepage, count = re.subn(
        r"<!-- ESSAYS:START -->.*?<!-- ESSAYS:END -->",
        lambda _: '<!-- ESSAYS:START -->\n' + listing + '\n<!-- ESSAYS:END -->',
        homepage, flags=re.S,
    )
    if count != 1:
        raise ValueError("index.html must contain one pair of ESSAYS markers")

    output = root / "_site"
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    shutil.copytree(root / "static", output / "static")
    (output / "index.html").write_text(version_assets(homepage), encoding="utf-8")
    (output / ".nojekyll").touch()
    (output / "essays").mkdir()
    if (root / "articles/images").exists():
        shutil.copytree(root / "articles/images", output / "essays/images")
    for filename, title, summary, body, published, source_url in articles:
        meta = []
        if published:
            meta.append(f'<time datetime="{published.isoformat()}">{published.strftime("%d %B %Y")}</time>')
        if source_url:
            meta.append(f'<a href="{escape(source_url, quote=True)}">Original article on X</a>')
        metadata_html = '<div class="essay-meta">' + ''.join(meta) + '</div>' if meta else ''
        page = re.sub(r"\{\{(TITLE|DESCRIPTION|BODY|META)\}\}",
                      lambda m: {"TITLE": escape(title), "DESCRIPTION": escape(summary, quote=True),
                                 "BODY": body, "META": metadata_html}[m.group(1)], template)
        (output / "essays" / filename).write_text(version_assets(page), encoding="utf-8")
    print(f"Built {len(articles)} essay(s) into {output}")


if __name__ == "__main__":
    build()
