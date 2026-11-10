"""Check the built bilingual pages without platform-specific native libraries."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / '_site'

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.links = []
        self.ids = set()
        self.language = None
        self.alternates = {}
        self.article_language = None
        self.errors = []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        if tag == 'html':
            self.language = a.get('lang')
        if 'article-body' in a.get('class', '').split():
            self.article_language = a.get('lang')
        if tag == 'link' and a.get('rel') == 'alternate' and a.get('hreflang'):
            self.alternates[a['hreflang']] = a.get('href')
        if tag == 'img' and not a.get('alt', '').strip():
            self.errors.append('Image without alt text')
        for key in ('href', 'src'):
            if a.get(key):
                self.links.append(a[key])

def resolve(url, source):
    parsed = urlsplit(url)
    if parsed.scheme not in ('', 'http', 'https') or (parsed.netloc and parsed.hostname not in ('sunwoo-j.github.io', '127.0.0.1', 'localhost')):
        return None
    path = unquote(parsed.path)
    target = SITE / path.lstrip('/') if path.startswith('/') else source.parent / path
    if target.is_dir():
        target /= 'index.html'
    return target.resolve(), unquote(parsed.fragment)

paths = [SITE / 'index.html', SITE / 'journal/index.html', SITE / 'portfolio/index.html', SITE / 'about/index.html']
paths += sorted((SITE / 'posts').glob('*/index.html'))
paths += sorted((SITE / 'en').rglob('index.html'))
pages = {p.resolve(): Page(p) for p in paths}
errors = []
for path, page in pages.items():
    errors += [f'{path.relative_to(SITE)}: {e}' for e in page.errors]
    for link in page.links:
        target = resolve(link, path)
        if target is None:
            continue
        file, fragment = target
        if not file.exists():
            errors.append(f'{path.relative_to(SITE)}: missing {link}')
        elif fragment and file.suffix == '.html':
            other = pages.get(file) or Page(file)
            if fragment not in other.ids:
                errors.append(f'{path.relative_to(SITE)}: missing anchor {link}')
    if '/posts/' in path.as_posix() or path.name == 'index.html' and path.parent.name == 'about':
        if set(page.alternates) != {'ko', 'en'}:
            errors.append(f'{path.relative_to(SITE)}: missing language pair')
        if page.article_language != page.language:
            errors.append(f'{path.relative_to(SITE)}: article language mismatch')

for post in (ROOT / '_posts').glob('*.md'):
    slug = post.stem[11:]
    translation = ROOT / '_translations' / f'{slug}.md'
    original = post.read_text(encoding='utf-8')
    if not translation.exists() and 'mechureal-devlog-' in slug:
        continue  # A Mechureal post may not have a published translation yet.
    english = translation.read_text(encoding='utf-8')
    codes = lambda s: re.findall(r'```[^\n]*\n.*?```', s, re.S)
    if codes(original) != codes(english):
        errors.append(f'{slug}: code examples differ between languages')
    if re.search(r'\[PART_\d+\]', english):
        errors.append(f'{slug}: unexpanded translation placeholder')
    if not (SITE / 'en/posts' / slug / 'index.html').exists():
        errors.append(f'{slug}: missing English output')

dictionary = (ROOT / '_includes/language-data.html').read_text(encoding='utf-8')
dictionary = json.loads(dictionary[dictionary.index('{'):dictionary.rindex('}')+1])
for p in [ROOT / 'index.html', ROOT / 'journal.html', SITE / 'portfolio/index.html', *ROOT.glob('_layouts/lily*.html')]:
    for key in re.findall(r'data-i18n(?:-aria-label|-placeholder|-alt)?="([^"]+)"', p.read_text(encoding='utf-8')):
        if key not in dictionary or set(dictionary[key]) != {'ko', 'en'}:
            errors.append(f'{p.name}: missing translation key {key}')

if (SITE / 'en/posts/ui-ux-1/index.html').exists():
    errors.append('Draft translation was published')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(pages)} pages; language pairs, internal links, image paths, anchors, dictionary keys, identical code examples, and draft exclusion.')
