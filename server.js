const Hapi = require('hapi')
const Inert = require('inert')
const fs = require('fs')

const server = Hapi.Server({ port: 2345 })

const init = async () => {
  await server.register(Inert)

  server.route({
    path: '/',
    method: 'GET',
    handler: (req, h) => ({ message: 'Hello Hapi.js' })
  })

  server.route({
    path: '/upload',
    method: 'POST',
    options: {
      payload: {
        output: 'stream'
      }
    },
    handler: async (req, h) => {
      const { payload } = req

      const response = handleFileUpload(payload.file)
      return response
    }
  })

  await server.start()
}

const handleFileUpload = file => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./upload/' + file.hapi.filename, file._data, err => {
      if (err) {
        reject(err)
      }
      resolve({ message: 'Upload successfully!' })
    })
  })
}

init()
