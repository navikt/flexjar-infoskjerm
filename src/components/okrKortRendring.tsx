import React, { ReactElement } from 'react'
import Link from 'next/link'
import { Heading } from '@navikt/ds-react'
import { DocPencilIcon } from '@navikt/aksel-icons'
import { Link as AkselLink } from '@navikt/ds-react'

import { ListMedCards, TrelloCard } from '@/trello/trelloClient'
import { MarkdownAksel } from '@/components/markdownAksel'

function EnkeltKvadrat({ kortet, infoskjerm }: { kortet: TrelloCard; infoskjerm?: boolean }): ReactElement {
    const klasser = infoskjerm ? 'w-[50vw] h-[50vh]' : 'w-[30rem] h-[30rem]'
    const padding = infoskjerm ? 'py-9 px-12' : 'p-4'
    return (
        <div className={`flex-item border border-gray-200 bg-gray-50 ${klasser}`}>
            <Heading level="2" size="medium" className={`bg-blue-100 ${padding}`} spacing>
                <div className="flex justify-between">
                    {kortet.name}
                    {!infoskjerm && (
                        <AkselLink
                            as={Link}
                            className="text-gray-400 text-right"
                            target="_blank"
                            underline={false}
                            href={kortet.shortUrl}
                        >
                            <DocPencilIcon className="inline" title="a11y-title" fontSize="1.5rem" />
                        </AkselLink>
                    )}
                </div>
            </Heading>

            <div className={padding}>
                <MarkdownAksel md={kortet.desc} />
            </div>
        </div>
    )
}

export function OkrKortRendring({ list, infoskjerm }: { list: ListMedCards; infoskjerm?: boolean }): ReactElement {
    return (
        <>
            {!infoskjerm && (
                <div className="flex justify-center">
                    <Heading size="large" spacing>
                        {list.name}
                    </Heading>
                </div>
            )}
            <div className="flex justify-center">
                <EnkeltKvadrat kortet={list.cards[0]} infoskjerm={infoskjerm} />
                <EnkeltKvadrat kortet={list.cards[1]} infoskjerm={infoskjerm} />
            </div>
            <div className="flex justify-center">
                <EnkeltKvadrat kortet={list.cards[2]} infoskjerm={infoskjerm} />
                <EnkeltKvadrat kortet={list.cards[3]} infoskjerm={infoskjerm} />
            </div>
            {!infoskjerm && list.cards.length > 4 && (
                <div className="p-4 bg-gray-100 mt-4">
                    <Heading level="2" size="medium" spacing>
                        <div className="flex justify-between">
                            {list.cards[4].name}
                            {!infoskjerm && (
                                <AkselLink
                                    as={Link}
                                    className="text-gray-400 text-right p-0"
                                    target="_blank"
                                    underline={false}
                                    href={list.cards[4].shortUrl}
                                >
                                    <DocPencilIcon className="inline" title="a11y-title" fontSize="1.5rem" />
                                </AkselLink>
                            )}
                        </div>
                    </Heading>

                    <MarkdownAksel md={list.cards[4].desc} />
                </div>
            )}
        </>
    )
}
