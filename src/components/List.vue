<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Фильтр" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Поиск...." />
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Сброс</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Сортировать" class="mb-0">
          <b-input-group>
            <b-form-select v-model="sortBy" :options="sortOptions">
              <option slot="first" :value="null">-- Нет --</option>
            </b-form-select>
            <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
              <option :value="false">Asc</option> <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="3" label="Количество" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
            show-empty
            stacked="md"
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            @filtered="onFiltered"
    >

      <template slot="actions" slot-scope="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Информация
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template slot="row-details" slot-scope="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination
                :total-rows="totalRows"
                :per-page="perPage"
                v-model="currentPage"
                class="my-0"
        />
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal size="xl" id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
      <!--<pre>{{ modalInfo.content }}</pre>-->
      <b-table
              show-empty
              stacked="md"
              :items="infos"
              :fields="infoFields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @filtered="onFiltered"
      >
        <template slot="type" slot-scope="row">
          <p v-if="infos.type==1">Приход</p>
          <p v-else>Приход</p>
        </template>

        <template slot="type_r" slot-scope="row">
          <p v-if="row==1">Бонус</p>
          <p v-else>Бонус</p>
        </template>

      </b-table>
    </b-modal>

  </b-container>
</template>



<script>
import axios from 'axios';
const items = [];
const infos = [];
export default {

  name: 'List',
    data() {
      return {
        infos: infos,
        items: items,
        fields: [
          { key: 'name', label: 'ИМЯ', sortable: true, sortDirection: 'desc' },
          { key: 'phone', label: 'Телефон', sortable: true, class: 'text-center' },
          { key: 'actions', label: 'Actions' }
        ],
        infoFields: [
          { key: 'created_at', label: 'Дата создания', sortable: true, sortDirection: 'desc' },
          { key: 'type', label: 'Приход/Расход', sortable: true, class: 'text-center' },
          { key: 'amount', label: 'Сумма', sortable: true, class: 'text-center' },
          { key: 'type_r', label: 'Тип', sortable: true, class: 'text-center' },
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: items.length,
        pageOptions: [5, 10, 15,50,100],
        sortBy: null,
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        modalInfo: { title: '', content: '' }
      }
    },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
              .filter(f => f.sortable)
              .map(f => {
                return { text: f.label, value: f.key }
              })
    }
  },

  methods: {
    info(item, index, button) {
      axios.get('http://localhost:3001/courier/'+item.id)
              .then(response => (this.infos = response.data));
      this.modalInfo.title = `Имя курьера: ${item.name}`
      this.modalInfo.content = JSON.stringify(this.infos, null, 2)
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
      console.log(infos);
    },
    resetModal() {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },

  mounted() {
    axios
      .get('http://localhost:3001/list')
      .then(response => (this.items = response.data));





  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
