import shutil
import tempfile
import unittest
from pathlib import Path

from build_site import ROOT, build


class BuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for directory in ("articles/images", "scripts", "static"):
            (self.root / directory).mkdir(parents=True)
        shutil.copy(ROOT / "index.html", self.root / "index.html")
        shutil.copy(ROOT / "scripts/essay.html", self.root / "scripts/essay.html")

    def test_empty_and_drafts(self):
        (self.root / "articles/README.md").write_text("Instructions")
        (self.root / "articles/_draft.md").write_text("Unpublished")
        build(self.root)
        self.assertIn("Coming soon.", (self.root / "_site/index.html").read_text())
        self.assertEqual(list((self.root / "_site/essays").glob("*.html")), [])

    def test_articles_images_order_and_cleanup(self):
        folder = self.root / "articles"
        (folder / "2026-01-first.md").write_text("# First\n\nFirst essay.")
        latest = folder / "2026-02-second.md"
        latest.write_text('# Second & **best**\n\nA paragraph with *emphasis*.\n\n![Photo](images/photo.svg)')
        (folder / "images/photo.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"/>')
        build(self.root)
        home = (self.root / "_site/index.html").read_text()
        self.assertLess(home.index("Second &amp; best"), home.index('>First</span>'))
        page = (self.root / "_site/essays/2026-02-second.html").read_text()
        self.assertIn("<em>emphasis</em>", page)
        self.assertIn('src="images/photo.svg"', page)
        self.assertTrue((self.root / "_site/essays/images/photo.svg").exists())
        latest.unlink()
        build(self.root)
        self.assertFalse((self.root / "_site/essays/2026-02-second.html").exists())

    def test_missing_title_rejects_article(self):
        (self.root / "articles/broken.md").write_text("No heading")
        with self.assertRaisesRegex(ValueError, "start the essay"):
            build(self.root)

    def test_explicit_excerpt_before_author_information(self):
        (self.root / "articles/essay.md").write_text(
            '# An essay\n\n<!-- excerpt: Decisions & confidence. -->\n\n**Author**: Someone\n\nThe essay.'
        )
        build(self.root)
        page = (self.root / "_site/essays/essay.html").read_text()
        self.assertIn('content="Decisions &amp; confidence."', page)
        home = (self.root / "_site/index.html").read_text()
        self.assertNotIn('Decisions &amp; confidence.', home)
        self.assertNotIn('Someone', home)

    def test_dates_and_metadata_move_into_essay_header(self):
        (self.root / "articles/2026-07-04-test.md").write_text(
            '# Test\n\n<div class="item-desc">Published: <time datetime="2026-07-04">2026-07-04</time>'
            '<br><a href="https://x.com/example/status/123">Original article on X</a></div>\n\nEssay text.'
        )
        build(self.root)
        home = (self.root / "_site/index.html").read_text()
        page = (self.root / "_site/essays/2026-07-04-test.html").read_text()
        self.assertIn('datetime="2026-07-04"', home)
        self.assertIn('Jul 04</time>', home)
        self.assertNotIn('Essay text.', home)
        self.assertIn('04 July 2026</time>', page)
        self.assertEqual(page.count('Original article on X'), 1)
        self.assertNotIn('Published:', page)


if __name__ == "__main__":
    unittest.main()
