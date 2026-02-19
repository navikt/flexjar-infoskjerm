'use client'

import {DependencyList, useCallback, useEffect, useState} from 'react'

import {isLocalOrDemo} from '@/utlis/env'

export function useNesteInternMelding(): {
    melding: InternMelding | undefined
    fjernMelding: (() => void) | undefined
} {
    const {meldinger, fjernMelding} = useInternMeldinger()
    const sorterteMeldinger = meldinger.sort(sammenlignTid)
    const nesteMelding = sorterteMeldinger.length > 0 ? sorterteMeldinger[0] : undefined

    const fjernNesteMelding = useCallback(() => {
        console.log('Fjerner neste melding')
        if (nesteMelding) {
            fjernMelding?.(nesteMelding.id)
        }
    }, [nesteMelding, fjernMelding])

    return {melding: nesteMelding, fjernMelding: fjernNesteMelding}
}

export function useInternMeldinger(): { meldinger: InternMelding[]; fjernMelding: (meldingId: string) => void } {
    const [meldinger, setMeldinger] = useState<InternMelding[]>([])

    useInterval(() => {
        if (isLocalOrDemo) {
            setMeldinger([...meldinger, ...popSessionStorageMeldinger()])
        } else {
            setMeldinger([])
        }
    }, 1000)

    const fjernMelding = useCallback(
        (meldingId: string) => {
            setMeldinger(meldinger.filter((m) => m.id !== meldingId))
        },
        [meldinger],
    )

    return {meldinger, fjernMelding}
}

function popSessionStorageMeldinger(): InternMelding[] {
    const meldingerString = sessionStorage.getItem('meldinger')
    sessionStorage.removeItem('meldinger')

    const meldinger = meldingerString ? meldingerString.split(',') : []
    return meldinger.map((m) => ({id: generateUuid(), opprettet: new Date(), text: m}))
}

function useInterval(handler: () => void, timeout?: number, deps?: DependencyList): void {
    useEffect(() => {
        const interval = setInterval(() => {
            handler()
        }, timeout)
        return () => clearInterval(interval)
    }, deps)
}

export type InternMelding = {
    id: string
    opprettet: Date
    text: string
}

const sammenlignTid = (a: InternMelding, b: InternMelding): number => {
    const aTime = a.opprettet?.getTime() ?? 0
    const bTime = b.opprettet?.getTime() ?? 0
    return aTime - bTime
}

function generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}
