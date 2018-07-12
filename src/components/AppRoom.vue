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
                <v-text-field
                  label="Nomor Kamar"
                  v-model="editedItem.number"
                  autofocus
                  type="number"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Nomor Lantai" v-model="editedItem.floor" type="number"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-select
                  label="Status Smoking"
                  :items="smoking"
                  v-model="editedItem.smokingStatus"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-select
                  label="Tipe Tempat Tidur"
                  :items="bedTypes"
                  v-model="editedItem.bedType"
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-select
                  label="Tipe Kamar"
                  :items="roomTypes"
                  v-model="editedItem.roomType"
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-flex>
              <v-select
                label="Cabang"
                :items="branches"
                v-model="editedItem.branchList"
                multiple
                chips
                item-text="location"
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
          <v-card-title>
            <span class="title"> Cabang </span>
          </v-card-title>
          <v-card-text>
            <ul>
              <li v-for="branch1 in editedItem.branchList" :key="branch1.id">
                {{ branch1.location }}
              </li>
            </ul>
          </v-card-text>
          <v-divider></v-divider>
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
          Kamar
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
            <td class="text-xs-left">{{ props.item.code }}</td>
            <td class="text-xs-left">{{ props.item.number }}</td>
            <td class="text-xs-left">{{ props.item.floor }}</td>
            <td class="text-xs-left">{{ props.item.smokingStatus }}</td>
            <td class="text-xs-left">{{ props.item.roomType.name }}</td>
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
        roomType: '',
        branchList: [],
        status: ''
      },
      defaultItem: {
        id: '',
        code: '',
        number: '',
        floor: '',
        smokingStatus: '',
        bedType: '',
        roomType: '',
        branchList: [],
        status: ''
      },
      bedTypes: [],
      branches: [],
      roomTypes: [],
      smoking: ['Smoking', 'Non-Smoking'],
      idList: []
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Tambah Kamar' : 'Ubah Kamar'
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    created() {
      this.fetchItem()
      this.getBranchList()
      this.getRoomTypeList()
      this.getBedType()
    },

    methods: {
      fetchItem() {
        const URL = '/api/room?code=' + this.key
        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          })
          .catch(err => {
          })
      },

      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
        for (var ea in item.branchList) {
          this.branched.push(item.branchList[ea].id)
        }
        this.editedItem = Object.assign({}, {
          id: item.id,
          code: item.code,
          number: item.number,
          floor: item.floor,
          smokingStatus: item.smokingStatus,
          bedType: item.bedType.id,
          roomType: item.roomType.id,
          status: item.status,
          branchList: this.branched
        })
        this.branched = []
        this.dialog = true
      },

      deleteItem(item) {
        const URL = '/api/room/' + item.id
        for (var ea in item.branchList) {
          this.branched.push(item.branchList[ea].id)
        }

        axios.put(URL,
          {
            number: item.number,
            floor: item.floor,
            smokingStatus: item.smokingStatus,
            bedType: item.bedType.id,
            roomType: item.roomType.id,
            branchList: this.branched,
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
        const URL = '/api/room/' + item.id
        for (var ea in item.branchList) {
          this.branched.push(item.branchList[ea].id)
        }

        axios.put(URL,
          {
            number: item.number,
            floor: item.floor,
            smokingStatus: item.smokingStatus,
            bedType: item.bedType.id,
            roomType: item.roomType.id,
            branchList: this.branched,
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
          const URL = '/api/room'
          axios.post(URL,
            {
              number: this.editedItem.number,
              floor: this.editedItem.floor,
              smokingStatus: this.editedItem.smokingStatus,
              bedType: this.editedItem.bedType,
              roomType: this.editedItem.roomType,
              branchList: this.editedItem.branchList,
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
          const URL = '/api/room/' + this.editedItem.id

          axios.put(URL,
            {
              number: this.editedItem.number,
              floor: this.editedItem.floor,
              smokingStatus: this.editedItem.smokingStatus,
              bedType: this.editedItem.bedType,
              roomType: this.editedItem.roomType,
              branchList: this.editedItem.branchList,
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
