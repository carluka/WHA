# WAREHOUSE ASSISTANT

## O "WHA"
**WHA** je spletna aplikacija, zasnovana za učinkovito upravljanje skladiščnih procesov. Ponuja celovite rešitve za dodajanje in spremljanje zaloge izdelkov, optimizirano pripravo in ustvarjanje naročil, avtomatizirano naročanje manjkajočih artiklov ter vodenje natančne evidence o zaposlenih. Aplikacija zagotavlja preglednost, izboljšuje organizacijo skladišča in omogoča boljšo produktivnost.

## ČLANI EKIPE:
 - Aljaž Kodrič (https://github.com/HlapecMihad)
 - Luka Car (https://github.com/carluka)
 - Rok Fonovič (https://github.com/01developer1)
  
### Tehnologije
Aplikacija je sestavljena iz frontend in backend delov:
- **Frontend**: Zgrajen z uporabo React.js, omogoča dinamičen in odziven uporabniški vmesnik.
- **Backend**: ackend je zgrajen z uporabo Spring frameworka.
- **Podatkovna baza**: MySql

## STRUKTURA PROJEKTA

### FrontEnd
**Direktorij**: `Frontend/frontend`
- **Opis**: Vsebuje kodo za uporabniški vmesnik napisan v React-u.

### Backend
**Direktorij**: `wha`
- **Opis**: Koda za posredovanje podatkov frontend-u, zgrajena z uporabo Spring frameworka.

### Komunikacija med Frontend-om in Backend-om
- **Protokol**: REST
- **Opis**: Komunikacija poteka preko REST API klicev, kjer frontend pošilja zahteve na backend, ki nato vrne ustrezne podatke.


