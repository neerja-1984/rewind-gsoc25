import os
import wave

# Folder to check
folder = r"C:\\Users\\Neerja\\Documents\\phoneme_stereo"

def is_stereo(wav_path):
    """Return True if WAV file has 2 channels (stereo), False if mono."""
    with wave.open(wav_path, 'rb') as wf:
        return wf.getnchannels() == 2

# Loop through all WAV files
for filename in os.listdir(folder):
    if filename.lower().endswith(".wav"):
        path = os.path.join(folder, filename)
        try:
            if is_stereo(path):
                print(f"{filename} → Stereo")
            else:
                print(f"{filename} → Mono")
        except wave.Error as e:
            print(f"{filename} → Not a valid WAV file ({e})")
