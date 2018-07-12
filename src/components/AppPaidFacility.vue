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
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    label="Fasilitas"
                    v-model="editedItem.name"
                    :rules="[() => !!editedItem.name || 'Tidak boleh kosong!']"
                    autofocus
                    required=""
                  ></v-text-field>
                  <v-text-field
                    label=" Harga"
                    v-model="editedItem.price"
                    :rules="numericRules"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent darken-1" flat @click.native="close">Batal</v-btn>
            <v-btn color="accent darken-1" flat @click.native="save" :disabled="!valid">Simpan</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-flex>
      <v-card>
        <v-card-title class="title">
          Fasilitas Berbayar
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
      valid: true,
      search: '',
      key:'',
      alert: false,
      message: '',
      dialog: false,
      headers: [
        { text: 'Fasilitas Berbayar', value: 'name' },
        { text: 'Harga', value: 'price' },
        { text: 'Status', value: 'status'},
        { icon: 'settings', value: 'action', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        price: '',
        status: ''
      },
      defaultItem: {
        id: '',
        name: '',
        price: '',
        status: ''
      },
      numericRules: [
        v => {
          return !!v || 'Tidak boleh kosong!'
        },
        v => /[\d]$/.test(v) || 'Masukkan harga valid!'
      ]
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Tambah Fasilitas Berbayar' : 'Ubah Fasilitas Berbayar'
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
        const URL = '/api/paidfacility?name=' + this.key
        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          })
          .catch(err => {})
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const URL = '/api/paidfacility/' + item.id

        axios.put(URL,
          {
            name : item.name,
            price : item.price,
            status : "Tidak aktif"
          }  )
          .then( response => {
            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },

    reDeleteItem (item) {
      const URL = '/api/paidfacility/' + item.id

      axios.put(URL,
        {
          name: item.name,
          price: item.price,
          status: 'Aktif'
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
        if(this.$refs.form.validate())  {
          if(this.editedItem.id == "") {
            const URL = '/api/paidfacility'
            axios.post(URL,
              {
                name : this.editedItem.name,
                price : this.editedItem.price,
                status : "Aktif"
              })
              .then(response => {
                this.fetchItem(this.key)
                if (response.data.data == null) {
                  this.alert = true
                  this.message = response.data.message
                }
              })
              .catch(err => {
              })
          }
          else  {
            const URL = '/api/paidfacility/' + this.editedItem.id

            axios.put(URL,
              {
                name : this.editedItem.name,
                price : this.editedItem.price,
                status : "Aktif"
              }  )
              .then( response => {
                this.fetchItem(this.key)
                if (response.data.data == null) {
                  this.alert = true
                  this.message = response.data.message
                }
              })
              .catch(err => {
                // alert(JSON.stringify(err))
              })
          }
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
