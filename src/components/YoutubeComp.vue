<template>
	<div class="hello">
		<form action>
			<div class="row">
				<div class="input-group mb-3 col-lg">
					<input
						type="text"
						v-model="path"
						class="form-control"
						placeholder="Save Path"
						aria-label="Save Path"
						aria-describedby="basic-addon1"
						readonly
					>
					<div class="input-group-append">
						<button v-on:click="savePath" class="btn btn-outline-secondary" type="button">Set path</button>
					</div>
				</div>
				<div class="input-group mb-3 col-lg">
					<input
						type="text"
						v-model="videoSearch"
						class="form-control"
						placeholder="Video URL"
						aria-label="Video URL"
						aria-describedby="basic-addon1"
					>
					<div class="input-group-append">
						<button v-on:click="searchVideo" class="btn btn-outline-secondary" type="button">Search</button>
					</div>
				</div>
			</div>
		</form>
		<div class="row">
			<div
				class="card video col-12 col-sm-6 col-md-4 col-lg-2"
				v-for="video in videoList"
				:key="video.title"
			>
				<img class="card-img-top" :src="video.thumbnail_url" alt="Card image cap">
				<div class="card-body">
					<p class="card-title cut-text">{{video.title}}</p>
					<p class="card-text cut-text">{{video.description}}</p>
					<div class="text-center">
						<div class="btn-group" role="group">
							<button
								type="button"
								class="btn btn-secondary dropdown-toggle"
								aria-haspopup="true"
								aria-expanded="false"
								:id="'btn' + video.title"
								data-toggle="dropdown"
							>Action</button>
							<div class="dropdown-menu" :aria-labelledby="'btn' + video.title">
								<a href="#" class="dropdown-item" v-on:click="downloadVideo(video.title)">Download mp4</a>
								<a href="#" class="dropdown-item" v-on:click="downloadMusic(video.title)">Download mp3</a>
								<a href="#" class="dropdown-item" v-on:click="removeVideo(video.title)">Delete from list</a>
								<a href="#" class="dropdown-item" v-on:click="removeAll(video.title)">Delete from list and disk</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Modal ref="modal"/>
	</div>
</template>

<script>
import Modal from "@/components/Modal.vue";

const google = window.electron.google;

export default {
	name: "Youtube",
	components: {
		Modal
	},
	props: {},
	data: function() {
		return {
			videoList: [],
			videoSearch: "https://www.youtube.com/watch?v=fCXW4DsjzH0",
			path: "/home/andriy/Downloads"
		};
	},
	mounted: function() {},
	methods: {
		searchVideo: function() {
			if (this.videoSearch) {
				const url = new URL(this.videoSearch);
				const list = url.searchParams.get("list");
				if (list) {
					window.electron.google
					.getPlaylist(list)
					.then(items => {
						items.forEach(item => {
							const video = this.getVideoByTitle(item.title);
							if (!video) {
								this.videoList.unshift(item);
							}
						});
					});
				} else {
					google.getBasicInfo({videoUrl: this.videoSearch})
					.then(response => {
						console.log(response);
						const video = this.getVideoByTitle(response.title);
						if (!video) {
							this.videoList.unshift(response);
						}
					}).catch(console.error);
				}
			}
		},
		removeVideo: function(title) {
			const index = this.videoList.findIndex(
				video => video.title === title
			);
			if (index > -1) {
				this.videoList.splice(index, 1);
			}
		},
		removeAll: function (title) {
			google.removeVideosContent({
				savePath: this.path,
				videoTitles: [title],
				fileTypes: [".mp3", ".mp4"]
			}).then(response => this.removeVideo(title))
			.catch(error => console.error);
		},
		getVideoByTitle: function(title) {
			return this.videoList.find(video => video.title === title);
		},
		downloadVideo: function(title) {
			const video = this.getVideoByTitle(title);
			if (video && video.video_url && this.path) {
				google.downloadVideo({
					savePath: this.path,
					videoTitle: video.title,
					videoUrl: video.video_url
				})
                .then(response => {
                    this.$refs.modal.openModal({
                        title: "Success!",
                        text: "Video download complete"
                    });
                })
                .catch(error => console.error(error));
			}
		},
		downloadMusic: function(title) {
			const video = this.getVideoByTitle(title);
			if (video && video.video_url && this.path) {
				google.downloadMusic({
					savePath: this.path,
					videoTitle: video.title,
					videoUrl: video.video_url
				}).then(() => {
					this.$refs.modal.openModal({
						title: "Success!",
						text: "MP3 download complete"
					});
				}).catch(console.error);
			}
		},
		savePath: function() {
			const paths = window.electron.dialog.showOpenDialog({
				properties: ["openDirectory"]
			});
			if (paths && paths.length === 1) {
				this.path = paths[0];
			}
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.video {
	position: relative;
}
.close {
	position: absolute;
	color: red;
	right: 20px;
	top: 20px;
	z-index: 1;
	cursor: pointer;
}
.cut-text {
	text-overflow: ellipsis;
	overflow: hidden;
	height: 1.2em;
	white-space: nowrap;
}
</style>
