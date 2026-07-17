# 🎉 Zaproszenia na osiemnastkę

Statyczna strona z **imiennymi zaproszeniami** na 18. urodziny — 16 sierpnia 2026.
Każdy gość dostaje własny link ze zdjęciem i osobistą wiadomością.

Bez budowania, bez zależności — czysty HTML/CSS/JS. Działa po otwarciu pliku
w przeglądarce albo po wrzuceniu na GitHub Pages.

## Struktura

```
index.html          — strona ogólna (bez imienia)
goscie/kasia.html   — przykładowe zaproszenie imienne
goscie/_szablon.html— szablon do kopiowania
js/dane.js          — WSZYSTKIE dane imprezy (data, miejsce, telefon)
js/app.js           — wspólny skrypt (render, odliczanie, konfetti)
css/style.css       — style
zdjecia/            — zdjęcia gości (imie.jpg)
```

## ✅ Zanim wyślesz — uzupełnij `js/dane.js`

W pliku [`js/dane.js`](js/dane.js) są pola oznaczone `TODO`:

- **miejsce, adres, mapaUrl** — gdzie impreza
- **telefon** — Twój numer (przycisk „Będę!” wysyła SMS na ten numer)
- ewentualnie godzina, termin RSVP, dress code

## ➕ Jak dodać gościa

1. Skopiuj `goscie/_szablon.html` jako `goscie/imie.html` (małe litery, bez polskich znaków — to będzie link).
2. W skopiowanym pliku uzupełnij `imie`, `opis`, `podpisZdjecia` i tytuł strony (`<title>`).
3. Wrzuć zdjęcie do `zdjecia/imie.jpg` (kwadratowe wygląda najlepiej). Brak zdjęcia = kółko z inicjałem.
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

- **Mobile-first** — projektowane pod telefon, skaluje się na desktop
- **Google Fonts** — Inter Tight (nagłówki) + Inter (tekst)
- **Lucide** — ikony z CDN
- **Animacje** — subtelny scroll reveal, odliczanie na żywo,
  konfetti tylko po kliknięciu „Będę”; respektuje `prefers-reduced-motion`
