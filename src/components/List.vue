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
          Остаток
        </b-button>

        <b-button size="sm" @click="goTodetail(row.item)" class="mr-1">
          Подробно
        </b-button>

        <b-button variant="outline-success" size="12px" @click="info(row.item, row.index, $event.target)" class="mr-1">
          
          <icon name="fa-thumbs-up">+</icon>
        </b-button>
      
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
      </b-table>
    </b-modal>

  </b-container>
</template>



<script>

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

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
          { key: 'user_sum', label: 'Общый баланс(Остаток)', sortable: true, class: 'text-center' },
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
      axios.get('http://192.168.1.91:3001/sum/'+item.id)
              .then(response => (this.infos = response.data));
      this.modalInfo.title = `Имя курьера: ${item.name}`
      this.modalInfo.content = JSON.stringify(this.infos, null, 2)
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    resetModal() {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    goTodetail(proId) {
    this.$router.push({name:'details',params:{Pid:proId.id}})
  }
  },

  mounted() {
    axios
      .get('http://192.168.1.91:3001/list')
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
