<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex xs12 sm12 md12>
        <v-card>
          <v-card-title class="title"> Reservasi</v-card-title>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 m12>
                    <v-select
                      label="Lokasi Hotel"
                      :items="branches"
                      v-model="items.branch"
                      item-text="location"
                      item-value="id"
                      prepend-icon="location_on"
                      :rules="[() => !!items.branch || 'Tidak boleh kosong!']"
                      required
                      id="branch"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md3>
                    <v-text-field
                      label="Dewasa"
                      type="number"
                      v-model="items.adult"
                      :rules="[() => !!items.adult || 'Tidak boleh kosong!']"
                      required
                      id="adult"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md3>
                    <v-text-field
                      label="Anak-anak"
                      type="number"
                      v-model="items.child"
                      :rules="[() => !!items.child|| 'Tidak boleh kosong!']"
                      id="child"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md3>
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
                      :return-value.sync="items.startDate"
                    >
                      <v-text-field
                        slot="activator"
                        label="Tanggal Check-In"
                        v-model="items.startDate"
                        prepend-icon="event"
                        id="startDate"
                        readonly
                        :rules="[() => !!items.startDate|| 'Tidak boleh kosong!']"
                        required
                      ></v-text-field>
                      <v-date-picker v-model="items.startDate" no-title scrollable :min="new Date().toISOString()">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menuStart = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menuStart.save(items.startDate)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm12 md3>
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
                      :return-value.sync="items.endDate"
                    >
                      <v-text-field
                        slot="activator"
                        label="Tanggal Check-Out"
                        v-model="items.endDate"
                        prepend-icon="event"
                        id="endDate"
                        readonly
                        required
                        :rules="[() => !!items.endDate|| 'Tidak boleh kosong!']"
                      ></v-text-field>
                      <v-date-picker v-model="items.endDate" no-title scrollable :min="new Date().toISOString()">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menuFinish = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menuFinish.save(items.endDate)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-flex md12 offset-md5>
                <v-btn
                  color="accent darken-1"
                  @click.native="getRooms"
                  :disabled="!valid"
                  id="getRooms"
                >
                  Cari
                </v-btn>
              </v-flex>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex> <!--milih spesifikasi reservasi-->
      <v-flex xs12 md6>
        <v-flex xs12 sm12 md12 v-for="(room1, index) in rooms" :key="room1.roomtpe_id">
          <v-card>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md6>
                    <span class="title">{{room1.roomtype_name}}</span>
                  </v-flex>
                  <v-flex xs6 sm6 md6>
                    <span class="subheading"> Rp {{room1.price}}</span> <span class="caption"> / malam / kamar</span>
                  </v-flex>
                  <v-flex xs6 sm6 md12>
                    <span class="caption text--accent-1"> Tersisa {{room1.quantity}} kamar!</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions md6>
              <v-btn flat color="accent" @click.native="addRoomType(room1)" :id="index">
                Pesan
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click.native="getFacility(room1)">
                <v-icon>{{ room1.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
              </v-btn>
            </v-card-actions>
            <v-slide-y-transition>
              <v-card-text v-show="room1.show">
                <v-flex xs12 sm12 md12>
                  <span>Kapasitas kamar untuk {{room1.capacity}} orang </span>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <span><b>Fasilitas : </b> </span>
                </v-flex>
                <v-flex xs12 sm12 md12 offset-md1>
                  <ul>
                    <li v-for="facility1 in facilities" :key="facility1.id">
                      {{facility1.name}}
                    </li>
                  </ul>
                </v-flex>
              </v-card-text>
            </v-slide-y-transition>
          </v-card>
        </v-flex>
      </v-flex> <!--tampil jenis kamar tersedia-->
      <v-flex xs12 sm12 md6 v-if="this.items.roomTypes.length!=0 || roleCheck == 6" weight>
        <v-card height="100%">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" @click.stop="dialog = true" v-if="roleCheck != 6">Isi Data Diri</v-btn>
          </v-card-actions>
          <v-card-title class="headline">Pesanan Saya</v-card-title>
          <v-card-text>
            <v-flex xs12 sm12 md12 v-for="roomtype1 in items.roomTypes" :key="roomtype1.id">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs6 sm6 md8>
                    <span class="title">{{roomtype1.name}}</span>
                  </v-flex>
                  <v-flex xs6 sm6 md4>
                    <span class="subheading">Jumlah : {{roomtype1.quantity}}</span>
                  </v-flex>
                  <v-flex xs6 sm6 md12>
                    <span class="caption">Rp {{roomtype1.pricePerRoom}} x {{roomtype1.quantity}} kamar x {{roomtype1.dur}} malam = Rp {{roomtype1.total}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
            <v-flex xs6 sm6 md8>
              <span class="title">Total : Rp {{totalPaymentSum}}</span>
            </v-flex>
            <v-flex>
              <v-card-actions>
                <v-spacer></v-spacer>
                <span class="caption">Metode Pembayaran : </span>
                <v-btn icon>
                  <v-icon large>atm</v-icon>
                </v-btn>
                <v-btn icon @click.stop="dialog2=true">
                  <v-icon large>credit_card</v-icon>
                </v-btn>
              </v-card-actions>
            </v-flex>
            <br/>
            <v-divider></v-divider>
            <div v-if="items.name!=='' || roleCheck == 6">
              <v-card-title class="headline">Data Diri</v-card-title>
              <v-card-text>
                <v-flex xs12 sm12 md12>
                  <span class="body-1">Nama : {{items.name}}</span>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <span class="body-1">Email : {{items.email}}</span>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <span class="body-1">Nomor Telepon : {{items.telp_numb}}</span>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <span class="body-1">Nomor Identitas : {{items.identityNumb}}</span>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <span class="body-1">Alamat : {{items.address}}</span>
                </v-flex>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="info" @click.stop="dialog3=true" :disabled="this.items.roomTypes.length==0" id="reservation">Reservasi</v-btn>
              </v-card-actions>
            </div>
          </v-card-text>
        </v-card>
      </v-flex> <!--daftar pesanan-->
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Isi Data Diri</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="dialog = false">Simpan</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid2" lazy-validation ref="form">
              <v-text-field
                label="Nama"
                v-model="items.name"
                :rules="[() => !!items.name || 'Tidak boleh kosong!']"
                autofocus
                required
              ></v-text-field>
              <v-text-field
                label="Email"
                v-model="items.email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                label="Nomor Identitas"
                v-model="items.identityNumb"
                :rules="identityRules"
                required
                counter
              ></v-text-field>
              <v-text-field
                label="Nomor telepon"
                v-model="items.telp_numb"
                required=""
              ></v-text-field>
              <v-text-field
                label="Alamat"
                v-model="items.address"
                :rules="[() => !!items.address || 'Tidak boleh kosong!']"
              ></v-text-field>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" max-width="400">
        <v-card>
          <v-flex md12>
            <v-card-title class="headline">Kartu Kredit</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="items.ccName"
                label="Nama Pemegang Kartu Kredit"
                required
              >
              </v-text-field>
              <v-text-field
                v-model="items.ccNumber"
                label="Nomor Kartu Kredit"
                required
              >
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click.native="dialog2 = false">Simpan</v-btn>
            </v-card-actions>
          </v-flex>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog3" max-width="250">
        <v-card>
          <v-card-title class="headline">Konfirmasi Pembayaran</v-card-title>
          <v-card-actions v-if="roleCheck!=6">
            <v-btn color="primary" @click="addReservation">
              Bayar
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <v-btn color="primary" @click="addReservationMember" id="save">
              Bayar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      roomqty: '',
      dialog3: false,
      dialog: false,
      dialog2: false,
      size: '',
      menuStart: false,
      menuFinish: false,
      form: true,
      valid2: true,
      valid: true,
      temp: 0,
      itemIndex: -1,
      items: {
        status: '',
        type: '',
        adult: '',
        child: '',
        branch: '',
        startDate: '',
        endDate: '',
        name: '',
        email: '',
        telp_numb: '',
        identityNumb: '',
        address: '',
        roomTypes: [],
        ccNumber: '',
        ccName: ''
      },
      defaultItem: {
        status: '',
        type: '',
        adult: '',
        child: '',
        branch: '',
        startDate: '',
        endDate: '',
        name: '',
        email: '',
        telp_numb: '',
        identityNumb: '',
        address: '',
        roomTypes: []
      },
      branches: [],
      rooms: [],
      date: '',
      facilities: [],
      roomTemp: [],
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
        v => (v.length === 16) || 'Nomor identitas harus 16 digit!'
      ]
    }),
    computed: {
      totalPaymentSum() {
        var totalPayment = 0;
        for (let i = 0; i < this.items.roomTypes.length; i++) {
          totalPayment = totalPayment + this.items.roomTypes[i].total
        }
        return totalPayment
      },
      roleCheck() {
        return localStorage.getItem('role')
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },

    created() {
      this.getBranches()
      if (localStorage.getItem('user') !== null)
        this.getUser()
    },

    methods: {
      getBranches() {
        const URL = '/api/branch/aktif'
        axios.get(URL)
          .then(response => {
            this.branches = response.data.data
          })
          .catch(err => {
          })
      },
      getRooms() {
        this.rooms = []
        const URL = '/api/roomtype/available?startDate=' + this.items.startDate + '&endDate=' + this.items.endDate +
          '&branch=' + this.items.branch
        axios.get(URL)
          .then(response => {
            this.rooms = response.data.data
            //this.size = this.rooms.length
          })
          .catch(err => {
          })

        if (this.items.roomTypes.length !== 0) {
          for (let i = 0; i < this.items.roomTypes.length; i++) {
            this.items.roomTypes.splice(i, this.items.roomTypes.length)
          }
        }
      },
      getFacility(roomItem) {
        const URL = '/api/roomtype/facility?startDate=' + this.items.startDate + '&endDate=' + this.items.endDate +
          '&branch=' + this.items.branch + '&roomType=' + roomItem.roomtype_id

        axios.get(URL)
          .then(response => {
            this.facilities = response.data.data
          })
          .catch(err => {
          })
        roomItem.show = !roomItem.show
      },
      addRoomType(roomItem) {
        var check = 0
        var date1 = new Date(this.items.startDate)
        var date2 = new Date(this.items.endDate)
        var timeDiff = Math.abs(date2.getTime() - date1.getTime())
        var diffDays = Math.ceil(timeDiff / (3600 * 1000 * 24))

        if (this.items.roomTypes.length === 0) {
          this.items.roomTypes.push({
            id: roomItem.roomtype_id,
            name: roomItem.roomtype_name,
            quantity: 1,
            pricePerRoom: roomItem.price,
            total: roomItem.price * diffDays,
            dur: diffDays
          })
        }
        else {
          for (let i = 0; i < this.items.roomTypes.length; i++) {
            if (this.items.roomTypes[i].id === roomItem.roomtype_id) {
              this.items.roomTypes[i].quantity = this.items.roomTypes[i].quantity + 1
              this.items.roomTypes[i].total = this.items.roomTypes[i].total + roomItem.price
              check = 1

            }
          }
          if (check == 0) {
            this.items.roomTypes.push({
              id: roomItem.roomtype_id,
              name: roomItem.roomtype_name,
              quantity: 1,
              pricePerRoom: roomItem.price,
              total: roomItem.price * diffDays,
              dur: diffDays
            })
          }
        }
      },
      addReservation() {
        for (let i = 0; i < this.items.roomTypes.length; i++) {
          this.roomTemp.push({
            id: this.items.roomTypes[i].id,
            quantity: this.items.roomTypes[i].quantity
          })
        }
        const URL = "/api/reservation/guest"
        axios.post(URL, {
            status: "Confirmed",
            type: "P",
            adult: this.items.adult,
            child: this.items.child,
            branch: this.items.branch,
            startDate: this.items.startDate,
            endDate: this.items.endDate,
            name: this.items.name,
            email: this.items.email,
            telp_numb: this.items.telp_numb,
            identityNumb: this.items.identityNumb,
            address: this.items.address,
            roomTypes: this.roomTemp
          }
        ).then(response => {
          //alert(id)
          //alert(response.data.data.reservation.id)
          //this.$router.push('/receipt/' + response.data.data.reservation.id)
          //this.$router.push('/')
          this.$router.push('/receipt/' + response.data.data[0].reservation.id)
        }).catch(err => {
          alert(JSON.stringify(response.data))
        })

      },
      addReservationMember()  {
        for (let i = 0; i < this.items.roomTypes.length; i++) {
          this.roomTemp.push({
            id: this.items.roomTypes[i].id,
            quantity: this.items.roomTypes[i].quantity
          })
        }
        const URL = "/api/reservation/member"
        axios.post(URL, {
            status: "Confirmed",
            type: "P",
            adult: this.items.adult,
            child: this.items.child,
            branch: this.items.branch,
            startDate: this.items.startDate,
            endDate: this.items.endDate,
            roomTypes: this.roomTemp,
            customer_id : localStorage.getItem('user')
          }
        ).then(response => {
          this.$router.push('/receipt/' + response.data.data[0].reservation.id)
          //this.$router.push('/')
        }).catch(err => {
          alert(JSON.stringify(response.data))
        })
      },
      getUser() {
        const URL = '/api/user/cust/' + localStorage.getItem('user')

        axios.get(URL)
          .then(response => {
            this.items.name = response.data.data.name
            this.items.address = response.data.data.address
            this.items.email = response.data.data.email
            this.items.telp_numb = response.data.data.telp_numb
            this.items.identityNumb = response.data.data.identityNumb
          })
          .catch(err => {
          })
      }
    }
  }
</script>
