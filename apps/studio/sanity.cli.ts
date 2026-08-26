import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'b0mw2pap',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  deployment: {
    autoUpdates: true,
  },
})
