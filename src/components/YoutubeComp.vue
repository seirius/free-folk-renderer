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
				<div class="input-group mb-3 col-lg">
					<div class="input-group-prepend">
						<button
							v-on:click="downloadAllItems"
							class="btn btn-outline-secondary"
							type="button"
						>Download all as</button>
					</div>
					<select name="downloadAll" v-model="downloadAll" class="form-control">
						<option value="mp3">mp3</option>
						<option value="mp4">mp4</option>
					</select>
				</div>
			</div>
		</form>
		<div class="row">
			<div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="video in videoList" :key="video.title">
				<div class="card video">
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
									<button type="button" class="dropdown-item" v-on:click="downloadVideo(video.title)">
										<span v-if="!video.diskInfo.mp4">Download mp4</span>
										<span v-if="video.diskInfo.mp4">mp4 downloaded</span>
									</button>
									<button type="button" class="dropdown-item" v-on:click="downloadMusic(video.title)">
										<span v-if="!video.diskInfo.mp3">Download mp3</span>
										<span v-if="video.diskInfo.mp3">mp3 downloaded</span>
									</button>
									<button
										type="button"
										class="dropdown-item"
										v-on:click="removeVideo(video.title)"
									>Delete from list</button>
									<button
										type="button"
										class="dropdown-item"
										v-on:click="removeFromDisk(video.title)"
									>Delete from disk</button>
									<button
										type="button"
										class="dropdown-item"
										v-bind:class="{'d-none': !video.diskInfo.mp4 && !video.diskInfo.mp3}"
										v-on:click="removeAll(video.title)"
									>Delete from list and disk</button>
								</div>
							</div>
						</div>
					</div>
					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-if="video.dwnProgress.downloading">
							<div class="progress">
								<div
									class="progress-bar progress-bar-striped"
									role="progressbar"
									v-bind:class="{'progress-bar-animated': video.dwnProgress.downloading}"
									v-bind:style="{width: `${video.dwnProgress.progress}%`}"
									aria-valuemin="0"
									aria-valuemax="100"
								></div>
							</div>
						</li>
						<li class="list-group-item disk-info">
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
		</div>
		<Modal ref="modal"/>
	</div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import * as $ from "jquery";

const electron = window.electron;
const {google, init, config} = electron;

