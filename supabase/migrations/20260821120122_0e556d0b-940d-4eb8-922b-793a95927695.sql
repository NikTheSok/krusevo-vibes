
-- ============ helpers ============
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TYPE public.app_role AS ENUM ('admin','editor','user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor');
$$;

-- ============ festivals ============
CREATE TABLE public.festivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline_mk text, tagline_en text,
  description_mk text, description_en text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  countdown_target timestamptz,
  location_name text,
  hero_image_url text,
  hero_video_url text,
  stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description_mk text, description_en text,
  address text, latitude numeric, longitude numeric,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  genre text, country text,
  bio_mk text, bio_en text,
  image_url text,
  stage text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id uuid REFERENCES public.festivals(id) ON DELETE CASCADE,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  artist_id uuid REFERENCES public.artists(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  title_mk text NOT NULL, title_en text NOT NULL,
  description_mk text, description_en text,
  category text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id uuid REFERENCES public.festivals(id) ON DELETE CASCADE,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  title_mk text NOT NULL, title_en text NOT NULL,
  description_mk text, description_en text,
  category text,
  difficulty text,
  duration_minutes int,
  price_mkd numeric,
  capacity int,
  image_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title_mk text, title_en text,
  alt_mk text, alt_en text,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text NOT NULL DEFAULT 'partner',
  logo_url text,
  website_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id uuid REFERENCES public.festivals(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  name_mk text NOT NULL, name_en text NOT NULL,
  description_mk text, description_en text,
  price_mkd numeric NOT NULL,
  currency text NOT NULL DEFAULT 'MKD',
  perks_mk text[] NOT NULL DEFAULT '{}',
  perks_en text[] NOT NULL DEFAULT '{}',
  capacity int,
  is_featured boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_mk text NOT NULL, question_en text NOT NULL,
  answer_mk text NOT NULL, answer_en text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_mk text NOT NULL, title_en text NOT NULL,
  body_mk text, body_en text,
  meta_description_mk text, meta_description_en text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  locale text NOT NULL DEFAULT 'mk',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  locale text NOT NULL DEFAULT 'mk',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at triggers
CREATE TRIGGER t1 BEFORE UPDATE ON public.festivals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t2 BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t3 BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t4 BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t5 BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t6 BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t7 BEFORE UPDATE ON public.sponsors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t8 BEFORE UPDATE ON public.ticket_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t9 BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t10 BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- grants + RLS for public content tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['festivals','locations','artists','events','activities','gallery_items','sponsors','ticket_types','faqs','pages'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "public read published" ON public.%I FOR SELECT USING (is_published = true)', t);
    EXECUTE format('CREATE POLICY "admins manage" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
END $$;

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read public settings" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage subscribers" ON public.newsletter_subscribers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "admins manage messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============ seed ============
INSERT INTO public.festivals (id, slug, name, tagline_mk, tagline_en, description_mk, description_en, start_date, end_date, countdown_target, location_name, hero_image_url, stats) VALUES
('11111111-1111-4111-8111-111111111111','vidik-2027','VIDIK Festival',
 'Три дена музика, планина и култура над облаците','Three days of music, mountain and culture above the clouds',
 'VIDIK е фестивал на отворено во Крушево кој ја спојува современата музика со планинските авантури, локалната кујна и живата традиција на највисокиот град на Балканот.',
 'VIDIK is an open-air festival in Krusevo where contemporary music meets mountain adventure, local food and the living traditions of the highest town in the Balkans.',
 '2027-07-15','2027-07-17','2027-07-15T18:00:00+02:00','Крушево, Северна Македонија','/images/hero-krusevo.jpg',
 '[{"key":"days","value":"3"},{"key":"activities","value":"20+"},{"key":"artists","value":"10+"},{"key":"altitude","value":"1350m"}]'::jsonb);

INSERT INTO public.locations (id, slug, name, description_mk, description_en, address, latitude, longitude, image_url, sort_order) VALUES
('21111111-1111-4111-8111-111111111111','glavna-bina','Главна бина / Main Stage','Голема бина на ливадата под Гумење, со поглед кон Пелагонија.','A large stage on the meadow below Gumenje peak, overlooking the Pelagonia valley.','Гумење, Крушево',41.3690,21.2470,'/images/stage-night.jpg',1),
('21111111-1111-4111-8111-111111111112','stara-carsija','Стара чаршија / Old Bazaar','Камени куќи и тесни улици каде се одвиваат акустични концерти и работилници.','Stone houses and narrow streets hosting acoustic sets and craft workshops.','Стара чаршија, Крушево',41.3695,21.2490,'/images/town.jpg',2),
('21111111-1111-4111-8111-111111111113','bushava-livada','Бушава ливада / Meadow Camp','Кампот на фестивалот со изгрев над облаците и утринска јога.','The festival camp with sunrises above the clouds and morning yoga.','Крушево',41.3660,21.2400,'/images/mountain-trail.jpg',3);

INSERT INTO public.artists (id, slug, name, genre, country, bio_mk, bio_en, image_url, stage, is_featured, sort_order) VALUES
('31111111-1111-4111-8111-111111111111','lelja','LELJA','Electronic folk','Северна Македонија','Дуо кое ги преработува гласовите на македонското пеење во длабоки електронски пејзажи.','A duo reworking Macedonian vocal singing into deep electronic landscapes.','/images/artist-1.jpg','Главна бина',true,1),
('31111111-1111-4111-8111-111111111112','oro-machine','Oro Machine','Live techno','Србија','Модуларен live-act инспириран од ритмите на балканското оро.','A modular live act built on the odd rhythms of Balkan oro dances.','/images/artist-2.jpg','Главна бина',true,2),
('31111111-1111-4111-8111-111111111113','marta-vrbska','Марта Врбска','Alt-pop','Северна Македонија','Автор на песни за планините, миграцијата и враќањето дома.','A songwriter whose work circles mountains, migration and coming home.','/images/artist-3.jpg','Стара чаршија',true,3),
('31111111-1111-4111-8111-111111111114','kaval-collective','Kaval Collective','Acoustic / traditional','Северна Македонија','Седум свирачи на кавал, гајда и тапан од Пелагонија и Мариово.','Seven players of kaval, gajda and tapan from Pelagonia and Mariovo.','/images/artist-4.jpg','Стара чаршија',true,4),
('31111111-1111-4111-8111-111111111115','nova Vardar','Nova Vardar','Indie rock','Северна Македонија','Гитарски квартет од Скопје со песни на македонски и англиски.','A Skopje guitar quartet writing in both Macedonian and English.','/images/artist-5.jpg','Главна бина',false,5),
('31111111-1111-4111-8111-111111111116','ilinden-sound-system','Ilinden Sound System','Dub / bass','Северна Македонија','Ноќен саунд систем што ја затвора секоја фестивалска вечер.','The night sound system that closes every festival evening.','/images/artist-6.jpg','Главна бина',false,6);

INSERT INTO public.events (festival_id, location_id, artist_id, slug, title_mk, title_en, description_mk, description_en, category, starts_at, ends_at, image_url, is_featured) VALUES
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111112','31111111-1111-4111-8111-111111111114','otvaranje-kaval','Отворање: Kaval Collective','Opening: Kaval Collective','Фестивалот започнува со акустичен сет во чаршијата на зајдисонце.','The festival opens with an acoustic set in the bazaar at sunset.','music','2027-07-15T18:30:00+02:00','2027-07-15T19:45:00+02:00','/images/folk-culture.jpg',true),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111111','31111111-1111-4111-8111-111111111111','lelja-live','LELJA во живо','LELJA live','Премиерно изведување на новиот албум на главната бина.','A premiere performance of the new album on the main stage.','music','2027-07-15T21:30:00+02:00','2027-07-15T23:00:00+02:00','/images/stage-night.jpg',true),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111113',NULL,'izgrev-joga','Изгрев и јога над облаците','Sunrise yoga above the clouds','Утринска сесија на ливадата, отворена за сите посетители со билет.','A morning session on the meadow, open to all ticket holders.','wellness','2027-07-16T05:40:00+02:00','2027-07-16T07:00:00+02:00','/images/mountain-trail.jpg',false),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111112',NULL,'kujna-pelagonija','Вкусови од Пелагонија','Flavours of Pelagonia','Дегустација на локални сирења, ајвар и слатки од Крушево.','A tasting of local cheeses, ajvar and Krusevo sweets.','food','2027-07-16T13:00:00+02:00','2027-07-16T15:00:00+02:00','/images/food-local.jpg',true),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111111','31111111-1111-4111-8111-111111111112','oro-machine-live','Oro Machine live','Oro Machine live','Модуларен техно сет под отворено небо.','A modular techno set under open sky.','music','2027-07-16T22:00:00+02:00','2027-07-16T23:30:00+02:00','/images/crowd.jpg',false),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111112','31111111-1111-4111-8111-111111111113','marta-vrbska-akustik','Марта Врбска: акустично','Marta Vrbska: acoustic','Интимен концерт во дворот на стара крушевска куќа.','An intimate concert in the yard of an old Krusevo house.','music','2027-07-17T19:00:00+02:00','2027-07-17T20:15:00+02:00','/images/town.jpg',false),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111111','31111111-1111-4111-8111-111111111116','zatvaranje','Затворање: Ilinden Sound System','Closing: Ilinden Sound System','Последната ноќ на фестивалот трае до изгрев.','The final festival night runs until sunrise.','music','2027-07-17T23:00:00+02:00','2027-07-18T02:00:00+02:00','/images/stage-night.jpg',true);

INSERT INTO public.activities (festival_id, location_id, slug, title_mk, title_en, description_mk, description_en, category, difficulty, duration_minutes, price_mkd, capacity, image_url, is_featured) VALUES
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111113','pesacenje-gumenje','Пешачење до Гумење','Hike to Gumenje peak','Водено пешачење до врвот со поглед кон Пелагонија и Баба планина.','A guided hike to the peak with views over Pelagonia and Baba mountain.','outdoor','moderate',240,600,25,'/images/mountain-trail.jpg',true),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111113','paraglajding','Параглајдинг над Крушево','Paragliding over Krusevo','Тандем лет од едно од најпознатите полетувалишта на Балканот.','A tandem flight from one of the best-known take-off sites in the Balkans.','outdoor','advanced',90,4500,12,'/images/paragliding.jpg',true),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111112','rabotilnica-kilim','Работилница за ткаење','Weaving workshop','Учете традиционални шари со ткајачи од регионот.','Learn traditional patterns with weavers from the region.','culture','easy',120,900,15,'/images/folk-culture.jpg',true),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111112','lokum-tura','Тура на крушевски лебленца и локум','Krusevo sweets walking tour','Прошетка низ чаршијата со дегустација кај локални мајстори.','A bazaar walk with tastings at local family workshops.','food','easy',90,750,20,'/images/food-local.jpg',false),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111113','nokjno-nebo','Набљудување на ѕвезди','Stargazing night','Астрономска сесија на 1350 метри со телескопи.','An astronomy session at 1350 metres with telescopes.','outdoor','easy',120,500,30,'/images/stars.jpg',false),
('11111111-1111-4111-8111-111111111111','21111111-1111-4111-8111-111111111113','planinski-velosipedizam','Планински велосипедизам','Mountain biking loop','Кружна трасa низ буковите шуми над градот.','A loop route through the beech forests above town.','outdoor','moderate',180,1200,16,'/images/biking.jpg',false);

