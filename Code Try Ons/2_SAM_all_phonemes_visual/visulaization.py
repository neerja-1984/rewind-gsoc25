import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# Define phoneme groups and corresponding flags
phoneme_data = {
    "Vowels": {
        "phonemes": ["IY", "IH", "EH", "AE", "AA", "AH", "AO", "OH", "UH", "UX", "ER", "AX", "IX"],
        "color": "#A2D5AB"
    },
    "Diphthongs": {
        "phonemes": ["EY", "AY", "OY", "AW", "OW", "UW"],
        "color": "#F7C59F"
    },
    "Voiced Consonants": {
        "phonemes": ["R", "L", "W", "WH", "Y", "M", "N", "NX", "B", "D", "G", "J", "Z", "ZH", "V", "DH"],
        "color": "#FFA69E"
    },
    "Unvoiced Consonants": {
        "phonemes": ["S", "SH", "F", "TH", "P", "T", "K", "CH", "/H"],
        "color": "#9EC1CF"
    },
    "Special": {
        "phonemes": ["UL", "UM", "UN", "Q"],
        "color": "#D3C0F9"
    }
}

# Flatten the data for plotting
all_phonemes = []
all_colors = []
for group in phoneme_data.values():
    all_phonemes.extend(group["phonemes"])
    all_colors.extend([group["color"]] * len(group["phonemes"]))

# Plot the color-coded phoneme chart
fig, ax = plt.subplots(figsize=(12, 6))
bars = ax.bar(all_phonemes, [1]*len(all_phonemes), color=all_colors)

# Customizing the plot
ax.set_title("Color-Coded SAM Phoneme Chart", fontsize=16, fontweight='bold')
ax.set_xticks(range(len(all_phonemes)))
ax.set_xticklabels(all_phonemes, rotation=45, ha='right', fontsize=10)
ax.set_yticks([])
ax.set_ylabel("")

# Create legend
legend_patches = [mpatches.Patch(color=group["color"], label=group_name) 
                  for group_name, group in phoneme_data.items()]
ax.legend(handles=legend_patches, title="Phoneme Group")

plt.tight_layout()
plt.show()
