import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

files_to_patch = [
    os.path.join(root_dir, "content-scripts", "content.js"),
    os.path.join(root_dir, "content-scripts", "math_patch.js"),
    os.path.join(root_dir, "src", "content-scripts", "math_patch.js")
]

target_node_def = """// Inline math: returns a saveaiMathXmlNode
function saveaiInlineMathNode(latex) {
  return new saveaiMathXmlNode(saveaiLatexToOfficeMathXML(latex, false));
}"""

replacement_node_def = """// Inline math: returns a saveaiMathXmlNode
function saveaiInlineMathNode(latex) {
  return new saveaiMathXmlNode(saveaiLatexToOfficeMathXML(latex, false));
}

// Display math: returns a saveaiMathXmlNode
function saveaiDisplayMathNode(latex) {
  return new saveaiMathXmlNode(saveaiLatexToOfficeMathXML(latex, true));
}"""

target_px_loop = """      // Math segment
      try {
        result.push(saveaiInlineMathNode(seg.content));
      } catch(err) {"""

replacement_px_loop = """      // Math segment
      try {
        if (seg.type === 'display') {
          result.push(saveaiDisplayMathNode(seg.content));
        } else {
          result.push(saveaiInlineMathNode(seg.content));
        }
      } catch(err) {"""

for file_path in files_to_patch:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        modified = False
        if target_node_def in content:
            content = content.replace(target_node_def, replacement_node_def)
            modified = True
            
        if target_px_loop in content:
            content = content.replace(target_px_loop, replacement_px_loop)
            modified = True
            
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Successfully patched math spacing in {os.path.relpath(file_path, root_dir)}")
        else:
            print(f"Math patch already applied or targets not found in {os.path.relpath(file_path, root_dir)}")
