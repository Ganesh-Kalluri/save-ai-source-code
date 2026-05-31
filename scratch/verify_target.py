file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\background.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = 'i=>{const o=Fr(gt(gt({},i.origin),i.origin.context==="window"&&{context:"content-script"})),n=Ze.get(o),a={message:i,to:ws,from:{endpointId:o,fingerprint:n.fingerprint}};Dt(o).withFingerprint(n.fingerprint).aboutSuccessfulDelivery(a)}'

if target in content:
    print("Found target exactly!")
else:
    print("Target NOT found exactly. Printing part of content to find matching sequence:")
    idx = content.find('aboutSuccessfulDelivery')
    while idx != -1:
        print(content[idx-100:idx+200])
        print("---")
        idx = content.find('aboutSuccessfulDelivery', idx+1)
