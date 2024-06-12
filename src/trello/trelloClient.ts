import dns from 'dns'

import { logger } from '@navikt/next-logger'

interface TrelloList {
    id: string
    name: string
    url: string
}

export interface TrelloCard {
    id: string
    idMembers: string[]
    members: string[]
    name: string
    url: string
    desc: string
    idList: string
    shortUrl: string
    dateLastActivity: string
    mapper: string[]
    urlMapper: string[]
    labels: { name: string }[]
    trengerArbeid: boolean
}

export interface ListMedCards extends TrelloList {
    cards: TrelloCard[]
}

const token = process.env['TRELLO_TOKEN']
const key = process.env['TRELLO_KEY']
const revalidateSeconds = 2

async function hentTrellokort(board: string | undefined): Promise<TrelloCard[]> {
    if (!board || !token || !key) {
        throw Error('Missing trello envs ')
    }
    const a = await fetch(`https://api.trello.com/1/boards/${board}/cards?key=${key}&token=${token}`, {
        next: { revalidate: revalidateSeconds },
    })
    return await a.json()
}

async function hentTrelloLister(board: string | undefined): Promise<TrelloList[]> {
    if (!board || !token || !key) {
        throw Error('Missing trello envs ')
    }
    const a = await fetch(`https://api.trello.com/1/boards/${board}/lists?key=${key}&token=${token}`, {
        next: { revalidate: revalidateSeconds },
    })
    return await a.json()
}

export async function hentKortMedlemNavn(memberId: string): Promise<string> {
    if (!token || !key) {
        throw Error('Missing trello envs ')
    }

    const response = await fetch(`https://api.trello.com/1/members/${memberId}?key=${key}&token=${token}`)
    const data = await response.json()

    if (data && data.fullName) {
        return data.fullName
    }

    return 'ukjent medlem'
}

export function urlFriendly(str: string): string {
    return str
        .toLowerCase()
        .replace(/ /g, '-')
        .replaceAll('æ', 'a')
        .replaceAll('ø', 'o')
        .replaceAll('å', 'a')
        .replace(/[^a-zA-Z0-9-]/g, '')
}

export async function hentTrelloKort(board: string | undefined): Promise<ListMedCards[]> {
    try {
        const kort = await hentTrellokort(board)

        const lister = await hentTrelloLister(board)

        return await Promise.all(
            lister.map(async (liste, i) => {
                const cardPromises = kort
                    .filter((k) => k.idList === liste.id)
                    .map(async (k, j) => {
                        const splittetNavn = k.name.split('/').map((s) => s.trim())
                        const siste = splittetNavn.pop() || ''

                        const mapper = [] as string[]
                        if (i > 0) {
                            mapper.push(liste.name)
                        }
                        mapper.push(...splittetNavn)

                        function url(): string {
                            if (i == 0 && j == 0) {
                                return '/'
                            }
                            return '/' + [...mapper, siste].map((m) => urlFriendly(m)).join('/')
                        }

                        const memberNames = k.idMembers ? await Promise.all(k.idMembers.map(hentKortMedlemNavn)) : []

                        return {
                            ...k,
                            name: siste,
                            url: url(),
                            mapper: mapper,
                            urlMapper: mapper.map((m) => urlFriendly(m)),
                            members: memberNames,
                            trengerArbeid:
                                k.labels.some((l) => l.name.toLowerCase() === 'trenger arbeid') || k.desc.length < 10,
                        }
                    })
                const cards = await Promise.all(cardPromises)

                return {
                    ...liste,
                    url: urlFriendly(liste.name),
                    cards: cards,
                }
            }),
        )
    } catch (error) {
        logger.error('Error in trello fetching, vurder å utvid med flere IPer', error)
        // Erstatt 'example.com' med domenet du vil slå opp
        const domain = 'api.trello.com'

        dns.resolve(domain, 'A', (err, addresses) => {
            if (err) {
                logger.error(`Kunne ikke løse opp domenet: ${err}`)
                return
            }
            logger.error(`IP-adresser for ${domain}: ${addresses.join(', ')}`)
        })
        throw error
    }
}
