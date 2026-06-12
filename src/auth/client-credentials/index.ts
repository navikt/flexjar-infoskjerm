import { withCache } from '../token-cache'

export type ClientCredentialsProvider = (scope: string) => Promise<ClientCredentialsResult>

export type ClientCredentialsResult = { ok: true; token: string } | { ok: false; error: Error }

export const ClientCredentialsResult = {
    Error: (error: Error | string): ClientCredentialsResult => ({
        ok: false,
        error: typeof error === 'string' ? Error(error) : error,
    }),
    Ok: (token: string): ClientCredentialsResult => {
        const res = {
            ok: true,
            token,
            toString: (): void => {
                throw Error(
                    "ClientCredentialsResult object can not be used as a string. If you tried to get the token, access the 'token' property.",
                )
            },
        } as const
        return res
    },
}

/**
 * Requests client credentials token from Azure. Requires Azure to be enabled in
 * nais application manifest.
 *
 * @param scope The target app you request a token for.
 */
export const requestAzureClientCredentialsToken: ClientCredentialsProvider = withCache(
    async (scope): Promise<ClientCredentialsResult> => {
        const tokenEndpoint = process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT
        const clientId = process.env.AZURE_APP_CLIENT_ID
        const clientSecret = process.env.AZURE_APP_CLIENT_SECRET

        if (!tokenEndpoint || !clientId || !clientSecret) {
            return ClientCredentialsResult.Error('Mangler Azure-konfigurasjon (token endpoint, client id eller secret)')
        }

        try {
            const response = await fetch(tokenEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: clientId,
                    client_secret: clientSecret,
                    scope,
                }),
            })

            if (!response.ok) {
                return ClientCredentialsResult.Error(
                    `Token-endepunkt svarte med ${response.status} ${response.statusText}`,
                )
            }

            const data = (await response.json()) as { access_token?: string }
            return data.access_token
                ? ClientCredentialsResult.Ok(data.access_token)
                : ClientCredentialsResult.Error('Token-respons mangler access_token')
        } catch (e) {
            return ClientCredentialsResult.Error(e as Error)
        }
    },
)
