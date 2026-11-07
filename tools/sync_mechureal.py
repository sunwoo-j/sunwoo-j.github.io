from pathlib import Path
from datetime import date, datetime, timezone
import re, sys, yaml

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1])
base = 'https://mechureal.github.io'
for folder in (root / '_posts', root / '_translations'):
    for old in folder.glob('*mechureal-devlog-*.md'):
        old.unlink()

def read(path):
    text = path.read_text(encoding='utf-8')
    _, front, body = text.split('---', 2)
    return yaml.safe_load(front), body

def write(path, metadata, body):
    path.write_text('---\n' + yaml.safe_dump(metadata, allow_unicode=True, sort_keys=False) + '---\n' + body, encoding='utf-8')

def publication_date(metadata):
    return date.fromisoformat(str(metadata['date'])[:10])

def is_public_devlog(metadata):
    tags = {tag.strip().casefold() for tag in metadata.get('tags', [])}
    # Older Mechureal announcements lived in the devlog directory.
    return (
        not metadata.get('draft')
        and not tags.intersection({'announcement', 'announcements'})
        and publication_date(metadata) <= datetime.now(timezone.utc).date()
    )

def optional_figure(match):
    figure = match.group()
    image = re.search(r'data-optional-src=(["\'])(/images/[^"\']+)\1', figure)
    if not image:
        return figure
    if not (source / 'public' / image[2].lstrip('/')).is_file():
        return ''
    figure = re.sub(r'(<figure\b[^>]*?)\s+hidden(?=[\s>])', r'\1', figure, count=1)
    return figure.replace('data-optional-src=', 'src=', 1)

for path in sorted((source / 'src/content/devlog/ko').glob('*.md')):
    ko, body = read(path)
    if not is_public_devlog(ko):
        continue
    published = publication_date(ko)
    slug = ko['slug']
    en_path = source / 'src/content/devlog/en' / path.name
    en, en_body = read(en_path) if en_path.exists() else (None, None)
    if en and not is_public_devlog(en):
        en, en_body = None, None
    name = 'mechureal-devlog-' + slug
    original = '/posts/' + name + '/'
    translated = '/en/posts/' + name + '/'
    def content(text, lang):
        text = re.sub(r'<figure\b[^>]*>.*?</figure>', optional_figure, text, flags=re.S)
        text = re.sub(r'(?P<prefix>(?:src|href)=["\'])/', r'\g<prefix>' + base + '/', text)
        text = re.sub(r'(?<=\]\()/', base + '/', text)
        label = '메추리알 원문 보기' if lang == 'ko' else 'Read the original on Mechureal'
        return '\n> [' + label + '](' + base + '/' + lang + '/devlog/' + slug + '/)\n' + text
    meta = dict(title=ko['title'], date=str(published), categories=['Dev Journal'], tags=ko.get('tags', []), description=ko.get('description', ''), lang='ko', source_mechureal=True)
    if en:
        meta.update(english_title=en['title'], english_description=en.get('description', ''), translation_url=translated)
    write(root / '_posts' / (str(published) + '-' + name + '.md'), meta, content(body, 'ko'))
    if en:
        emeta = dict(title=en['title'], date=str(published), categories=['Dev Journal'], tags=en.get('tags', []), description=en.get('description', ''), lang='en', layout='lily-post', original_url=original, permalink=translated, source_mechureal=True)
        write(root / '_translations' / (name + '.md'), emeta, content(en_body, 'en'))
print('Mechureal devlogs synchronized.')
