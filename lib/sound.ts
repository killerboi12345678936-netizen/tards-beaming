'use client'

/*
  Subtle synthesized UI sounds via the WebAudio API — no audio assets,
  never autoplays. Gated by the global SOUND: ON/OFF setting.
*/

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

type Tone = {
  freq: number
  type?: OscillatorType
  duration?: number
  gain?: number
  sweepTo?: number
}

function play({ freq, type = 'sine', duration = 0.08, gain = 0.05, sweepTo }: Tone) {
  const ac = getCtx()
  if (!ac) return
  if (ac.state === 'suspended') void ac.resume()
  const osc = ac.createOscillator()
  const amp = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime)
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, ac.currentTime + duration)
  amp.gain.setValueAtTime(0.0001, ac.currentTime)
  amp.gain.exponentialRampToValueAtTime(gain, ac.currentTime + 0.01)
  amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration)
  osc.connect(amp).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + duration + 0.02)
}

export const sfx = {
  click: () => play({ freq: 620, type: 'square', duration: 0.04, gain: 0.03 }),
  hover: () => play({ freq: 880, type: 'sine', duration: 0.03, gain: 0.015 }),
  access: () => {
    play({ freq: 420, type: 'sawtooth', duration: 0.12, gain: 0.04, sweepTo: 960 })
  },
  deploy: () => {
    play({ freq: 300, type: 'triangle', duration: 0.1, gain: 0.05, sweepTo: 720 })
    setTimeout(() => play({ freq: 720, type: 'triangle', duration: 0.12, gain: 0.05 }), 90)
  },
  error: () => {
    play({ freq: 200, type: 'sawtooth', duration: 0.18, gain: 0.05, sweepTo: 90 })
  },
  boot: () => {
    play({ freq: 120, type: 'sawtooth', duration: 0.5, gain: 0.04, sweepTo: 480 })
  },
}

export type SfxName = keyof typeof sfx
