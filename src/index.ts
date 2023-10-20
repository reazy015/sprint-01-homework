import {app} from './app'
import {rundb} from './db/db'
import {SETTINGS} from './shared/configs'

const PORT = SETTINGS.PORT

rundb()

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`))
