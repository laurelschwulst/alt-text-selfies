import os

def process_md_files(directory):
    # Iterate over all files in the directory
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r') as file:
                lines = file.readlines()

            # Check each line for the 'audio: ' pattern
            for i, line in enumerate(lines):
                if line.startswith("audio:"):
                    # Extract the string after 'audio:'
                    audio_name = line.split(":", 1)[1].strip()
                    # Create the transcript line
                    transcript_line = f"transcript:" if audio_name == "" else f"transcript: /assets/selfie-transcripts/{os.path.splitext(filename)[0]}.json"
                    # Add the transcript line after the audio line
                    lines.insert(i + 1, f"{transcript_line}\n")
                    break  # Stop searching for 'audio: ' after first occurrence

            # Write the modified lines back to the file
            with open(filepath, 'w') as file:
                file.writelines(lines)

# Example usage:
directory_path = "selfies/"
process_md_files(directory_path)