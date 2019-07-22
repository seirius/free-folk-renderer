<template>
  <div class="home">
    <Youtube/>
  </div>
</template>

<script>
// @ is an alias to /src
import Youtube from '@/components/youtube/Youtube.vue'

export default {
  name: 'youtube',
  components: {
    Youtube
  }
}
</script>
