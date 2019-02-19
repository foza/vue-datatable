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

          <b-button size="sm" @click="add(row.item,row.index,$event.target)">+</b-button>

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
    <b-modal size="lg" id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
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

    <b-modal size="xl" id="modalAdd"  @hide="resetModal" :title="modalAdd.title" ok-only>

      <form @submit="onSubmit">
        <b-form-select v-model="modalAdd.selected" :options="options" />
        <hr>
        <b-form-select v-model="modalAdd.selected2" :options="payOptions" />
        <hr>
        <b-form-input type="text" placeholder="Введите сумму" v-model="modalAdd.amount" />
        <hr>
        <b-form-input type="number" placeholder="Введите номер заказа" v-model="modalAdd.order_id" />
          <hr>
          <div class="mt-3">

      
         

        <table class="table">
          <thead>
            <tr>
              <th scope="col">Имя</th>
              <th scope="col">Тип</th>
              <th scope="col">Тип2</th>
              <th scope="col">Номер заказа</th>
              <th scope="col">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ modalAdd.name }}</td>
              <td> 
                <p v-if ="selected === '1'">Приход</p>
                <p v-if ="selected === '2'">Расход</p>
              </td>
              <td>
                <p v-if ="selected2  === '1'">Бесплатная доставка</p>
                <p v-if ="selected2  === '2'">Бонус</p>
                <p v-if ="selected2  === '3'">Онлайн</p>
              </td>
              <td>{{ order_id }}</td>
              <td>{{ amount }}</td>
            </tr>
          </tbody>
        </table>
            <b-button-group>
        <b-button type="submit" variant="primary">Добавить</b-button>
        <b-button type="reset" variant="danger">Сброс</b-button>
      </b-button-group>
    </div>
      </form>
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

        modalAdd:{
            order_id:'',
            name:'',
            selected:'',
            selected2:'',
            amount:''
        },

        fields: [
          { key: 'name', label: 'ИМЯ', sortable: true, sortDirection: 'desc' },
          { key: 'phone', label: 'Телефон', sortable: true, class: 'text-center' },
          { key: 'actions', label: 'Actions' }
        ],
        infoFields: [
          { key: 'user_sum', label: 'Общый баланс(Остаток)', sortable: true, class: 'text-center' },
        ],

        selected: null,
        options: [
          { value: null, text: 'Выберите' },
          { value: '1', text: 'Приход(Начисление)' },
          { value: '2', text: 'Расход' }
        ],

        selected2: null,
        payOptions: [
          { value: null, text: 'Выберите' },
          { value: '1', text: 'Бесплатная доставка' },
          { value: '2', text: 'Бонус' },
          { value: '3', text: 'Онлайн' }
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
     },

    add(item,index,button){
       this.modalAdd.title = `Курьер: ${item.name}`,
       this.modalAdd.name =  item.name,
       this.$root.$emit('bv::show::modal', 'modalAdd', button)
    },

    onSubmit(evt) {
        evt.preventDefault()
        const send = JSON.stringify(this.modalAdd);
        axios.post('http://192.168.1.91:3001/add/',send).then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.log(error);
                });
      },

  },

  mounted() {
    axios.get('http://192.168.1.91:3001/list').then(response => (this.items = response.data));

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
