# Longevity Lab

Česko-anglický vzdělávací web o zdravém stárnutí: kalkulačka „kolik let zdraví ti dávají tvoje návyky",
sedm pilířů (pohyb, strava, vztahy, spánek, sauna, chlad, doplňky) s hloubkovými rozbory, 30denní protokol,
biomarkery, slovník a FAQ.

Živě: https://longevity-lab-wheat.vercel.app

Kalkulačka dává **odhad proti průměrné populaci s pásmem nejistoty**, ne předpověď. Web je vzdělávací,
nenahrazuje lékařskou radu.

## Spuštění

```bash
npm install
npm run dev      # vývoj na http://localhost:5173
npm run build    # produkční build do dist/
npm run lint
```

## Kde co je

- `src/App.jsx` — celý web: barvy (`T`), anglický obsah, model kalkulačky (`calcLifespan`), komponenty.
- `src/content-cs.js` — české texty a anglické texty rozhraní (objekt `UI`).
- `src/Avatar2D.jsx` — avatar, který reaguje na posuvníky.
- `public/og.png` — náhled pro sdílení (1200×630).

## Pravidla pro obsah

- Čísla na webu musí mít zdroj. Co nejde doložit, formuluj opatrně („odhad", „spojeno s").
- Efekty pilířů se **nesčítají** — model počítá s klesajícími výnosy, takže na webu nesčítej maxima.
- Barvy textu drž v kontrastu aspoň 4,5 : 1 (WCAG AA); tokeny `sub`, `dim`, `accent`, `aurora`, `warm` už to splňují.
