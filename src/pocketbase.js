import PocketBase from 'pocketbase'

const domain = 'http://127.0.0.1:8090'
const client = new PocketBase(domain)

export { client, domain }
