import { Timestamp } from "firebase/firestore"

export interface BlogPost {
    id: string
    title: string
    summary: string
    content: string
    countryEmoji: string
    year: number
    date: Timestamp
    slug: string
    travel: boolean
}