INSERT INTO public.gallery_items (image_url, title_mk, title_en, alt_mk, alt_en, category, sort_order) VALUES
('/images/crowd.jpg','Ноќ на главната бина','Main stage night','Публика пред осветлена бина ноќе','Crowd in front of a lit stage at night','music',1),
('/images/mountain-trail.jpg','Патека кон врвот','Trail to the peak','Пешаци на планинска патека','Hikers on a mountain trail','outdoor',2),
('/images/town.jpg','Стара чаршија','Old bazaar','Камени куќи во Крушево','Stone houses in Krusevo','town',3),
('/images/folk-culture.jpg','Традиција во живо','Living tradition','Свирачи на традиционални инструменти','Musicians playing traditional instruments','culture',4),
('/images/food-local.jpg','Вкусови од регионот','Local flavours','Локални јадења на дрвена маса','Local dishes on a wooden table','food',5),
('/images/paragliding.jpg','Лет над облаците','Flight above the clouds','Параглајдер над планина','A paraglider above the mountain','outdoor',6);

INSERT INTO public.sponsors (name, tier, website_url, sort_order) VALUES
('Pelagonia Energy','main',NULL,1),
('Balkan Rail','main',NULL,2),
('Krusevo Tourism Board','institutional',NULL,3),
('Vodno Outdoor','partner',NULL,4),
('Radio Sever','media',NULL,5),
('Planina Coffee','partner',NULL,6);

