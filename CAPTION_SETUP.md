# Caption Setup Guide

This guide explains how to set up real-time speech-to-text captioning in the Interview Support App.

## Prerequisites

### 1. Node.js and npm

Ensure Node.js (v18+) and npm are installed.

### 2. ffmpeg (Windows only)

On Windows, `ffmpeg` is used to capture system audio.

**Install via winget:**
```
winget install Gyan.FFmpeg
```

**Or download manually:**
1. Go to https://www.gyan.dev/ffmpeg/builds/
2. Download "ffmpeg-release-essentials.zip"
3. Extract and add the `bin` folder to your system PATH

**Verify:** Open a terminal and run `ffmpeg -version`

### 3. Virtual Audio Cable (Windows only)

To capture system audio output (what you hear), you need a virtual audio device:

**Option A: VB-Audio Virtual Cable (free)**
1. Download from https://vb-audio.com/Cable/
2. Install and restart your PC
3. In Windows Sound Settings, set the virtual cable as the default playback device
4. ffmpeg captures audio from this virtual device

**Option B: Stereo Mix (built-in, some PCs)**
1. Right-click the speaker icon in taskbar -> Sound Settings -> More sound settings
2. Go to Recording tab
3. Right-click -> Show Disabled Devices
4. Enable "Stereo Mix" if available

### 4. PulseAudio (Linux only)

Most Linux desktops already have PulseAudio or PipeWire-PulseAudio. Verify:
```bash
pactl info
```
The app automatically finds the monitor source of your default audio output.

---

## Whisper Model Setup

The app uses the `openai/whisper-base` model via `@xenova/transformers` for local speech recognition.

### Automatic Download (requires internet on first run)

When you first click "Start" (or open the Interviewer page), the model downloads automatically from HuggingFace (~150 MB). It is cached at:

| OS | Cache Location |
|---|---|
| Windows | `%USERPROFILE%\.cache\huggingface\hub\` |
| Linux | `~/.cache/huggingface/hub/` |
| macOS | `~/.cache/huggingface/hub/` |

### Manual / Offline Setup

If you need to use the model without internet access, download it beforehand:

**Step 1: Download the model files**

Using git (with Git LFS installed):
```bash
git lfs install
git clone https://huggingface.co/Xenova/whisper-base models/whisper-base
```

Or download these files manually from https://huggingface.co/Xenova/whisper-base/tree/main :
- `config.json`
- `tokenizer.json`
- `tokenizer_config.json`
- `preprocessor_config.json`
- `generation_config.json`
- `onnx/encoder_model.onnx`
- `onnx/decoder_model_merged.onnx`

**Step 2: Place in the app's data directory**

Copy the model folder to the app's user data directory:

| OS | Path |
|---|---|
| Windows | `%APPDATA%\interview-support-app\models\whisper-base\` |
| Linux | `~/.config/interview-support-app/models/whisper-base/` |

The folder should contain `config.json` and the other files at the top level.

**Step 3: Verify**

The app checks for a local model at startup. If `config.json` exists in the above path, it uses the local model instead of downloading.

---

## Using Different Whisper Models

You can use a larger model for better accuracy (at the cost of speed):

| Model | Size | Speed | Accuracy |
|---|---|---|---|
| `Xenova/whisper-tiny` | ~40 MB | Fastest | Basic |
| `Xenova/whisper-base` | ~150 MB | Fast | Good (default) |
| `Xenova/whisper-small` | ~500 MB | Medium | Better |
| `Xenova/whisper-medium` | ~1.5 GB | Slow | Best |

To use a different model, download it and place it in the `models/whisper-base` folder (same location). The app loads whatever model files are in that folder.

---

## Troubleshooting

### "No audio loopback source found"
- **Windows:** Install VB-Audio Virtual Cable and ensure ffmpeg is in PATH
- **Linux:** Run `pactl list short sources` and check for a `*.monitor` source

### "Whisper model failed to load"
- Check internet connection (first run needs to download the model)
- Or follow the manual setup above for offline use
- Ensure enough disk space (~150 MB for whisper-base)

### Caption text is empty or inaccurate
- Ensure the system audio is actually playing (check volume)
- Whisper-base works best with clear English speech
- Try whisper-small for better accuracy

### ffmpeg errors on Windows
- Ensure `ffmpeg` is in PATH: run `ffmpeg -version` in cmd
- If using VB-Audio Virtual Cable, ensure it is set as the default playback device

### High CPU usage
- Whisper runs locally on CPU. whisper-base uses moderate resources
- Close other heavy applications if needed
- Consider using whisper-tiny for lower CPU usage
