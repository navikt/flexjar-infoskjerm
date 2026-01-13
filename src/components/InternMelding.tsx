'use client'

import React, {DependencyList, ReactElement, useEffect, useRef} from 'react'
import {BodyLong} from '@navikt/ds-react'

import {InternMelding} from '@/fetching/useInternMeldinger'

type Props = {
    melding?: InternMelding
    fjernMelding?: () => void
}

export default function InternMeldingSkjerm({melding, fjernMelding}: Props): ReactElement {
    const meldingTimeout: number = 2000

    useTimeout(() => {
        fjernMelding?.()
        console.log('fjerner melding')
    }, meldingTimeout, [melding])

    const text = melding?.text ?? '[Ingen melding]'

    const styling = {
        bakgrunn: 'bg-gray-800',
    }

    return (
        <>
            <div
                className={`w-100 max-w-90 flex h-screen flex-col justify-center align-middle ${styling.bakgrunn} py-10 px-10 text-center leading-none text-white`}
            >
                <BodyLong style={{lineHeight: '1.5'}} className={calculateFontSize(text)}>
                    {melding?.text}
                </BodyLong>
            </div>
        </>
    )
}

function useTimeout(callback: () => void, timeout: number, resetDeps?: DependencyList) {
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const timerId = setTimeout(() => savedCallback.current(), timeout);
        return () => clearTimeout(timerId);
    }, [timeout, ...(resetDeps || [])]);
}

function calculateFontSize(text: string): string {
    if (text.length > 100) {
        return 'text-6xl'
    } else if (text.length > 50) {
        return 'text-7xl'
    } else {
        return 'text-8xl'
    }
}
