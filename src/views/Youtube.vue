<template>
  <div class="home">
    <YoutubeComp/>
  </div>
</template>

<script>
// @ is an alias to /src
import YoutubeComp from '@/components/YoutubeComp.vue'

export default {
  name: 'youtube',
  components: {
    YoutubeComp
  }
}
</script>
