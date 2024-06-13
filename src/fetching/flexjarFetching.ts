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
                app: 'app',
                feedbackId: 'feedbackId',
                opprettet: '2024-01-01',
            },
            {
                feedback: 'hei',
                svar: '5',
                app: 'app',
                feedbackId: 'feedbackId',
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
                app: 'app',
                feedbackId: 'feedbackId',
                opprettet: '2024-01-01',
            },
        ]
    }
    return [
        {
            feedback: 'Klarte å hente token til bruk',
            svar: '5',
            app: 'app',
            feedbackId: 'feedbackId',
            opprettet: '2024-01-01',
        },
    ]
}

export interface Feedback {
    feedback: string
    svar: string
    app: string
    feedbackId: string
    opprettet: string
}
