import React, { ReactElement } from 'react'
import { Heading } from '@navikt/ds-react'

import { TrelloCard } from '@/trello/trelloClient'
import { MarkdownAksel } from '@/components/markdownAksel'
import { EditButton } from '@/components/EditButton'

export function TrelloKortRendring({ kortet }: { kortet: TrelloCard }): ReactElement {
    return (
        <>
            <Heading size="large" spacing>
                {kortet.name}{' '}
            </Heading>

            <MarkdownAksel md={kortet.desc} />
            <EditButton kortet={kortet} />
        </>
    )
}
