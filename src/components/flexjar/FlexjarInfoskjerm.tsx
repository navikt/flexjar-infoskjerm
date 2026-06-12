'use client'

import React, { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BodyLong, BodyShort } from '@navikt/ds-react'

import { Feedback } from '@/fetching/flexjarFetching'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

export function FlexjarInfoskjerm({ feedbacks }: { feedbacks: Feedback[] }): ReactElement {
    const router = useRouter()
    const [currentFeedback, setCurrentFeedback] = useState<Feedback>(feedbacks[0])

    // Henter ny data fra serveren hvert 5. minutt uten full page reload
    useEffect(() => {
        const interval = setInterval(() => router.refresh(), REFRESH_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [router])

    useEffect(() => {
        if (feedbacks.length > 0) {
            const interval = setInterval(() => {
                const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
                setCurrentFeedback(randomFeedback)
            }, 60000)
            return () => clearInterval(interval)
        }
    }, [feedbacks])

    useEffect(() => {
        const handleKeyDown = (): void => {
            const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
            setCurrentFeedback(randomFeedback)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [feedbacks])
    if (!currentFeedback) {
        return <div>Det er ingen tilbakemeldinger</div>
    }

    const styling = hentStyling(currentFeedback)

    return (
        <>
            <div
                onClick={() => {
                    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
                    setCurrentFeedback(randomFeedback)
                }}
                className={`w-100 max-w-90 flex h-screen flex-col justify-center align-middle ${styling.bakgrunn} py-10 px-10 text-center leading-none text-white`}
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
