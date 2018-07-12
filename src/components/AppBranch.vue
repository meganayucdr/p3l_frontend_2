<template>
  <v-flex md10 offset-md1>
    <v-alert type="error" dismissible v-model="alert" transition="scale-transition">
      {{ message }}
    </v-alert>
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
        <v-form v-model="valid" lazy-validation ref="form">
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    label="Lokasi"
                    v-model="editedItem.location"
                    :rules="[() => !!editedItem.location || 'Tidak boleh kosong!']"
                    autofocus
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent darken-1" flat @click.native="close">Batal</v-btn>
            <v-btn
              color="accent darken-1"
              flat
              @click.native="save"
              :disabled="!valid"
            >
              Simpan
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-flex>
      <v-card>
        <v-card-title class="title">
          Cabang
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
            <td class="text-xs-left">{{ props.item.location }}</td>
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
        { text: 'Lokasi', value: 'loc' },
        { text: 'Status', value: 'status'},
        { icon: 'settings', value: 'action', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        loc: '',
        status: ''
      },
      defaultItem: {
        id: '',
        loc: '',
        status: ''
      }
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
        const URL = '/api/branch?location=' + this.key
        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          })
          .catch(err => {})
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, {
          id: item.id,
          location: item.location,
          status: item.status
        })
        this.dialog = true
      },

      reDeleteItem (item) {
        const URL = '/api/branch/' + item.id

        axios.put(URL,
          {
            location : item.location,
            status : "AKTIF"
          }  )
          .then( response => {
            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },
      deleteItem (item) {
        const URL = '/api/branch/' + item.id

        axios.put(URL,
          {
            location : item.location,
            status : "NON-AKTIF"
          }  )
          .then( response => {
            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },

      close () {
        this.$refs.form.reset()
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
          if(this.editedItem.id == "") {
            const URL = '/api/branch'
            axios.post(URL,
              {
                location : this.editedItem.location,
                status : "AKTIF"
              })
              .then(response => {
                //alert(JSON.stringify(response))
                this.fetchItem(this.key)
                if(response.data.data == null)  {
                 this.message = response.data.message
                 this.alert = true
                }
              })
              .catch(err => {
                alert(JSON.stringify(err))
              })

          }
          else {
            const URL = '/api/branch/' + this.editedItem.id

            axios.put(URL,
              {
                location: this.editedItem.location,
                status: "AKTIF"
              })
              .then(response => {
                this.fetchItem(this.key)
                if (response.data.data == null) {
                  this.message = response.data.message
                  this.alert = true

                }
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
      }
    }
  }
</script>
