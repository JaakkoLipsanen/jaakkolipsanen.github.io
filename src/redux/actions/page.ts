import { action } from 'typesafe-actions'

export const CHANGE_PAGE = 'CHANGE_PAGE'
export const changePage = (page: string) => action(CHANGE_PAGE, { page })
