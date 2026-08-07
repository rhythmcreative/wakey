"""Generate the brand assets under custom_components/wakey/brand/.

Kept in the repo so the icons are reproducible rather than binary blobs of
unknown origin. Run with any Python that has Pillow:

    python scripts/make_brand.py
"""

from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw

OUT = pathlib.Path(__file__).resolve().parent.parent / "custom_components" / "wakey" / "brand"

AMBER = (255, 176, 32, 255)
AMBER_DEEP = (224, 138, 0, 255)
FACE = (255, 249, 240, 255)
INK = (33, 42, 54, 255)

SS = 4  # supersample factor, downsampled at the end for clean edges


def draw_icon(size: int) -> Image.Image:
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cx, cy = s / 2, s / 2 + s * 0.035
    body_r = s * 0.36
    bell_r = s * 0.115

    def circle(x, y, r, fill):
        d.ellipse([x - r, y - r, x + r, y + r], fill=fill)

    # Bells, tucked behind the body.
    offset = body_r * 0.80
    circle(cx - offset, cy - offset, bell_r, AMBER_DEEP)
    circle(cx + offset, cy - offset, bell_r, AMBER_DEEP)

    # Feet.
    foot_r = s * 0.055
    circle(cx - body_r * 0.72, cy + body_r * 0.80, foot_r, AMBER_DEEP)
    circle(cx + body_r * 0.72, cy + body_r * 0.80, foot_r, AMBER_DEEP)

    # Case and face.
    circle(cx, cy, body_r, AMBER)
    circle(cx, cy, body_r * 0.78, FACE)

    # Hands: a little before seven, which is what an alarm clock is for.
    w = s * 0.028
    d.line([cx, cy, cx, cy - body_r * 0.52], fill=INK, width=int(w * 1.1))
    d.line([cx, cy, cx - body_r * 0.34, cy + body_r * 0.30], fill=INK, width=int(w * 1.3))
    circle(cx, cy, w * 1.15, INK)

    return img.resize((size, size), Image.LANCZOS)


def draw_logo(width: int, height: int) -> Image.Image:
    """Wordless logo: the icon on a wider canvas, as brands expects."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    icon = draw_icon(height)
    img.paste(icon, ((width - height) // 2, 0), icon)
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    draw_icon(256).save(OUT / "icon.png")
    draw_icon(512).save(OUT / "icon@2x.png")
    draw_logo(512, 256).save(OUT / "logo.png")
    draw_logo(1024, 512).save(OUT / "logo@2x.png")
    for p in sorted(OUT.iterdir()):
        print(f"{p.name}: {Image.open(p).size}")


if __name__ == "__main__":
    main()
