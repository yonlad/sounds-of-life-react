// audioUtils.js or at the top of your app
if (!window.GlobalAudioController) {
    window.GlobalAudioController = {
      activeAudio: null,
      activeTimestamp: null,
      activePopupId: null,
      
      playSound: function(audio, timestampId, popupId) {
        this.stopSound();
        this.activeAudio = audio;
        this.activeTimestamp = timestampId;
        this.activePopupId = popupId;
      },
      
      stopSound: function() {
        if (this.activeAudio) {
          this.activeAudio.pause();
          this.activeAudio.currentTime = 0;
          this.activeAudio = null;
        }
        this.activeTimestamp = null;
      }
    };
  }
export const audioBufferToWAV = (buffer) => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const length = buffer.length * numChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
  
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
  
    // Write WAV header
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);
  
    // Write audio data
    const offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset + (i * numChannels + channel) * 2, int16, true);
      }
    }
  
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };