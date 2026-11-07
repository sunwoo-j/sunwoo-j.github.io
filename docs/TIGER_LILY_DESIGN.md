# Tiger Lily personal website

The existing Jekyll repository now has an independent portfolio homepage, a searchable journal, and matching article pages. Post permalinks and Markdown content are unchanged. The original Chirpy category/tag/archive pages remain available at their existing URLs. GitHub Pages builds and deploys the website when changes are pushed to master.

## Design

- Electric orange `#ff5c1a`, near-black `#090909`, and warm paper `#eeeae2`.
- Oversized Barlow Condensed headings; Space Grotesk and Noto Sans KR body text.
- Lando Norris reference: https://landonorris.com/ (large typography, vivid accent, editorial rhythm).
- Hero artwork is a generated tiger lily, not an image taken from the reference website.
- Delivery Simulator artwork is explicitly labeled a concept visual; it is not a gameplay screenshot.
- Journal categories, dates, titles, and links come from `site.posts`.
- Giscus retains the configured repository, category, and pathname mapping.
- Motion can be disabled in the footer. System reduced-motion preferences take priority.

## Main files

- `index.html`: homepage content and composition.
- `_layouts/lily.html`: navigation, metadata, footer, and shared assets.
- `_layouts/lily-post.html`: article layout and comments.
- `_includes/lily-entry.html`: shared journal entry.
- `journal.html`: complete archive with topic/search controls.
- `assets/css/lily.css`: design tokens, layouts, and responsive styles.
- `assets/js/lily.js`: mobile navigation, motion preferences, and combined filters.

Run `bundle exec jekyll serve --host 127.0.0.1 --port 4000` from the repository, then open http://127.0.0.1:4000/. For a static build, use `bundle exec jekyll build`.

## Generated artwork provenance

Generated with the built-in imagegen tool. Web-optimized artwork: `assets/img/tiger-lily/hero.webp` (approximately 225 KB). WebP encoding preserves the generated composition.

Final prompt:

> Use case: stylized-concept. Asset type: premium personal portfolio website hero artwork. Create one stunning oversized tiger lily flower in macro, electric fluorescent vermilion orange (#ff5a12) recurved petals with rich natural black spots, black filaments and copper orange anthers, subtly sculptural almost lacquered organic texture yet botanically recognizable. One flower head with just a short dark stem, diagonal dynamic composition, three-quarter front view. Entire bloom contained in frame with 8 percent breathing room. Pure near-black (#080808) seamless background. Dramatic hard studio light and precise specular highlights on translucent petals, profound shadows. Sophisticated experimental editorial photography, ultra detailed, high contrast. Square composition. No text, typography, border, UI, logo, watermark, additional flowers or green foliage.

## Cleanup

Unused Chirpy home/post layouts and their exclusive sharing, reading-time, related-post, post-navigation, and pagination fragments were removed. Existing category, tag, archive, and about routes still use Chirpy, so their templates, styles, scripts, and build dependencies remain. The uncompressed hero duplicate and local build log were removed; social previews use the same WebP as the homepage. Journal lists all posts, so legacy homepage pagination is disabled. The supplied logo source and Markdown drafts are retained for editing.

## Mechureal devlog synchronization

The Pages workflow checks out the public Mechureal repository and runs `python tools/sync_mechureal.py <mechureal-checkout>` before building. It runs daily and on personal-site pushes; published Korean Markdown devlogs and available English translations are mirrored with links to their originals. Drafts and future-dated posts are excluded. Images remain hosted on Mechureal. Run the same command locally (with PyYAML installed) after updating that checkout. MDX posts require conversion to Markdown before they can be mirrored.
