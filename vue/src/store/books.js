const booksLocalStorageKey = 'books'

const syncStateBooks = (state) => {
  localStorage.setItem(booksLocalStorageKey, JSON.stringify(state.books))
}
const sortByType = (books) => {
  return books.sort((a, b) => {
    return a.type.localeCompare(b.type)
  })
}
const sortByAuthor = (books) => {
  return books.sort((a, b) => {
    const authorA = (a.authors && a.authors.length > 0) ? a.authors[0].surname : ''
    const authorB = (b.authors && b.authors.length > 0) ? b.authors[0].surname : ''
    return authorA.localeCompare(authorB)
  })
}
const sortByTitle = (books) => {
  return books.sort((a, b) => {
    return a.title.localeCompare(b.title)
  })
}
const sortByYear = (books) => {
  return books.sort((a, b) => {
    return a.year - b.year
  })
}

export default {
  namespaced: true,
  state: {
    books: JSON.parse(localStorage.getItem(booksLocalStorageKey)) ?? []
  },
  getters: {
    getBooks: (state) => state.books,
    getBook: (state) => (id) => state.books.find((book) => book.id === id)
  },
  mutations: {
    setBooks: (state, payload) => {
      state.books = payload
      syncStateBooks(state)
    },
    addBook: (state, payload) => {
      payload.id = Date.now()
      state.books.push(payload)
      syncStateBooks(state)
    },
    removeBook: (state, payload) => {
      state.books = state.books.filter((book) => book.id !== payload)
      syncStateBooks(state)
    },
    editBook: (state, payload) => {
      state.books = state.books.map((book) => book.id === payload.id ? payload : book)
      syncStateBooks(state)
    }
  },
  actions: {
    sortByType({ commit, state }) {
      commit('setBooks', sortByType(state.books))
    },
    sortByAuthor({ commit, state }) {
      commit('setBooks', sortByAuthor(state.books))
    },
    sortByTitle({ commit, state }) {
      commit('setBooks', sortByTitle(state.books))
    },
    sortByYear({ commit, state }) {
      commit('setBooks', sortByYear(state.books))
    }
  }
}