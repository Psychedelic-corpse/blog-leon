import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'b0mw2pap',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
  },
})
