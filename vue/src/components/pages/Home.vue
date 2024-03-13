<template>
  <PageLayout>
    <section>
      <div class="navigation">
        <h2 class="flex-1">
          Список источников
        </h2>
        <ElSelect
          v-model="typeOfList"
          size="small"
          placeholder="Выберите тип списка">
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
      <div class="order">
        <div class="order--sort">
          <ElSelect
            v-model="sortBy"
            size="small"
            placeholder="Сортировать по"
            @change="() => getSortedBooks(sortBy)"
            >
              <ElOption label="По типу" value="type" />
              <ElOption label="По автору" value="author" />
              <ElOption label="По названию" value="title" />
              <ElOption label="По году" value="year" />
          </ElSelect>
        </div>
        <div class="order--filter">
          <ElSelect
            v-model="selectedTypes"
            multiple
            size="small"
            placeholder="Выберите типы источников"
            @change="() => filteredAndSortedBooks(selectedTypes)"
            collapse-tags
            >
              <ElOption
                v-for="(value, key) in LABEL_SOURCE_TYPE"
                :key="key"
                :label="`${value}`"
                :value="key"
              />
          </ElSelect>
        </div>
      </div>
      <ListContainer
        :books="books"
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
  data () {
    return {
      editMode: false,
      typeOfList: 'ol',
      selectedTypes: [],
      sortBy: null
    }
  },
  computed: {
    ...mapGetters('books', [
      'filteredAndSortedBooks'
    ]),
    RouteNames () {
      return RouteNames
    },
    books () {
      return this.filteredAndSortedBooks(this.selectedTypes, this.sortBy)
    },
    options () {
      return [{
        value: "ol",
        label: "Нумерованный список"
      }, {
        value: "ul",
        label: "Простой список"
      }, {
        value: "div",
        label: "Блочный список"
      }]
    },
    LABEL_SOURCE_TYPE () {
      return LABEL_SOURCE_TYPE
    },
    sortFunctions () {
      return {
        type: (a, b) => a.type.localeCompare(b.type),
        author: (a, b) => {
          const authorA = (a.authors && a.authors.length > 0) ? a.authors[0].surname : ''
          const authorB = (b.authors && b.authors.length > 0) ? b.authors[0].surname : ''
          return authorA.localeCompare(authorB)
        },
        title: (a, b) => a.title.localeCompare(b.title), 
        year: (a, b) => a.year - b.year
      }
    }
  },
  methods: {
    getSortedBooks (type) {
      if (this.sortFunctions[type]) {
        this.sortBy = this.sortFunctions[type]
      }
      else {
        this.sortBy = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order{
  display: flex;
  &--sort{
    padding: 10px 10px 10px 20px;
  }
  &--filter{
    padding: 10px;
  }
}
</style>
