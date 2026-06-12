# Flexjar Infoskjerm

Infoskjerm som viser anonyme tilbakemeldinger fra [Flexjar](https://github.com/navikt/flexjar-backend) på en TV på kontoret til team Flex. 
Roterer gjennom feedbacks med fargekodet bakgrunn basert på score.

## Lokal kjøring

```sh
npm install
npm run dev
```

Appen kjører på `http://localhost:3000`. I dev-modus brukes mock-data.

## Deploy

Automatisk deploy til Nais via GitHub Actions ved push til `main`.

- Dev: https://flexjar-infoskjerm.ansatt.dev.nav.no
- Prod: https://flexjar-infoskjerm.ansatt.nav.no


## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles til flex@nav.no

### For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #flex.
