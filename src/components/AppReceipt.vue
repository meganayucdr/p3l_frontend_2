<template>
  <v-flex md10 offset-md1 class="mt-4 mb-4">
    <v-card>
      <br/>
      <h1 class="text-md-center">Tanda Terima Pemesanan</h1>
      <br/>
      <v-flex md4 offset-md4>
        <v-divider></v-divider>
      </v-flex>
      <br/>
      <br/>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex md9>
            <p><b>ID Booking : </b>{{ datas.reservation_id }}</p>
            </v-flex>
            <v-flex md3>
              <p><b>Tanggal : </b>{{ new Date(datas.date).toDateString() }}</p>
            </v-flex>
            <br/>
            <br/>
            <v-flex md12>
              <p><b>Nama : </b>{{datas.name}}</p>
            </v-flex>
            <v-flex md12>
              <p><b>Alamat : </b>{{datas.address}}</p>
            </v-flex>
          </v-layout>
        </v-container>
        <v-flex md4 offset-md4>
          <v-divider></v-divider>
        </v-flex>
        <br/>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex md12>
              <p><b>Check In : </b>{{ new Date(datas.checkIn).toDateString() }}</p>
            </v-flex>
            <v-flex md12>
              <p><b>Check Out : </b>{{ new Date(datas.checkOut).toDateString() }}</p>
            </v-flex>
            <v-flex md12>
              <p><b>Dewasa : </b>{{datas.adult}}</p>
            </v-flex>
            <v-flex md12>
              <p><b>Anak-Anak : </b>{{datas.child}}</p>
            </v-flex>
            <v-flex md12>
              <p><b>Tanggal Pembayaran : </b>{{ new Date(datas.date).toDateString() }}</p>
            </v-flex>
          </v-layout>
        </v-container>
        <v-flex md4 offset-md4>
          <v-divider></v-divider>
        </v-flex>
      </v-card-text>
      <v-data-table
        hide-actions
        :headers="headers"
        :items="items"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.roomType }}</td>
          <td class="text-xs-left">{{ props.item.bedType }}</td>
          <td class="text-xs-left">{{ props.item.quantity }}</td>
          <td class="text-xs-left">{{ props.item.price }}</td>
          <td class="text-xs-left">{{ props.item.subTotal }}</td>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      items: [],
      datas: [],
      headers: [
        { text: 'Jenis Kamar', value: 'roomtype', sortable: false },
        { text: 'Tempat Tidur', value: 'bedtype', sortable: false },
        { text: 'Jumlah', value: 'quantity', sortable: false },
        { text: 'Harga', value: 'price', sortable: false },
        { text: 'Subtotal', value: 'subTotal', sortable: false }
        ]
    }),
    created() {
      this.fetchItem()
    },
    methods: {
      fetchItem() {
        const URL = '/api/reservation/receipt?id=' + this.$route.params.id

        axios.get(URL)
          .then(response => {
            //alert(JSON.stringify(response))
            this.datas = response.data.data
            this.items = response.data.data.roomTypeReceiptList
          })
          .catch(err => {
            //alert(JSON.stringify(err))
          })
      }
    }
  }
</script>


<style scoped>

</style>
