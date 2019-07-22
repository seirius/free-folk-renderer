<template>
    <v-snackbar
      v-model="feedback"
      :color="color"
      :timeout="timeout"
    >
      {{ text }}
      <v-btn
        dark
        flat
        @click="close"
      >
        Close
      </v-btn>
    </v-snackbar>
</template>

<style lang="sass" scoped>

</style>

<script>
export default {
    name: "Feedback",
    props: {},
    data: function() {
        return {
            title: null,
            text: null,
            color: "info",
            timeout: 4000,
            feedback: false
        };
    },
    methods: {
        open: function(args) {
            const { title, text, color, timeout } = args;
            this.title = title;
            this.text = text;
            this.color = color;
            this.timeout = timeout;
            this.feedback = true;
        },
        close: function () {
            this.title = null;
            this.text = null;
            this.color = "info";
            this.timeout = 4000;
            this.feedback = false;
        }
    }
};
</script>

