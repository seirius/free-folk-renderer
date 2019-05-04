<template>
	<div
		class="modal fade"
		tabindex="-1"
		role="dialog"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true"
        ref="modal"
	>
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{title}}</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">{{text}}</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-outline-primary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import * as $ from "jquery";

export default {
	name: "Modal",
	props: {
        inpText: "",
        inpTitle: ""
    },
	data: function() {
		return {
            text: this.inpText,
            title: this.inpTitle
        };
	},
	methods: {
        openModal: function (args) {
            this.text = args.text;
            this.title = args.title;
            $(this.$refs.modal).modal("show");
        }
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
