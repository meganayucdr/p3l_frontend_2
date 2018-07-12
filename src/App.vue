<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      clipped
    >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Beranda</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/cust/history" v-if="roleCheck == 6">
          <v-list-tile-action>
            <v-icon>history</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Histori Reservasi</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/branch" v-if="roleCheck == 1">
          <v-list-tile-action>
            <v-icon>business</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Cabang</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/facility" v-if="roleCheck == 2 || roleCheck == 5 || roleCheck === 3">
          <v-list-tile-action>
            <v-icon>event_seat</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Fasilitas</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/paidfacility" v-if="roleCheck == 2 || roleCheck == 5 || roleCheck === 3">
          <v-list-tile-action>
            <v-icon>room_service</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Fasilitas Berbayar</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/employee" v-if="roleCheck == 2 || roleCheck == 1">
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Pengguna Karyawan</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/customer" v-if="roleCheck == 2 || roleCheck == 1">
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Pengguna Pelanggan</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/season" v-if="roleCheck == 2 || roleCheck == 1">
          <v-list-tile-action>
            <v-icon>attach_money</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Season</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group  prepend-icon="hotel">
          <v-list-tile slot="activator">
            <v-list-tile-title>Kamar</v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/room"  v-if="roleCheck === 2">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Pengelolaan Kamar</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/availableRoom">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Lihat Kamar Tersedia</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile to="/roomtype"  v-if="roleCheck == 2 || roleCheck == 3">
          <v-list-tile-action>
            <v-icon>weekend</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Jenis Kamar</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/reservation/personal" v-if="roleCheck == 6 || roleCheck == null" id="reservasi">
          <v-list-tile-action>
            <v-icon>playlist_add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Reservasi</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group  prepend-icon="bar_chart" v-if="roleCheck == 2 || roleCheck == 1">
          <v-list-tile slot="activator">
            <v-list-tile-title>Laporan</v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/report/monthlyIncome" v-if="roleCheck == 2 || roleCheck == 1">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Laporan Pendapatan Bulanan</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/report/numberOfGuests" v-if="roleCheck == 2 || roleCheck == 1">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Laporan Jumlah Pelanggan</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/report/newCustomer" v-if="roleCheck == 2 || roleCheck == 1">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Laporan Jumlah Pelanggan Baru</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/report/topFiveCust" v-if="roleCheck == 2 || roleCheck == 1">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Laporan 5 Pelanggan Reservasi Terbanyak</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/report/incomePerYear" v-if="roleCheck == 2 || roleCheck == 1">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Laporan Pendapatan Pertahun</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-group  prepend-icon="collections_bookmark" v-if="roleCheck == 2 || roleCheck == 1">
          <v-list-tile slot="activator">
            <v-list-tile-title>Pengelolaan Reservasi</v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/reservation/report/personal" v-if="roleCheck == 2 || roleCheck == 1 || roleCheck == 3">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Reservasi Personal</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/reservation/report/group" v-if="roleCheck == 2 || roleCheck == 1 || roleCheck == 4">
            <v-list-tile-action>
              <v-icon small></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="caption">Reservasi Grup</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="primary" dark="" fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Grand Atma Hotel</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat v-if="loginCheck === null" to="/login"> Masuk </v-btn>
        <v-btn flat v-if="loginCheck === null" to="/cust/register"> Daftar </v-btn>
        <v-btn flat v-if="loginCheck !== null" @click="logout"> Keluar </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null
    }),
    props: {
      source: String
    },
    computed: {
      loginCheck()  {
        return localStorage.getItem('user')
      },
      roleCheck() {
        return localStorage.getItem('role')
      }
    },
    methods: {
      logout()  {
        localStorage.clear()
        location.reload()
      }
    }
  }
</script>

