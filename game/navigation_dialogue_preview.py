import json
from pathlib import Path

base = Path(__file__).parent
nav = json.loads((base / "navigation.json").read_text())
dialogue = json.loads((base / "dialogue.json").read_text())

print("Star character:", dialogue["characters"]["randy_jason"]["display_name"])
print("Start node:", nav["start_node"])
print("Intro lines:")
for line in dialogue["scenes"]["intro"]:
    speaker = dialogue["characters"][line["speaker"]]["display_name"]
    print(f"- {speaker}: {line['line']}")
