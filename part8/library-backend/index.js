const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

let authors = [
  { name: 'Robert Martin', id: uuid(), born: 1952 },
  { name: 'Martin Fowler', id: uuid(), born: 1963 },
  { name: 'Fyodor Dostoevsky', id: uuid(), born: 1821 },
  { name: 'Joshua Kerievsky', id: uuid() },
  { name: 'Sandi Metz', id: uuid() },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
*/
let books = [
  { title: 'Clean Code', published: 2008, author: 'Robert Martin', id: uuid(), genres: ['refactoring'] },
  { title: 'Agile software development', published: 2002, author: 'Robert Martin', id: uuid(), genres: ['agile','patterns','design'] },
  { title: 'Refactoring, edition 2', published: 2018, author: 'Martin Fowler', id: uuid(), genres: ['refactoring'] },
  { title: 'Refactoring to patterns', published: 2008, author: 'Joshua Kerievsky', id: uuid(), genres: ['refactoring','patterns'] },
  { title: 'Practical Object-Oriented Design', published: 2012, author: 'Sandi Metz', id: uuid(), genres: ['refactoring','design'] },
  { title: 'Crime and punishment', published: 1866, author: 'Fyodor Dostoevsky', id: uuid(), genres: ['classic','crime'] },
  { title: 'Demons', published: 1872, author: 'Fyodor Dostoevsky', id: uuid(), genres: ['classic','revolution'] },
]

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
    input BookInput {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  }
    type Mutation {
    addBook(input: BookInput!): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,

    allBooks: (root, args) => {
      let filtered = books
      if (args.author)
        filtered = filtered.filter(b => b.author === args.author)
      if (args.genre)
        filtered = filtered.filter(b => b.genres.includes(args.genre))
      return filtered
    },

    allAuthors: () => authors,
  },

  Mutation: {
    addBook: (root, args) => {
      const { title, author, published, genres } = args.input
      const newBook = { title, author, published, genres, id: uuid() }

      books = books.concat(newBook)

      if (!authors.find(a => a.name === author)) {
        authors = authors.concat({ name: author, id: uuid() })
      }

      return newBook
    },

    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) return null

      author.born = args.setBornTo
      return author
    }
  },

  Author: {
    bookCount: (root) =>
      books.filter(book => book.author === root.name).length
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})