<template>
  <div class="home">
    <TorrentComp/>
  </div>
</template>

<script>
// @ is an alias to /src
import TorrentComp from '@/components/TorrentComp.vue'

export default {
  name: 'torrent',
  components: {
    TorrentComp
  }
}
</script>
