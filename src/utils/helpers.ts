import {Resolutions} from '../types/videos'
import {RESOLUTIONS} from './constants'

export const isAvailableResolutionsCorrect = (availableResolutions: Resolutions[]) => {
  return availableResolutions.every((res) => RESOLUTIONS.includes(res))
}
