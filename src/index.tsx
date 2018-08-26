import './global.css'
import 'normalize.css'
import 'typeface-raleway'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './redux'
import { App } from './views/app'

const render = async () => {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.getElementById('root')
	)
}

render()
