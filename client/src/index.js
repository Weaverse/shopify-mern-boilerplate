const { baseURL } = window.pagefly_data
const { PUBLIC_PATH } = process.env
// eslint-disable-next-line no-undef
__webpack_public_path__ = baseURL + PUBLIC_PATH + '/'
;(async () => {
	const renderApp = (await import('./App')).default
	renderApp()

	console.log(process.env)
})()
