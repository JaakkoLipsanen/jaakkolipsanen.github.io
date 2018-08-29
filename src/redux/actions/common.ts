import { action } from 'typesafe-actions'

export const UPDATE_IS_PAGE_VISIBLE = 'UPDATE_IS_PAGE_VISIBLE'
export const updateIsPageVisible = (isPageVisible: boolean) =>
	action(UPDATE_IS_PAGE_VISIBLE, { isPageVisible })
