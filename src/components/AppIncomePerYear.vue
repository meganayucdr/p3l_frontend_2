<template>
  <v-flex md10 offset-md1 class="mt-2">
    <v-flex>
      <v-card>
        <v-card-title class="headline">Laporan Pendapatan Pertahun
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.year }}</td>
            <td class="text-xs-left">{{ props.item.branch1 }}</td>
            <td class="text-xs-left">{{ props.item.branch2 }}</td>
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
            text: 'Tahun',
            value: 'year'
          },
          { text: 'Yogyakarta', value: 'branch1' },
          { text: 'Bandung', value: 'branch2' },
          { text: 'Total', value: 'total' }
        ],
        items: [],
        years: [],
        totalIncome: 0
      }
    },
    created () {
      this.fetchItem()
    },
    methods: {
      fetchItem() {
        const URL = '/api/report'

        axios.get(URL)
          .then(response => {
            this.items = response.data.data
            this.getTotalIncome()
          }).catch(err => {})
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
