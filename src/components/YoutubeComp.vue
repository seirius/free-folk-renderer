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
								@click="getVideoDiskInfo(video.title)"
							>Action</button>
							<div class="dropdown-menu" :aria-labelledby="'btn' + video.title">
								<a class="dropdown-item" v-on:click="downloadVideo(video.title)">
									<span v-if="!video.diskInfo.mp4">Download mp4</span>
									<span v-if="video.diskInfo.mp4">mp4 downloaded</span>
								</a>
								<a class="dropdown-item" v-on:click="downloadMusic(video.title)">
									<span v-if="!video.diskInfo.mp3">Download mp3</span>
									<span v-if="video.diskInfo.mp3">mp3 downloaded</span>
								</a>
								<a class="dropdown-item" v-on:click="removeVideo(video.title)">Delete from list</a>
								<a
									class="dropdown-item"
									v-bind:class="{'d-none': !video.diskInfo.mp4 && !video.diskInfo.mp3}"
									v-on:click="removeAll(video.title)"
								>Delete from list and disk</a>
							</div>
						</div>
					</div>
				</div>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">
						<span
							v-if="!video.diskInfo.mp3 && !video.diskInfo.mp4"
							class="badge badge-secondary"
						>Not downloaded</span>
						<span v-if="video.diskInfo.mp3" class="badge badge-success">mp3</span>
						<span v-if="video.diskInfo.mp4" class="badge badge-success">mp4</span>
					</li>
				</ul>
			</div>
		</div>
		<Modal ref="modal"/>
	</div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import * as $ from "jquery";

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
					window.electron.google.getPlaylist(list).then(items => {
						items.forEach(item => {
							const video = this.getVideoByTitle(item.title);
							if (!video) {
								item.diskInfo = {};
								this.videoList.unshift(item);
								this.getVideoDiskInfo(item.title);
							}
						});
					});
				} else {
					google
						.getBasicInfo({ videoUrl: this.videoSearch })
						.then(response => {
							const video = this.getVideoByTitle(response.title);
							if (!video) {
								response.diskInfo = {};
								this.videoList.unshift(response);
								this.getVideoDiskInfo(response.title);
							}
						})
						.catch(console.error);
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
		removeAll: function(title) {
			google
				.removeVideosContent({
					savePath: this.path,
					videoTitles: [title],
					fileTypes: [".mp3", ".mp4"]
				})
				.then(response => this.removeVideo(title))
				.catch(error => console.error);
		},
		getVideoByTitle: function(title) {
			return this.videoList.find(video => video.title === title);
		},
		downloadVideo: function(title) {
			const video = this.getVideoByTitle(title);
			if (video && video.video_url && this.path && !video.diskInfo.mp4) {
				google
					.downloadVideo({
						savePath: this.path,
						videoTitle: video.title,
						videoUrl: video.video_url
					})
					.then(response => {
						this.getVideoDiskInfo(title);
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
			if (video && video.video_url && this.path && !video.diskInfo.mp3) {
				google
					.downloadMusic({
						savePath: this.path,
						videoTitle: video.title,
						videoUrl: video.video_url
					})
					.then(() => {
						this.getVideoDiskInfo(title);
						this.$refs.modal.openModal({
							title: "Success!",
							text: "MP3 download complete"
						});
					})
					.catch(console.error);
			}
		},
		savePath: function() {
			const paths = window.electron.dialog.showOpenDialog({
				properties: ["openDirectory"]
			});
			if (paths && paths.length === 1) {
				this.path = paths[0];
			}
		},
		getVideoDiskInfo: function(title) {
			const video = this.getVideoByTitle(title);
			if (!video) {
				console.error(`No video found for title: ${title}`);
				return;
			}
			google
				.getItemDiskInformation({
					title: title,
					filePath: this.path,
					fileTypes: [".mp3", ".mp4"]
				})
				.then(info => {
					if (info[".mp3"]) {
						video.diskInfo.mp3 = true;
					}
					if (info[".mp4"]) {
						video.diskInfo.mp4 = true;
					}
					this.$forceUpdate();
				})
				.catch(console.error);
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
