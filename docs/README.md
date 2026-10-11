# FreshTrack: Design Mockups

High-fidelity UI mockups for the transport management system, made to show the client what the product will look like before development starts. They follow the project research pack and design prompts.

**Brand used:** FreshTrack, "Perishables. On Time." (taken from the Prompt 0 reference result). Deep green `#1B6B4A` with amber `#F2A900`. If the client picks another name or colour, change it in `assets/ft.css` and `assets/ft.js`, then rebuild.

## What to open

| File | Use it for |
|---|---|
| `FreshTrack_All_Designs.html` | **One file with every board.** Double-click to open in Chrome or Edge, or send it to the client. Needs internet for fonts and icons |
| `png/*.png` | Ready-made images of each board, for WhatsApp, email or a slide deck |
| `index.html` + `00_…` to `08_…html` | The same boards as separate pages with a top menu |

## Boards

| # | Board | Screens |
|---|---|---|
| 00 | Style guide & overview (Prompt 0) | Colours, status colours, stop markers, type, components, sample trip, 4 key screens |
| 01 | Admin dashboard | KPIs, live mini-map, needs attention, active trips, on-time by stop chart |
| 02 | Create trip: stops builder | Trip details, 3 ordered dealer stops with goods, capacity, route preview with ETAs, overload state |
| 03 | Live map & trip detail | Fleet map with filters and drawer, trip overview, timeline, admin skip-stop dialog |
| 04 | Approvals, POD & vehicles | Can't-deliver decision, KYC approvals, POD review with GPS check, vehicles master |
| 05 | Driver app | Permission, home, loading sheet, next stop (EN + Hindi), report problem, offline, OTP, OTP error, quantities, can't deliver, waiting, trip complete |
| 06 | Dealer app & tracking link | Deliveries, detail, live tracking (private), You're next, arrived, receive goods, OTP, delivered, share page |
| 07 | Vehicle owner app | KYC, home, trip offer, assign truck and driver, trip live, trucks, add truck, drivers, earnings |
| 08 | Login & admin monitor | Splash, language, mobile login, OTP, role picker, notifications, admin dashboard, map, trip, approval |

In total: 7 full desktop screens plus 3 close-up views (overload state, timeline, skip dialog), and 44 phone screens.

## Notes
- All names, numbers and maps are illustrative sample data. The maps are hand-drawn, not real map tiles.
- Every screen uses one sample trip: SLP-2610-00123, truck MH13-AB-1234, Solapur → Hyderabad → Vijayawada → Visakhapatnam.

## Editing
Screens live in `src/*.html`, and the shared style is in `assets/ft.css`. Maps, the phone status bar and the admin sidebar are drawn by `assets/ft.js`. After editing, run:

```
python build.py
```

To regenerate a PNG (Chrome):
```
chrome --headless=new --window-size=1600,4200 --virtual-time-budget=6000 --screenshot=png/05_driver_app.png 05_driver_app.html
```
