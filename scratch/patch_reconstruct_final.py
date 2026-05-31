import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

files_to_patch = [
    os.path.join(root_dir, "content-scripts", "content.js"),
    os.path.join(root_dir, "content-scripts", "math_patch.js"),
    os.path.join(root_dir, "src", "content-scripts", "math_patch.js")
]

target_A_original = 'function A(E){return new xr({text:E,bold:i,italics:o,strike:l,underline:u?{type:"single"}:void 0,color:"000000",size:e?.paragraphSize||24,font:g,rightToLeft:e?.direction==="RTL"})}'

safe_A_array_def = """function A(E){
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
        if target_A_original in content:
            content = content.replace(target_A_original, safe_A_array_def)
            modified = True
            
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Successfully patched and reconstructed inner A(E) function in {os.path.relpath(file_path, root_dir)}")
        else:
            print(f"Target A(E) original not found in {os.path.relpath(file_path, root_dir)}")
