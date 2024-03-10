const booksLocalStorageKey = 'books'

const syncStateBooks = (state) => {
  localStorage.setItem(booksLocalStorageKey, JSON.stringify(state.books))
}

export default {
  namespaced: true,
  state: {
    books: JSON.parse(localStorage.getItem(booksLocalStorageKey)) ?? []
  },
  getters: {
    getBooks: (state) => state.books,
    getBook: (state) => (id) => state.books.find((book) => book.id === id),
    filteredAndSortedBooks: (state) => (selectedTypes, sortBy) => {
      let filteredBooks = state.books
      if (selectedTypes.length > 0) {
        filteredBooks = filteredBooks.filter(book => selectedTypes.includes(book.type))
      }
      switch (sortBy) {
        case 'type':
          filteredBooks.sort((a, b) => a.type.localeCompare(b.type))
          break
        case 'author':
          filteredBooks.sort((a, b) => {
            const authorA = (a.authors && a.authors.length > 0) ? a.authors[0].surname : ''
            const authorB = (b.authors && b.authors.length > 0) ? b.authors[0].surname : ''
            return authorA.localeCompare(authorB)
          })
          break
        case 'title':
          filteredBooks.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'year':
          filteredBooks.sort((a, b) => a.year - b.year)
          break
        default:
          break
      }
      return filteredBooks
    }
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
  actions: {  }
}