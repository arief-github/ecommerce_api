import morgan from 'morgan';

let logger = morgan(':method :url :status :res[content-length] - :response-time ms')

export default logger;