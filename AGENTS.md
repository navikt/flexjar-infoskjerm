# AGENTS.md - `flexjar-infoskjerm`

Infoskjerm-app (Next.js 15, App Router) som viser anonyme tilbakemeldinger fra Flexjar på en TV på kontoret til team Flex.

## 1) Kommandoer

```sh
npm run dev      # kjør lokalt (mock-data)
npm run build    # bygg for produksjon
npm run format   # formater kode med Prettier + ESLint fix
```

### Før commit (obligatorisk)

```sh
npm run format && npm run build
```

## 2) Prosjektstruktur

- App Router: `src/app/` (layout, page, API-ruter)
- UI-komponenter: `src/components/`
- Server-side datahenting: `src/fetching/`
- Auth (Azure client_credentials): `src/auth/`
- Hjelpefunksjoner: `src/utlis/`
- Nais-konfigurasjon: `nais/app/`

Appen har én server-side page som henter feedbacks og sender til en klient-komponent som roterer visningen.

## 3) Kodestil

- All kode, kommentarer og UI-tekst på **norsk bokmål**
- Bruk eksisterende mønstre i koden fremfor nye varianter

## 4) Git-workflow

- Egen branch per feature/fix, aldri direkte på `main`
- Hold commit-meldinger korte, beskrivende, én linje, uten punktum
- Ingen conventional commit-prefix og ingen issue-nummer påkrevd

Standard flyt:

```sh
git checkout -b kort-beskrivende-navn
npm run format && npm run build
git commit -m "Kort beskrivelse"
git push origin <branch>
gh pr create --fill
```

## 5) Grenser (aldri gjør dette)

- Aldri lekke eller logge sensitiv informasjon (fnr, tokens, session-data)
- Aldri hardkode hemmeligheter eller credentials
- Aldri commit med rød format/build

## Når du trenger mer kontekst

- `README.md` — prosjektformål og lokal kjøring
- `package.json` — scripts og avhengigheter
- `nais/app/naiserator.yaml` — Nais-konfigurasjon

## Hurtigsjekk før levering

- [ ] Endringen følger eksisterende mønster i berørte filer
- [ ] `npm run format && npm run build` er grønn

