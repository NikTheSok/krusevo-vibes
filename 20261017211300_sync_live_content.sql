-- Missing live content changes verified on 2026-10-17.
-- Intended destination: supabase/migrations/20261017211300_sync_live_content.sql
-- Run AFTER all existing migrations. This file contains only plain UPDATEs.
-- Events/pages have randomly generated IDs in the original seed; slug fallbacks
-- make these updates work on fresh databases while preserving the real live IDs.
-- Activities and FAQs are unchanged from the seed and need no updates.
-- Existing artist migration already covers Macedonian bios, genres and stages.
-- Live image URLs are preserved exactly. Self-hosting must serve /__l5e/ assets
-- separately; this SQL file does not copy image files or change their URLs.
-- The old festival slug and privacy email below are still present in live data.

UPDATE public.festivals SET
  name = 'WhenInKrusevo',
  description_mk = 'WhenInKrusevo е фестивал на отворено во Крушево кој ја спојува современата музика со планинските авантури, локалната кујна и живата традиција на највисокиот град на Балканот.',
  description_en = 'WhenInKrusevo is an open-air festival in Krusevo where contemporary music meets mountain adventure, local food and the living traditions of the highest town in the Balkans.'
WHERE id = '11111111-1111-4111-8111-111111111111';

UPDATE public.site_settings SET
  value = '{"email":"hello@wheninkrusevo.mk","press":"press@wheninkrusevo.mk","phone":"+389 00 000 000","address":"Крушево, Северна Македонија"}'::jsonb
WHERE key = 'contact';

UPDATE public.pages SET
  body_mk = 'WhenInKrusevo Фестивал ги обработува само оние податоци кои се неопходни за продажба на билети, резервации на активности и информирање преку билтен. Податоците не се продаваат на трети страни. Можете да побарате бришење на вашите податоци во секое време на privacy@vidikfestival.mk.',
  body_en = 'WhenInKrusevo Festival processes only the data required for ticketing, activity reservations and newsletter communication. Data is never sold to third parties. You may request deletion of your data at any time at privacy@vidikfestival.mk.',
  meta_description_mk = 'Како WhenInKrusevo ги собира и чува вашите податоци.',
  meta_description_en = 'How WhenInKrusevo collects and stores your data.'
WHERE id = '7fe859c7-f457-4cda-93c1-8952110c482a' OR slug = 'privacy';

UPDATE public.pages SET
  meta_description_mk = 'Кои колачиња ги користи сајтот на WhenInKrusevo.',
  meta_description_en = 'Which cookies the WhenInKrusevo site uses.'
WHERE id = '518f8af1-455b-45a5-8513-c3b989ef1c64' OR slug = 'cookies';

UPDATE public.artists SET
  bio_en = 'More than 10 years on the Macedonian music scene.',
  image_url = '/images/slatkaristika.jpg'
WHERE id = '31111111-1111-4111-8111-111111111111';

UPDATE public.artists SET
  bio_en = 'The band with the finest timeless hits. Music everyone loves and that never gets old.',
  image_url = '/images/nokaut.jpg'
WHERE id = '31111111-1111-4111-8111-111111111112';

UPDATE public.artists SET
  bio_en = 'Top-class musicians, made for those who want to dive deeper into music.',
  image_url = '/images/foltin.jpg'
WHERE id = '31111111-1111-4111-8111-111111111113';

UPDATE public.artists SET
  name = 'Funk Shui',
  bio_en = 'An unexpected blend of sounds and genres... You will be amazed.',
  image_url = '/images/funk_shui.jpg'
WHERE id = '31111111-1111-4111-8111-111111111114';

UPDATE public.artists SET
  bio_en = 'The band slowly but surely conquering the scene lately. Now in our town too.',
  image_url = '/images/duper.webp'
WHERE id = '31111111-1111-4111-8111-111111111115';

UPDATE public.artists SET
  bio_en = 'Matej will close the event with his unique energy and leave you wanting more.',
  image_url = '/images/matej_foltz.jpg'
WHERE id = '31111111-1111-4111-8111-111111111116';

