import os
import shutil

# Your custom IPA order
ipa_order = [
    'a_colon', 'aɪ', 'aʊ', 'b', 'd', 'dʒ', 'e', 'eə', 'eɪ',
    'f', 'g', 'h', 'i', 'i_colon', 'j', 'k', 'l', 'm', 'n',
    'p', 'r', 's', 't', 'u_colon', 'v', 'w', 'z', 'æ', 'ð',
    'ŋ', 'ɒ', 'ɔ_colon', 'ɔɪ', 'ə', 'əʊ', 'ɜ_colon', 'ɪə',
    'ʃ', 'ʈʃ', 'ʊ', 'ʊə', 'ʌ', 'ʒ', 'θ'
]

# Paths
src_folder = r"C:\\Users\\Neerja\\Documents\\phoneme_dataset"
dst_folder = r"C:\\Users\\Neerja\\Documents\\phoneme_dataset_sorted"

# Make destination folder
os.makedirs(dst_folder, exist_ok=True)

# Process files in custom order
for index, phoneme in enumerate(ipa_order):
    filename = phoneme + ".wav"
    src_path = os.path.join(src_folder, filename)
    if os.path.exists(src_path):
        new_filename = f"{index+1:03d}_{filename}"
        dst_path = os.path.join(dst_folder, new_filename)
        shutil.copy2(src_path, dst_path)
        print(f"Copied {filename} → {new_filename}")
    else:
        print(f"WARNING: {filename} not found in source folder!")

print("Done. Sorted files are in:", dst_folder)
