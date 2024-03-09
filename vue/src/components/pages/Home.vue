<template>
  <PageLayout>
    <section>
      <div class="navigation">
        <h2 class="flex-1">
          Список источников
        </h2>
        <ElSelect v-model="typeOfList" size="small" placeholder="Выберите тип списка">
          <ElOption
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <ElSwitch
          v-model="editMode"
          active-text="Режим редактирования"
        />
        <ElButton
          type="primary"
          size="small"
          @click="() => openNewBiblioModal()"
        >Добавить источник</ElButton>
      </div>
      <ElSelect v-model="sortBy" size="small" placeholder="Сортировать по" @change="sortBooks">
        <ElOption label="По типу" value="type" />
        <ElOption label="По автору" value="author" />
        <ElOption label="По названию" value="title" />
        <ElOption label="По году" value="year" />
      </ElSelect>
      <ElSelect v-model="selectedTypes" multiple size="small" placeholder="Выберите типы источников">
        <ElOption
          v-for="(value, key) in LABEL_SOURCE_TYPE"
          :key="key"
          :label="value"
          :value="key"
        />
      </ElSelect>
      <ListContainer
        :books="filteredBooks"
        :type-list="editMode ? 'div' : typeOfList"
        :is-edit="editMode"
      />
    </section>
  </PageLayout>
</template>

<script>
import { mapGetters } from "vuex";
import { biblioModal } from "@/mixins/modals";
import ListContainer from "@/components/parts/biblio/List.vue";
import { RouteNames } from "@/router/routes";
import PageLayout from "@/components/parts/PageLayout.vue";
import { LABEL_SOURCE_TYPE } from "@/components/forms/BookForm.vue";

export default {
  name: 'HomePage',
  mixins: [
    biblioModal
  ],
  components: {
    PageLayout,
    ListContainer
  },
  data() {
    return {
      editMode: false,
      typeOfList: 'ol',
      selectedTypes: [],
      sortBy: null,
      options: [{
        value: "ol",
        label: "Нумерованный список"
      }, {
        value: "ul",
        label: "Простой список"
      }, {
        value: "div",
        label: "Блочный список"
      }]
    }
  },
  computed: {
    ...mapGetters('books', [
      'getBooks'
    ]),
    RouteNames() {
      return RouteNames
    },
    filteredBooks() {
      let filtered = this.getBooks
      if (this.selectedTypes.length > 0) {
        filtered = filtered.filter(book => this.selectedTypes.includes(book.type))
      }
      return filtered
    },
    LABEL_SOURCE_TYPE() {
      return LABEL_SOURCE_TYPE
    }
  },
  methods: {
    sortBooks() {
      if (this.sortBy === 'type') {
        this.sortByType()
      }
      else if (this.sortBy === 'author') {
        this.sortByAuthor()
      }
      else if (this.sortBy === 'title') {
        this.sortByTitle()
      }
      else if (this.sortBy === 'year') {
        this.sortByYear()
      }
    },
    sortByType() {
      let sortedBooks = this.filteredBooks.sort((a, b) => {
        return a.type.localeCompare(b.type)
      })
      this.$store.commit('books/setBooks', sortedBooks)
    },
    sortByAuthor() {
      let sortedBooks = this.filteredBooks.sort((a, b) => {
        const authorA = (a.authors && a.authors.length > 0) ? a.authors[0].surname : ''
        const authorB = (b.authors && b.authors.length > 0) ? b.authors[0].surname : ''
        return authorA.localeCompare(authorB)
      })
      this.$store.commit('books/setBooks', sortedBooks)
    },
    sortByTitle() {
      let sortedBooks = this.filteredBooks.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
      this.$store.commit('books/setBooks', sortedBooks)
    },
    sortByYear() {
      let sortedBooks = this.filteredBooks.sort((a, b) => {
        return a.year - b.year
      })
      this.$store.commit('books/setBooks', sortedBooks)
    }
  }
}
</script>
