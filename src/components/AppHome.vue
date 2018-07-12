<template>
  <v-flex>
    <v-parallax src="/static/images/carousel/gah.jpg" height="300"></v-parallax>
    <!--<h1 class="text-md-center">Kamar</h1>-->
    <!--<v-flex>-->
      <!--<v-container grid-list-md>-->
        <!--<v-layout wrap>-->
          <!--<v-flex xs12 sm12 md3>-->
            <!--<v-card>-->
              <!--<v-card-media src="/static/images/carousel/gah-2.jpg" height="200px"></v-card-media>-->
              <!--<v-card-title>Test</v-card-title>-->
            <!--</v-card>-->
          <!--</v-flex>-->
          <!--<v-flex xs12 sm12 md3>-->
            <!--<v-card-media src="/static/images/carousel/gah-3.jpg" height="200px"></v-card-media>-->
            <!--<v-card>-->
              <!--<v-card-title>Test</v-card-title>-->
            <!--</v-card>-->
          <!--</v-flex>-->
          <!--<v-flex xs12 sm12 md3>-->
            <!--<v-card-media src="/static/images/carousel/gah-4.jpg" height="200px"></v-card-media>-->
            <!--<v-card>-->
              <!--<v-card-title>Test</v-card-title>-->
            <!--</v-card>-->
          <!--</v-flex>-->
          <!--<v-flex xs12 sm12 md3>-->
            <!--<v-card-media src="/static/images/carousel/gah-6.jpg" height="200px"></v-card-media>-->
            <!--<v-card>-->
              <!--<v-card-title>Test</v-card-title>-->
            <!--</v-card>-->
          <!--</v-flex>-->
        <!--</v-layout>-->
      <!--</v-container>-->
    <!--</v-flex>-->
    <v-flex md10 offset-md1 v-if="roleCheck == 6 || roleCheck == null">
      <v-btn large color="accent" block to="/reservation/personal">Reservasi Sekarang!</v-btn>
    </v-flex>
  </v-flex>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          {
            src: '/static/images/carousel/gah-2.jpg'
          },
          {
            src: '/static/images/carousel/gah-3.jpg'
          },
          {
            src: '/static/images/carousel/gah-4.jpg'
          },
          {
            src: '/static/images/carousel/gah-6.jpg'
          }
        ]
      }
    },
    computed: {
      roleCheck() {
        return localStorage.getItem('role')
      }
    }
  }
</script>
