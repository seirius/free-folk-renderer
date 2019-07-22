<template>
  <div class="home">
    <VideoView :name="name" type="type"/>
  </div>
</template>

<script>
import VideoView from '@/components/video-player/VideoView.vue'

export default {
  name: 'video-view',
  components: {
    VideoView
  },
  props: {
      name: String,
      type: String
  }
}
</script>
