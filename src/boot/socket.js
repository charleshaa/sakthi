import sio from 'socket.io-client'
let io = sio.connect(`${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`)
export default async ({ Vue }) => {
  Vue.prototype.$io = io
}
