// Display name helper: Song.name stores the user-provided base name.
// The "(variant task)" suffix is rebuilt dynamically from request fields
// for the card title in the UI and for download filenames.
import type { Song } from './types.js';

export function displaySongName(song: Song): string {
	// DiT variant is no longer part of the generated name. Kept commented out
	// so it can be restored as-is.
	// const m = String(song.request.synth_model || '').match(/^acestep-v15-(.+?)-(Q\d.*|BF16)\.gguf$/);
	// const variant = m ? m[1] : '';
	const task = song.request.task_type || '';
	const srcRef = (song.request as any).src_ref_name || '';
	const timbreRef = (song.request as any).timbre_ref_name || '';
	const suffix = [task, srcRef, timbreRef].filter((s) => s).join(' ');
	return suffix ? song.name + ' (' + suffix + ')' : song.name;
}
