# Khatabook — সেটআপ গাইড

## যা আছে এই ফোল্ডারে
- `index.html` — মূল অ্যাপ (Khatabook logo বসানো আছে, GitHub Pages-এ আপলোডের জন্য প্রস্তুত)
- `Code.gs` — Google Apps Script backend (আপনার Google Sheet-এর সাথে সংযোগ করে)
- `manifest.json` — এটা থাকলেই Android/Chrome-এ "Install app" (শুধু শর্টকাট না) অপশন আসবে
- `service-worker.js` — Install করার জন্য Chrome-এর প্রয়োজনীয় একটা ছোট ফাইল
- `logo.svg` — লোগো, ভেক্টর ফরম্যাট
- `logo-192.png`, `logo-512.png` — অ্যাপ আইকন (হোমস্ক্রিন/ইনস্টলের জন্য দরকার)
- `README.md` — এই ফাইলটি

⚠️ **গুরুত্বপূর্ণ:** GitHub-এ আপলোড করার সময় এই **সবগুলো ফাইল একসাথে** (শুধু index.html না) একই ফোল্ডারে/রুটে আপলোড করতে হবে — নাহলে manifest/icon খুঁজে না পেয়ে "Install" অপশন আসবে না, শুধু "Add shortcut" দেখাবে।

## Google Sheet সংযোগ (যদি নতুন করে সেটআপ করতে হয়)
1. আপনার Google Sheet ওপেন করুন → **Extensions → Apps Script**
2. `Code.gs`-এর কোড পেস্ট করুন → Save
3. **Deploy → New deployment → Web app**
   - Execute as: Me
   - Who has access: Anyone
4. যে URL পাবেন সেটা `index.html`-এ `sheetUrl` এর জায়গায় বসান (ইতিমধ্যে বসানো আছে যদি আগেরটা কাজ করে থাকে)

## GitHub Pages-এ পাবলিশ
1. GitHub-এ নতুন public রিপো বানান
2. এই ফোল্ডারের সবকিছু আপলোড করুন (Add file → Upload files)
3. `index.html` নামটাই ঠিক আছে কিনা নিশ্চিত করুন
4. Settings → Pages → Branch: main, folder: / (root) → Save
5. কিছুক্ষণ পর লিংক অ্যাক্টিভ হবে: `https://<username>.github.io/<repo-name>/`
