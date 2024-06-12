import { ReactElement } from 'react'
import { BodyShort } from '@navikt/ds-react'

export default async function Tertialinfo(): Promise<ReactElement> {
    return (
        <div className="w-100 max-w-90 flex h-screen flex-col justify-between bg-gray-900 pb-20 pt-10 text-center leading-none text-white">
            <h1 className="text-8xl">Team Flex - T1 - 2024 💪</h1>
            <BodyShort className="text-6xl">🤔</BodyShort>
        </div>
    )
}