-- All programme titles/descriptions, including the two unchanged entries.
UPDATE public.events SET
  title_mk = 'Отворање: Funk Shui',
  title_en = 'Opening: Funk Shui',
  description_mk = 'Funk Shui го отвора фестивалот со неочекувана комбинација на фанк, рок и современи звуци.',
  description_en = 'Funk Shui opens the festival with an unexpected blend of funk, rock and contemporary sounds.',
  image_url = '/__l5e/assets-v1/34ea74e2-deb7-4454-a15a-9a81e8f15d4d/funk_shui.jpg'
WHERE id = '2406bd52-133b-4646-85cb-f41623b36ee5' OR slug = 'otvaranje-kaval';

UPDATE public.events SET
  title_mk = 'SLATKARISTIKA во живо',
  title_en = 'SLATKARISTIKA live',
  description_mk = 'SLATKARISTIKA носи хип-хоп енергија на главната бина — повеќе од 10 години на македонската музичка сцена.',
  description_en = 'SLATKARISTIKA brings hip-hop energy to the main stage, drawing on more than 10 years on the Macedonian music scene.',
  image_url = '/__l5e/assets-v1/7bb4f046-e89b-4dca-ad11-bc03b539eeea/slatkaristika.jpg'
WHERE id = 'c656f2af-932f-429e-aa9a-a4123b431010' OR slug = 'lelja-live';

UPDATE public.events SET
  title_mk = 'Изгрев и јога над облаците',
  title_en = 'Sunrise yoga above the clouds',
  description_mk = 'Утринска сесија на ливадата, отворена за сите посетители со билет.',
  description_en = 'A morning session on the meadow, open to all ticket holders.'
WHERE id = 'e5d536a2-e87b-4ee0-a4fa-6ce2f7479c9a' OR slug = 'izgrev-joga';

UPDATE public.events SET
  title_mk = 'Вкусови од Пелагонија',
  title_en = 'Flavours of Pelagonia',
  description_mk = 'Дегустација на локални сирења, ајвар и слатки од Крушево.',
  description_en = 'A tasting of local cheeses, ajvar and Krusevo sweets.'
WHERE id = '187ff3db-9c37-45f8-bb26-e75fc55f2f2e' OR slug = 'kujna-pelagonija';

UPDATE public.events SET
  title_mk = 'Nokaut во живо',
  title_en = 'Nokaut live',
  description_mk = 'Nokaut под отворено небо со безвременски хитови — музика што ја сакаат сите и која никогаш не застарува.',
  description_en = 'Nokaut performs under the open sky with timeless hits — music everyone loves and that never gets old.',
  image_url = '/__l5e/assets-v1/79b6e809-c315-45dc-b26f-46b47a1d31b6/nokaut.jpg'
WHERE id = 'c4179e6d-9717-417e-8b74-462ce3b132ad' OR slug = 'oro-machine-live';

UPDATE public.events SET
  title_mk = 'Фолтин Бенд во живо',
  title_en = 'Foltin Band live',
  description_mk = 'Фолтин Бенд спојува прогресивни и традиционални звуци во концерт за оние кои сакаат да навлезат подлабоко во музиката.',
  description_en = 'Foltin Band blends progressive and traditional sounds in a concert for those who want to dive deeper into music.',
  image_url = '/__l5e/assets-v1/88b80f20-8756-4927-a07d-8f62a731c219/foltin.jpg'
WHERE id = 'f99cd799-b7f6-4f1c-80b0-1d032fd03409' OR slug = 'marta-vrbska-akustik';

UPDATE public.events SET
  title_mk = 'Затворање: Matej Foltz',
  title_en = 'Closing: Matej Foltz',
  description_mk = 'Matej Foltz го затвора фестивалот со хип-хоп и поп звуци, уникатна енергија и настап што ќе ве остави да барате уште.',
  description_en = 'Matej Foltz closes the festival with hip-hop and pop sounds, unique energy and a performance that leaves you wanting more.',
  image_url = '/__l5e/assets-v1/cc5508f9-b4fc-4184-b0ae-ee756aec3f9a/matej_foltz.jpg'
WHERE id = 'fc77a7af-47e4-4339-bd0c-3ad0de36170e' OR slug = 'zatvaranje';