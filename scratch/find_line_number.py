file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

target = 'i=>{const o=Fr(gt(gt({},i.origin),i.origin.context==="window"&&{context:"content-script"})),n=Ze.get(o),a={message:i,to:ws,from:{endpointId:o,fingerprint:n.fingerprint}};Dt(o).withFingerprint(n.fingerprint).aboutSuccessfulDelivery(a)}'

for idx, line in enumerate(lines):
    if target in line:
        print(f"Found exactly on line {idx+1}")
