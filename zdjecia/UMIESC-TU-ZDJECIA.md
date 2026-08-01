# Zdjęcia gości (wersje na stronę)

Tu leżą **przeskalowane** zdjęcia. Oryginały trzymamy w `people/img/`.

Nowe zdjęcie przerabiamy tak (maks. 1600 px, jakość 4):

```sh
ffmpeg -y -i people/img/NOWE.jpg \
  -vf "scale=w=1600:h=1600:force_original_aspect_ratio=decrease" \
  -q:v 4 zdjecia/imie.jpg
```

Ścieżkę wpisujemy w pliku gościa, w `window.GUEST.zdjecie`, np.
`goscie/4f7c653c.html` → `../zdjecia/bogusz.jpg`. Nazwa pliku ze zdjęciem
nie musi pasować do losowej nazwy strony.

Zdjęcia wyświetlają się pełnoekranowo — pionowe wyglądają najlepiej.

Jeśli zdjęcia nie ma, na stronie pokaże się kółko z inicjałem — nic się nie zepsuje.
