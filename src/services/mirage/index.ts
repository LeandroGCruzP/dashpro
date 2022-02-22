import { createServer, Factory, Model } from 'miragejs'
import faker from 'faker'

type User = {
  name: string
  email: string
  created_at: string
}

export function makeServer() {
  const server = createServer({
    models: {
      user: Model.extend<Partial<User>>({}), // Partial faz que deva usar esses campos mas nao necessita ser todos os campos de User
    },

    factories: {
      user: Factory.extend({
        name(i: number) {
          return `Leh ${i + 1}`
        },
        email() {
          return faker.internet.email().toLowerCase()
        },
        createdAt() {
          return faker.date.recent(10) // Últimos 10 dias
        },
      }),
    },

    seeds(server) {
      server.createList('user', 10) // Criando 10 usuários
    },

    routes() {
      this.namespace = 'api'
      this.timing = 750 // Testar o tempo de carregamento

      this.get('/users')
      this.post('/users')

      this.namespace = '' // Nao causar problemas com uma conexão a api real por ter o mesmo nome "api"
      this.passthrough() // Se nao forem detetadas as rotas no mirage que passe a api real
    },
  })

  return server
}
