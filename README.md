# KuoLO Ry:n intra

KuoLO Ry:n jäsensivut koodattuna uudelleen _Next.js + tRPC + Prisma (PostgreSQL) + Minio_ stäckillä.

## TODO

- Integraatiotestit

- Alumnijäsenten lisääminen

## Käyttäminen

1. Kloonaa repositorio palvelimelle: `git clone https://github.com/hunaja/intra.kuolo.fi`

2. Luo Clerkiin uusi sovellus. Tulet tarvitsemaan Clerkin antamia tietoja seuraavassa kohdassa.

3. Uudelleennimeä `.env.example` -> `.env` ja päivitä tiedot. Postgren ja Minion tiedot on hyvä asettaa mahd. turvallisiksi.
   Muokkaa `DATABASE_URL` Postgrelle laittamiesi arvojen mukaiseksi.

4. Suorita `docker compose --env-file .env up`

### Kurssien lisääminen vanhoilta jäsensivuilta

Tenttiarkisto sisältää kursseja, jotka sisältävät tentit. Tähän repositorioon on tuotu kaikki vanhojen jäsensivujen kurssit, ja voit lisätä ne tietokantaan helposti seuraavalla komennolla:

```bash
npm npx prisma/seed.ts
```

### Perusjäsenien ja alumnijäsenien lisääminen

Jotta jäsensivuja voisi käyttää saumattomasti, on jäsenet lisättävä tietokantaan. Olen havainnut, että selkein tapa tehdä tämä on ottamalla kide.appin antama tiedosto kaikista jäsentiedoista, muuntamalla tämä tiedosto `.csv`-tiedostoksi ja laittamalla nimeksi `registry.csv` ja siirtämällä tämä tiedosto project rootiin (samaan kansioon, missä tämä README-tiedosto on).

Tämän jälkeen voit suorittaa seuraavan komennon, jolloin tietokannassa oleva jäsenrekisteri päivittyy:

```bash
npx tsx scripts/importMembers.ts
```

_Alumnijäsenten lisääminen ja helpompi työkalu jäsenten tuomiseen tietokantaan on tulossa._

### Ylläpitokäyttäjän lisääminen

Voit muokata kenestä tahansa tietokannan jäsenestä ylläpitokäyttäjän yksinkertaisella skriptillä. Oletetaan, että jäsenkäyttäjäni sähköpostini olisi `admin@student.uef.fi`. Tällöin kutsuisin skriptiä seuraavasti, jos haluaisin jäsenkäyttäjästäni ylläpitäjän:

```bash
npx tsx script/setAdmin.ts admin@student.uef.fi true
```

Vastaavasti käyttäjän ylläpito-oikeudet voi evätä seuraavalla komennolla:

```bash
npx tsx scripts/setAdmin.ts admin@student.uef.fi false
```

### Uuden vierailijakäyttäjän luonti

Oletuksena vain tietokannassa olevat (KuoLO:n) jäsenet voivat katsella jäsensivuja. Tähän poikkeuksena ovat vierailijakäyttäjät.

Vierailijakäyttäjät ovat käyttäjiä, joilla on oikeus katsella sivustoja mutta ei esimerkiksi lähettää uutta materiaalia tentttiarkistoon.

Luo Clerkissä käyttäjä, esimerkiksi sähköpostilla `hampaat+noreply@kuolo.fi`. Tämän jälkeen voit kutsua vierailijakäyttäjän luontiin tarkoitettua skriptiä seuraavasti:

```bash
npx tsx scripts/addGuest.ts hampaat+noreply@kuolo.fi Hampaat Dentina
```

Nyt siis sähköpostiosoitteella `hampaat+noreply@kuolo.fi` luotu käyttäjä voisi katsella jäsensivuja. **Yhteistyökumppanien (ja esim. Dentinan) tilit on luotava tällä tavalla.**
