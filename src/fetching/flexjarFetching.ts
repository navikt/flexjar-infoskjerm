import { logger } from '@navikt/next-logger'
import getConfig from 'next/config'

import { requestAzureClientCredentialsToken } from '@/auth/client-credentials'
import { isLocalOrDemo } from '@/utlis/env'

const { serverRuntimeConfig } = getConfig()

export async function hentFlexjarFeedbacks(): Promise<Feedback[]> {
    if (isLocalOrDemo) {
        return [
            {
                feedback: 'feedback',
                svar: 'svar',
                opprettet: '2024-01-01',
            },
            {
                feedback: 'hei',
                svar: '5',
                opprettet: '2024-01-01',
            },
        ]
    }
    const token = await requestAzureClientCredentialsToken(serverRuntimeConfig.flexjarBackendClientId)
    if (!token.ok) {
        logger.error('Kunne ikke hente token: ' + token.error)
        return [
            {
                feedback: 'Klarte ikke hente feedbacks fra backend. error',
                svar: '1',
                opprettet: '2024-01-01',
            },
        ]
    }

    const response = await fetch(`http://flexjar-backend/api/v1/infoskjerm`, {
        headers: {
            Authorization: `Bearer ${token.token}`,
        },
    })
    const data = (await response.json()) as { feedback: Record<string, string>; opprettet: string }[]
    return data.map((row) => {
        return {
            feedback: row.feedback.feedback,
            svar: row.feedback.svar,
            opprettet: row.opprettet,
        }
    })
}

export interface Feedback {
    feedback: string
    svar: string
    opprettet: string
}
