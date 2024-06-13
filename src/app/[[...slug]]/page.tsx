import { ReactElement } from 'react'

import { FlexjarInfoskjerm } from '@/components/flexjar/FlexjarInfoskjerm'
import { hentFlexjarFeedbacks } from '@/fetching/flexjarFetching'

export default async function Docs(): Promise<ReactElement> {
    const list = await hentFlexjarFeedbacks()

    return <FlexjarInfoskjerm feedbacks={list} />
}
