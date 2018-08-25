import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import * as blog from './blog'
import { store } from './redux'
import { App } from './views/app'

import 'typeface-raleway'
import './global.css'

const render = async () => {
	await blog.initialize()
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.getElementById('root')
	)
}

render()
