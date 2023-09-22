import {Resolutions} from '../types/video'
import {RESOLUTIONS} from './constants'

export const isAvailableResolutionsCorrect = (availableResolutions: Resolutions[]) => {
  return availableResolutions.every((res) => RESOLUTIONS.includes(res))
}
