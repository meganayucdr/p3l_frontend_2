<template>
  <v-flex md10 offset-md1 class="mt-2">
    <v-flex>
      <v-card>
        <v-card-title class="headline">Laporan Jumlah Tamu
          <v-spacer></v-spacer>
          <v-select
            v-model="monthSearch"
            label="Bulan"
            :items="months"
            name="key2"
          >
          </v-select>
          <v-select
            v-model="yearSearch"
            label="Tahun"
            :items="years"
            name="key1"
          >
          </v-select>
          <v-card-actions>
            <v-btn icon @click="getSearch" :disabled="yearSearch === '' || monthSearch === ''">
              <v-icon>search</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.roomType }}</td>
            <td class="text-xs-left">{{ props.item.groupAmount }}</td>
            <td class="text-xs-left">{{ props.item.personalAmount }}</td>
            <td class="text-xs-left">{{ props.item.total }}</td>
          </template>
        </v-data-table>
        <v-card-text>
          <v-flex md10 offset-md9>
            <span class="title"><b>Total :  {{totalAmount}}</b></span>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-flex>
</template>
<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        key1: '',
        key2: '',
        yearSearch: '',
        monthSearch: '',
        totalAmount: 0,
        headers: [
          {
            text: 'Jenis Kamar',
            value: 'roomType'
          },
          { text: 'Grup', value: 'groupAmount' },
          { text: 'Personal', value: 'personalAmount' },
          { text: 'Total', value: 'total' }
        ],
        items: [],
        years: [],
        months: []
      }
    },
    created () {
      this.getYear()
      this.fetchItem()
      this.getMonth()
    },
    methods: {
      getYear() {
        const URL = '/api/report/year'

        axios.get(URL)
          .then(response => {
            this.years = response.data.data
          }).catch(err => {})
      },
      fetchItem() {
        const URL = '/api/report/numberOfGuests?year='+ this.key1 + '&month=' + this.key2

        axios.get(URL)
          .then(response => {
            this.items = response.data.data
            this.getTotalAmount()
          }).catch(err => {})
      },
      getSearch() {
        this.key1 = this.yearSearch
        this.key2 = this.monthSearch
        this.fetchItem()
      },
      getMonth()  {
        const URL = '/api/report/month/m'

        axios.get(URL)
          .then(response => {
            this.months = response.data.data
          }).catch(err => {})
      },
      getTotalAmount()  {
        for (let i = 0; i < this.items.length ; i++) {
          this.totalAmount = this.totalAmount + this.items[i].total
        }
      }
    }
  }
</script>

<style scoped>

</style>
