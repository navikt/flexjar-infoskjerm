import {ReactElement} from 'react'


import {hentFlexjarFeedbacks} from '@/fetching/flexjarFetching'
import {Infoskjerm} from '@/components/Infoskjerm'

export default async function Docs(): Promise<ReactElement> {
    const flexjarFeedbacks = await hentFlexjarFeedbacks()

    return <Infoskjerm feedbacks={flexjarFeedbacks}/>
}
