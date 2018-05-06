import React, { Component } from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { AppProvider } from '@shopify/polaris'
const { apiKey, shopOrigin } = window.appData
class App extends Component {
	render() {
		return (
			<AppContainer>
				<AppProvider
					forceRedirect
					apiKey={apiKey}
					shopOrigin={shopOrigin}
				>
					<div>Hello from React app!</div>
				</AppProvider>
			</AppContainer>
		)
	}
}

export default function renderApp() {
	render(<App />, document.getElementById('root'))

	if (module.hot) {
		module.hot.accept()
	}
}
