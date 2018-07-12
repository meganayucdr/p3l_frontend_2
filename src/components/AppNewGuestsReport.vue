<template>
  <v-flex md10 offset-md1 class="mt-2">
    <v-flex>
      <v-card>
        <v-card-title class="headline">Laporan Jumlah Pelanggan Baru
          <v-spacer></v-spacer>
          <v-select
            v-model="yearSearch"
            label="Tahun"
            :items="years"
            name="key"
            required
            :rules="[() => !!yearSearch || 'Tidak boleh kosong!']"
          >
          </v-select>
          <v-card-actions>
            <v-btn icon @click="getSearch" :disabled="yearSearch === ''">
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
            <td class="text-xs-left">{{ props.item.month }}</td>
            <td class="text-xs-left">{{ props.item.amount }}</td>
          </template>
        </v-data-table>
        <v-card-text>
          <v-flex md10 offset-md8>
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
        valid: true,
        key: '',
        yearSearch: '',
        headers: [
          {
            text: 'Bulan',
            value: 'month'
          },
          { text: 'Jumlah', value: 'amount' }
        ],
        items: [],
        years: [],
        totalAmount: 0
      }
    },
    created () {
      this.getYear()
      this.fetchItem()
    },
    methods: {
      getYear() {
        const URL = '/api/report/user/year/y'

        axios.get(URL)
          .then(response => {
            this.years = response.data.data
          }).catch(err => {})
      },
      fetchItem() {
        const URL = '/api/report/cust/newCust?year='+ this.key

        axios.get(URL)
          .then(response => {
            this.items = response.data.data
            this.getTotalAmount()
          }).catch(err => {})
      },
      getSearch() {
        this.key = this.yearSearch
        this.fetchItem()
      },
      getTotalAmount()  {
        for (let i = 0; i < this.items.length ; i++) {
          this.totalAmount = this.totalAmount + this.items[i].amount
        }
      }
    }
  }
</script>

<style scoped>

</style>
