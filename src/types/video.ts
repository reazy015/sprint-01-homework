import {RESOLUTIONS} from '../utils/constants'

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type AgeRange = Range<1, 18>
export type Resolutions = (typeof RESOLUTIONS)[number]
export interface Video {
  id: number
  title: string
  author: string
  availableResolutions: Resolutions[]
  canBeDownloaded: boolean
  minAgeRestriction: AgeRange | null
  createdAt: string
  publicationDate: string
}
