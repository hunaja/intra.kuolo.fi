# KuoLO Ry:n intra

KuoLO Ry:n jäsensivut koodattuna uudelleen _Next.js + tRPC + Prisma (PostgreSQL) + Minio_ stäckillä.

Kuunnelkaa https://soundcloud.com/eliaswest

## TODO

- Integraatiotestit

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

### Opiskelijoiden ja alumnijäsenien lisääminen

Opiskelijat ja alumnijäsenet lisätään ylläpitonäkymässä.

### Vierailijakäyttäjät

**Yhteistyökumppanien (ja esim. Dentinan) tilit on luotava tällä tavalla.**

Oletuksena vain tietokannassa olevat (KuoLO:n) jäsenet voivat katsella jäsensivuja. Tähän poikkeuksena ovat vierailijakäyttäjät.

Vierailukäyttäjiä voi hallita ylläpitonäkemässä.

### Ylläpitokäyttäjän lisääminen

Voit muokata kenestä tahansa tietokannan jäsenestä ylläpitokäyttäjän yksinkertaisella skriptillä. Oletetaan, että jäsenkäyttäjäni sähköpostini olisi `admin@student.uef.fi`. Tällöin kutsuisin skriptiä seuraavasti, jos haluaisin jäsenkäyttäjästäni ylläpitäjän:

```bash
npx tsx script/setAdmin.ts admin@student.uef.fi true
```

Vastaavasti käyttäjän ylläpito-oikeudet voi evätä seuraavalla komennolla:

```bash
npx tsx scripts/setAdmin.ts admin@student.uef.fi false
```
