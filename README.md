# WordSoccerEasy
Word soccer game for blind

popis hry:

- na začátku hry se vybere náhodně slovo ze slovníku (soubor se slovy ?) -> je vykopnuto, zahraje se zvuk a přečte slovo
- uživatel zadá své slovo začínající na písmeno, kterým končilo generované slovo, a potvrdí klávesou - vše musí zvládnout do 15 sekund
-> pokud zadá  správně, je hráči přičten bod a generována odpověď -> v okamžiku, kdy není odpověď nalezena, je zahrán vítězný zvuk (jásot) - skóre vynásobeno koeficientem
-> pokud zadá špatně, zahraje se zvuk, odečtou 3 sekundy a je vyzván k opakování
- hra končí uplynutím časomíry pro zadání slova, nebo pokud není možno generovat odpověď na hráčovo slovo

Ovládání:
- pomocí klávesy 'Enter' se potvrdí slovo zadané uživatelem do text inputu
- pomocí klávesy 'Alt' si může uživatel nechat přečíst slovo, které se mu náhodně vygeneruje
- pomocí klávesy 'Shift' si uživatel spustí novou hru


Mechanismy
- porovnání hráčova slova se slovníkem, jestli dává význam
- přísnější kritérium pro výběr slova počítačem
- slova se neopakují

Graficky vyjádřeno:

- při losování slova točící se míč -> zobrazí se slovo, míč se dotočí
-> uživatel odpoví a losování se opakuje

# Install project (components)
