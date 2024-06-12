'use client'

import Link from 'next/link'
import React, { ReactElement, useEffect } from 'react'
import { DocPencilIcon } from '@navikt/aksel-icons'
import { Link as AkselLink } from '@navikt/ds-react'

import { TrelloCard } from '@/trello/trelloClient'

export function EditButton({ kortet }: { kortet: TrelloCard }): ReactElement {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent): void => {
            if (event.key === 'e') {
                window.open(kortet.shortUrl, '_blank')
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [kortet.shortUrl])

    return (
        <AkselLink as={Link} className="text-gray-500" target="_blank" underline={false} href={kortet.shortUrl}>
            {'Sist redigert ' + kortet.dateLastActivity.slice(0, 10)}{' '}
            <DocPencilIcon className="inline" title="a11y-title" fontSize="1.5rem" />
        </AkselLink>
    )
}
