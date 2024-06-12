'use client'

import React, { ReactElement } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link as AkselLink } from '@navikt/ds-react'

import { ListMedCards } from '@/trello/trelloClient'

export function OkrLayoutMenu({
    okrList,
    dokumentasjonList,
}: {
    okrList: ListMedCards[]
    dokumentasjonList: ListMedCards[]
}): ReactElement {
    const pathname = usePathname()

    return (
        <>
            <div className="w-[22rem] bg-white py-10 pl-10 pr-5 shadow-md space-y-4">
                <AkselLink className="block}" underline={false} as={Link} href="/">
                    {dokumentasjonList[0].cards[0].name}
                </AkselLink>
                {okrList.map((l, index) => {
                    const first = index === 0
                    const url = first ? '/okr-board/' : '/okr-board/' + l.url

                    const bold = (first && pathname === '/okr-board') || pathname === '/okr-board/' + l.url
                    return (
                        <AkselLink
                            className={`block${bold ? ' font-extrabold' : ''}`}
                            underline={false}
                            as={Link}
                            key={l.id}
                            href={url}
                        >
                            {l.name}
                        </AkselLink>
                    )
                })}
            </div>
        </>
    )
}
