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
npm test         # testy modelu kalkulačky
```

## Kde co je

- `src/App.jsx` — web: barvy (`T`), anglický obsah, komponenty.
- `src/model.js` — model kalkulačky (`calcLifespan`) a kontrola uložených odpovědí; testy v `src/model.test.js`.
- `src/details-en.js`, `src/details-cs.js` — dlouhé rozbory pilířů; načítají se až po otevření pilíře.
- `src/content-cs.js` — české texty a anglické texty rozhraní (objekt `UI`).
- `src/Avatar3D.jsx` — realistická 3D postava (three.js), která reaguje na posuvníky. Načítá se až u kalkulačky;
  bez WebGL 2, při omezeném pohybu nebo při chybě načítání zůstává `src/Avatar2D.jsx` (SVG).
- `src/avatar-params.js` — jak odpovědi mění vzhled postavy (sdílí 2D i 3D).
- `public/models/avatar-<pohlaví>-<styl>.glb` — 3D postavy (muž, žena × sportovec, právník, gangster) s tvary
  svaly / ochablost / váha / štíhlost / stáří / úsměv / smutek / únava, kostrou, rekvizitami v rukou
  (cigareta, doutník, e-cigareta, pivo, víno, whisky, panák) a animacemi `smoke` a `drink`. Vyrábí je
  `blender/build_avatar.py` (viz níže). Autoři v `public/models/CREDITS.md`. Styl si návštěvník vybere nad
  postavou (pamatuje se v prohlížeči); kouření a pití se ukáže podle posuvníků a typ podle stylu.
- `public/og.png` — náhled pro sdílení (1200×630).

## Pravidla pro obsah

- Čísla na webu musí mít zdroj. Co nejde doložit, formuluj opatrně („odhad", „spojeno s").
- Efekty pilířů se **nesčítají** — model počítá s klesajícími výnosy, takže na webu nesčítej maxima.
- Barvy textu drž v kontrastu aspoň 4,5 : 1 (WCAG AA); tokeny `sub`, `dim`, `accent`, `aurora`, `warm` už to splňují.

## 3D postavy

Potřebuješ Blender 5 s rozšířením MPFB (MakeHuman pro Blender) a jeho balíčky assetů — stejné nastavení jako
v `~/dev/longevityclinic/blender`.

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P blender/build_avatar.py                    # všech 6 postav (~2 min)
/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P blender/build_avatar.py -- --sex female --style lawyer --preview
/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P blender/build_avatar.py -- --quick --preview  # bez tvarů těla, rychlá kontrola
```

`--preview` uloží náhledy všech tvarů do `blender/previews/` (není v gitu).

