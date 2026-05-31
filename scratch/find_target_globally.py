import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
target = 'i=>{const o=Fr(gt(gt({},i.origin),i.origin.context==="window"&&{context:"content-script"})),n=Ze.get(o),a={message:i,to:ws,from:{endpointId:o,fingerprint:n.fingerprint}};Dt(o).withFingerprint(n.fingerprint).aboutSuccessfulDelivery(a)}'

for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            if target in content:
                print(f"FOUND TARGET EXACTLY IN: {os.path.relpath(full_path, root_dir)}")
