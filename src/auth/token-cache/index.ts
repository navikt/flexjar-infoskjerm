import { createHash } from 'node:crypto'

import { decodeJwt, JWTPayload } from 'jose'

import { ClientCredentialsResult, ClientCredentialsProvider } from '../client-credentials'

import SieveCache from './cache'

function sha256(content: string): string {
    return createHash('sha256').update(content).digest('hex')
}

let cache: SieveCache

function getCache(): SieveCache {
    if (!cache) {
        // Appen har i praksis bare ett fåtall scopes, så en liten cache er nok.
        cache = new SieveCache(10)
    }
    return cache
}

function getSecondsToExpire(payload: JWTPayload): number {
    function secondsUntil(timestamp: number): number {
        return Math.max(Math.round(timestamp - Math.round(Date.now() / 1000)), 0)
    }

    return payload.exp ? secondsUntil(payload.exp) : 0
}

export const withCache = (oboProvider: ClientCredentialsProvider): ClientCredentialsProvider => {
    return async (audience: string) => {
        const cache = getCache()
        const key = sha256(audience)
        const cachedToken = cache.get(key)
        if (cachedToken) {
            return Promise.resolve(ClientCredentialsResult.Ok(cachedToken))
        }

        return oboProvider(audience).then((result) => {
            if (result.ok) {
                const ttl = getSecondsToExpire(decodeJwt(result.token))
                if (ttl > 0) {
                    cache.set(key, result.token, ttl * 1000)
                }
            }

            return result
        })
    }
}
