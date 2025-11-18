# 🔍 How to Find the Auto-Generate Plot Button

## 📍 Location

The **Auto-Generate Plot** button is located:

```
Script Generator Page
  ↓
Plot Details Section
  ↓
Top-Right Corner (next to "Plot Details *" label)
  ↓
Purple Button with Lightning Icon ⚡
```

---

## 🎯 Step-by-Step Instructions

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 2. Open in Browser
- Go to: http://localhost:3000
- Click "Login with Discord (Demo)"

### 3. Scroll Down
- You'll see the Script Generator form
- Look for the "Plot Details *" section

### 4. Find the Button
The button is **on the same line** as the "Plot Details *" label, on the **right side**.

---

## ⚠️ Important: Button States

### 🔴 DISABLED (Gray Button)
The button will be **GRAY and DISABLED** if:
- ❌ You haven't entered a **Title**
- ❌ You haven't selected a **Niche**

**What you'll see:**
- Gray background
- Text: "Auto-Generate Plot"
- Cannot click it
- Message below: "💡 Enter a title and select a niche to use auto-generate"

### 🟣 ENABLED (Purple Button)
The button will be **PURPLE and CLICKABLE** when:
- ✅ You have entered a **Title**
- ✅ You have selected a **Niche** (after selecting Category)

**What you'll see:**
- Purple background
- Lightning icon ⚡
- Text: "Auto-Generate Plot"
- Can click it!

---

## 📝 How to Enable the Button

### Step 1: Enter Title
```
Field: "Script Title *"
Example: "The Mystery of the Bermuda Triangle"
```

### Step 2: Select Category
```
Options:
❤️ Emotional
👻 Horror
🔍 Mystery
🗺️ Adventure
📚 Educational
```

### Step 3: Select Niche
After selecting category, choose a specific niche:
```
Example for Mystery:
- True Crime
- Conspiracy Theories
- Unexplained Phenomena ← Select this
- Cold Cases
```

### Step 4: Button Turns Purple!
Now the "Auto-Generate Plot" button will be **PURPLE** and ready to click!

---

## 🎬 Using the Button

### When You Click It:

1. **Button Changes:**
   - Shows spinner animation
   - Text changes to "Generating..."
   - Button becomes disabled

2. **AI Works:**
   - DeepSeek R1 analyzes your title and niche
   - Creates detailed plot outline (200-400 words)
   - Takes 5-15 seconds

3. **Plot Appears:**
   - Automatically fills the "Plot Details" textarea
   - You can edit it if you want
   - Or use it as-is!

---

## 🖼️ Visual Layout

```
┌─────────────────────────────────────────────────┐
│  Script Generator                               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Script Title *                                 │
│  [Enter your title here_______________]         │
│                                                 │
│  Select Category *                              │
│  [❤️] [👻] [🔍] [🗺️] [📚]                      │
│                                                 │
│  Select Niche *                                 │
│  [Niche options appear here]                    │
│                                                 │
│  Script Example * (min 500 characters)          │
│  [Paste example here_______________]            │
│                                                 │
│  Plot Details *          [⚡ Auto-Generate Plot] │ ← HERE!
│  ┌─────────────────────────────────────────┐   │
│  │ Describe your plot...                   │   │
│  │                                         │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│  💡 Enter a title and select a niche to use    │
│     auto-generate                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### "I still don't see the button!"

1. **Make sure app is running:**
   ```bash
   # Check backend is running
   curl http://localhost:5000/health

   # Check frontend is running
   # Should open in browser automatically
   ```

2. **Clear browser cache:**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

3. **Check console for errors:**
   - Press `F12` to open developer tools
   - Look for red errors in Console tab

4. **Verify you're logged in:**
   - You should see your username in top-right
   - If not, click "Login with Discord (Demo)"

### "The button is there but it's gray!"

✅ **This is normal!** The button is disabled until you:
1. Enter a title in "Script Title" field
2. Select a category (Emotional, Horror, Mystery, etc.)
3. Select a specific niche

Once you do these 3 steps, the button will turn **PURPLE** and become clickable!

### "I clicked it but nothing happens!"

1. **Check the button changes:**
   - Should show "Generating..." with spinner
   - Should be disabled while generating

2. **Check browser console:**
   - Press F12
   - Look for errors in Console tab

3. **Wait 5-15 seconds:**
   - AI takes time to generate
   - Watch for plot to appear in textarea

4. **Check API key:**
   - Make sure you added Gemini API key in settings
   - Check backend console for errors

---

## ✅ Quick Checklist

Before clicking Auto-Generate Plot:

- [ ] Backend is running (http://localhost:5000)
- [ ] Frontend is running (http://localhost:3000)
- [ ] Logged in (see username in top-right)
- [ ] Entered a title
- [ ] Selected a category
- [ ] Selected a niche
- [ ] Button is PURPLE (not gray)

If all checked, you're ready to click! 🎉

---

## 💡 Pro Tip

The auto-generate feature uses your:
- **Title** - To understand what the video is about
- **Niche** - To match the content style
- **Style Type** - To use appropriate tone

So the better your title, the better the plot!

**Good titles:**
- "The Mystery of the Bermuda Triangle"
- "How I Survived 30 Days in the Amazon"
- "The Dark Truth About Ancient Egypt"

**Poor titles:**
- "My video"
- "Test"
- "Untitled"

---

## 📞 Still Having Issues?

1. **Restart both servers:**
   ```bash
   # Kill all processes
   # Restart backend: npm run dev
   # Restart frontend: npm start
   ```

2. **Check the code is up to date:**
   ```bash
   git status
   git pull origin claude/build-facelessscriptpro-015iuTBYzJ6dA46E2AiYmz7D
   ```

3. **Reinstall dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

---

**The button IS there! Follow the steps above to find and enable it.** ✨
