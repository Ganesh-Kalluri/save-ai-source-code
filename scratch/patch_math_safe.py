import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

files_to_patch = [
    os.path.join(root_dir, "content-scripts", "content.js"),
    os.path.join(root_dir, "content-scripts", "math_patch.js"),
    os.path.join(root_dir, "src", "content-scripts", "math_patch.js")
]

# Let's write a python script that will cleanly rewrite the entire Math patch section in content.js and math_patch.js
# Let's define the clean, 100% safe math patch block.

safe_math_patch_block = """
// Inline math: returns a saveaiMathXmlNode
function saveaiInlineMathNode(latex) {
  return new saveaiMathXmlNode(saveaiLatexToOfficeMathXML(latex, false));
}

// === Patch the Px function to handle LaTeX math ===

function Px(t, e) {
  // Fast path: no $ signs means no math
  if (!t || t.indexOf('$') === -1) return _saveai_orig_Px(t, e);

  // Split on $$...$$ (display) and $...$ (inline) math delimiters
  const segments = [];
  let cur = '';
  let i = 0;
  while (i < t.length) {
    if (t[i] === '$' && t[i+1] === '$') {
      if (cur) { segments.push({ type: 'text', content: cur }); cur = ''; }
      i += 2;
      let mathContent = '';
      while (i < t.length && !(t[i] === '$' && t[i+1] === '$')) mathContent += t[i++];
      i += 2;
      if (mathContent.trim()) segments.push({ type: 'display', content: mathContent });
    } else if (t[i] === '$') {
      if (cur) { segments.push({ type: 'text', content: cur }); cur = ''; }
      i += 1;
      let mathContent = '';
      while (i < t.length && t[i] !== '$') mathContent += t[i++];
      i += 1;
      if (mathContent.trim()) segments.push({ type: 'inline', content: mathContent });
      else cur += '$' + mathContent + '$';
    } else {
      cur += t[i++];
    }
  }
  if (cur) segments.push({ type: 'text', content: cur });

  // Build result array
  const result = [];
  for (const seg of segments) {
    if (seg.type === 'text') {
      if (seg.content) {
        const textRuns = _saveai_orig_Px(seg.content, e);
        result.push(...textRuns);
      }
    } else {
      // Math segment
      try {
        if (seg.type === 'display') {
          // Display math: place on its own line by adding line breaks before and after
          result.push(new xr({ text: "\\n", break: 1 }));
          result.push(saveaiInlineMathNode(seg.content));
          result.push(new xr({ text: "\\n", break: 1 }));
        } else {
          result.push(saveaiInlineMathNode(seg.content));
        }
      } catch(err) {
        // Fallback: render as plain text
        const textRuns = _saveai_orig_Px('$' + seg.content + '$', e);
        result.push(...textRuns);
      }
    }
  }
  return result.length ? result : _saveai_orig_Px(t, e);
}

/* END SAVEAI LATEX MATH PATCH */
"""

# Let's also define the safe _saveai_orig_Px newline handler:
safe_A_def = """  function A(E){
    const parts = E.split('\\n');
    const runs = [];
    parts.forEach((part, idx) => {
      runs.push(new xr({
        text: part,
        bold: i,
        italics: o,
        strike: l,
        underline: u ? {type:"single"} : void 0,
        color: "000000",
        size: e?.paragraphSize||24,
        font: g,
        rightToLeft: e?.direction==="RTL"
      }));
      if (idx < parts.length - 1) {
        runs.push(new xr({
          text: "\\n",
          break: 1
        }));
      }
    });
    return runs;
  }"""

for file_path in files_to_patch:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        modified = False
        
        # Replace the Px math patch section
        # Locate from "// Inline math: returns a saveaiMathXmlNode" to "/* END SAVEAI LATEX MATH PATCH */"
        start_idx = content.find('// Inline math: returns a saveaiMathXmlNode')
        end_idx = content.find('/* END SAVEAI LATEX MATH PATCH */')
        if start_idx != -1 and end_idx != -1:
            end_idx += len('/* END SAVEAI LATEX MATH PATCH */')
            content = content[:start_idx] + safe_math_patch_block + content[end_idx:]
            modified = True
            
        # Also replace the A(E) definition inside _saveai_orig_Px
        # Locate starting from "function A(E){" up to its closing "return runs;\n  }"
        # We can search for the start of A(E) inside the patched version:
        start_A = content.find('  function A(E){\n    const parts = E.split')
        if start_A != -1:
            # Let's find the end of this definition
            end_A = content.find('return runs;\n  }', start_A)
            if end_A != -1:
                end_A += len('return runs;\n  }')
                content = content[:start_A] + safe_A_def + content[end_A:]
                modified = True
                
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Successfully applied 100% safe math spacing to {os.path.relpath(file_path, root_dir)}")
        else:
            print(f"Failed to find match regions in {os.path.relpath(file_path, root_dir)}")
