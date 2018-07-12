<template>
  <v-flex md10 offset-md1>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="accent" dark slot="activator" class="mb-2 mt-2" fab>
        <v-icon>add</v-icon>
      </v-btn>
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title class="white--text">
            <span class="headline">{{ formTitle }}</span>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Nama Tipe Kamar" v-model="editedItem.name" autofocus></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Harga" v-model="editedItem.price"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Deskripsi" v-model="editedItem.desc"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field
                  label="Kapasitas Kamar"
                  v-model="editedItem.capacity"
                  type="number"
                  mask="##"
                ></v-text-field>
              </v-flex>
              <v-select
                label="Fasilitas"
                :items="facilities"
                v-model="editedItem.facilityList"
                multiple
                chips
                item-text="name"
                item-value="id"
              ></v-select>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent darken-1" flat @click.native="close">Batal</v-btn>
          <v-btn color="accent darken-1" flat @click.native="save">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog1" max-width="500px">
      <v-card md6>
        <v-flex md10 offset-md1>
          <v-card-text>
            <ul>
              <li v-for="facility1 in editedItem.facilityList" :key="facility1.id">
                {{ facility1.name }}
              </li>
            </ul>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close1">Tutup</v-btn>
          </v-card-actions>
        </v-flex>
      </v-card>
    </v-dialog>
    <v-flex>
      <v-card>
        <v-card-title class="title">
          Jenis Kamar
          <v-spacer></v-spacer>
          <v-text-field
            name="key"
            append-icon="search"
            label="Cari"
            single-line
            v-model="search"
            @input="getSearch()"
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.price }}</td>
            <td class="text-xs-left">{{ props.item.capacity }}</td>
            <td class="text-xs-left">{{ props.item.status }}</td>

            <td class="justify-start layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <div  v-if="props.item.status === 'AKTIF'">
                <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                  <v-icon color="pink">delete</v-icon>
                </v-btn>
              </div>
              <div v-else>
                <v-btn icon class="mx-0" @click="reDeleteItem(props.item)">
                  <v-icon color="indigo">check_box</v-icon>
                </v-btn>
              </div>
              <v-btn icon class="mx-0" @click="getItem(props.item)">
                <v-icon color="indigo">info</v-icon>
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
      search: '',
      key: '',
      dialog: false,
      dialog1: false,
      headers: [
        {text: 'Nama Tipe Kamar', value: 'name'},
        {text: 'Harga', value: 'price'},
        {text: 'Kapasitas Kamar', value: 'capacity'},
        {text: 'Status', value: 'status'},
        {icon: 'settings', value: 'action', sortable: false}
      ],
      items: [],
      editedBranch: -1,
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        price: '',
        capacity: '',
        pict: '',
        desc: '',
        facilityList: [],
        status: ''
      },
      defaultItem: {
        id: '',
        name: '',
        price: '',
        capacity: '',
        pict: '',
        desc: '',
        facilityList: [],
        status: ''
      },
      facilities: [],
      facility: []
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Tambah Jenis Kamar' : 'Ubah Jenis Kamar'
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    created() {
      this.fetchItem()
      this.getFacilityList()
    },

    methods: {
      fetchItem() {
        const URL = '/api/roomtype?name=' + this.key
        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          })
          .catch(err => {
          })
      },

      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
        for (var ea in item.facilityList) {
          this.facility.push(item.facilityList[ea].id)
        }
        this.editedItem = Object.assign({}, {
          id: item.id,
          name: item.name,
          price: item.price,
          capacity: item.capacity,
          pict: item.pict,
          desc: item.desc,
          facilityList: this.facility,
          status: item.status
        })
        this.facility = []
        this.dialog = true
      },

      deleteItem(item) {
        const URL = '/api/roomtype/' + item.id
        for (var ea in item.facilityList) {
          this.facility.push(item.facilityList[ea].id)
        }

        axios.put(URL,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            capacity: item.capacity,
            pict: item.pict,
            desc: item.desc,
            facilityList: this.facility,
            status: "NON-AKTIF"
          })
          .then(response => {
            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },

      reDeleteItem (item) {
        const URL = '/api/roomtype/' + item.id
        for (var ea in item.facilityList) {
          this.facility.push(item.facilityList[ea].id)
        }

        axios.put(URL,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            capacity: item.capacity,
            pict: item.pict,
            desc: item.desc,
            facilityList: this.facility,
            status: "AKTIF"
          })
          .then(response => {
            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },

      getItem(item) {
        this.editedItem = Object.assign({}, item)
        this.dialog1 = true
      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      close1() {
        this.dialog1 = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save() {
        if (this.editedItem.id == "") {
          const URL = '/api/roomtype'
          axios.post(URL,
            {
              name: this.editedItem.name,
              price: this.editedItem.price,
              capacity: this.editedItem.capacity,
              pict: this.editedItem.pict,
              desc: this.editedItem.desc,
              facilityList: this.editedItem.facilityList,
              status: "AKTIF"
            })
            .then(response => {
              //alert(JSON.stringify(response))
              this.fetchItem(this.key)
            })
            .catch(err => {
              //alert(JSON.stringify(err))
            })
        }
        else {
          const URL = '/api/roomtype/' + this.editedItem.id

          axios.put(URL,
            {
              name: this.editedItem.name,
              price: this.editedItem.price,
              capacity: this.editedItem.capacity,
              pict: this.editedItem.pict,
              desc: this.editedItem.desc,
              facilityList: this.editedItem.facilityList,
              status: "AKTIF"
            })
            .then(response => {
              this.fetchItem(this.key)
            })
            .catch(err => {
              // alert(JSON.stringify(err))
            })
        }
        this.close()
      },
      getSearch() {
        this.key = this.search
        this.fetchItem()
      },
      getFacilityList() {
        const URL = '/api/facility/aktif'
        axios.get(URL)
          .then(response => {
            this.facilities = response.data.data
          })
          .catch(err => {
          })
      }
    }
  }
</script>
