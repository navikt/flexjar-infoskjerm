import '../../../styles/globals.css'
import { ReactElement } from 'react'

import { verifyUserLoggedIn } from '@/auth/authentication'

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<ReactElement> {
    await verifyUserLoggedIn()

    return (
        <html lang="en">
            <head>
                <title>Tertial info</title>
                <meta name="robots" content="noindex" />
            </head>
            <body>
                <main>{children}</main>
            </body>
        </html>
    )
}
