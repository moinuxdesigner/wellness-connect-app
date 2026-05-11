import json, sys

def to_hex(r, g, b):
    return "#{:02X}{:02X}{:02X}".format(int(round(r*255)), int(round(g*255)), int(round(b*255)))

def walk(node, colors, texts, components, depth=0):
    if not isinstance(node, dict):
        return

    name = node.get("name", "")
    ntype = node.get("type", "")

    # Collect fills
    for fill in node.get("fills", []):
        if fill.get("type") == "SOLID" and "color" in fill:
            c = fill["color"]
            hex_val = to_hex(c["r"], c["g"], c["b"])
            if hex_val not in ("#000000", "#FFFFFF") or True:
                colors.append({"name": name, "type": ntype, "hex": hex_val, "alpha": c.get("a", 1)})

    # Collect text
    if ntype == "TEXT":
        style = node.get("style", {})
        texts.append({
            "chars": node.get("characters", ""),
            "fontFamily": style.get("fontFamily", ""),
            "fontSize": style.get("fontSize", ""),
            "fontWeight": style.get("fontWeight", ""),
            "letterSpacing": style.get("letterSpacing", ""),
            "lineHeightPx": style.get("lineHeightPx", ""),
            "fills": [{"hex": to_hex(f["color"]["r"], f["color"]["g"], f["color"]["b"])}
                      for f in node.get("fills", []) if f.get("type") == "SOLID" and "color" in f]
        })

    # Collect component names
    if ntype in ("COMPONENT", "COMPONENT_SET", "FRAME"):
        components.append({"name": name, "type": ntype, "depth": depth,
                           "w": node.get("absoluteBoundingBox", {}).get("width", ""),
                           "h": node.get("absoluteBoundingBox", {}).get("height", ""),
                           "bg": to_hex(*[node.get("backgroundColor", {}).get(k, 0) for k in ["r","g","b"]]) if node.get("backgroundColor") else "",
                           "padding": {
                               "top": node.get("paddingTop", ""),
                               "right": node.get("paddingRight", ""),
                               "bottom": node.get("paddingBottom", ""),
                               "left": node.get("paddingLeft", ""),
                           },
                           "itemSpacing": node.get("itemSpacing", ""),
                           "layoutMode": node.get("layoutMode", ""),
                           "cornerRadius": node.get("cornerRadius", ""),
                           "strokes": [{"hex": to_hex(s["color"]["r"], s["color"]["g"], s["color"]["b"])}
                                      for s in node.get("strokes", []) if s.get("type") == "SOLID" and "color" in s]
                          })

    for child in node.get("children", []):
        walk(child, colors, texts, components, depth+1)


pages = {
    "page01_foundations": "1:2",
    "page02_components": "1:417",
    "page03_layouts": "1:643",
    "page04_datadisplay": "1:867",
    "page05_forms": "1:1115",
    "page06_accessibility": "1:1342",
}

all_colors = {}
all_texts = {}
all_components = {}

for fname, node_id in pages.items():
    with open(f"d:/vbts_db/references/{fname}.json", encoding="utf-8-sig") as f:
        data = json.load(f)
    node_key = node_id.replace("-", ":")
    # Try both formats
    doc = data.get("nodes", {}).get(node_key, {}).get("document") or \
          data.get("nodes", {}).get(node_id, {}).get("document")
    if not doc:
        print(f"[WARN] No document found for {fname}")
        continue
    colors, texts, components = [], [], []
    walk(doc, colors, texts, components)
    all_colors[fname] = colors
    all_texts[fname] = texts
    all_components[fname] = components

# Print summary
print("\n" + "="*60)
print("DESIGN TOKEN EXTRACTION REPORT")
print("="*60)

# Unique colors across all pages
print("\n--- ALL UNIQUE COLORS ---")
color_set = {}
for page, cols in all_colors.items():
    for c in cols:
        h = c["hex"]
        if h not in color_set:
            color_set[h] = []
        color_set[h].append(c["name"])

for hex_val, names in sorted(color_set.items()):
    unique_names = list(set(names))[:3]
    print(f"  {hex_val}  ← {', '.join(unique_names)}")

# Typography from page 01
print("\n--- TYPOGRAPHY (Page 01 Foundations) ---")
seen_sizes = set()
for t in all_texts.get("page01_foundations", []):
    key = (t["fontSize"], t["fontWeight"])
    if key not in seen_sizes and t["fontSize"]:
        seen_sizes.add(key)
        fill_hex = t["fills"][0]["hex"] if t["fills"] else "N/A"
        print(f"  {t['fontFamily']}  size={t['fontSize']}  weight={t['fontWeight']}  color={fill_hex}  → \"{t['chars'][:50]}\"")

# Text samples showing content
print("\n--- ALL TEXT CONTENT (Page 01) ---")
for t in all_texts.get("page01_foundations", []):
    if t["chars"].strip():
        print(f"  [{t['fontSize']}px w{t['fontWeight']}] \"{t['chars'][:80]}\"")

# Components per page
for fname in pages.keys():
    comps = all_components.get(fname, [])
    top = [c for c in comps if c["depth"] <= 2]
    print(f"\n--- TOP COMPONENTS: {fname} ---")
    for c in top[:20]:
        pad = c["padding"]
        print(f"  [{c['type']}] {c['name']}  bg={c['bg']}  w={c['w']}  h={c['h']}  layout={c['layoutMode']}  gap={c['itemSpacing']}  radius={c['cornerRadius']}  strokes={c['strokes']}")

print("\nDONE")
