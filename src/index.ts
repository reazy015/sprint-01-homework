import {app} from './app'
import {rundb} from './db/db'
import {SETTINGS} from './shared/configs'

const PORT = SETTINGS.PORT

app.set('trust proxy', true)

rundb()

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`))
