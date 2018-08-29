import { action } from 'typesafe-actions'

export const UPDATE_IS_PAGE_VISIBLE = 'UPDATE_IS_PAGE_VISIBLE'
export const updateIsPageVisible = (isPageVisible: boolean) =>
	action(UPDATE_IS_PAGE_VISIBLE, { isPageVisible })

export const UPDATE_BODY_SCROLL_Y = 'UPDATE_BODY_SCROLL_Y'
export const updateBodyScrollY = (bodyScrollY: number) =>
	action(UPDATE_BODY_SCROLL_Y, { bodyScrollY })
