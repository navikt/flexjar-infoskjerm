'use client'

import React, {ReactElement} from 'react'

import {Feedback} from '@/fetching/flexjarFetching'
import {useNesteInternMelding} from '@/fetching/useInternMeldinger'
import InternMeldingSkjerm from '@/components/InternMelding'
import {FlexjarInfoskjerm} from '@/components/flexjar/FlexjarInfoskjerm'

export function Infoskjerm({feedbacks}: { feedbacks: Feedback[] }): ReactElement {
    const {melding: internMelding, fjernMelding: fjernInternMelding} = useNesteInternMelding()

    if (internMelding) {
        return <InternMeldingSkjerm melding={internMelding} fjernMelding={fjernInternMelding}/>
    } else {
        return <FlexjarInfoskjerm feedbacks={feedbacks}/>
    }
}
