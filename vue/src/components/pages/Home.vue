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
      <ElSelect
        v-model="sortBy"
        size="small"
        placeholder="Сортировать по"
        @change="filteredAndSortedBooks">
          <ElOption label="По типу" value="type" />
          <ElOption label="По автору" value="author" />
          <ElOption label="По названию" value="title" />
          <ElOption label="По году" value="year" />
      </ElSelect>
      <ElSelect
        v-model="selectedTypes"
        multiple size="small"
        placeholder="Выберите типы источников"
        @change="filteredAndSortedBooks">
          <ElOption
            v-for="(value, key) in LABEL_SOURCE_TYPE"
            :key="key"
            :label="value"
            :value="key"
          />
      </ElSelect>
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
  data() {
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
    RouteNames() {
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
    LABEL_SOURCE_TYPE() {
      return LABEL_SOURCE_TYPE
    }
  }
}
</script>
