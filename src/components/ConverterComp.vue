<template>
	<div class="converter">
		<form action>
			<div class="row">
				<div class="input-group mb-3 col-lg">
					<input
						type="file"
						class="form-control-file"
						placeholder="Input file"
						aria-label="Input file"
						aria-describedby="basic-addon1"
						readonly
					>
				</div>
				<div class="input-group mb-3 col-lg">
					<input
						type="file"
						class="form-control-file"
						placeholder="Video URL"
						aria-label="Video URL"
						aria-describedby="basic-addon1"
					>
				</div>
			</div>
		</form>
		<div class="row">
			<div class="col-12 col-sm-6 col-md-4 col-lg-2">
			</div>
		</div>
		<Modal ref="modal"/>
	</div>
</template>

<script>
import Modal from "@/components/Modal.vue";

export default {
	name: "Converter",
	components: {
		Modal
	},
	props: {},
	data: function() {
		return {
		};
	},
	mounted: function() {},
	methods: {
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
