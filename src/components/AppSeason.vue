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
              <v-flex xs12 sm12 md12>
                <v-text-field label="Season" v-model="editedItem.name" autofocus></v-text-field>
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
                >
                  <v-text-field
                    slot="activator"
                    label="Tanggal Mulai"
                    v-model="editedItem.start_date"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="editedItem.start_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuStart = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menuStart.save(editedItem.start_date)">OK</v-btn>
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
                >
                  <v-text-field
                    slot="activator"
                    label="Tanggal Selesai"
                    v-model="editedItem.finish_date"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="editedItem.finish_date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menuFinish = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menuFinish.save(editedItem.finish_date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-text-field label="Persentase" v-model="editedItem.percentage"></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-select
                  :items="branches"
                  v-model="editedItem.branch"
                  label="Pilih Branch"
                  item-text="location"
                  item-value="id"
                ></v-select>
              </v-flex>
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
    <v-flex>
      <v-card>
        <v-card-title class="title">
          Season
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
            <td class="text-xs-left">{{ moment(props.item.start_date).format('YYYY-MM-DD') }}</td>
            <td class="text-xs-left">{{ moment(props.item.finish_date).format('YYYY-MM-DD') }}</td>
            <td class="text-xs-left">{{ props.item.percentage }}</td>
            <td class="text-xs-left">{{ props.item.branch.location }}</td>
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
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-flex>
</template>

<script>
  import moment from 'moment'
  import axios from 'axios'

  export default {
    data: () => ({
      date: null,
      menuStart: false,
      menuFinish: false,
      search: '',
      key:'',
      dialog: false,
      headers: [
        { text: 'Season', value: 'name' },
        { text: 'Tanggal Mulai', value: 'start_date'},
        { text: 'Tanggal Selesai', value: 'finish_date'},
        { text: 'Persentase', value: 'percentage'},
        { text: 'Cabang', value: 'branch'},
        { text: 'Status', value: 'status'},
        { icon: 'settings', value: 'action', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        start_date: '',
        finish_date: '',
        percentage: '',
        branch: '',
        status: ''
      },
      defaultItem: {
        id: '',
        name: '',
        start_date: '',
        finish_date: '',
        percentage: '',
        branch: '',
        status: ''
      },
      branches: []
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Tambah Season' : 'Ubah Season'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.fetchItem()
      this.getBranch()
    },

    methods: {
      fetchItem() {
        const URL = '/api/season?name=' + this.key
        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          })
          .catch(err => {
            //alert(JSON.stringify(err))
          })
      },

      editItem (item) {
        var startdate = moment(item.start_date).format('YYYY-MM-DD')
        var finishdate = moment(item.finish_date).format('YYYY-MM-DD')

        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, {
          id: item.id,
          name: item.name,
          start_date: startdate,
          finish_date: finishdate,
          percentage: item.percentage,
          branch: item.branch.id,
          status: item.status
        })
        this.dialog = true
      },

      deleteItem (item) {
        var startdate = moment(item.start_date).format('YYYY-MM-DD')
        var finishdate = moment(item.finish_date).format('YYYY-MM-DD')

        const URL = '/api/season/' + item.id

        axios.put(URL,
          {
            name: item.name,
            start_date: startdate,
            finish_date: finishdate,
            percentage: item.percentage,
            branch: item.branch.id,
            status: "Deaktif"
          }  )
          .then( response => {
            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },

      reDeleteItem (item) {
        var startdate = moment(item.start_date).format('YYYY-MM-DD')
        var finishdate = moment(item.finish_date).format('YYYY-MM-DD')

        const URL = '/api/season/' + item.id

        axios.put(URL,
          {
            name: item.name,
            start_date: startdate,
            finish_date: finishdate,
            percentage: item.percentage,
            branch: item.branch.id,
            status: "Aktif"
          }  )
          .then( response => {
            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if(this.editedItem.id == "") {
          const URL = '/api/season'
          axios.post(URL,
            {
              name: this.editedItem.name,
              start_date: this.editedItem.start_date,
              finish_date: this.editedItem.finish_date,
              percentage: this.editedItem.percentage,
              status: "Aktif",
              branch: this.editedItem.branch
            })
            .then(response => {
              //alert(JSON.stringify(response))
              this.fetchItem(this.key)
            })
            .catch(err => {
              //alert(JSON.stringify(err))
            })
        }
        else  {
          const URL = '/api/season/' + this.editedItem.id

          axios.put(URL,
            {
              name: this.editedItem.name,
              start_date: this.editedItem.start_date,
              finish_date: this.editedItem.finish_date,
              percentage: this.editedItem.percentage,
              branch: this.editedItem.branch,
              status: "Aktif"
            }  )
            .then( response => {
              this.fetchItem(this.key)
            })
            .catch(err => {
              // alert(JSON.stringify(err))
            })
        }
        this.close()
      },

      getSearch()  {
        this.key = this.search
        this.fetchItem()
      },

      getBranch() {
        const URL = '/api/branch/aktif'
        axios.get(URL)
          .then(response => {
            this.branches = response.data.data
          })
          .catch(err => {})
      }
    }
  }
</script>
