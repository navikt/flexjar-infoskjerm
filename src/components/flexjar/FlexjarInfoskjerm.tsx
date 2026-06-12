'use client'

import React, { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BodyLong, BodyShort } from '@navikt/ds-react'

import { Feedback } from '@/fetching/flexjarFetching'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000
const FEEDBACK_MODUS_MS = 5 * 60 * 1000
const DASHBOARD_MODUS_MS = 2 * 60 * 1000
const METABASE_DASHBOARD_URL =
    'https://metabase.ansatt.nav.no/public/dashboard/c21e4a98-4678-4872-a976-c9be01fabf29?dato=past1months~&gruppering=day'

type Modus = 'feedbacks' | 'dashboard'

export function FlexjarInfoskjerm({ feedbacks }: { feedbacks: Feedback[] }): ReactElement {
    const router = useRouter()
    const [currentFeedback, setCurrentFeedback] = useState<Feedback>(feedbacks[0])
    const [modus, setModus] = useState<Modus>('feedbacks')

    // Henter ny data fra serveren hvert 5. minutt uten full page reload
    useEffect(() => {
        const interval = setInterval(() => router.refresh(), REFRESH_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [router])

    // Bytter modus mellom feedbacks (5 min) og dashboard (2 min)
    useEffect(() => {
        const varighet = modus === 'feedbacks' ? FEEDBACK_MODUS_MS : DASHBOARD_MODUS_MS
        const timer = setTimeout(() => {
            setModus(modus === 'feedbacks' ? 'dashboard' : 'feedbacks')
        }, varighet)
        return () => clearTimeout(timer)
    }, [modus])

    useEffect(() => {
        if (modus !== 'feedbacks' || feedbacks.length === 0) return
        const interval = setInterval(() => {
            const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
            setCurrentFeedback(randomFeedback)
        }, 60000)
        return () => clearInterval(interval)
    }, [feedbacks, modus])

    useEffect(() => {
        if (modus !== 'feedbacks') return
        const handleKeyDown = (): void => {
            const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
            setCurrentFeedback(randomFeedback)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [feedbacks, modus])

    if (modus === 'dashboard') {
        return (
            <div onClick={() => setModus('feedbacks')} className="cursor-pointer">
                <iframe
                    src={METABASE_DASHBOARD_URL}
                    className="h-screen w-full border-0 pointer-events-none"
                    title="Metabase-dashboard"
                />
            </div>
        )
    }

    if (!currentFeedback) {
        return <div>Det er ingen tilbakemeldinger</div>
    }

    const styling = hentStyling(currentFeedback)

    return (
        <>
            <div
                onClick={() => setModus('dashboard')}
                className={`w-100 max-w-90 flex h-screen flex-col justify-center align-middle ${styling.bakgrunn} py-10 px-10 text-center leading-none text-white cursor-pointer`}
            >
                {styling.emoji && <BodyShort className="text-8xl mb-10">{styling.emoji}</BodyShort>}
                <BodyLong style={{ lineHeight: '1.5' }} className={calculateFontSize(currentFeedback)}>
                    {currentFeedback.feedback}
                </BodyLong>
                <BodyShort className="text-1xl mt-20">{'💪 Flexjar ' + datoFormattering(currentFeedback)}</BodyShort>
            </div>
        </>
    )
}

interface Styling {
    emoji?: string
    bakgrunn: string
}

function hentStyling(feedback: Feedback): Styling {
    switch (feedback.svar) {
        case '1':
            return {
                emoji: '😡',
                bakgrunn: 'bg-red-600',
            }
        case '2':
        case 'NEI':
            return {
                emoji: '🙁',
                bakgrunn: 'bg-red-400',
            }
        case '3':
            return {
                emoji: '😐',
                bakgrunn: 'bg-blue-400',
            }
        case '4':
        case 'JA':
            return {
                emoji: '🙂',
                bakgrunn: 'bg-green-400',
            }
        case '5':
            return {
                emoji: '😍',
                bakgrunn: 'bg-green-700',
            }
        default:
            return {
                bakgrunn: 'bg-gray-800',
            }
    }
}

function calculateFontSize(fe: Feedback): string {
    const text = fe.feedback
    if (text.length > 100) {
        return 'text-6xl'
    } else if (text.length > 50) {
        return 'text-7xl'
    } else {
        return 'text-8xl'
    }
}

function datoFormattering(feed: Feedback): string {
    const dato = new Date(feed.opprettet)
    return dato.toLocaleDateString('nb-NO')
}
