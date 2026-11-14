# UNI MED — React + Supabase storefront

A responsive medical and dental equipment catalogue with a compact product grid, product detail pages and galleries (up to five photos), cart, WhatsApp order handoff, and a Supabase-authenticated admin area.

## 1. Requirements

- Node.js 20.19+ (or a current supported Node LTS)
- A Supabase project
- A WhatsApp Business or company number

## 2. Install and run

```bash
npm install
cp .env.example .env
```

Open `.env` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
VITE_WHATSAPP_NUMBER=961XXXXXXXXX
VITE_CURRENCY=USD
```

Use the Supabase **anon/publishable** key in the browser. Never put the `service_role` or secret key in a frontend `.env` file.

Then run:

```bash
npm run dev
```

Open the local URL printed by Vite.

If Supabase is not configured, the storefront opens with sample/demo products so you can preview the design. Admin functions require Supabase configuration.

## 3. Set up Supabase

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Paste and run `supabase/schema.sql`.
4. Open **Authentication → Users** and create the first admin user. Keep public sign-ups disabled in Authentication settings.
5. Copy that user's UUID.
6. In SQL Editor, run the final `INSERT INTO public.admin_users` statement from `schema.sql`, replacing the placeholder UUID with the real one.
7. Add the project URL and anon/publishable key to `.env`.
8. Restart `npm run dev`.

The admin sign-in page is at `/admin`. Only user IDs explicitly added to `public.admin_users` can manage products and categories. Creating an Auth user alone does not grant admin permissions.

## 4. Product management

From `/admin`, sign in with the admin account. You can:

- Create, edit, publish/hide and delete products.
- Set a price or leave it blank to display “Request a quote”.
- Assign a category and add a description.
- Add technical specifications as JSON, e.g. `{"Power":"LED","Warranty":"1 year"}`.
- Upload up to five JPG, PNG or WEBP images per product (max 5 MB each).
- Add and remove product categories.

The first uploaded image is the card's main image. Product detail pages let customers switch between all uploaded images.

## 5. WhatsApp checkout

Set `VITE_WHATSAPP_NUMBER` to the business number in international format, digits only, without `+`, spaces or dashes. Example: `96170123456`.

The cart builds a pre-filled message with product names, quantities and estimated total. The customer sends it to UNI MED in WhatsApp. This is an order enquiry/hand-off, not an online payment processor. The business should confirm availability, delivery and final price with the customer.

## 6. Important before launch

- Replace the demo images and sample content with UNI MED's actual product photos and verified descriptions.
- Confirm prices, currency, contact number, address, delivery terms and support details with the business owner.
- Add the real logo and brand assets if available.
- Test the admin login, RLS policies, image uploads, cart and WhatsApp checkout before publishing.
- Configure Supabase Auth allowed redirect URLs for the production domain.
- Add privacy, terms, returns and contact information appropriate to the business and local law.
- Do not enable public account registration for this admin-only dashboard.
- Use an appropriate commercial hosting plan for a live business website; Vercel Hobby is intended for personal, non-commercial use.

## 7. Deploy

Build locally with `npm run build`. Deploy the project to a hosting provider that permits commercial use, set the same `VITE_` environment variables in its dashboard, and add the production domain to Supabase Auth URL configuration.

## Notes

- Frontend: React + Vite
- Styling: responsive custom CSS
- Animation: Framer Motion
- Icons: Lucide React
- Backend: Supabase Database, Auth and Storage
- Storefront routes: `/`, `/products`, `/product/:id`, `/cart`
- Admin route: `/admin`
