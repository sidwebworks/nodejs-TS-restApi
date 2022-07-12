import logger from 'pino'
import dayjs from 'dayjs'

const log = logger({
    name: 'my-app',
    level: 'debug',
    base: {
        pid: false, //process id
    },
    timestamp: () => dayjs().format('YYYY-MM-DD HH:mm:ss')
});

export default log;

