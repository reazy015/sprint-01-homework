import {app} from './app'

const PORT = process.env.PORT || 3003

app.listen(PORT, () => `Server started on localhost:${PORT}`)
