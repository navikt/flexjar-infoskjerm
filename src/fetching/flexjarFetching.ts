import { logger } from '@navikt/next-logger'
import { requestAzureClientCredentialsToken } from '@navikt/oasis'

import { isLocalOrDemo } from '@/utils/env'

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
    const flexjarBackendClientId = process.env.FLEXJAR_BACKEND_CLIENT_ID
    if (!flexjarBackendClientId) {
        logger.error('Mangler FLEXJAR_BACKEND_CLIENT_ID')
        return []
    }
    const token = await requestAzureClientCredentialsToken(flexjarBackendClientId)
    if (!token.ok) {
        logger.error('Kunne ikke hente token: ' + token.error)
        return []
    }

    const response = await fetch(`http://flexjar-backend/api/v1/infoskjerm`, {
        next: { revalidate: 300 },
        headers: {
            Authorization: `Bearer ${token.token}`,
        },
    })
    if (!response.ok) {
        logger.error(`Backend svarte med ${response.status} ${response.statusText}`)
        return []
    }
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
