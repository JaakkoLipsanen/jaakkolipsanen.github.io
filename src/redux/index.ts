import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer, { RootState } from './reducers'
import rootEpic from './epics'
import { createEpicMiddleware } from 'redux-observable'
import { RootActions } from './actions'

const epicMiddleware = createEpicMiddleware<
	RootActions,
	RootActions,
	RootState
>()

export const store = createStore<RootState, RootActions, {}, {}>(
	rootReducer,
	composeWithDevTools(applyMiddleware(epicMiddleware))
)

epicMiddleware.run(rootEpic)
store.dispatch({ type: 'INIT' })
