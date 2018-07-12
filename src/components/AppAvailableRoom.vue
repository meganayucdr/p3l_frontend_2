<template>
  <v-flex md10 offset-md1>
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="accent" dark slot="activator" class="mb-2 mt-2" fab>
        <v-icon>search</v-icon>
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
              <v-flex xs12 sm12 md12>
                <v-flex xs12 sm12 md6>
                  <v-select
                    label="Cari berdasarkan..."
                    :items="filter"
                    v-model="search"
                  ></v-select>
                </v-flex>
              </v-flex>
              <v-flex xs12 sm12 md4>
                <v-select
                  label="Status Smoking"
                  :items="smoking"
                  v-model="editedItem.smokingStatus"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md4>
                <v-select
                  label="Tipe Kamar"
                  :items="roomTypes"
                  v-model="editedItem.roomType"
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md4>
                <v-select
                  label="Cabang"
                  :items="branches"
                  v-model="editedItem.branch"
                  item-text="location"
                  item-value="id"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-menu
                  ref="menuStart"
                  lazy
                  :close-on-content-click="false"
                  v-model="menuStart"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  min-width="290px"
                  :return-value.sync="editedItem.startDate"
                >
                  <v-text-field
                    slot="activator"
                    label="Tanggal Check-In"
                    v-model="editedItem.startDate"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="editedItem.startDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuStart = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menuStart.save(editedItem.startDate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-menu
                  ref="menuFinish"
                  lazy
                  :close-on-content-click="false"
                  v-model="menuFinish"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  min-width="290px"
                  :return-value.sync="editedItem.endDate"
                >
                  <v-text-field
                    slot="activator"
                    label="Tanggal Check-Out"
                    v-model="editedItem.endDate"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="editedItem.endDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuFinish = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menuFinish.save(editedItem.endDate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent darken-1" flat @click.native="close">Batal</v-btn>
          <v-btn color="accent darken-1" flat @click.native="fetchItem">Cari</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog1" max-width="500px">
      <v-card md6>
        <v-flex md10 offset-md1>
          <v-card-title>
            <span class="title"> Fasilitas </span>
          </v-card-title>
          <v-card-text>
            <ul>
              <li v-for="facility1 in editedItem.roomType.facilityList" :key="facility1.id">
                {{ facility1.name }}
              </li>
            </ul>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-title>
            <span class="title"> Tipe Tempat tidur </span>
          </v-card-title>
          <v-card-text>
            {{ editedItem.bedType.name }}
          </v-card-text>
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
          Kamar Tersedia
          <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.code }}</td>
            <td class="text-xs-left">{{ props.item.number }}</td>
            <td class="text-xs-left">{{ props.item.floor }}</td>
            <td class="text-xs-left">{{ props.item.smokingStatus }}</td>
            <td class="text-xs-left">{{ props.item.roomType.name }}</td>
            <td class="text-xs-left">{{ props.item.status }}</td>

            <td class="justify-start layout px-0">
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
      menuStart: false,
      menuFinish: false,
      key: '',
      dialog: false,
      dialog1: false,
      headers: [
        {text: 'Kode', value: 'code'},
        {text: 'Nomor Kamar', value: 'number'},
        {text: 'Nomor Lantai', value: 'floor'},
        {text: 'Status Smoking', value: 'smokingStatus'},
        {text: 'Tipe Kamar', value: 'roomType'},
        {text: 'Status', value: 'status'},
        {icon: 'settings', value: 'action', sortable: false}
      ],
      branched: [],
      items: [],
      editedBranch: -1,
      editedIndex: -1,
      editedItem: {
        id: '',
        code: '',
        number: '',
        floor: '',
        smokingStatus: '',
        bedType: '',
        roomType: -1,
        branch: -1,
        status: '',
        startDate: '',
        endDate: ''
      },
      defaultItem: {
        id: '',
        code: '',
        number: '',
        floor: '',
        smokingStatus: '',
        bedType: '',
        roomType: -1,
        branch: -1,
        status: '',
        startDate: '',
        endDate: ''
      },
      bedTypes: [],
      branches: [],
      roomTypes: [],
      smoking: ['Smoking', 'Non-Smoking']
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Cari Kamar Tersedia' : 'Ubah Kamar'
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    created() {
      this.getBedType()
      this.getRoomTypeList()
      this.getBranchList()
    },

    methods: {
      fetchItem() {
        if (this.search == "" || this.search == "Semua") {
          const URL = '/api/room/available?startDate=' + this.editedItem.startDate + '&endDate=' + this.editedItem.endDate
            + '&roomType=' + this.editedItem.roomType + '&smokingStatus=' + this.editedItem.smokingStatus
            + '&branch=' + this.editedItem.branch
          axios.get(URL)
            .then(response => {
              this.items = response.data.data
            })
            .catch(err => {
            })
        }
        else
          if(this.search == "Jenis Kamar")  {
            const URL = '/api/room/available/roomtype?startDate=' + this.editedItem.startDate + '&endDate=' + this.editedItem.endDate
            + '&roomType=' + this.editedItem.roomType
            axios.get(URL)
              .then(response => {
                this.items = response.data.data
              })
              .catch(err => {
              })
          }
          else {
            const URL = '/api/room/available/branch?startDate=' + this.editedItem.startDate + '&endDate=' + this.editedItem.endDate
              + '&branch=' + this.editedItem.branch
            axios.get(URL)
              .then(response => {
                this.items = response.data.data
              })
              .catch(err => {
              })
          }
        this.close()
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
      getBedType() {
        const URL = '/api/room/bedtype'
        axios.get(URL)
          .then(response => {
            this.bedTypes = response.data.data
          })
          .catch(err => {
          })
      },
      getBranchList() {
        const URL = '/api/branch/aktif'
        axios.get(URL)
          .then(response => {
            this.branches = response.data.data
          })
          .catch(err => {
          })
      },
      getRoomTypeList() {
        const URL = '/api/roomtype?name='
        axios.get(URL)
          .then(response => {
            this.roomTypes = response.data.data
          })
          .catch(err => {
          })
      }
    }
  }
</script>
