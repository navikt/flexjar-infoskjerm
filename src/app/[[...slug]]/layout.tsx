import '../../styles/globals.css'
import { ReactElement } from 'react'
import Link from 'next/link'
import { ReadMore } from '@navikt/ds-react'
import { Link as AkselLink } from '@navikt/ds-react'

import { hentTrelloKort, urlFriendly } from '@/trello/trelloClient'
import { verifyUserLoggedIn } from '@/auth/authentication'
import { arraysAreEqual } from '@/utlis/arrayEqual'

import apper from '../../apper.json'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Lenke {
    name: string
    url: string
    mapper: string[]
    urlMapper: string[]
    mappe?: string
    trengerArbeid?: boolean
}

function LenkeRendring({
    lenker,
    slug,
    aktiv,
    level,
}: {
    lenker: Lenke[]
    slug: string[]
    aktiv: boolean
    level: number
}): ReactElement {
    const underlenker = lenker
        .filter((l) => l.mapper.length > 0)
        .map((l) => {
            return {
                ...l,
                mapper: l.mapper.slice(1),
                mappe: l.mapper[0],
            }
        })
        .reduce((acc: Map<string, Lenke[]>, obj: Lenke) => {
            const categoryList = acc.get(obj.mappe!) || []
            categoryList.push(obj)
            acc.set(obj.mappe!, categoryList)
            return acc
        }, new Map<string, Lenke[]>())

    // grupper undermapper basert på mapper

    return (
        <>
            {lenker.map((l, index) => {
                if (l.mapper.length !== 0) return null

                function bold(): boolean {
                    if (!aktiv) {
                        return false
                    }
                    if (l.url === '/' && slug.length === 0) {
                        return true
                    }

                    const urlSplittet = l.url.split('/').filter((s) => s.length > 0)

                    return arraysAreEqual(urlSplittet, slug)
                }

                return (
                    <AkselLink
                        className={`block${bold() ? ' font-bold' : ''}`}
                        underline={false}
                        as={Link}
                        key={index}
                        href={l.url}
                    >
                        {l.name + (l.trengerArbeid ? ' 🚧' : '')}
                    </AkselLink>
                )
            })}

            {Array.from(underlenker.keys()).map((k, i) => {
                const aktivHer = urlFriendly(k) == slug[level] && aktiv
                return (
                    <div
                        key={i}
                        style={
                            {
                                '--ac-read-more-line': 'var(--a-transparent)',
                            } as React.CSSProperties
                        }
                    >
                        <ReadMore header={k} defaultOpen={aktivHer}>
                            <div className="space-y-2">
                                <LenkeRendring
                                    lenker={underlenker.get(k)!}
                                    slug={slug}
                                    aktiv={aktivHer}
                                    level={level + 1}
                                />
                            </div>
                        </ReadMore>
                    </div>
                )
            })}
        </>
    )
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { slug?: string[] }
}): Promise<ReactElement> {
    await verifyUserLoggedIn()
    const list = await hentTrelloKort(process.env['TRELLO_BOARD'])

    const lenker = [] as Lenke[]

    lenker.push({
        name: list[0].cards[0].name,
        url: '/',
        mapper: [],
        urlMapper: [],
    })

    list[0].cards.forEach((c, i) => {
        if (i > 0)
            lenker.push({
                name: c.name,
                url: c.url,
                mapper: [],
                urlMapper: [],
                trengerArbeid: c.trengerArbeid,
            })
    })
    list.slice(1).forEach((l) => {
        l.cards.forEach((c) => {
            lenker.push({
                name: c.name,
                url: c.url,
                mapper: c.mapper,
                urlMapper: c.urlMapper,
                trengerArbeid: c.trengerArbeid,
            })
        })
    })
    apper
        .map((c) => c.name)
        .sort()
        .forEach((a) => {
            lenker.push({
                name: a,
                url: '/apper/' + a,
                mapper: ['Apper'],
                urlMapper: ['apper'],
            })
        })

    return (
        <html lang="en">
            <head>
                <title>{list[0].cards[0].name}</title>
                <meta name="robots" content="noindex" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body>
                <div className="min-h-screen bg-gray-50 flex">
                    <div className="w-[26rem] bg-white py-10 pl-10 pr-5 shadow-md space-y-2 overflow-y-auto h-screen">
                        <LenkeRendring lenker={lenker} slug={params.slug || []} aktiv={true} level={0} />
                    </div>
                    <div className="overflow-y-auto w-full">
                        <div className="flex-1 max-w-5xl mx-auto p-10 h-screen">
                            <main>{children}</main>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
