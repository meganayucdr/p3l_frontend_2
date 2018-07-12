<template>
  <v-flex md10 offset-md1 class="mt-4">
    <v-flex>
      <v-card>
        <v-card-title class="title">
          Reservasi Group
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.id }}</td>
            <td class="text-xs-left">{{ props.item.total }}</td>
            <td class="text-xs-left">{{ moment(props.item.date).format('YYYY-MM-DD') }}</td>

            <td class="justify-start layout px-0">
              <v-btn flat class="mx-0" @click="editItem(props.item)">
                detail
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-flex>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      alert: false,
      valid: true,
      message: '',
      search: '',
      key:'',
      dialog: false,
      headers: [
        { text: 'Kode Reservasi', value: 'id', sortable: false},
        { text: 'Total', value: 'total', sortable: false},
        { text: 'Tanggal Reservasi', value: 'date' },
        { icon: 'settings', value: 'action', sortable: false }
      ],
      items: []
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Tambah Cabang' : 'Ubah Cabang'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.fetchItem()
    },

    methods: {
      fetchItem() {
        const URL = '/api/reservation?type=G'
        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          })
          .catch(err => {})
      }
    }
  }
</script>
