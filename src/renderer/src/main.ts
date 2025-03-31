import App from './App.svelte'
import { settings } from '../../config'

document.title = settings.appName

const app = new App({
  target: document.getElementById('app')
})

export default app
