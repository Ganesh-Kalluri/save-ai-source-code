import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

files_to_patch = [
    os.path.join(root_dir, "content-scripts", "content.js"),
    os.path.join(root_dir, "content-scripts", "math_patch.js"),
    os.path.join(root_dir, "src", "content-scripts", "math_patch.js")
]

# Let's write the 100% safe A(E) function definition that filters out empty text runs:
safe_A_def = """  function A(E){
    const parts = E.split('\\n');
    const runs = [];
    parts.forEach((part, idx) => {
      if (part !== "") {
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
      }
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
        # Locate starting from "function A(E){\n    const parts = E.split" up to its closing "return runs;\n  }"
        start_A = content.find('  function A(E){\n    const parts = E.split')
        if start_A != -1:
            end_A = content.find('return runs;\n  }', start_A)
            if end_A != -1:
                end_A += len('return runs;\n  }')
                content = content[:start_A] + safe_A_def + content[end_A:]
                modified = True
                
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Successfully applied safe empty-filtering newlines to {os.path.relpath(file_path, root_dir)}")
        else:
            print(f"Match region not found in {os.path.relpath(file_path, root_dir)}")
