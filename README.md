# 🎉 Zaproszenia na osiemnastkę

Statyczna strona z **imiennymi zaproszeniami** na 18. urodziny — 16 sierpnia 2026.
Każdy gość dostaje własny link w formie **instagramowej relacji (story)**:

1. **Hej, [imię]** — powitanie
2. **Dlaczego Ty** — osobista wiadomość
3. **Zdjęcie** — pełnoekranowe, z podpisem
4. **Szczegóły + RSVP** — data, miejsce, dress code i potwierdzenie obecności

Nawigacja jak na Instagramie: tap po prawej = dalej, po lewej = wstecz,
przytrzymanie = pauza, paski postępu u góry, auto-przejście co 7 s.

Bez budowania, bez zależności — czysty HTML/CSS/JS.

## Struktura

```
index.html          — strona ogólna (bez imienia)
goscie/kasia.html   — przykładowe zaproszenie imienne
goscie/_szablon.html— szablon do kopiowania
js/dane.js          — WSZYSTKIE dane imprezy (data, miejsce, telefon, klucz Pageclip)
js/app.js           — wspólny skrypt (story, formularz, konfetti)
css/style.css       — style
zdjecia/            — zdjęcia gości (imie.jpg)
```

## ✅ Dane imprezy — `js/dane.js`

Wszystko w jednym miejscu: data, godzina, miejsce (Borówiec, Drapałka 3B),
dress code, klucz Pageclip. Zostało do uzupełnienia: **telefon** (używany
tylko jako fallback SMS, gdyby Pageclip padł).

Na komputerze strona pokazuje komunikat „Otwórz na telefonie” —
zaproszenie jest projektowane pod komórkę.

## 📨 RSVP przez Pageclip

Pageclip to backend dla formularzy na statycznych stronach — odpowiedzi gości
(„Będę” / „Nie dam rady” + wiadomość) lądują w jednym panelu.

**Podłączenie:**

1. Załóż darmowe konto na [pageclip.co](https://pageclip.co).
2. W panelu skopiuj **Site API Key** (ciąg znaków przy adresie
   `https://send.pageclip.co/TWÓJ_KLUCZ`).
3. Wklej klucz w `js/dane.js` → `pageclipKey: "TWÓJ_KLUCZ"`.
4. Gotowe — na ostatnim slajdzie pojawi się formularz. Odpowiedzi zbierają się
   w panelu Pageclip w formularzu o nazwie **osiemnastka** (kolumny: `imie`,
   `obecnosc`, `wiadomosc`). W ustawieniach Pageclip możesz włączyć
   powiadomienia e-mail o każdym zgłoszeniu.

Dopóki `pageclipKey` jest pusty, zamiast formularza pokazują się przyciski
**SMS** i **Zadzwoń** (używają pola `telefon`).

## ➕ Goście

10 osób już dodanych — pliki w `goscie/` mają **losowe nazwy**, żeby nikt nie
zgadł cudzego linku i nie potwierdził obecności za kogoś. Mapa „kto → który
plik” leży w `LINKI.md`, który **celowo nie trafia do repo** (jest w
`.gitignore`) — publikacja tej tabeli zniweczyłaby sens losowych adresów.

Teksty zaproszeń powstały z `people/opisy.md` (też lokalnie, poza repo).
Oryginały zdjęć trzymamy w `people/img/`, na stronę idą przeskalowane
wersje w `zdjecia/`.

**Nowy gość:** skopiuj `goscie/_szablon.html` pod losową nazwą, uzupełnij
`imie` i `opis`, wrzuć przeskalowane zdjęcie do `zdjecia/` (pionowe —
wyświetla się pełnoekranowo; brak zdjęcia = inicjał), dopisz do `LINKI.md`.

## 🌍 Publikacja (GitHub Pages)

1. Wypchnij repo na GitHub.
2. Na GitHubie: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Po chwili strona będzie pod `https://<login>.github.io/zaproszenia/`,
   a zaproszenia pod `https://<login>.github.io/zaproszenia/goscie/imie.html`.

> Uwaga: GitHub Pages na darmowym planie wymaga **publicznego repo** — wtedy
> każdy może przejrzeć kod i zobaczyć wszystkie linki oraz opisy (losowe nazwy
> chronią tylko przed zgadywaniem adresu, nie przed czytaniem repo). Jeśli to
> przeszkadza, opublikuj za darmo z prywatnego repo przez Netlify albo
> Cloudflare Pages. Strony mają `noindex` — Google ich nie zaindeksuje.

## Technikalia

- **Mobile-first** — pełnoekranowe story na telefonie; na desktopie „telefon” na środku ekranu
- **Google Fonts** — Inter Tight (nagłówki) + Inter (tekst)
- **Lucide** — ikony z CDN
- **Pageclip** — formularz RSVP bez własnego backendu
- **Animacje** — paski postępu, wejścia slajdów, konfetti po „Będę”;
  respektuje `prefers-reduced-motion`
