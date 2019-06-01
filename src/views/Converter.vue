<template>
  <div class="converter">
    <ConverterComp/>
  </div>
</template>

<script>
// @ is an alias to /src
import ConverterComp from '@/components/ConverterComp.vue'

export default {
  name: 'converter',
  components: {
    ConverterComp
  }
}
</script>
