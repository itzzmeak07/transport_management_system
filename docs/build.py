"""Builds the FreshTrack mockup pages.

src/*.html hold the body of each board. This script wraps them into:
  - one standalone page per board (links assets/ft.css and assets/ft.js)
  - FreshTrack_All_Designs.html: every board in one self-contained file (CSS/JS inlined)
Run:  python build.py
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
BOARDS = [
    ("00_style_guide", "Style Guide & Overview", "Brand, colours, type, stop markers, components, sample trip, and the key screens at a glance."),
    ("01_admin_dashboard", "Admin Dashboard", "The dispatcher's all-day screen: KPIs, live map, needs-attention list, active trips."),
    ("02_create_trip", "Create Trip: Stops Builder", "Admin builds a trip with ordered dealer stops, capacity check and route preview. Includes the overload state."),
    ("03_live_map_trip_detail", "Live Map & Trip Detail", "All trucks on one map, a trip's stop-by-stop progress, timeline and admin-only stop actions."),
    ("04_approvals_pod_masters", "Approvals, POD Review & Vehicles", "Skip-stop decisions, KYC approval, proof-of-delivery review with GPS check, vehicles master."),
    ("05_driver_app", "Driver App", "Big-button Android screens for drivers: loading, next stop, OTP delivery, offline, Hindi version."),
    ("06_dealer_app", "Dealer App & Tracking Link", "A dealer sees only their own stop: live ETA, You're next, OTP, receiving goods, POD."),
    ("07_owner_app", "Vehicle Owner App", "Trip offers, assigning truck and driver, live trips, fleet documents, drivers and earnings."),
    ("08_onboarding_admin_monitor", "Login & Admin Monitor", "Language, OTP login, role picker, notifications, and the admin's on-the-go monitor mode."),
]
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400..600,0..1,0&display=block">')


def nav(current, single):
    links = []
    for slug, title, _ in BOARDS:
        href = f"#{slug}" if single else f"{slug}.html"
        style = "font-weight:700;color:var(--g)" if slug == current else "color:var(--s600)"
        links.append(f'<a href="{href}" style="{style};text-decoration:none;white-space:nowrap">{title}</a>')
    home = "#top" if single else "index.html"
    return ('<nav style="position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:rgba(255,255,255,.96);border-bottom:1px solid var(--s200);backdrop-filter:blur(6px)">'
            '<div style="max-width:1560px;margin:0 auto;padding:10px 24px;display:flex;gap:18px;align-items:center;overflow-x:auto;font-size:13px">'
            f'<a href="{home}" class="brandmark" style="text-decoration:none;font-size:16px"><span class="leaf"><span class="ms fill">eco</span></span>FreshTrack</a>'
            + "".join(links) + '</div></nav>')


def index_body(single):
    cards = []
    for i, (slug, title, desc) in enumerate(BOARDS):
        href = f"#{slug}" if single else f"{slug}.html"
        cards.append(f'<a class="idx-card" href="{href}"><span class="n">BOARD {i:02d}</span><h3>{title}</h3><p>{desc}</p></a>')
    return ('<div class="board" id="top"><div class="board-head"><div>'
            '<div class="brandmark" style="font-size:22px;margin-bottom:10px"><span class="leaf" style="width:40px;height:40px;border-radius:12px"><span class="ms fill" style="font-size:26px">eco</span></span>FreshTrack</div>'
            '<h1>Product design preview</h1>'
            '<p>How the FreshTrack transport management system will look: the admin web panel and the Android app for vehicle owners, drivers and dealers. '
            'Every screen uses one sample trip: truck MH13-AB-1234 leaves Solapur APMC with goods for three dealers (Hyderabad → Vijayawada → Visakhapatnam) and delivers them in the order the admin set.</p>'
            '<p class="small muted" style="margin-top:8px">Design mockups for discussion. Names, numbers and maps are illustrative sample data.</p>'
            '</div></div><div class="idx-grid">' + "".join(cards) + '</div></div>')


def main():
    css = (ROOT / "assets/ft.css").read_text(encoding="utf-8")
    js = (ROOT / "assets/ft.js").read_text(encoding="utf-8")
    bodies = {slug: ((ROOT / "src" / f"{slug}.html").read_text(encoding="utf-8") if (ROOT / "src" / f"{slug}.html").exists() else "<div class='board'><p>Coming soon</p></div>") for slug, _, _ in BOARDS}

    head = lambda title, inline: (
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>{title}</title>{FONTS}' + (f"<style>{css}</style>" if inline else '<link rel="stylesheet" href="assets/ft.css">') + '</head><body>')
    tail = lambda inline: (f"<script>{js}</script>" if inline else '<script src="assets/ft.js"></script>') + "</body></html>"

    for slug, title, desc in BOARDS:
        html = head(f"FreshTrack · {title}", False) + nav(slug, False) + bodies[slug] + tail(False)
        (ROOT / f"{slug}.html").write_text(html, encoding="utf-8")
    (ROOT / "index.html").write_text(head("FreshTrack Design Preview", False) + nav(None, False) + index_body(False) + tail(False), encoding="utf-8")

    combined = "".join(f'<section id="{slug}">{bodies[slug]}</section>' for slug, _, _ in BOARDS)
    all_html = head("FreshTrack Design Preview", True) + nav(None, True) + index_body(True) + combined + tail(True)
    (ROOT / "FreshTrack_All_Designs.html").write_text(all_html, encoding="utf-8")

    # Artifact build (publish wrapper adds doctype/head/body itself)
    art = ('<title>FreshTrack Design Preview</title>' + FONTS + f"<style>{css}</style>" + nav(None, True)
           + index_body(True) + combined + f"<script>{js}</script>")
    (ROOT / "_artifact.html").write_text(art, encoding="utf-8")
    print("built", len(BOARDS), "boards")


if __name__ == "__main__":
    main()
