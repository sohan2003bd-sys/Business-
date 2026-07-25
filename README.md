# Khatabook — সেটআপ গাইড

## যা আছে এই ফোল্ডারে
- `index.html` — মূল অ্যাপ (Khatabook logo বসানো আছে, GitHub Pages-এ আপলোডের জন্য প্রস্তুত)
- `Code.gs` — Google Apps Script backend (আপনার Google Sheet-এর সাথে সংযোগ করে)
- `logo.svg` — লোগো, ভেক্টর ফরম্যাট (যেকোনো সাইজে বড়/ছোট করা যাবে, মান নষ্ট হবে না)
- `logo-512.png` — লোগো, ৫১২x৫১২ পিক্সেল PNG (অ্যাপ আইকন, Play Store লিস্টিং, প্রোফাইল ছবি ইত্যাদির জন্য)
- `README.md` — এই ফাইলটি

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
