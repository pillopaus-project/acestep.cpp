<script lang="ts">
	import { app } from '../lib/state.svelte.js';
	import SongCard from './SongCard.svelte';
	import LogCard from './LogCard.svelte';

	// Filter out songs marked as timbre palettes
	let visibleSongs = $derived(app.songs.filter((s) => !s.timbre_ref));
</script>

<div class="song-list">
	{#each visibleSongs as song (song.id)}
		<SongCard {song} />
	{/each}
	<LogCard />
</div>

<style>
	.song-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		overflow-y: auto;
	}
</style>
