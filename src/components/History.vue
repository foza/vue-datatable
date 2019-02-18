<template>
	 <b-container fluid>
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
           	<template slot="type" slot-scope="row">

	          <p v-if="row.item.type === 1">Приход</p>
	          <p v-else="2">Расход</p>
	        </template>

        <template slot="type_r" slot-scope="row">
          <p v-if=" row.item.type_r === 1 ">Бонус от доставки</p>
          <p v-else-if="2">Сертификат</p>
          <p v-else-if="3">Бесплатный заказ</p>
        </template>

           </b-table>


</b-container>
</template>

<script>

import axios from 'axios';
const items = [{}];
export default {
	name: 'History',
	data(){
	   return{
	   	items: items,
	    proId: this.$route.params.Pid,
	    title: "details",
	    fields: [
          { key: 'created_at', label: 'Дата создания', sortable: true, sortDirection: 'desc' },
          { key: 'type', label: 'Приход/Расход', sortable: true, class: 'text-center' },
          { key: 'amount', label: 'Сумма', sortable: true, class: 'text-center' },
          { key: 'type_r', label: 'Тип', sortable: true, class: 'text-center' },
        ],
		currentPage: 1,
        perPage: 5,
        totalRows: items.length,
        pageOptions: [1, 5, 10, 15,50,100],
        sortBy: null,
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
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
	 methods:{
    init(){
    	var panda = this.$route.params.Pid;
      axios
      .get('http://192.168.1.91:3001/courierDetail/'+panda)
      .then(response => (this.items = response.data));
      console.log(items);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
	mounted() {
		this.init()
		
    
  }
}
</script>