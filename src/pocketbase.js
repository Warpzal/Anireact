import PocketBase from 'pocketbase'

const domain = 'https://anireact.fly.dev'
const client = new PocketBase(domain)

export { client, domain }
