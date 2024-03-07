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
      <div>
        <input type="radio" id="sortByType" name="sort" @change="sortByType">
        <label for="sortByType">Сортировать по типу</label>
        <input type="radio" id="sortByAuthor" name="sort" @change="sortByAuthor">
        <label for="sortByAuthor">Сортировать по автору</label>
        <input type="radio" id="sortByTitle" name="sort" @change="sortByTitle">
        <label for="sortByTitle">Сортировать по названию</label>
        <input type="radio" id="sortByYear" name="sort" @change="sortByYear">
        <label for="sortByYear">Сортировать по году</label>
      </div>
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
import {mapGetters, mapActions} from "vuex";
import { biblioModal } from "@/mixins/modals";
import ListContainer from "@/components/parts/biblio/List.vue";
import {RouteNames} from "@/router/routes";
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
    }
  },
  computed: {
    ...mapGetters('books', [
      'getBooks'
    ]),
    RouteNames () {
      return RouteNames
    },
    filteredBooks () {
      let filtered = this.getBooks
      if (this.selectedTypes.length > 0) {
        filtered = filtered.filter(book => this.selectedTypes.includes(book.type))
      }
      return filtered
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
    }
  },
  methods: {
    ...mapActions('books', ['sortByType', 'sortByAuthor', 'sortByTitle', 'sortByYear'])
  }
}
</script>