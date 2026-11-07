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

for path in sorted((source / 'src/content/devlog/ko').glob('*.md')):
    ko, body = read(path)
    published = ko['date'] if isinstance(ko['date'], date) else date.fromisoformat(str(ko['date'])[:10])
    if ko.get('draft') or published > datetime.now(timezone.utc).date():
        continue
    slug = ko['slug']
    en_path = source / 'src/content/devlog/en' / path.name
    en, en_body = read(en_path) if en_path.exists() else (None, None)
    if en and (en.get('draft') or date.fromisoformat(str(en['date'])[:10]) > datetime.now(timezone.utc).date()):
        en, en_body = None, None
    name = 'mechureal-devlog-' + slug
    original = '/posts/' + name + '/'
    translated = '/en/posts/' + name + '/'
    def content(text, lang):
        text = re.sub(r'(?P<prefix>(?:src|href|data-optional-src)=["\'])/', r'\g<prefix>' + base + '/', text)
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