export default {
	name: "Youtube",
	components: {
		Modal
	},
	props: {},
	data: function() {
		return {
			videoList: [],
			videoSearch: "",
			path: "",
			downloadAll: "mp3"
		};
	},
	mounted: function() {
		config.getUserConfig()
		.then(userConfig => {
			this.path = userConfig.setPath;
            this.videoSearch = userConfig.videoUrl;
            this.videoList = userConfig.videoList;
            if (this.videoList) {
                this.videoList.forEach(video => this.getVideoDiskInfo(video.title));
            }
		}).catch(console.error);
	},
	methods: {
		searchVideo: function() {
			if (this.videoSearch) {
                config.getUserConfig().then(userConfig => {
                    userConfig.videoUrl = this.videoSearch;
                    config.saveCurrentUserConfig();
                });
				const url = new URL(this.videoSearch);
				const list = url.searchParams.get("list");
				if (list) {
					google.getPlaylist(list).then(items => {
						items.forEach(item => {
							const video = this.getVideoByTitle(item.title);
							if (!video) {
								item.diskInfo = {};
								item.dwnProgress = {
									progress: 0,
									downloading: false
								};
								this.videoList.unshift(item);
								this.getVideoDiskInfo(item.title);
							}
                        });
                        config.getUserConfig().then(userConfig => {
                            userConfig.videoList = this.videoList;
                            config.saveCurrentUserConfig();
                        });
					});
				} else {
					google
						.getVideoInfo({ videoUrl: this.videoSearch })
						.then(response => {
							const video = this.getVideoByTitle(response.title);
							if (!video) {
								response.diskInfo = {};
								response.dwnProgress = {
									progress: 0,
									downloading: false
								};
								this.videoList.unshift(response);
                                this.getVideoDiskInfo(response.title);
                                config.getUserConfig().then(userConfig => {
                                    userConfig.videoList = this.videoList;
                                    config.saveCurrentUserConfig();
                                });
							}
						})
						.catch(console.error);
				}
			}
		},
		downloadAllItems: async function() {
			if (this.videoList) {
				if (this.downloadAll === "mp4") {
					await Promise.all(
						this.videoList.map(video => {
							if (!video.diskInfo.mp4) {
								return this.downloadVideo(video.title, true);
							}
						})
					);
					this.$refs.modal.openModal({
						title: "Success!",
						text: "All videos download complete"
					});
				} else {
					for (let video of this.videoList) {
						if (!video.diskInfo.mp3) {
							await this.downloadMusic(video.title, true);
						}
					}
					this.$refs.modal.openModal({
						title: "Success!",
						text: "All music download complete"
					});
				}
			}
		},
		removeVideo: function(title) {
			const index = this.videoList.findIndex(
				video => video.title === title
			);
			if (index > -1) {
                this.videoList.splice(index, 1);
                config.getUserConfig().then(userConfig => {
                    userConfig.videoList = this.videoList;
                    config.saveCurrentUserConfig();
                });
			}
		},
		removeFromDisk: function(title) {
			google
				.removeVideosContent({
					savePath: this.path,
					videoTitles: [title],
					fileTypes: [".mp3", ".mp4"]
				})
				.then(response => {
					this.getVideoDiskInfo(title);
					alert("Done!");
				})
				.catch(error => console.error);
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
		downloadVideo: function(title, noFeedback) {
			return new Promise((resolve, reject) => {
				const video = this.getVideoByTitle(title);
				if (
					video &&
					video.video_url &&
					this.path &&
					!video.diskInfo.mp4
				) {
					video.dwnProgress.downloading = true;
					video.dwnProgress.progress = 0;
					google
						.downloadVideo({
							savePath: this.path,
							videoTitle: video.title,
							videoUrl: video.video_url,
							downloadProgressCallback: callbackArgs => {
								const {
									contentLength,
									progress
								} = callbackArgs;
								video.dwnProgress.progress = progress;
								this.$forceUpdate();
							}
						})
						.then(response => {
							video.dwnProgress.progress = 0;
							video.dwnProgress.downloading = false;
							this.getVideoDiskInfo(title);
							if (!noFeedback) {
								this.$refs.modal.openModal({
									title: "Success!",
									text: `Video (${title}) download complete`
								});
							}
							resolve();
						})
						.catch(error => {
							console.error(error);
							reject(error);
						});
				}
			});
		},
		downloadMusic: function(title, noFeedback) {
			return new Promise((resolve, reject) => {
				const video = this.getVideoByTitle(title);
				if (
					video &&
					video.video_url &&
					this.path &&
					!video.diskInfo.mp3
				) {
					video.dwnProgress.downloading = true;
					video.dwnProgress.progress = 0;
					google
						.downloadMusic({
							savePath: this.path,
							videoTitle: video.title,
							videoUrl: video.video_url,
							downloadProgressCallback: callbackArgs => {
								const {
									contentLength,
									progress
								} = callbackArgs;
								video.dwnProgress.progress = progress;
								this.$forceUpdate();
							}
						})
						.then(() => {
							video.dwnProgress.progress = 0;
							video.dwnProgress.downloading = false;
							this.getVideoDiskInfo(title);
							if (!noFeedback) {
								this.$refs.modal.openModal({
									title: "Success!",
									text: `MP3 (${title}) download complete`
								});
							}
							resolve();
						})
						.catch(error => {
							console.error(error);
							reject(error);
						});
				}
			});
		},
		savePath: function() {
			const paths = window.electron.dialog.showOpenDialog({
				properties: ["openDirectory"]
			});
			if (paths && paths.length === 1) {
                this.path = paths[0];
                config.getUserConfig().then(userConfig => {
                    userConfig.setPath = this.path;
                    config.saveCurrentUserConfig();
                });
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
					video.diskInfo.mp3 = !!info[".mp3"];
					video.diskInfo.mp4 = !!info[".mp4"];
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
.disk-info > .badge {
	margin-right: 5px;
}
</style>
