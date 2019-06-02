<template>
	<div class="converter">
		<form action>
			<div class="row">
				<div class="input-group mb-3 col-xs">
					<input
						type="text"
						v-model="inputFile"
						class="form-control"
						placeholder="Input file"
						aria-label="Input file"
						aria-describedby="basic-addon1"
						readonly
					>
					<div class="input-group-append">
						<button v-on:click="getFile" class="btn btn-outline-secondary" type="button">Choose file</button>
					</div>
				</div>
				<div class="input-group mb-3 col-xs">
					<select
						name="formats"
						class="form-control"
						aria-label="Input file"
						aria-describedby="basic-addon1"
						v-model="chosenFormat"
						v-on:change="outputFilePathCheck"
					>
						<option value>Select format</option>
						<option
							v-for="format in formats"
							:key="format.type"
							:value="format.type"
						>{{format.description}} ({{format.type}})</option>
					</select>
				</div>
				<div class="input-group mb-3 col-xs">
					<input
						type="text"
						class="form-control"
						v-model="outputFile"
						placeholder="Output file"
						aria-label="Output file"
						aria-describedby="basic-addon1"
						readonly
					>
					<div class="input-group-append">
						<button
							v-on:click="getDir"
							class="btn btn-outline-secondary"
							type="button"
						>Choose output directory</button>
					</div>
				</div>
				<div type="button" class="btn btn-outline-primary btn-block" v-on:click="format">Format</div>
			</div>
			<div class="row">
				<div class="progress" v-if="formatProgress">
					<div
						class="progress-bar progress-bar-striped"
						role="progressbar"
						v-bind:class="{'progress-bar-animated': formatProgress}"
						v-bind:style="{width: `${formatProgress}%`}"
						aria-valuemin="0"
						aria-valuemax="100"
					></div>
				</div>
			</div>
		</form>
		<div class="row">
			<div class="col-12 col-sm-6 col-md-4 col-lg-2"></div>
		</div>
		<Modal ref="modal"/>
	</div>
</template>

<script>
import Modal from "@/components/Modal.vue";

const { electron } = window;

export default {
	name: "Converter",
	components: {
		Modal
	},
	props: {},
	data: function() {
		return {
			inputFile: "",
			outputFile: "",
			formats: [],
			chosenFormat: "",
			outputFileSet: false,
			formatProgress: 0
		};
	},
	mounted: function() {
		electron.google
			.getAvailableFormats()
			.then(formats => {
				if (formats) {
					this.formats = Object.keys(formats).map(key => {
						const format = formats[key];
						format.type = key;
						return format;
					});
				}
			})
			.catch(console.error);
	},
	methods: {
		getFile: function() {
			const paths = electron.dialog.showOpenDialog();
			if (paths && paths.length === 1) {
				this.inputFile = paths[0];
				this.outputFilePathCheck();
			}
		},
		getDir: function() {
			const paths = electron.dialog.showOpenDialog({
				properties: ["openDirectory"]
			});
			if (paths && paths.length === 1) {
				this.outputFile = paths[0];
				this.outputFileSet = true;
			}
		},
		outputFilePathCheck: function() {
			if (!this.outputFileSet && this.chosenFormat) {
				const extname = electron.path.extname(this.inputFile);
				if (extname) {
					this.outputFile = this.inputFile.replace(
						extname,
						`.${this.chosenFormat}`
					);
				}
			}
		},
		format: function() {
			electron.formats
				.to({
					inputFile: this.inputFile,
					outputFile: this.outputFile,
					format: this.format,
					progressCallback: args => {
						this.formatProgress = args.progress;
						this.$forceUpdate();
					}
				})
				.then(() => {
					this.$refs.modal.openModal({
						title: "Success!",
						text: `${this.outputFile} is formatted succesfully`
					});
					this.formatProgress = 0;
					this.$forceUpdate();
				})
				.catch(console.error);
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
	.progress {
		width: 100%;
	}
</style>
