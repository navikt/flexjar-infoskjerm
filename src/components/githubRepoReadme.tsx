import React, { ReactElement } from 'react'
import Link from 'next/link'
import { DocPencilIcon } from '@navikt/aksel-icons'
import { Link as AkselLink } from '@navikt/ds-react'

import { MarkdownAksel } from '@/components/markdownAksel'

export async function GithubRepoReadme({ repo }: { repo: string }): Promise<ReactElement> {
    const readmeFromGithubRaw = `https://raw.githubusercontent.com/navikt/${repo}/master/README.md`
    const edit = `https://github.com/navikt/${repo}/edit/master/README.md`

    const readmeResponse = await fetch(readmeFromGithubRaw, {
        next: { revalidate: 10 },
    })

    const readme = await readmeResponse.text()

    return (
        <>
            {readme && <MarkdownAksel md={readme} />}
            <AkselLink as={Link} className="text-gray-500" target="_blank" underline={false} href={edit}>
                Rediger på GitHub <DocPencilIcon className="inline" title="a11y-title" fontSize="1.5rem" />
            </AkselLink>
        </>
    )
}
