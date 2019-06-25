<template>
	<div class="torrent">
		<form action>
			<div class="row">
				<div class="input-group col-xs-12">
					<input
						type="text"
						v-model="magnet"
						class="form-control"
						placeholder="Magnet URL"
						aria-label="Magnet URL"
						aria-describedby="basic-addon1"
					>
					<div class="input-group-append">
						<button v-on:click="addTorrent" class="btn btn-outline-secondary" type="button">Add torrent</button>
					</div>
				</div>
			</div>
			<div class="row">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th class="free-speed">Speed</th>
							<th class="free-progress">Progress</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="torrent in torrents" :key="torrent.infoHash">
							<td scope="row">{{torrent.name}}</td>
							<td>{{torrent.speed.toFixed(2)}}mb/s</td>
							<td>
								<div class="progress">
									<div
										class="progress-bar progress-bar-striped"
										role="progressbar"
										v-bind:class="{'progress-bar-animated': torrent.progress}"
										v-bind:style="{width: `${torrent.progress}%`}"
										aria-valuemin="0"
										aria-valuemax="100"
									></div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</form>
	</div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import * as uuid from "uuid/v1";

const { electron } = window;

export default {
	name: "Torrent",
	components: {
		Modal
	},
	props: {},
	data: function() {
		return {
			torrents: [],
			magnet: "magnet:?xt=urn:btih:1FBDCE143D18131C87F900E4CB2344023F3F70B7&dn=%5BHorribleSubs%5D+Bungou+Stray+Dogs+-+36+%5B720p%5D+mkv&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fbt.xxx-tracker.com%3A2710%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.si%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337%2Fannounce"
		};
	},
	mounted: function() {},
	methods: {
		addTorrent: function () {
			const torrent = {
				name: "Loading...",
				hash: uuid(),
				progress: 0,
				speed: 0
			};
			electron.torrent.addTorrent({
				magnetLink: this.magnet,
				added: args => {
					torrent.name = args.name;
					torrent.hash = args.hash;
				},
				download: args => {
					torrent.progress = args.progress;
					torrent.speed = args.speed;
				}
			});
			this.torrents.push(torrent);
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.free-progress {
	width: 120px;
}

.free-speed {
	width: 120px;
}
</style>
