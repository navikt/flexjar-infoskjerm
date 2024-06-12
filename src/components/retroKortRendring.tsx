import React, { ReactElement } from 'react'
import Link from 'next/link'
import { Heading } from '@navikt/ds-react'
import { DocPencilIcon } from '@navikt/aksel-icons'
import { Link as AkselLink } from '@navikt/ds-react'

import { ListMedCards } from '@/trello/trelloClient'
import { MarkdownAksel } from '@/components/markdownAksel'

export function RetroKortRendring({ list }: { list: ListMedCards }): ReactElement {
    return (
        <>
            <Heading size="large" spacing>
                {list.name}
            </Heading>
            <Heading className="mt-8" level="2" size="medium" spacing>
                Diskusjonspunkter:
            </Heading>

            {list.cards.map((card, index) => (
                <div key={index} className="mt-8 border-b border-gray-300 pb-4">
                    <div className="mb-4 flex items-center">
                        <Heading className="mr-4" size="small" level="3">
                            {card.name}{' '}
                        </Heading>
                        <AkselLink
                            as={Link}
                            className="text-gray-500"
                            target="_blank"
                            underline={false}
                            href={card.shortUrl}
                        >
                            <DocPencilIcon className="inline" title="a11y-title" fontSize="1.5rem" />
                        </AkselLink>
                    </div>
                    <MarkdownAksel md={card.desc} />
                    <strong>Ansvarlig:</strong>{' '}
                    {card.members && card.members.length > 0 ? card.members.join(', ') : 'Hele teamet'}
                </div>
            ))}
        </>
    )
}
