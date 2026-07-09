# Admin panel

This project includes a simple built-in admin panel for editing the site's
text and hero image — no external accounts or database sign-ups required.

## How to use it

1. Run the site as usual (`npm install` then `npm run dev`)
2. Go to **http://localhost:3000/admin**
3. Log in with the password below
4. Edit any text field or upload a hero image, then click **Save changes**
5. Open **http://localhost:3000** in another tab to see your changes live

## Default password

The admin password is set in the `.env.local` file at the root of this
project:

```
ADMIN_PASSWORD=fixmyhome123
```

**Change this before showing the site to anyone else.** Open `.env.local`,
edit the value, and restart `npm run dev` for it to take effect.

## How it works (in plain terms)

- All the site's editable text lives in `src/content/site-content.json`
- The admin panel reads and writes to that file through a couple of small
  API routes in `src/app/api/`
- Uploaded images are saved into the `public/uploads` folder
- There's no real database and no user accounts beyond the single admin
  password — this is intentionally simple so it works with zero setup

## Media manager (Supabase image uploads)

There's a second admin page for uploading images to cloud storage:

```
http://localhost:3000/admin/media
```

It lets you drag and drop an image (PNG/JPG/WebP, up to 5MB), tag it as a
**Site Logo**, **Homepage Banner**, or **Category Thumbnail**, and uploads
it to a Supabase Storage bucket called `site-assets`, using a predictable
path like `logos/site-logo.png` or `banners/homepage-banner-1720000000000.png`.
Once uploaded, it shows a live thumbnail and the public URL you can copy
and paste anywhere on the site (e.g. into the hero image field on the main
content page).

### One-time Supabase setup

This part needs a free Supabase account, since image storage has to live
somewhere:

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your project, go to **Storage** → **Create a new bucket**
   - Name it exactly `site-assets`
   - Toggle it **Public** (so uploaded images can be viewed on your live site)
3. Go to **Settings → API** and copy:
   - **Project URL**
   - **anon public** key
4. Open `.env.local` in this project and paste them in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart `npm run dev`

Until you do this, the Media Manager page will show an "Supabase not
configured" notice instead of failing silently.

**Note on security:** the anon key is safe to expose in the browser — that's
what it's designed for. What actually controls who can upload is the
bucket's **Storage Policies** in Supabase (under Storage → Policies).
By default a new public bucket often allows uploads from anyone with the
anon key, which is fine while you're the only one using this — but if you
ever open this page up more broadly, add a policy that restricts uploads
(e.g. to signed-in users only).



## When you'd want to upgrade this

This setup is great for running the site on your own computer, or on a
single small server. If you ever want:
- Multiple people editing at once
- The site live on the internet with real visitors
- Stronger security than a single shared password

...that's the point where it's worth adding a proper database (e.g.
Postgres) and a more robust login system. Just let me know when you get
there and I can help you upgrade it.
