import json

pages = {
    "Components":         "1:417",
    "LayoutPatterns":     "1:643",
    "DataDisplay":        "1:867",
    "FormPatterns":       "1:1115",
    "AccessibilityRules": "1:1342",
}

def walk_text(node, results, path=""):
    if not isinstance(node, dict): return
    name = node.get("name","")
    ntype = node.get("type","")
    chars = node.get("characters","")
    cur_path = f"{path}/{name}"

    if ntype == "TEXT" and chars.strip():
        style = node.get("style", {})
        fills = node.get("fills", [])
        color = ""
        for f in fills:
            if isinstance(f,dict) and f.get("type")=="SOLID" and f.get("color"):
                c=f["color"]
                color="#{:02X}{:02X}{:02X}".format(int(round(c.get("r",0)*255)),int(round(c.get("g",0)*255)),int(round(c.get("b",0)*255)))
                break
        results.append({
            "path": cur_path,
            "chars": chars,
            "fontSize": style.get("fontSize",""),
            "fontWeight": style.get("fontWeight",""),
            "color": color
        })

    for child in node.get("children",[]):
        walk_text(child, results, cur_path)

for page_name, node_id in pages.items():
    with open(f"d:/vbts_db/references/{page_name.lower()}_raw.json", encoding="utf-8") as f:
        data = json.load(f)
    doc = data.get("nodes",{}).get(node_id,{}).get("document")
    if not doc: continue
    results = []
    walk_text(doc, results)
    safe = []
    for r in results:
        safe.append({k: v.encode('ascii','replace').decode() if isinstance(v,str) else v for k,v in r.items()})

    print(f"\n{'='*60}")
    print(f"PAGE: {page_name}")
    print(f"{'='*60}")
    for r in safe:
        if r["chars"].strip():
            print(f"  [{r['fontSize']}px w{r['fontWeight']} {r['color']}] \"{r['chars'][:120]}\"")
            print(f"    path: {r['path'][-80:]}")
