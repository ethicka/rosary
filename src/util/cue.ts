import type { AudioCue } from "../state/settings.ts";

let audioCtx: AudioContext | null = null;

function playTone(): void {
  try {
    audioCtx ??= new AudioContext();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 660;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch {
    // Audio unavailable; silently skip the cue.
  }
}

export function playAdvanceCue(mode: AudioCue): void {
  if (mode === "sound") playTone();
  else if (mode === "vibrate" && "vibrate" in navigator) navigator.vibrate(30);
}
