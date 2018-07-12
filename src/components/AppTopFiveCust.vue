<template>
  <v-flex md10 offset-md1 class="mt-2">
    <v-flex>
      <v-card>
        <v-card-title class="headline">Laporan 5 Pelanggan Reservasi Terbanyak
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.reservationAmount }}</td>
            <td class="text-xs-left">{{ props.item.total }}</td>
          </template>
        </v-data-table>
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
            text: 'Nama Pelanggan',
            value: 'name'
          },
          { text: 'Jumlah Reservasi', value: 'reservationAmount' },
          { text: 'Total Pembayaran', value: 'total' }
        ],
        items: [],
        years: [],
        totalAmount: 0
      }
    },
    created () {
      this.fetchItem()
    },
    methods: {
      fetchItem() {
        const URL = '/api/report/cust/top/five/list/report/'

        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          }).catch(err => {})
      }
    }
  }
</script>

<style scoped>

</style>
