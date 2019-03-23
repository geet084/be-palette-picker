const app = require('./app');
const cors = require('cors')
app.use(cors())

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}`)
});

module.exports = app;