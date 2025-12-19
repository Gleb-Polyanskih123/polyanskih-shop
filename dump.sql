--
-- PostgreSQL database dump
--

\restrict TBoLwbRuwazXHhTUTaiT7b8dYvmRfWb2Q1fplQJBDbAqhWNcVQR97e7yoYyoRFm

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

-- Started on 2025-12-17 16:31:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 24715)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_name character varying(100) NOT NULL,
    customer_phone character varying(50) NOT NULL,
    product_name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    product_size character varying(20)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24714)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 4808 (class 0 OID 0)
-- Dependencies: 218
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 217 (class 1259 OID 24707)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    price integer NOT NULL,
    old_price integer,
    image_url text,
    rating character varying(50),
    description text,
    spec_material character varying(100),
    spec_brand character varying(100),
    spec_season character varying(50),
    spec_article character varying(50),
    image_back_url text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24678)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24677)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4809 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4645 (class 2604 OID 24718)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4643 (class 2604 OID 24681)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4802 (class 0 OID 24715)
-- Dependencies: 219
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_name, customer_phone, product_name, created_at, product_size) FROM stdin;
1	Глеб	89516117698	Nike Tech Fleece	2025-12-17 15:47:40.968181	\N
2	Глеб	+79516117698	Nike Tech Fleece	2025-12-17 15:54:07.320713	XL
\.


--
-- TOC entry 4800 (class 0 OID 24707)
-- Dependencies: 217
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, price, old_price, image_url, rating, description, spec_material, spec_brand, spec_season, spec_article, image_back_url) FROM stdin;
jordan-t-shirt	Jordan T-Shirt	3990	4990	img/Jordan T-SHIRT.png	★★★★★ (37 отзывов)	Комфортная и стильная футболка от Jordan - идеальный выбор для повседневной носки.	100% хлопок	Jordan	Лето	JOR-2025-001	img/jordan-back.png
nike-acg	Nike ACG T-Shirt	5990	6990	img/Nike-ACG-tshirt.png	★★★★☆ (12 отзывов)	Футболка из коллекции All Conditions Gear. Плотный хлопок премиум-класса сохраняет форму.	100% органический хлопок	Nike ACG	Всесезонный	ACG-2025-WHT	img/nike acg back.png
nike-tech	Nike Tech Fleece	8990	10990	img/nike-tech-flecee.png	★★★★★ (54 отзыва)	Легендарный костюм Nike Tech Fleece. Инновационный легкий материал.	66% хлопок, 34% полиэстер	Nike	Осень / Весна	TECH-2025-GRY	img/nike tech fleece back.png
lacoste-hoodie	Lacoste Hoodie	10990	12990	img/lacoste-hoodie.png	★★★★★ (8 отзывов)	Классическое худи от французского бренда Lacoste. Мягкий флис с начесом.	83% хлопок, 17% полиэстер	Lacoste	Демисезон	LAC-2025-HOOD	img/lacoste back.png
\.


--
-- TOC entry 4799 (class 0 OID 24678)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, created_at) FROM stdin;
1	admin	12345	2025-12-08 03:50:20.294539
2	Gleb	1111	2025-12-08 04:15:34.788346
3	admin1	123123	2025-12-17 16:06:32.338841
\.


--
-- TOC entry 4810 (class 0 OID 0)
-- Dependencies: 218
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 2, true);


--
-- TOC entry 4811 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4654 (class 2606 OID 24721)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4652 (class 2606 OID 24713)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4648 (class 2606 OID 24684)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4650 (class 2606 OID 24686)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


-- Completed on 2025-12-17 16:31:59

--
-- PostgreSQL database dump complete
--

\unrestrict TBoLwbRuwazXHhTUTaiT7b8dYvmRfWb2Q1fplQJBDbAqhWNcVQR97e7yoYyoRFm

