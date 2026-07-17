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

## ✅ Zanim wyślesz — uzupełnij `js/dane.js`

Pola oznaczone `TODO`:

- **miejsce, adres, mapaUrl** — gdzie impreza
- **telefon** — Twój numer (fallback, gdy Pageclip niepodłączony)
- **pageclipKey** — klucz z pageclip.co (patrz niżej)
- ewentualnie godzina, termin RSVP, dress code

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

## ➕ Jak dodać gościa

1. Skopiuj `goscie/_szablon.html` jako `goscie/imie.html` (małe litery, bez polskich znaków — to będzie link).
2. W skopiowanym pliku uzupełnij `imie`, `opis`, `podpisZdjecia` i tytuł strony (`<title>`).
3. Wrzuć zdjęcie do `zdjecia/imie.jpg` (pionowe wygląda najlepiej — wyświetla się pełnoekranowo). Brak zdjęcia = inicjał.
4. Wyślij gościowi link: `https://twoja-strona/goscie/imie.html`.

Przykładowi goście (Kasia, Michał, Ola) są tylko demo — usuń ich pliki albo podmień treść.

## 🌍 Publikacja (GitHub Pages)

1. Wypchnij repo na GitHub.
2. Na GitHubie: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Po chwili strona będzie pod `https://<login>.github.io/zaproszenia/`,
   a zaproszenia pod `https://<login>.github.io/zaproszenia/goscie/imie.html`.

> Uwaga: repo publiczne = linki technicznie dostępne dla każdego, kto je zna.
> Strony mają `noindex`, więc Google ich nie zaindeksuje, ale nie wrzucaj tu
> niczego bardzo prywatnego.

## Technikalia

- **Mobile-first** — pełnoekranowe story na telefonie; na desktopie „telefon” na środku ekranu
- **Google Fonts** — Inter Tight (nagłówki) + Inter (tekst)
- **Lucide** — ikony z CDN
- **Pageclip** — formularz RSVP bez własnego backendu
- **Animacje** — paski postępu, wejścia slajdów, konfetti po „Będę”;
  respektuje `prefers-reduced-motion`
