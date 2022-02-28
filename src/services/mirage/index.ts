import {
  createServer,
  Factory,
  Model,
  Response,
  ActiveModelSerializer,
} from 'miragejs'
import faker from 'faker'

type User = {
  name: string
  email: string
  created_at: string
}

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

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
      server.createList('user', 200) // Criando 200 usuários
    },

    routes() {
      this.namespace = 'api'
      this.timing = 750 // Testar o tempo de carregamento

      this.get('/users', function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams

        const total = schema.all('user').length

        const pageStart = (Number(page) - 1) * Number(per_page)
        const pageEnd = pageStart + Number(per_page)

        const users = this.serialize(schema.all('user')).users.slice(
          pageStart,
          pageEnd
        )

        return new Response(200, { 'x-total-count': String(total) }, { users })
      })
      this.get('/users/:id')
      this.post('/users')

      this.namespace = '' // Nao causar problemas com uma conexão a api real por ter o mesmo nome "api"
      this.passthrough() // Se nao forem detetadas as rotas no mirage que passe a api real
    },
  })

  return server
}
