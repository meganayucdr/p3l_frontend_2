<template>
  <v-flex md8 offset-md4 class="mt-4">
    <v-card width="500px">
      <v-container fluid>
        <v-card-title class="title">Masuk</v-card-title>
        <v-layout row>
          <v-flex xs8 offset-xs2>
            <v-text-field
              name="email"
              label="Email"
              id="email"
              v-model="email"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs8 offset-xs2>
            <v-text-field
              name="password"
              label="Password"
              type=password
              v-model="password"
              id="password"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs8 offset-xs5>
            <v-btn color="success" @click.native="login" id="login">Masuk</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
</template>

<script>
  import axios from 'axios'
  import router from 'vue-router'
  export default {
    data: () => ({
      email: '',
      password: '',
      methods: {
      }
    }),
    methods: {
      login() {
        const URL = '/api/login'

        axios.post(URL, {
          email: this.email,
          password: this.password
        })
          .then(response => {
            localStorage.setItem('user',response.data.data.id)
            localStorage.setItem('role',response.data.data.role.id)
            location.reload()

          }).catch(err => {
          alert(JSON.stringify(response.data))
        })
      }
    }
  }
</script>
