import json
import urllib.request

TOKEN = "<FIGMA_PERSONAL_ACCESS_TOKEN>"
FILE_KEY = "YPcsNzDtaqn2O4FfEJ6CI4"

PAGES = {
    "Foundations":        "1:2",
    "Components":         "1:417",
    "LayoutPatterns":     "1:643",
    "DataDisplay":        "1:867",
    "FormPatterns":       "1:1115",
    "AccessibilityRules": "1:1342",
}

def fetch(url):
    req = urllib.request.Request(url, headers={"X-Figma-Token": TOKEN})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())

def to_hex(r, g, b):
    return "#{:02X}{:02X}{:02X}".format(int(round(r*255)), int(round(g*255)), int(round(b*255)))

def walk(node, colors, texts, frames):
    if not isinstance(node, dict):
        return
    name = node.get("name", "")
    ntype = node.get("type", "")

    # fills
    for fill in node.get("fills", []):
        if isinstance(fill, dict) and fill.get("type") == "SOLID":
            c = fill.get("color", {})
            if c:
                hex_val = to_hex(c.get("r",0), c.get("g",0), c.get("b",0))
                colors.setdefault(hex_val, []).append(name)

    # text
    if ntype == "TEXT":
        style = node.get("style", {})
        text_fills = []
        for f in node.get("fills", []):
            if isinstance(f, dict) and f.get("type") == "SOLID" and f.get("color"):
                c = f["color"]
                text_fills.append(to_hex(c.get("r",0), c.get("g",0), c.get("b",0)))
        texts.append({
            "chars": node.get("characters", ""),
            "fontFamily": style.get("fontFamily", ""),
            "fontSize": style.get("fontSize", ""),
            "fontWeight": style.get("fontWeight", ""),
            "lineH": style.get("lineHeightPx", ""),
            "ls": style.get("letterSpacing", ""),
            "color": text_fills[0] if text_fills else "",
        })

    # frames / components
    if ntype in ("FRAME", "COMPONENT", "COMPONENT_SET", "INSTANCE"):
        bb = node.get("absoluteBoundingBox", {})
        stroke_colors = []
        for s in node.get("strokes", []):
            if isinstance(s, dict) and s.get("type") == "SOLID" and s.get("color"):
                c = s["color"]
                stroke_colors.append(to_hex(c.get("r",0), c.get("g",0), c.get("b",0)))
        bg = node.get("backgroundColor", {})
        bg_hex = to_hex(bg.get("r",0), bg.get("g",0), bg.get("b",0)) if bg else ""
        frames.append({
            "name": name, "type": ntype,
            "w": bb.get("width",""), "h": bb.get("height",""),
            "bg": bg_hex,
            "cornerRadius": node.get("cornerRadius", ""),
            "layout": node.get("layoutMode", ""),
            "gap": node.get("itemSpacing", ""),
            "pt": node.get("paddingTop", ""), "pr": node.get("paddingRight", ""),
            "pb": node.get("paddingBottom", ""), "pl": node.get("paddingLeft", ""),
            "strokes": stroke_colors,
        })

    for child in node.get("children", []):
        walk(child, colors, texts, frames)

# Fetch all pages
report = {}
for page_name, node_id in PAGES.items():
    print(f"Fetching {page_name} ({node_id})...")
    url = f"https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={node_id}"
    data = fetch(url)
    doc = data.get("nodes", {}).get(node_id, {}).get("document")
    if not doc:
        print(f"  [WARN] No document for {page_name}")
        continue
    colors, texts, frames = {}, [], []
    walk(doc, colors, texts, frames)
    report[page_name] = {"colors": colors, "texts": texts, "frames": frames}
    # Save raw JSON too
    with open(f"d:/vbts_db/references/{page_name.lower()}_raw.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"  Colors: {len(colors)}, Texts: {len(texts)}, Frames: {len(frames)}")

# Save report
with open("d:/vbts_db/references/design_report.json", "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2)

# Print human-readable summary
print("\n" + "="*70)
print("DESIGN SYSTEM EXTRACTION COMPLETE")
print("="*70)

# Aggregate colors
all_colors = {}
for page, data in report.items():
    for hex_val, names in data["colors"].items():
        all_colors.setdefault(hex_val, []).extend(names)

print("\n--- COLOR PALETTE (all pages) ---")
for hex_val, names in sorted(all_colors.items()):
    sample_names = [n.encode('ascii','replace').decode() for n in list(set(names))[:2]]
    print(f"  {hex_val}  <- {', '.join(sample_names)}")

# Typography from foundations
print("\n--- TYPOGRAPHY SCALE (Foundations page) ---")
found_ty = report.get("Foundations", {}).get("texts", [])
seen = set()
for t in found_ty:
    key = (t["fontSize"], t["fontWeight"])
    if key not in seen and t["fontSize"]:
        seen.add(key)
        chars = t['chars'][:60].encode('ascii','replace').decode()
        print(f"  {t['fontFamily'] or 'N/A'}  {t['fontSize']}px  w{t['fontWeight']}  color={t['color']}  -> \"{chars}\"")

# All text content from foundations
print("\n--- ALL TEXT (Foundations) ---")
for t in found_ty:
    if t["chars"].strip():
        chars = t['chars'][:100].encode('ascii','replace').decode()
        print(f"  [{t['fontSize']}px w{t['fontWeight']} {t['color']}] \"{chars}\"")

# Component details per page
for page_name in PAGES:
    frms = report.get(page_name, {}).get("frames", [])
    named = [f for f in frms if not f["name"].startswith("Container") and f["name"] not in ("","Foundations","Components")]
    print(f"\n--- FRAMES/COMPONENTS: {page_name} (top {min(25,len(named))}) ---")
    for f in named[:25]:
        fname_s = f["name"].encode('ascii','replace').decode()
        w = f['w']
        w_str = f"{w:.0f}" if isinstance(w, float) else str(w)
        print(f"  [{f['type']}] \"{fname_s}\"  bg={f['bg']}  w={w_str}  layout={f['layout']}  gap={f['gap']}  radius={f['cornerRadius']}  stroke={f['strokes']}")
