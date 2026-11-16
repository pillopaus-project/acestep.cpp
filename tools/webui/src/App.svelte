<script lang="ts">
	import { Volume2, AudioWaveform, RotateCcw } from '@lucide/svelte';
	import { app } from './lib/state.svelte.js';
	import { props } from './lib/api.js';
	import { getAllSongs } from './lib/db.js';
	import { PROPS_POLL_MS } from './lib/config.js';
	import RequestForm from './components/RequestForm.svelte';
	import SongList from './components/SongList.svelte';
	import Toast from './components/Toast.svelte';

	// boot: load songs from IndexedDB
	$effect(() => {
		getAllSongs()
			.then((songs) => (app.songs = songs.reverse()))
			.catch(() => {});
	});

	// poll /props every PROPS_POLL_MS, null on failure (grey badges)
	function pollProps() {
		props()
			.then((h) => (app.props = h))
			.catch(() => (app.props = null));
	}

	$effect(() => {
		pollProps();
		const id = setInterval(pollProps, PROPS_POLL_MS);
		return () => clearInterval(id);
	});

	function onVolume(e: Event) {
		app.volume = Number((e.target as HTMLInputElement).value);
	}

	// playback speed in percent: 100 = 1.0x, 94-106 in 0.5% steps
	function onSpeed(e: Event) {
		app.speed = Number((e.target as HTMLInputElement).value);
	}

	function resetSpeed() {
		app.speed = 100;
	}

	// sync dark/light class on <html> so CSS variables switch
	$effect(() => {
		document.documentElement.classList.toggle('dark', app.dark);
		document.documentElement.classList.toggle('light', !app.dark);
	});
</script>

<div class="ace-app">
	<header>
		<span class="header-label">acestep.cpp</span>
		<span class="header-version">{__ACE_VERSION__}</span>
		<div class="spacer"></div>
		<label class="dark-toggle">
			<input type="checkbox" bind:checked={app.dark} /> Dark
		</label>
		<div class="volume">
			<Volume2 size={14} />
			<input type="range" min="0" max="1" step="0.01" value={app.volume} oninput={onVolume} />
		</div>
		<div class="volume">
			<AudioWaveform size={14} />
			<input
				type="range"
				class="speed-range"
				min="94"
				max="106"
				step="0.5"
				value={app.speed}
				oninput={onSpeed}
			/>
			<span class="speed-label">{app.speed}%</span>
			<button
				type="button"
				class="icon-btn"
				onclick={resetSpeed}
				disabled={app.speed === 100}
				title="Reset playback speed to 100%"
			>
				<RotateCcw size={14} />
			</button>
		</div>
	</header>

	<main>
		<section class="panel form-panel">
			<RequestForm />
		</section>
		<section class="panel songs-panel">
			<SongList />
		</section>
	</main>
</div>

<Toast />

<style>
	:global(:root) {
		--bg: #1a1a1a;
		--bg-input: #2a2a2a;
		--bg-card: #242424;
		--bg-btn: #333;
		--bg-btn-hover: #444;
		--fg: #eee;
		--fg-dim: #999;
		--border: #3a3a3a;
		--focus: #2ed573;
		--error: #c0392b;
		--ok: #27ae60;
		--waveform-dim: #555;
		--waveform-play: #2ed573;
		--waveform-range: #ff6b6b;
		color-scheme: dark;
	}
	:global(:root.light) {
		--bg: #f5f5f5;
		--bg-input: #fff;
		--bg-card: #fff;
		--bg-btn: #e0e0e0;
		--bg-btn-hover: #d0d0d0;
		--fg: #000;
		--fg-dim: #666;
		--border: #ccc;
		--focus: #27ae60;
		--error: #c0392b;
		--ok: #27ae60;
		--waveform-dim: #ccc;
		--waveform-play: #27ae60;
		--waveform-range: #e74c3c;
		color-scheme: light;
	}
	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
	}
	:global(body) {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		background: var(--bg);
		color: var(--fg);
		min-height: 100dvh;
	}
	.ace-app {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}
	header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 1rem 1rem;
		border-bottom: none;
	}
	.header-label {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--fg);
	}
	.header-version {
		font-size: 0.7rem;
		color: var(--fg-dim);
		align-self: flex-end;
	}
	.spacer {
		flex: 1;
	}
	.dark-toggle {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.75rem;
		color: var(--fg-dim);
		cursor: pointer;
	}
	.dark-toggle {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.75rem;
		color: var(--fg);
		cursor: pointer;
	}
	.volume {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--fg);
	}
	.volume input[type='range'] {
		width: 80px;
		cursor: pointer;
	}
	.volume input.speed-range {
		width: 160px;
	}
	.speed-label {
		font-size: 0.75rem;
		font-family: monospace;
		color: var(--fg);
		min-width: 2.8rem;
	}
	.icon-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.15rem;
		color: var(--fg-dim);
		display: flex;
		align-items: center;
	}
	.icon-btn:hover:not(:disabled) {
		color: var(--focus);
	}
	.icon-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}
	main {
		flex: 1;
		display: flex;
		gap: 1rem;
		padding: 0 1rem 1rem;
		background: var(--bg);
		overflow: hidden;
	}
	.panel {
		background: var(--bg);
		overflow-y: auto;
	}
	.form-panel {
		width: 400px;
		flex-shrink: 0;
	}
	.songs-panel {
		flex: 1;
	}
	@media (max-width: 800px) {
		main {
			flex-direction: column;
		}
		.form-panel {
			width: 100%;
		}
	}
</style>
