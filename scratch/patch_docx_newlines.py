import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

files_to_patch = [
    os.path.join(root_dir, "content-scripts", "content.js"),
    os.path.join(root_dir, "content-scripts", "math_patch.js"),
    os.path.join(root_dir, "src", "content-scripts", "math_patch.js")
]

target_A_def = """  function A(E){return new xr({text:E,bold:i,italics:o,strike:l,underline:u?{type:"single"}:void 0,color:"000000",size:e?.paragraphSize||24,font:g,rightToLeft:e?.direction==="RTL"})}"""

replacement_A_def = """  function A(E){
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
          text: "",
          break: 1
        }));
      }
    });
    return runs;
  }"""

target_S_def = """function S(){r&&(n.push(A(r)),r="")}"""

replacement_S_def = """function S(){r&&(n.push(...A(r)),r="")}"""

target_final_push = """c&&(r="`"+r),r.trim()&&n.push(A(r)))"""

replacement_final_push = """c&&(r="`"+r),r.trim()&&n.push(...A(r)))"""

for file_path in files_to_patch:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        modified = False
        if target_A_def in content:
            content = content.replace(target_A_def, replacement_A_def)
            modified = True
            
        if target_S_def in content:
            content = content.replace(target_S_def, replacement_S_def)
            modified = True
            
        if target_final_push in content:
            content = content.replace(target_final_push, replacement_final_push)
            modified = True
            
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Successfully patched newline spacing in {os.path.relpath(file_path, root_dir)}")
        else:
            print(f"New line spacing patch already applied or targets not found in {os.path.relpath(file_path, root_dir)}")
