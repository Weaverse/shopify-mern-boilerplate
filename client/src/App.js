import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { AppProvider, Page, Card, Button } from '@shopify/polaris'
import '@shopify/polaris/styles.css'

const { apiKey, shopOrigin } = window.appData

class App extends Component {
	static contextTypes = {
		easdk: PropTypes.object
	}
	state = {
		page: ''
	}

	componentDidMount() {
		window.easdk = this.context.easdk
	}

	render() {
		return (
			<Page title="Example application">
				<Card sectioned>
					<Button onClick={() => this.context.easdk.startLoading()}>
						Start loading
					</Button>
					<Button onClick={() => this.context.easdk.stopLoading()}>
						Stop loading
					</Button>
				</Card>
			</Page>
		)
	}
}

export default function renderApp() {
	render(
		<AppContainer>
			<AppProvider forceRedirect apiKey={apiKey} shopOrigin={shopOrigin}>
				<App />
			</AppProvider>
		</AppContainer>,
		document.getElementById('root')
	)

	if (module.hot) {
		module.hot.accept()
	}
}
