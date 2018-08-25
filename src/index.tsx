import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as blog from './blog'
import { App } from './views/app'

import 'typeface-raleway'
import './global.css'

const render = async () => {
	await blog.initialize()
	ReactDOM.render(<App />, document.getElementById('root'))
}

render()
