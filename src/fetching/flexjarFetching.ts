export async function hentFlexjarFeedbacks(): Promise<Feedback[]> {
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

export interface Feedback {
    feedback: string
    svar: string
    app: string
    feedbackId: string
    opprettet: string
}
