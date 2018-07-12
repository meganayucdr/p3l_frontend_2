<template>
    <v-flex md10 offset-md1 class="mt-2">
      <v-flex>
        <v-card>
          <v-card-title class="headline">Laporan Pendapatan Bulanan
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
              <td class="text-xs-left">{{ props.item.groupIncome }}</td>
              <td class="text-xs-left">{{ props.item.personalIncome }}</td>
              <td class="text-xs-left">{{ props.item.total }}</td>
            </template>
          </v-data-table>
          <v-card-text>
            <v-flex md10 offset-md8>
              <span class="title"><b>Total :  {{totalIncome}}</b></span>
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
          { text: 'Grup', value: 'groupIncome' },
          { text: 'Personal', value: 'personalIncome' },
          { text: 'Total', value: 'total' }
        ],
        items: [],
        years: [],
        totalIncome: 0
      }
    },
    created () {
      this.getYear()
      this.fetchItem()
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
        const URL = '/api/report/monthlyIncome?year='+ this.key

        axios.get(URL)
          .then(response => {
            this.items = response.data.data
            this.getTotalIncome()
          }).catch(err => {})
      },
      getSearch() {
        this.key = this.yearSearch
        this.fetchItem()
      },
      getTotalIncome()  {
        for (let i = 0; i < this.items.length ; i++) {
          this.totalIncome = this.totalIncome + this.items[i].total
        }
      }
    }
  }
</script>

<style scoped>

</style>
