import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import Counter from './Counter'
import ClockApp from './Clock'

const App = () => (
	<div>
		<h1>Hello, world.</ h1>
		<Counter/>
		clock!
		<ClockApp />
	</div>
)

export default hot(App)
