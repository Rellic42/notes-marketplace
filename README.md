# NoteSwap – Digital Notes Marketplace (Next.js)

Run locally: `npm install` then `npm run dev` 

Data is saved in `data/db.json` and uploaded files in `storage/` (created automatically).
Deleting both resets the app to the 6 sample notes.

## Deploy on Render (free)
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Note: the free plan wipes saved data when the service sleeps or redeploys.
  To keep data permanently, add a Render Disk (mount path `/var/data`) and set env var `DATA_DIR=/var/data`.