INSERT INTO public.ticket_types (festival_id, slug, name_mk, name_en, description_mk, description_en, price_mkd, perks_mk, perks_en, capacity, is_featured, sort_order) VALUES
('11111111-1111-4111-8111-111111111111','daily','Дневен билет','Day Pass','Пристап до сите концерти и настани во еден фестивалски ден.','Access to all concerts and events for one festival day.',1500,
 ARRAY['Пристап за еден ден','Сите бини','Фестивалска нараквица'],ARRAY['One day access','All stages','Festival wristband'],1200,false,1),
('11111111-1111-4111-8111-111111111111','three-day','Тридневен билет','3-Day Pass','Целосно фестивалско искуство од петок до недела.','The full festival experience from Friday to Sunday.',3500,
 ARRAY['Пристап за три дена','Сите бини','Попуст на активности','Фестивалска нараквица'],ARRAY['Three day access','All stages','Discount on activities','Festival wristband'],900,true,2),
('11111111-1111-4111-8111-111111111111','camping','Тридневен + камп','3-Day + Camping','Билет со место во фестивалскиот камп на ливадата.','Festival pass with a pitch in the meadow camp.',4900,
 ARRAY['Пристап за три дена','Место за шатор','Тушеви и вода','Утринска јога'],ARRAY['Three day access','Tent pitch','Showers and water','Morning yoga'],400,false,3);

