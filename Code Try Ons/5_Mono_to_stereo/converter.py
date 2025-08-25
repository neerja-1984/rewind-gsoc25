import os
import subprocess

# Source and destination folders
src_folder = r"C:\\Users\\Neerja\\Documents\\phoneme"
dst_folder = r"C:\\Users\\Neerja\\Documents\\phoneme_stereo"

# Create destination folder if it doesn't exist
os.makedirs(dst_folder, exist_ok=True)

# Loop through all .wav files in source folder
for filename in os.listdir(src_folder):
    if filename.lower().endswith(".wav"):
        src_path = os.path.join(src_folder, filename)
        dst_path = os.path.join(dst_folder, filename)  # keep same filename

        # FFmpeg command to convert to stereo (-ac 2), preserving sample rate
        cmd = [
            r"C:\\Program Files\\ffmeg\\ffmpeg.exe",
            "-y",              # overwrite without asking
            "-i", src_path,    # input file
            "-ac", "2",        # force 2 channels (stereo)
            dst_path           # output file
        ]

        print(f"Converting: {src_path} -> {dst_path}")
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

print("✅ Conversion complete!")
