"""Build the static homepage and Markdown essays without editing source files."""

from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil

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
        paragraph = re.search(r"<p>(.*?)</p>", body, re.S)
        summary = plain(paragraph.group(1)) if paragraph else ""
        if len(summary) > 180:
            summary = summary[:177].rsplit(" ", 1)[0] + "…"
        articles.append((path.stem + ".html", title, summary, body))

    homepage = (root / "index.html").read_text(encoding="utf-8")
    template = (root / "scripts/essay.html").read_text(encoding="utf-8")
    listing = '<p class="item-desc">Coming soon.</p>'
    if articles:
        items = []
        for filename, title, summary, _ in articles:
            items.append(
                '<li class="item"><a class="item-link" href="essays/'
                + escape(filename, quote=True) + '"><span class="item-name">'
                + escape(title) + '</span></a>'
                + ('<p class="item-desc">' + escape(summary) + '</p>' if summary else '')
                + '</li>'
            )
        listing = '<ul class="list">\n' + '\n'.join(items) + '\n</ul>'
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
    (output / "index.html").write_text(homepage, encoding="utf-8")
    (output / ".nojekyll").touch()
    (output / "essays").mkdir()
    if (root / "articles/images").exists():
        shutil.copytree(root / "articles/images", output / "essays/images")
    for filename, title, summary, body in articles:
        page = re.sub(r"\{\{(TITLE|DESCRIPTION|BODY)\}\}",
                      lambda m: {"TITLE": escape(title), "DESCRIPTION": escape(summary, quote=True),
                                 "BODY": body}[m.group(1)], template)
        (output / "essays" / filename).write_text(page, encoding="utf-8")
    print(f"Built {len(articles)} essay(s) into {output}")


if __name__ == "__main__":
    build()
