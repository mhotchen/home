import * as Transport from 'winston-transport'
import * as tripleBeam from 'triple-beam'
import * as winston from 'winston'

export namespace transports {
  export class Console extends Transport {
    log (info: any, next: () => void): any {
      console.log(info[tripleBeam.MESSAGE])

      if (next) {
        next()
      }
    }
  }
}

export default () => winston.createLogger({
  level: 'debug',
  format: winston.format.json({
    replacer: (_, value) => {
      if (value instanceof Buffer) {
        return value.toString('base64');
      } else if (value instanceof Error) {
        const error: Error = {
          name: value.name,
          message: value.message
        }
        if (value.stack !== undefined) {
          error.stack = value.stack
        }

        return error
      }

      return value
    }
  }),
  transports: [ new transports.Console() ]
})
