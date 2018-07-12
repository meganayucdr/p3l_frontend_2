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
                    label="Nama"
                    v-model="editedItem.name"
                    :rules="[() => !!editedItem.name || 'Tidak boleh kosong!']"
                    autofocus
                    required
                  >
                  </v-text-field>
                  <v-text-field
                    label="Email"
                    v-model="editedItem.email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    v-model="editedItem.password"
                    :rules="[() => !!editedItem.password || 'Tidak boleh kosong!',
                              6 <= editedItem.password.length || 'Password harus lebih dari 6 karakter!']"
                    type="password"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Nomor Identitas"
                    v-model="editedItem.identityNumb"
                    :rules="identityRules"
                    :counter="16"
                    required=""
                  ></v-text-field>
                  <v-text-field
                    label="Nomor telepon"
                    v-model="editedItem.telp_numb"
                    return-masked-value
                    :rules="telpRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Alamat"
                    v-model="editedItem.address"
                    :rules="[() => !!editedItem.address || 'Tidak boleh kosong!']"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-select
                    :items="branches"
                    v-model="editedItem.branch"
                    label="Pilih Branch"
                    item-text="location"
                    item-value="id"
                    :rules="[v => !!v || 'Tidak boleh kosong!']"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-select
                    :items="roles"
                    v-model="editedItem.role"
                    label="Pilih role"
                    item-text="name"
                    item-value="id"
                    :rules="[v => !!v || 'Tidak boleh kosong!']"
                    required
                  ></v-select>
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
          Pengguna Karyawan
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
            <td class="text-xs-left">{{ props.item.address }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.identityNumb }}</td>
            <td class="text-xs-left">{{ props.item.telp_numb }}</td>
            <td class="text-xs-left">{{ props.item.role.name }}</td>
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
  import axios from 'axios'

  export default {
    data: () => ({
      alert: false,
      message: '',
      valid: true,
      search: '',
      key:'',
      value:'',
      dialog: false,
      headers: [
        { text: 'Nama', value: 'name' },
        { text: 'Alamat', value: 'address' },
        { text: 'Email', value: 'email' },
        { text: 'Nomor Identitas', value: 'identityNumb' },
        { text: 'Nomor Telepon', value: 'telp' },
        { text: 'Role', value: 'role' },
        { text: 'Cabang', value: 'branch' },
        { text: 'Status', value: 'status' }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        name: '',
        email: '',
        password: '',
        address: '',
        identityNumb: '',
        telp_numb: '',
        status: '',
        role: '',
        branch: ''
      },
      defaultItem: {
        id: '',
        name: '',
        email: '',
        password: '',
        address: '',
        identityNumb: '',
        telp_numb: '',
        status: '',
        role: '',
        branch: ''
      },
      branches: [],
      roles: [],
      emailRules: [
        v => {
          return !!v || 'Tidak boleh kosong!'
        },
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Masukkan alamat E-mail yang valid!'
      ],
      identityRules: [
        v => {
          return !!v || 'Tidak boleh kosong!'
        },
        v => /[\d]$/.test(v) || 'Masukkan nomor identitas yang valid!',
        v => ( v.length === 16) || 'Nomor identitas harus 16 digit!'
      ],
      telpRules: [
        v => {
          return !!v || 'Tidak boleh kosong!'
        }
      ]
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Tambah Karyawan' : 'Ubah Karyawan'
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
      this.getRole()
    },

    methods: {
      fetchItem() {
        const URL = '/api/user/employee?name=' + this.key
        axios.get(URL)
          .then(response => {
            this.items = response.data.data
          })
          .catch(err => {})
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, {
          id : item.id,
          name : item.name,
          email: item.email,
          password: item.password,
          address: item.address,
          identityNumb: item.identityNumb,
          telp_numb: item.telp_numb,
          status: item.status,
          role: item.role.id,
          branch: item.branch.id
        })
        this.dialog = true
      },

      deleteItem (item) {
        const URL = '/api/user/employee/' + item.id

        axios.put(URL, {
          name: item.name,
          email: item.email,
          password: item.password,
          address: item.address,
          identityNumb: item.identityNumb,
          telp_numb: item.telp_numb,
          status: "NON-AKTIF",
          role: item.role.id,
          branch: item.branch.id
        })
          .then( response => {

            this.fetchItem(this.key)
          })
          .catch(err => {
            // alert(JSON.stringify(err))
          })
      },
      reDeleteItem (item) {
        const URL = '/api/user/employee/' + item.id

        axios.put(URL,
          {
            name: item.name,
            email: item.email,
            password: item.password,
            address: item.address,
            identityNumb: item.identityNumb,
            telp_numb: item.telp_numb,
            status: "AKTIF",
            role: item.role.id,
            branch: item.branch.id
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
        this.$refs.form.reset()
      },

      save () {
        if(this.$refs.form.validate())  {
          if(this.editedItem.id == "") {
            const URL = '/api/user/employee/register'
            axios.post(URL,
              {
                name: this.editedItem.name,
                email: this.editedItem.email,
                password: this.editedItem.password,
                address: this.editedItem.address,
                identityNumb: this.editedItem.identityNumb,
                telp_numb: this.editedItem.telp_numb,
                status: "AKTIF",
                role: this.editedItem.role,
                branch: this.editedItem.branch
              })
              .then(response => {
                this.fetchItem(this.key)
                if (response.data.data == null) {
                  this.alert = true
                  this.message = response.data.message
                }
              })
              .catch(err => {
                //alert(JSON.stringify(err))
              })
          }
          else  {
            const URL = '/api/user/employee/' + this.editedItem.id
            axios.put(URL,
              {
                name: this.editedItem.name,
                email: this.editedItem.email,
                password: this.editedItem.password,
                address: this.editedItem.address,
                identityNumb: this.editedItem.identityNumb,
                telp_numb: this.editedItem.telp_numb,
                status: "AKTIF",
                role: this.editedItem.role,
                branch: this.editedItem.branch
              }  )
              .then( response => {
                this.fetchItem(this.key)
                if (response.data.data == null) {
                  this.alert = true
                  this.message = response.data.message
                }
              })
              .catch(err => {
              })
          }
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
      },

      getRole() {
        const URL = '/api/user/roleEmployee'
        axios.get(URL)
          .then(response => {
            this.roles = response.data.data
          })
          .catch(err => {})
      }
    }
  }
</script>
