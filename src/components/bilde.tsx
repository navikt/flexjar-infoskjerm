'use client'
import { ReactElement } from 'react'

export function Bilde(
    props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
): ReactElement {
    return (
        // eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text
        <img
            className="cursor-pointer"
            {...props}
            onClick={() => {
                window.open(props.src, '_blank')
            }}
        />
    )
}
