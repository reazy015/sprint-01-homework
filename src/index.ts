import {app} from './app'
import {rundb} from './data-access-layer/db'

const PORT = process.env.PORT || 5000

rundb()

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`))