INSERT INTO public.faqs (question_mk, question_en, answer_mk, answer_en, category, sort_order) VALUES
('Каде точно се одржува фестивалот?','Where exactly does the festival take place?','Настаните се одвиваат на ливадите под врвот Гумење и во старата чаршија во Крушево.','Events take place on the meadows below Gumenje peak and in the old bazaar of Krusevo.','general',1),
('Како да стигнам до Крушево?','How do I get to Krusevo?','Крушево е на околу два часа возење од Скопје и еден час од Битола. За време на фестивалот работи шатл од Прилеп.','Krusevo is about a two hour drive from Skopje and one hour from Bitola. A shuttle from Prilep runs during the festival.','travel',2),
('Дали има камп?','Is there a campsite?','Да, кампот е дел од билетот „Тридневен + камп“ и има тушеви, вода и ноќно обезбедување.','Yes, the camp is included in the 3-Day + Camping ticket and has showers, water and night security.','tickets',3),
('Дали фестивалот е пристапен за лица со инвалидност?','Is the festival accessible?','Главната бина и чаршијата имаат пристапни патеки и одвоени места за гледање.','The main stage and bazaar have accessible paths and dedicated viewing areas.','accessibility',4),
('Дали децата плаќаат билет?','Do children need a ticket?','Децата до 12 години влегуваат бесплатно во придружба на возрасен.','Children under 12 enter free when accompanied by an adult.','tickets',5),
('Што ако врне?','What happens if it rains?','Фестивалот се одржува и по дожд. Дел од програмата се преместува во покриените простори во чаршијата.','The festival runs rain or shine. Part of the programme moves to covered venues in the bazaar.','general',6);

INSERT INTO public.pages (slug, title_mk, title_en, meta_description_mk, meta_description_en, body_mk, body_en) VALUES
('privacy','Политика за приватност','Privacy Policy','Како VIDIK ги собира и чува вашите податоци.','How VIDIK collects and stores your data.',
'VIDIK Фестивал ги обработува само оние податоци кои се неопходни за продажба на билети, резервации на активности и информирање преку билтен. Податоците не се продаваат на трети страни. Можете да побарате бришење на вашите податоци во секое време на privacy@vidikfestival.mk.',
'VIDIK Festival processes only the data required for ticketing, activity reservations and newsletter communication. Data is never sold to third parties. You may request deletion of your data at any time at privacy@vidikfestival.mk.'),
('cookies','Политика за колачиња','Cookie Policy','Кои колачиња ги користи сајтот на VIDIK.','Which cookies the VIDIK site uses.',
'Овој сајт користи неопходни колачиња за да го запамети избраниот јазик и состојбата на кошничката. Аналитичките колачиња се вклучуваат само по ваша согласност.',
'This site uses necessary cookies to remember your selected language and cart state. Analytics cookies are only enabled with your consent.'),
('terms','Услови за користење','Terms & Conditions','Услови за билети, резервации и однесување на фестивалот.','Terms for tickets, reservations and festival conduct.',
'Билетите се лични и важат за наведениот датум. Организаторот го задржува правото да ја измени програмата поради временски услови или безбедносни причини. Со влез на фестивалот прифаќате да ги почитувате правилата на локацијата и упатствата на организаторите.',
'Tickets are personal and valid for the stated date. The organiser may adjust the programme due to weather or safety conditions. By entering the festival you agree to follow venue rules and organiser instructions.');

INSERT INTO public.site_settings (key, value) VALUES
('social','{"instagram":"","facebook":"","youtube":"","tiktok":""}'::jsonb),
('contact','{"email":"hello@vidikfestival.mk","press":"press@vidikfestival.mk","phone":"+389 00 000 000","address":"Крушево, Северна Македонија"}'::jsonb);
