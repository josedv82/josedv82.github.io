"""Render the public GitHub contribution calendar for the homepage preview."""

from datetime import date, timedelta
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
import re


class Calendar(HTMLParser):
    def __init__(self):
        super().__init__()
        self.days = {}
        self.labels = {}
        self.tooltip = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "td" and "data-date" in attrs and "data-level" in attrs:
            day = date.fromisoformat(attrs["data-date"])
            level = int(attrs["data-level"])
            if level not in range(5):
                raise ValueError("Unexpected GitHub contribution level")
            self.days[day] = (attrs["id"], level)
        if tag == "tool-tip":
            self.tooltip = attrs.get("for")

    def handle_data(self, data):
        if self.tooltip:
            self.labels[self.tooltip] = self.labels.get(self.tooltip, "") + data

    def handle_endtag(self, tag):
        if tag == "tool-tip":
            self.tooltip = None

    def render(self):
        if len(self.days) < 350:
            raise ValueError("GitHub did not return a complete yearly calendar")
        first, last = min(self.days), max(self.days)
        start = first - timedelta(days=(first.weekday() + 1) % 7)
        weeks = (last - start).days // 7 + 1
        width = weeks * 12 - 2
        cells, months, total = [], [], 0
        if first.day != 1:
            months.append(f'<text x="0" y="10">{first.strftime("%b")}</text>')
        for day, (identifier, level) in sorted(self.days.items()):
            offset = (day - start).days
            x, y = offset // 7 * 12, offset % 7 * 12 + 18
            if identifier not in self.labels:
                raise ValueError("GitHub did not return contribution counts")
            label = self.labels[identifier].strip()
            count = re.search(r"([\d,]+) contributions?", label)
            total += int(count[1].replace(",", "")) if count else 0
            cells.append(f'<rect x="{x}" y="{y}" width="10" height="10" rx="2" '
                         f'class="contribution-day" data-level="{level}"><title>{escape(label)}</title></rect>')
            if day.day == 1 and x < width - 22:
                months.append(f'<text x="{x}" y="10">{day.strftime("%b")}</text>')
        return (f'<p class="contribution-summary">{total:,} contributions in the last year</p>\n'
                f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 100" '
                'role="img" aria-label="GitHub contribution calendar for josedv82">\n'
                + "\n".join(months + cells) + "\n</svg>\n")


if __name__ == "__main__":
    request = Request("https://github.com/users/josedv82/contributions", headers={"User-Agent": "JoseFernandezWebsite"})
    with urlopen(request, timeout=30) as response:
        source = response.read().decode("utf-8")
    calendar = Calendar()
    calendar.feed(source)
    output = Path(__file__).with_name("contributions.html")
    output.write_text(calendar.render(), encoding="utf-8")
    print(f"Updated contribution calendar with {len(calendar.days)} days")
