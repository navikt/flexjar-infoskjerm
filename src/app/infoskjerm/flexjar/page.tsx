import { ReactElement } from 'react'

import { hentFlexjarFeedbacks } from '@/bigquery/flexjarFetching'
import { FlexjarInfoskjerm } from '@/components/flexjar/FlexjarInfoskjerm'

export default async function Docs(): Promise<ReactElement> {
    const list = await hentFlexjarFeedbacks()

    return <FlexjarInfoskjerm feedbacks={list} />
}
