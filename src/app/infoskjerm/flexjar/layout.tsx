import '../../../styles/globals.css'
import { ReactElement } from 'react'

import { verifyUserLoggedIn } from '@/auth/authentication'

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<ReactElement> {
    await verifyUserLoggedIn()

    return (
        <html lang="en">
            <head>
                <title>Infoskjerm feedbacks</title>
                <meta name="robots" content="noindex" />
            </head>
            <body>
                <main
                    style={
                        {
                            '--a-font-size-large': '1.75rem',
                            '--a-font-line-height-large': '1.75rem',
                            '--a-font-size-medium': '1.5rem',
                            '--a-font-line-height-medium': '1.5rem',
                            '--a-font-size-heading-medium': '3.5rem',
                            '--a-font-line-height-heading-medium': '3rem',
                        } as React.CSSProperties
                    }
                >
                    {children}
                </main>
            </body>
        </html>
    )
}
