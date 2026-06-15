'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  condition: string;
  stock: number;
}

const philippineCities: Record<string, string[]> = {
  'Abra': ['Bangued', 'Bacarra', 'Bacnot', 'Baldoc', 'Batac', 'Beleme', 'Burgos', 'Buang', 'Burgos', 'Cabangaran', 'Cadanglan', 'Calao', 'Daguioman', 'Danglas', 'Dauis', 'Dipac', 'Dolores', 'La Paz', 'Lacub', 'Lagangagang', 'Lagayan', 'Langiden', 'Licuan-Baay', 'Luba', 'Malibcong', 'Manabo', 'Peñarrubia', 'Pidigan', 'Pilar', 'Pugo', 'Rosario', 'San Isidro', 'San Juan', 'San Quintin', 'Tayum', 'Tineg', 'Tubod', 'Tubug', 'Urbiztondo'],
  'Agusan del Norte': ['Cabadbaran', 'Butuan', 'Las Nieves', 'Magallanes', 'Nasipit', 'Remedios T. Romualdez', 'Santiago', 'Loreto', 'Prosperidad', 'Santana', 'Tubod', 'Bunog', 'Carmen', 'Jabonga', 'Kitcharao', 'Guinsiliban'],
  'Agusan del Sur': ['Bayugan', 'Prosperidad', 'San Francisco', 'San Luis', 'Santa Jose', 'Trento', 'Veruela', 'Cantonigui', 'Cuzco', 'Jabongue', 'Mabini', 'Pantukan', 'Malaybalay', 'Bunog', 'Molave', 'Sibagat', 'Talacogon', 'Trento', 'Veruela'],
  'Aklan': ['Kalibo', 'Madalag', 'Makato', 'Malay', 'Malinao', 'Nabas', 'Naasibu', 'Renato Reyes Redoblado', 'San Joaquin', 'San Remigio', 'Sebaste', 'Virac'],
  'Albay': ['Legazpi', 'Ligao', 'Tabaco', 'Bacacay', 'Camalig', 'Daraga', 'Guinobatan', 'Jovellar', 'Libon', 'Malilipot', 'Malinao', 'Manito', 'Oas', 'Pio Duran', 'Polangui', 'Rapu-Rapu', 'Santo Domingo', 'Tiwi'],
  'Antique': ['San Jose de Buenavista', 'Anini-y', 'Barbaza', 'Belison', 'Bugasong', 'Caluya', 'Culasi', 'Hamtic', 'Laua-an', 'Libertad', 'Pandan', 'Patnongon', 'San Remigio', 'Sebaste', 'Sibalom', 'Tibiao', 'Tudla'],
  'Apayao': ['Kabugao', 'Luna', 'Pudtol', 'Santa Marcela', 'Bacca', 'Calanasan', 'Conner', 'Flora', 'Madgic', 'Mallig', 'Naguilian', 'Santa Juan', 'Sugpon', 'Sufrian', 'Tayum', 'Umagil', 'Bongabong', 'Elpidio', 'Roxas'],
  'Aurora': ['Baler', 'Casiguran', 'Dilasag', 'Dinalungan', 'Dingalan', 'Dipaculao', 'Balbalag', 'Maria Aurora', 'San Luis'],
  'Basilan': ['Isabela City', 'Lamitan', 'Akbar', 'Al-Barka', 'Hadji Mohammad Ajul', 'Hadji Muhtamad', 'Opi', 'Panglima Estino', 'Pangutaran', 'Parang', 'Pata', 'Pio Martinez', 'Summy', 'Tungkal'],
  'Bataan': ['Balanga', 'Abucay', 'Bagac', 'Dinalupihan', 'Hermosa', 'Limay', 'Mariveles', 'Morong', 'Orani', 'Orion', 'Pilar', 'Samal'],
  'Batanes': ['Basco', 'Itbayat', 'Ivana', 'Mahatao', 'Sabtang', 'Uyugan'],
  'Batangas': ['Batangas City', 'Lipa', 'Tanauan', 'Agoncillo', 'Alitagtag', 'Balayan', 'Balete', 'Bauan', 'Cuenca', 'Ibaan', 'Laurel', 'Mabini', 'Majayjay', 'Nasugbu', 'San Jose', 'San Juan', 'San Luis', 'San Nicolas', 'San Pascual', 'Santa Teresita', 'Santo Tomas', 'Taal', 'Talisay', 'Taysan', 'Tingloy'],
  'Benguet': ['Baguio', 'Atok', 'Bakun', 'Bokod', 'Buguias', 'Itogon', 'Kabayan', 'Kapangan', 'Kibungan', 'La Trinidad', 'Mankayan', 'Sablan', 'Tuba', 'Tublay'],
  'Biliran': ['Naval', 'Almeria', 'Biliran', 'Cabucgalan', 'Caibiran', 'Culaba', 'Kawayan', 'Maripos'],
  'Bohol': ['Tagbilaran', 'Baclayon', 'Balilihan', 'Bien Unido', 'Bilar', 'Buenavista', 'Calape', 'Carmen', 'Catigbian', 'Clarin', 'Corella', 'Cortes', 'Dauis', 'Dimiao', 'Danao', 'Frederick', 'Getafe', 'Guindulman', 'Inabang', 'Jagna', 'Panglao', 'Pilar', 'Pres. Carlos P. Garcia', 'Sagbayan', 'San Isidro', 'San Miguel', 'Sevilla', 'Sierra Bullones', 'Sikatuna', 'Ubay', 'Valencia', 'Alicia', 'Loon', 'Loboc', 'Loon'],
  'Bukidnon': ['Malaybalay', 'Valencia', 'Baungon', 'Cabangahan', 'Quezon', 'San Fernando', 'Sumilao', 'Talakag', 'Kadatuan', 'Lanao', 'Mangataon', 'Pantao Ragat', 'Rio Grande', 'San Antonio', 'San Pablo', 'Sugbongcogon', 'Tagoloan', 'Villanueva'],
  'Bulacan': ['Malolos', 'Meycauayan', 'San Jose del Monte', 'Valenzuela', 'Angat', 'Balagtas', 'Baliuag', 'Bocaue', 'Bulakan', 'Bustos', 'Calumpit', 'Doña Remedios Trinidad', 'Guiguinto', 'Hagonoy', 'Marilao', 'Norzagaray', 'Obando', 'Pandi', 'Paombong', 'Plaridel', 'Pulilan', 'San Ildefonso', 'San Miguel', 'San Rafael', 'Santa Maria'],
  'Cagayan': ['Tuguegarao', 'Pili', 'Camiling', 'Alicia', 'Angadanan', 'Auforan', 'Baggao', 'Ballesteros', 'Buguey', 'Calayan', 'Camalaniugan', 'Claveria', 'Enrile', 'Gamtoc', 'Iguig', 'Mahaob', 'Mallig', 'Naguilian', 'Pamplona', 'Peñablanca', 'Piat', 'Rizal', 'Sanchez-Mira', 'Santa Ana', 'Santa Praxedes', 'Santa Teresita', 'Santo Niño', 'Solana', 'Tuao'],
  'Camarines Norte': ['Daet', 'Basud', 'Capalonga', 'Jose Panganiban', 'Labo', 'Mercedes', 'Paracale', 'San Lorenzo Ruiz', 'San Vicente', 'Vinzons', 'Lagonoy', 'Gumaca'],
  'Camarines Sur': ['Naga', 'Iriga', 'Camalig', 'Libmanan', 'Labo', 'Pasacao', 'Pili', 'Ragay', 'Sagñay', 'Siruma', 'Lagonoy', 'Oas', 'San Jose', 'Talisay', 'Bula', 'Cabusao', 'Calabanga', 'Camaligan', 'Canaman', 'Caramoan', 'Gumaca', 'Milaor', 'Minalabac', 'Nabua', 'Ocampo', 'San Fernando', 'San Juan', 'Sipocot', 'Tiaong'],
  'Camiguin': ['Mambajao', 'Catarman', 'Guinsiliban', 'Mahinog', 'Sagay', 'Balungag', 'Sibonga', 'Tibaug', 'Amlan'],
  'Capiz': ['Roxas City', 'Cuartero', 'Dao', 'Dumalag', 'Dumarao', 'Ivisan', 'Jamindan', 'Ma-ayon', 'Makato', 'Mapanas', 'Mambusao', 'NUEVA', 'Panay', 'Panitan', 'Pontevedra', 'President Roxas', 'Sapi-an', 'Sigma', 'Tapaz'],
  'Catanduanes': ['Virac', 'Bagamanoc', 'Baras', 'Bato', 'Caramoran', 'Gigmoto', 'Pandan', 'Panganiban', 'San Andres', 'San Miguel', 'Viga'],
  'Cavite': ['Bacoor', 'Cavite City', 'Dasmariñas', 'Imus', 'Taga', 'Alfonso', 'Amadeo', 'Carmona', 'General Emilio Aguinaldo', 'General Mariano Alvarez', 'General Trias', 'Indang', 'Kawit', 'Magallanes', 'Maragondon', 'Mendez', 'Naic', 'Noveleta', 'Rosario', 'Silang', 'Tanza', 'Ternate'],
  'Cebu': ['Cebu City', 'Lapu-Lapu', 'Mandaue', 'Talisay', 'Toledo', 'Danao', 'Bogo', 'Balamban', 'Bantayan', 'Barili', 'Bulligan', 'Carcar', 'Carmen', 'Catmon', 'Compostela', 'Consolacion', 'Cordova', 'Daanbantayan', 'Dalaguete', 'Dumanjug', 'Ginatilan', 'Liloan', 'Madrideos', 'Malabuyoc', 'Medellin', 'Minglanilla', 'Naga', 'Oslob', 'Pilar', 'Pinamungajan', 'Poro', 'Ronda', 'Samboan', 'San Fernando', 'San Francisco', 'San Remigio', 'Santa Fe', 'Santander', 'Sibonga', 'Sogod', 'Tabogon', 'Tabuelan', 'Tuburan', 'Tudela'],
  'Cotabato': ['Kidapawan', 'Alamada', 'Aleosan', 'Antipas', 'Arakan', 'Banisilan', 'Carmen', 'Kabacan', 'Libungan', 'Mlang', 'Magpet', 'Makilid', 'Matalam', 'Midsayap', 'Pigkawayan', 'Pikit', 'President Roxas', 'Supang', 'Tacurong'],
  'Davao de Oro': ['Nabunturan', 'Compostela', 'Laak', 'Mabini', 'Maco', 'Maragusan', 'Mawab', 'Monkayo', 'Montevista', 'New Bataan', 'Pantukan'],
  'Davao del Norte': ['Tagum', 'Panabo', 'Island Garden City of Samal', 'Bansalan', 'Hagonoy', 'Kapalong', 'New Corella', 'San Isidro', 'Santo Tomas', 'Talaingod'],
  'Davao del Sur': ['Davao City', 'Digos', 'Bansalan', 'Hagonoy', 'Kiblawan', 'Magsaysay', 'Malalag', 'Matanao', 'Oroquieta', 'Padada', 'Santa Cruz', 'Surallah', 'Talaingod'],
  'Davao Occidental': ['Malita', 'Don Marcelino', 'Jose Abad Santos', 'General Santos', 'Surallah'],
  'Davao Oriental': ['Mati', 'Baganga', 'Banaybanay', 'Boston', 'Caraga', 'Cateel', 'Governor Gener', 'Lupon', 'Manay', 'San Isidro', 'Tarragona'],
  'Dinagat Islands': ['San Jose', 'Basilisa', 'Cagdianao', 'Dinagat', 'Libjo', 'Loreto', 'Tubajon'],
  'Eastern Samar': ['Borongan', 'Arteche', 'Balangiga', 'Balangkayan', 'Can-avid', 'Dolores', 'General Macarthur', 'Giporlos', 'Guiuan', 'Hernani', 'Jipapad', 'Lawaan', 'Llorente', 'Maslog', 'Maydolong', 'Mercedes', 'Oras', 'Quinapang', 'San Julian', 'San Pedro', 'San Ricardo', 'Silvino Lobos', 'Victoria'],
  'Guimaras': ['Jordan', 'Buenavista', 'Nueva Valencia', 'San Lorenzo', 'Sibunag'],
  'Ifugao': ['Banaue', 'Hungduan', 'Maganang', 'Lagawe', 'Lamut', 'Mayoyao', 'Tinoc', 'Asipulo', 'Hingyon', 'Aguinaldo', 'Alfonso Lista', 'Kibugayon', 'Kiangan', 'Lagangagang'],
  'Ilocos Norte': ['Laoag', 'Batac', 'Pugo', 'Badoc', 'Bacarra', 'Badoc', 'Burgos', 'Dingras', 'Dumalneg', 'Laganglangang', 'Lidao', 'Macalecel', 'McArthurs', 'NuevaEra', 'Paoay', 'Pasuquin', 'Pila', 'Rosario', 'San Nicolas', 'Sarrat', 'Solsona', 'Vintar'],
  'Ilocos Sur': ['Vigan', 'Candon', 'Nagcarlan', 'Bantay', 'Burgos', 'Cabugao', 'Caoayan', 'Cervantes', 'Galimuyod', 'Gregorio del Pilar', 'Lidlidda', 'Magsingal', 'Narvacan', 'Quirino', 'Salcedo', 'San Emilio', 'San Esteban', 'San Ildefonso', 'San Juan', 'San Vicente', 'Santa', 'Santa Catalina', 'Santa Cruz', 'Santa Lucia', 'Santa Maria', 'Santiago', 'Santo Domingo', 'Sigay', 'Sinait', 'Sugpon', 'Suyo', 'Tagudin'],
  'Iloilo': ['Iloilo City', 'Passi', 'Ajuy', 'Alimodian', 'Anini-y', 'Balasan', 'Banate', 'Barotac Nuevo', 'Barotac Viejo', 'Batad', 'Bingawan', 'Cabatuan', 'Calinog', 'Carles', 'Concepcion', 'Dingle', 'Dueñas', 'Dumangas', 'Estancia', 'Guimbal', 'Igbaras', 'Janiuay', 'Lambunao', 'Leganes', 'Lemery', 'Liwa', 'Madalag', 'Makato', 'Malay', 'Malaynon', 'Mina', 'Nueva Valencia', 'Oton', 'Pavia', 'Pototan', 'San Dionisio', 'San Enrique', 'San Joaquin', 'San Miguel', 'San Rafael', 'Santa Barbara', 'Sara', ' Tigbauan', 'Valencia', 'Zarraga'],
  'Isabela': ['Ilagan', 'Cauayan', 'Santiago', 'Alicia', 'Angadanan', 'Auforan', 'Baggao', 'Ballesteros', 'Buguey', 'Calayan', 'Camalaniugan', 'Claveria', 'Enrile', 'Gamtoc', 'Iguig', 'Mahaob', 'Mallig', 'Naguilian', 'Pamplona', 'Peñablanca', 'Piat', 'Rizal', 'Sanchez-Mira', 'Santa Ana', 'Santa Praxedes', 'Santa Teresita', 'Santo Niño', 'Solana', 'Tuao'],
  'Kalinga': ['Tabuk', 'Balbalan', 'Lubuagan', 'Pasil', 'Pinukpuk', 'Rizal', 'Tanudan', 'Tinglayan'],
  'Laguna': ['Calamba', 'San Pablo', 'Santa Rosa', 'Biñan', 'Cabuyao', 'Alaminos', 'Binangonan', 'Cardona', 'Jalajala', 'Los Banos', 'Mabitac', 'Magdalena', 'Majayjay', 'Nasugbu', 'Pagsanjan', 'Palayan', 'Pangil', 'Pila', 'Rizal', 'San Pedro', 'Siniloan', 'Victoria'],
  'Lanao del Norte': ['Marawi', 'Bacolod', 'Baloi', 'Balingasag', 'Burgos', 'Calanogas', 'Dapao-on', 'Datu Abdullah Sangki', 'Datu Anggal Midtimbang', 'Datu Blah T. Sinsuat', 'Datu Hoffer Ampatuan', 'Datu Montawal', 'Datu Odin Sinsuat', 'Datu Paglas', 'Datu Salibo', 'Datu Saudi-Ampatuan', 'Kapatagan', 'Kauswagan', 'Kolambugan', 'Lala', 'Linamon', 'Magsaysay', 'Maigo', 'Matungao', 'Munai', 'Nunungan', 'Pantao Ragat', 'Pantar', 'Poona Bayabao', 'Pualas', 'Saguiaran', 'Sultan Dumalondong'],
  'Lanao del Sur': ['Iligan', 'Bacolod', 'Balabagan', 'Balindong', 'Bayang', 'Buluan', 'Datu Abdullah Sangki', 'Datu Anggal Midtimbang', 'Datu Hoffer Ampatuan', 'Datu Montawal', 'Datu Odin Sinsuat', 'Datu Paglas', 'Datu Salibo', 'Datu Saudi-Ampatuan', 'Kapatagan', 'Lugus', 'Madalum', 'Madamba', 'Maguing', 'Malabang', 'Marantao', 'Marogong', 'Masiu', 'Mulondo', 'Nagcar', 'Piagapo', 'Poona Bayabao', 'Pualas', 'Saguiaran', 'Sultan Baranga', 'Sultan Dumalondong', 'Tagoloan III', 'Tamparan', 'Taraka', 'Tubod'],
  'La Union': ['San Fernando', 'Agoo', 'Aringay', 'Bacnotan', 'Bagulin', 'Balaoan', 'Bangar', 'Bauang', 'Burgos', 'Caba', 'Luna', 'Naguilian', 'Pugo', 'Rosario', 'San Gabriel', 'San Juan', 'Santo Tomas', 'Santol', 'Sudipen', 'Tubao'],
  'Leyte': ['Tacloban', 'Ormoc', 'Baybay', 'Alangalang', 'Albuera', 'Babatngon', 'Barugo', 'Bato', 'Carigara', 'Dagami', 'Dulag', 'Hilongos', 'Hindang', 'Inopacan', 'Isabel', 'Javier', 'Julita', 'Kananga', 'La Paz', 'Leyte', 'MacArthur', 'Mahaplag', 'Matag-ob', 'Matalom', 'Mayorga', 'Merida', 'Palo', 'Palompon', 'Pastrana', 'San Isidro', 'San Miguel', 'Santa Fe', 'Tabango', 'Tabontabon', 'Tanauan', 'Tolosa', 'Tunga', 'Villaba'],
  'Maguindanao': ['Cotabato City', 'Ampatuan', 'Barira', 'Buldon', 'Buluan', 'Datu Abdullah Sangki', 'Datu Anggal Midtimbang', 'Datu Hoffer Ampatuan', 'Datu Montawal', 'Datu Odin Sinsuat', 'Datu Paglas', 'Datu Salibo', 'Datu Saudi-Ampatuan', 'El Salvador', 'Gen. S. K. Pendatun', 'Guindulungan', 'Kabuntalan', 'Mamasapano', 'Mangudadatu', 'Matnog', 'Northern Kabuntalan', 'Pagalungan', 'Paglat', 'Pandami', 'Pantar', 'Parang', 'Rajah Buayan', 'Shariff Aguak', 'Shariff Saydona Mustapha', 'Sultan sa Barongis', 'Sultan Kudarat', 'Sultan Mastura', 'Sultan Sumagui', 'Talitay', 'Talitay II'],
  'Marinduque': ['Boac', 'Gasan', 'Magsaysay', 'Mogpog', 'Santa Cruz', 'Torrijos'],
  'Masbate': ['Masbate City', 'Aroroy', 'Baleno', 'Balud', 'Batuan', 'Cataingan', 'Cawayan', 'Claveria', 'Dimasalang', 'Esperanza', 'Mandaon', 'Milagros', 'Mobo', 'Monreal', 'Palanas', 'Pio V. Corpuz', 'Placer', 'San Fernando', 'San Jacinto', 'San Pascual', 'Santa Ana', 'Tibiao', 'Uson'],
  'Misamis Occidental': ['Oroquieta', 'Ozamiz', 'Aloran', 'Baganga', 'Baloi', 'Bantayan', 'Burias', 'Cagayan', 'Carmen', 'Clarin', 'Concepcion', 'Dapao-on', 'Datu Abdullah Sangki', 'Datu Anggal Midtimbang', 'Datu Hoffer Ampatuan', 'Datu Montawal', 'Datu Odin Sinsuat', 'Datu Paglas', 'Datu Salibo', 'Datu Saudi-Ampatuan', 'Gingoog', 'Jimbol', 'Kibawe', 'Kuday', 'Lugait', 'Magsaysay', 'Manticao', 'Medina', 'Naawan', 'Plaridel', 'Sapang Dalaga', 'Sinacpan', 'Tudela'],
  'Misamis Oriental': ['Cagayan de Oro', 'Gingoog', 'El Salvador', 'Labason', 'Lagonglong', 'Laguindingan', 'Libertad', 'Lugangan', 'Malayba', 'Manticao', 'Medina', 'Naawan', 'Plaridel', 'Sapang Dalaga', 'Sinacpan', 'Tudela'],
  'Mountain Province': ['Bontoc', 'Barlig', 'Bauko', 'Kabugao', 'La Trinidad', 'Mankayan', 'Sablan', 'Sagada', 'Tadian'],
  'Negros Occidental': ['Bacolod', 'Silay', 'Talisay', 'Victorias', 'Cadiz', 'Sagay', 'Cauayan', 'Ilog', 'Murcia', 'Pulupandan', 'Valladolid', 'Don Salvador Benedicto', 'La Castellana', 'Manapla', 'Moises Padilla', 'Nagcarlan', 'Pontevedra', 'Himamaylan', 'Candoni', 'Cauayan', 'Sipalay', 'Toboso', 'Valencia', 'Canlaon', 'Burgos', 'Enrique B. Magalona', 'Jimalalud', 'La Libertad', 'Mabinay', 'Manjuyod', 'Pamplona', 'San Jose', 'Santa Cruz', 'Santa Rosa', 'Santa Teresita'],
  'Negros Oriental': ['Dauin', 'Sibulan', 'Tanjay', 'Amlan', 'Ayungon', 'Bacong', 'Basay', 'Bindoy', 'Danao', 'Duero', 'Jimalalud', 'La Castellana', 'Mabinay', 'Manjuyod', 'Pamplona', 'San Jose', 'Santa Cruz', 'Santa Rosa', 'Tayasan', 'Valencia', 'Vallehermoso', 'Zamboanguita'],
  'Northern Samar': ['Catarman', 'Allen', 'Biranan', 'Capul', 'Dagami', 'Diliman', 'Dingle', 'Dumanjug', 'Enrique B. Magalona', 'Garcia Hernandez', 'Laoang', 'Lapinig', 'Las Navas', 'Lavezanias', 'Lope de Vega', 'Mapanas', 'Mondragon', 'Palapag', 'Pambujan', 'Rosario', 'San Antonio', 'San Isidro', 'San Jose', 'San Roque', 'San Vicente', 'Silvino Lobos', 'Victoria'],
  'Nueva Ecija': ['Palayan', 'Gapan', 'San Jose City', 'Aliaga', 'Bongabon', 'Cabiao', 'Carranglan', 'Cuyapo', 'Gabaldon', 'Gabaldon', 'General Mamerto Natividad', 'General Tinio', 'Guimba', 'Jaen', 'Laur', 'Licab', 'Llanera', 'Lupao', 'Nampican', 'Palayan', 'Pantabangan', 'Peñaranda', 'Quezon', 'Rizal', 'Rufino', 'San Antonio', 'San Isidro', 'San Leonardo', 'Santa Rosa', 'Santo Domingo', 'Talavera', 'Talipao', 'Tarlac', 'Teresa', 'Zaragoza'],
  'Nueva Vizcaya': ['Bayombong', 'Kambing', 'Aliaga', 'Bongabon', 'Cabiao', 'Carranglan', 'Cuyapo', 'Guimba', 'Jaen', 'Laur', 'Licab', 'Llanera', 'Lupao', 'Nampican', 'Palayan', 'Pantabangan', 'Peñaranda', 'Quezon', 'Rizal', 'Rufino', 'San Antonio', 'San Isidro', 'San Leonardo', 'Santa Rosa', 'Santo Domingo', 'Talavera', 'Talipao', 'Tarlac', 'Teresa', 'Zaragoza'],
  'Occidental Mindoro': ['Mamburao', 'Abra de Ilog', 'Calintaan', 'Looc', 'Lubang', 'Magdiwang', 'Paluan', 'Rizal', 'Sablayan', 'San Jose', 'Santa Cruz'],
  'Oriental Mindoro': ['Calapan', 'Baco', 'Bansud', 'Bongabong', 'Bulalacao', 'Gloria', 'Mansalay', 'Naujan', 'Pinamalayan', 'Pola', 'Puerto Galera', 'Roxas', 'San Teodoro', 'Socorro', 'Victoria'],
  'Palawan': ['Puerto Princesa', 'Coron', 'El Nido', 'Rizal', 'Araceli', 'Balabac', 'Bataraza', 'Brooke\'s Point', 'Busuanga', 'Cagayancillo', 'Culion', 'Cuyo', 'Dumaran', 'Maguindanao', 'Narra', 'Quezon', 'Roxas', 'San Vicente', 'Sofronio Española', 'Taytay'],
  'Pampanga': ['Angeles', 'San Fernando', 'Apalit', 'Arayat', 'Candaba', 'Floridablanca', 'Guagua', 'Lubao', 'Macabebe', 'Mabalacat', 'Magalang', 'Masantol', 'Mexico', 'Meycauayan', 'Porac', 'San Luis', 'San Simon', 'Santa Ana', 'Santa Rita', 'Santo Tomas', 'Sasmuan'],
  'Pangasinan': ['Lingayen', 'Alaminos', 'Dagupan', 'San Carlos', 'Urdaneta', 'Agno', 'Aguilar', 'Alcala', 'Bacarra', 'Badoc', 'Bagnao', 'Balungao', 'Bani', 'Basista', 'Binmaley', 'Boliney', 'Burgos', 'Busuanga', 'Calasiao', 'Dao', 'Dauin', 'Dolores', 'Fabian', 'Flores', 'Gumaca', 'Igbaras', 'Janiua', 'Laoag', 'Lingayen', 'Mabini', 'Malasiqui', 'Manaoag', 'Mangaldan', 'Mangatarem', 'Mapandan', 'Naguilian', 'Pozorrubio', 'Rosales', 'San Fabian', 'San Jacinto', 'San Manuel', 'San Nicolas', 'Santa Barbara', 'Santa Cruz', 'Santa Maria', 'Santo Tomas', 'Sison', 'Sual', 'Tayug', 'Umingan', 'Urbiztondo', 'Villaverde'],
  'Quezon': ['Lucena', 'Tayabas', 'Agdangan', 'Alabat', 'Atimonan', 'Buenavista', 'Burdeos', 'Calauag', 'Candelaria', 'Gumaca', 'Infanta', 'Jomalig', 'Lopez', 'Lucban', 'Macalelon', 'Mauban', 'Mulaney', 'Nagtipunan', 'Pantucalan', 'Patnanungan', 'Perez', 'Pitogo', 'Plaridel', 'Polillo', 'Quezon', 'Real', 'Sariaya', 'Tagkawayan', 'Tiaong', 'Unisan'],
  'Quirino': ['Cabarroguis', 'Aglipay', 'Diffun', 'Maddela', 'Nagtipunan', 'Saguday'],
  'Rizal': ['Antipolo', 'Cainta', 'Taytay', 'Angono', 'Baras', 'Binangonan', 'Cardona', 'Jalajala', 'Morong', 'Pililla', 'Rodriguez', 'San Mateo', 'Tanay', 'Taytay'],
  'Romblon': ['Romblon', 'Alcantara', 'Baco', 'Balabag', 'Banar', 'Baunguan', 'Cajidiocan', 'Calapadan', 'Cañ-ayan', 'Concepcion', 'Corcuera', 'Ferrol', 'Looc', 'Magdiwang', 'Magdalena', 'Maonmaw', 'Odiongan', 'San Fernando', 'San Jose', 'Santa Fe', 'Santa Maria'],
  'Samar': ['Catbalogan', 'Borongan', 'Abuyog', 'Almagro', 'Basey', 'Calbiga', 'Dulag', 'Hilongos', 'Hindang', 'Inopacan', 'Isabel', 'Javier', 'Julita', 'Kananga', 'La Paz', 'Leyte', 'MacArthur', 'Mahaplag', 'Matag-ob', 'Matalom', 'Mayorga', 'Merida', 'Palo', 'Palompon', 'Pastrana', 'San Isidro', 'San Miguel', 'Santa Fe', 'Tabango', 'Tabontabon', 'Tanauan', 'Tolosa', 'Tunga', 'Villaba'],
  'Sarangani': ['Alabel', 'Glan', 'Kiamba', 'Maasim', 'Maitum', 'Malapatan', 'Malungon'],
  'Siquijor': ['Siquijor', 'Enrique Villanueva', 'Larena', 'Lazi', 'Maria', 'San Juan'],
  'Sorsogon': ['Sorsogon City', 'Bulusan', 'Casiguran', 'Castilla', 'Donsol', 'Gubat', 'Irosin', 'Juban', 'Magallanes', 'Matnog', 'Pili', 'Prieto Diaz', 'Santa Margarita', 'Santa Rita', 'Santo Domingo'],
  'South Cotabato': ['Koronadal', 'General Santos', 'Banga', 'Lake Sebu', 'Norala', 'Polomolok', 'Santo Niño', 'Surallah', 'T\'boli', 'Tampakan'],
  'Southern Leyte': ['Maasin', 'Anahawan', 'Borongan', 'Claypo', 'Gigantes', 'Hinunangan', 'Liloan', 'Limasawa', 'Maasin', 'Macrohon', 'Malitbog', 'Padre Burgos', 'Pintuyan', 'San Pedro', 'San Ricardo', 'San Juan', 'Santa Fe', 'Tacloban'],
  'Sultan Kudarat': ['Isulan', 'Kalamansig', 'Lambayong', 'Lebak', 'Lutayan', 'Palimbang', 'President Quirino', 'Sen. Ninoy Aquino', 'Tacurong'],
  'Sulu': ['Jolo', 'Indanan', 'Kalingalan Caluang', 'Luuk', 'Omar', 'Pandami', 'Panglima Estino', 'Pangutaran', 'Parang', 'Pata', 'Pio Martinez', 'Summy', 'Tungkal'],
  'Surigao del Norte': ['Surigao City', 'Alegria', 'Bacuag', 'Burgos', 'Claver', 'Dapa', 'Dinagat', 'Loreto', 'Pilar', 'Placer', 'San Benito', 'San Francisco', 'San Isidro', 'Santa Monica', 'Sison', 'Tubod'],
  'Surigao del Sur': ['Tandag', 'Bislig', 'Barobo', 'Bayabas', 'Cagayan', 'Carmen', 'Cortes', 'Hinatuan', 'Ligawasan', 'Lianga', 'Lingig', 'Madrid', 'Marihatag', 'San Agustin', 'San Miguel', 'Tagbina', 'Tago'],
  'Tarlac': ['Tarlac City', 'Anao', 'Bamban', 'Camiling', 'Capas', 'Gerona', 'Mayantoc', 'Moncada', 'Paniqui', 'Pura', 'Ramos', 'San Clemente', 'San Jose', 'San Manuel', 'Santa Ignacia', 'Victoria'],
  'Tawi-Tawi': ['Bongao', 'Languyan', 'Sibutu', 'Simunul', 'Sitangkai', 'Tandubas', 'Turtle Islands'],
  'Zambales': ['Iba', 'Botolan', 'Cabangan', 'Candelaria', 'Castillejos', 'Masinloc', 'Olongapo', 'Palauig', 'San Antonio', 'San Felipe', 'San Marcelino', 'San Narciso', 'Santa Cruz', 'Subic'],
  'Zamboanga del Norte': ['Dapitan', 'Dipolog', 'Baliguian', 'Godod', 'Gutalac', 'Jose Dalman', 'Kalawit', 'Katipunan', 'La Libertad', 'Labason', 'Liloy', 'Manukan', 'Mutia', 'Piagapo', 'Polanco', 'Pres. Manuel A. Roxas', 'Rizal', 'Salug', 'Sergio Osmeña Sr.', 'Siayan', 'Sibuco', 'Sibutad', 'Sindangan', 'Siocon', 'Sirawai', 'Tampilisan'],
  'Zamboanga del Sur': ['Pagadian', 'Zamboanga City', 'Aurora', 'Bayog', 'Dimataling', 'Dinas', 'Dumalinao', 'Dumingag', 'Guipos', 'Josefa', 'Lakewood', 'Latuan', 'Pitogo', 'Ramon Magsaysay', 'San Miguel', 'San Pablo', 'Sominot', 'Tabina', 'Tambulig', 'Tiguyan', 'Aurora', 'Bayog', 'Dimataling', 'Dinas', 'Dumalinao', 'Dumingag', 'Guipos', 'Josefa', 'Lakewood', 'Latuan', 'Pitogo', 'Ramon Magsaysay', 'San Miguel', 'San Pablo', 'Sominot', 'Tabina', 'Tambulig', 'Tiguyan'],
   'Zamboanga Sibugay': ['Ipil', 'Alicia', 'Buug', 'Diplahan', 'Imelda', 'Kabasalan', 'Mabuhay', 'Malangas', 'Naga', 'Olutanga', 'Payao', 'Roseller Lim', 'Siay', 'Talusan', 'Titay', 'Tungawan'],
};

export default function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cart, addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const params = use(searchParams);
  const queryString = new URLSearchParams(params).toString();
  const searchParamsObj = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
  });

  const [shipping, setShipping] = useState({
    street: '',
    barangay: '',
    city: '',
    province: '',
    zip: '',
     country: 'Philippines',
     courier: 'Lalamove',
   });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholder: '',
    sameAsShipping: true,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    paymentMethod: 'credit_card',
  });

  const [review, setReview] = useState({
    termsAccepted: false,
  });

  useEffect(() => {
    const productId = searchParamsObj.get('add');
    if (productId) {
      fetch(`/api/cart/add?id=${productId}`)
        .then(res => res.json())
        .then((product: Product) => {
          addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            condition: product.condition,
            stock: product.stock,
          });
          router.replace('/checkout');
        })
        .catch(err => console.error('Failed to add product:', err));
    }
  }, [searchParamsObj]);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) handlePlaceOrder();
  };

  const isCustomerValid = () => {
    return (
      customer.fullName.trim() !== '' &&
      customer.email.trim() !== '' &&
      customer.phone.trim() !== ''
    );
  };

  const isShippingValid = () => {
    return (
      shipping.street.trim() !== '' &&
      shipping.barangay.trim() !== '' &&
      shipping.city.trim() !== '' &&
      shipping.province.trim() !== '' &&
       shipping.zip.trim() !== '' &&
       shipping.courier !== ''
    );
  };

  const isPaymentValid = () => {
    if (payment.paymentMethod === 'credit_card') {
      return (
        payment.cardNumber.trim() !== '' &&
        payment.expiry.trim() !== '' &&
        payment.cvv.trim() !== '' &&
        payment.cardholder.trim() !== ''
      );
    }
    return true;
  };

  const isFormValid = () => {
    if (step === 1) return isCustomerValid();
    if (step === 2) return isShippingValid();
    if (step === 3) return isPaymentValid();
    if (step === 4) return review.termsAccepted;
    return false;
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!review.termsAccepted) return;
    setLoading(true);
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    let orderNumber = 'SH-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000);
    
    try {
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal: cart.subtotal,
          tax: cart.tax,
          shippingCost: cart.shipping,
          total: cart.grandTotal,
          shippingAddress: { ...shipping, fullName: customer.fullName, email: customer.email, phone: customer.phone, company: customer.company },
          paymentMethod: payment.paymentMethod,
        }),
      });
      
      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        orderNumber = orderData.orderNumber || orderNumber;
      }
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastOrder', JSON.stringify({
          orderNumber: orderNumber,
          items: cart.items,
          total: cart.grandTotal,
          shipping,
          payment: 'pending',
        }));
        
        localStorage.removeItem('cart');
      }
      
      setTimeout(() => {
        router.push('/confirmation');
      }, 1000);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background pt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <a href="/inventory" className="text-primary hover:text-primary-dark">
            Browse Inventory →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                <span className={`ml-2 text-sm ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Customer' : s === 2 ? 'Shipping' : s === 3 ? 'Payment' : 'Review'}
                </span>
                {s < 4 && (
                  <div className={`w-16 h-0.5 mx-4 ${step > s ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            {step === 1 && (
              <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
                <h2 className="text-lg font-medium text-foreground">Customer Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Phone</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Company (optional)</label>
                    <input
                      type="text"
                      value={customer.company}
                      onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
                <h2 className="text-lg font-medium text-foreground">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground">Street Address</label>
                    <input
                      type="text"
                      value={shipping.street}
                      onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Province</label>
                    <select
                      value={shipping.province}
                      onChange={(e) => setShipping({ ...shipping, province: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="">Select Province</option>
                      <option value="Abra">Abra</option>
                      <option value="Agusan del Norte">Agusan del Norte</option>
                      <option value="Agusan del Sur">Agusan del Sur</option>
                      <option value="Aklan">Aklan</option>
                      <option value="Albay">Albay</option>
                      <option value="Antique">Antique</option>
                      <option value="Apayao">Apayao</option>
                      <option value="Aurora">Aurora</option>
                      <option value="Basilan">Basilan</option>
                      <option value="Bataan">Bataan</option>
                      <option value="Batanes">Batanes</option>
                      <option value="Batangas">Batangas</option>
                      <option value="Benguet">Benguet</option>
                      <option value="Biliran">Biliran</option>
                      <option value="Bohol">Bohol</option>
                      <option value="Bukidnon">Bukidnon</option>
                      <option value="Bulacan">Bulacan</option>
                      <option value="Cagayan">Cagayan</option>
                      <option value="Camarines Norte">Camarines Norte</option>
                      <option value="Camarines Sur">Camarines Sur</option>
                      <option value="Camiguin">Camiguin</option>
                      <option value="Capiz">Capiz</option>
                      <option value="Catanduanes">Catanduanes</option>
                      <option value="Cavite">Cavite</option>
                      <option value="Cebu">Cebu</option>
                      <option value="Cotabato">Cotabato</option>
                      <option value="Davao de Oro">Davao de Oro</option>
                      <option value="Davao del Norte">Davao del Norte</option>
                      <option value="Davao del Sur">Davao del Sur</option>
                      <option value="Davao Occidental">Davao Occidental</option>
                      <option value="Davao Oriental">Davao Oriental</option>
                      <option value="Dinagat Islands">Dinagat Islands</option>
                      <option value="Eastern Samar">Eastern Samar</option>
                      <option value="Guimaras">Guimaras</option>
                      <option value="Ifugao">Ifugao</option>
                      <option value="Ilocos Norte">Ilocos Norte</option>
                      <option value="Ilocos Sur">Ilocos Sur</option>
                      <option value="Iloilo">Iloilo</option>
                      <option value="Isabela">Isabela</option>
                      <option value="Kalinga">Kalinga</option>
                      <option value="Laguna">Laguna</option>
                      <option value="Lanao del Norte">Lanao del Norte</option>
                      <option value="Lanao del Sur">Lanao del Sur</option>
                      <option value="La Union">La Union</option>
                      <option value="Leyte">Leyte</option>
                      <option value="Maguindanao">Maguindanao</option>
                      <option value="Marinduque">Marinduque</option>
                      <option value="Masbate">Masbate</option>
                      <option value="Misamis Occidental">Misamis Occidental</option>
                      <option value="Misamis Oriental">Misamis Oriental</option>
                      <option value="Mountain Province">Mountain Province</option>
                      <option value="Negros Occidental">Negros Occidental</option>
                      <option value="Negros Oriental">Negros Oriental</option>
                      <option value="Northern Samar">Northern Samar</option>
                      <option value="Nueva Ecija">Nueva Ecija</option>
                      <option value="Nueva Vizcaya">Nueva Vizcaya</option>
                      <option value="Occidental Mindoro">Occidental Mindoro</option>
                      <option value="Oriental Mindoro">Oriental Mindoro</option>
                      <option value="Palawan">Palawan</option>
                      <option value="Pampanga">Pampanga</option>
                      <option value="Pangasinan">Pangasinan</option>
                      <option value="Quezon">Quezon</option>
                      <option value="Quirino">Quirino</option>
                      <option value="Rizal">Rizal</option>
                      <option value="Romblon">Romblon</option>
                      <option value="Samar">Samar</option>
                      <option value="Sarangani">Sarangani</option>
                      <option value="Siquijor">Siquijor</option>
                      <option value="Sorsogon">Sorsogon</option>
                      <option value="South Cotabato">South Cotabato</option>
                      <option value="Southern Leyte">Southern Leyte</option>
                      <option value="Sultan Kudarat">Sultan Kudarat</option>
                      <option value="Sulu">Sulu</option>
                      <option value="Surigao del Norte">Surigao del Norte</option>
                      <option value="Surigao del Sur">Surigao del Sur</option>
                      <option value="Tarlac">Tarlac</option>
                      <option value="Tawi-Tawi">Tawi-Tawi</option>
                      <option value="Zambales">Zambales</option>
                      <option value="Zamboanga del Norte">Zamboanga del Norte</option>
                      <option value="Zamboanga del Sur">Zamboanga del Sur</option>
                      <option value="Zamboanga Sibugay">Zamboanga Sibugay</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">City/Municipality</label>
                    <select
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="">Select City/Municipality</option>
                      {shipping.province && (philippineCities[shipping.province] || []).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Barangay</label>
                    <input
                      type="text"
                      value={shipping.barangay}
                      onChange={(e) => setShipping({ ...shipping, barangay: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">ZIP</label>
                    <input
                      type="text"
                      value={shipping.zip}
                      onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                      required
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Country</label>
                    <input
                      type="text"
                      value={shipping.country}
                      readOnly
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Courier</label>
                    <div className="space-y-2">
                      {['Lalamove', 'J&T', 'AP Cargo'].map((courier) => (
                        <label key={courier} className="flex items-center">
                          <input
                            type="radio"
                            name="courier"
                            value={courier}
                            checked={shipping.courier === courier}
                            onChange={(e) => setShipping({ ...shipping, courier: e.target.value })}
                            required
                            className="h-4 w-4 text-primary focus:ring-primary border-border"
                          />
                          <span className="ml-2 text-sm text-foreground">{courier}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
                <h2 className="text-lg font-medium text-foreground">Payment Information</h2>
                <div className="space-y-4">
                  {['credit_card', 'wire_transfer', 'purchase_order'].map((method) => (
                    <label key={method} className="flex items-center p-4 border border-border bg-card rounded-md cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={payment.paymentMethod === method}
                        onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
                        className="h-4 w-4 text-primary focus:ring-primary border-border"
                      />
                      <span className="ml-2 text-sm text-foreground capitalize">{method.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
                {payment.paymentMethod === 'credit_card' && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                        required
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                        required
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                        required
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground">Cardholder Name</label>
                      <input
                        type="text"
                        value={payment.cardholder}
                        onChange={(e) => setPayment({ ...payment, cardholder: e.target.value })}
                        required
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
                <h2 className="text-lg font-medium text-foreground">Review Your Order</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Customer Information</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {customer.fullName}<br />
                      {customer.email}<br />
                      {customer.phone}<br />
                      {customer.company && `${customer.company}\n`}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {shipping.street}<br />
                      {shipping.barangay}<br />
                      {shipping.city}<br />
                      {shipping.province}<br />
                      {shipping.zip}<br />
                      {shipping.country}<br />
                      Courier: {shipping.courier}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Payment Method</h3>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{payment.paymentMethod.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Items</h3>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {cart.items.map((item) => (
                        <li key={item.productId}>
                          {item.name} x{item.quantity} - ₱{(item.price * item.quantity).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={review.termsAccepted}
                      onChange={(e) => setReview({ ...review, termsAccepted: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                      I agree to the Terms & Conditions
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={handleNext}
                disabled={loading || !isFormValid()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-dark disabled:opacity-50"
              >
                {step === 3 ? 'Place Order' : 'Next'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-card text-card-foreground shadow rounded-lg p-6 sticky top-4 border border-border">
              <h2 className="text-lg font-medium text-foreground mb-4">Order Summary</h2>
              <ul className="divide-y divide-border text-sm">
                {cart.items.map((item) => (
                  <li key={item.productId} className="py-3 flex justify-between">
                    <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-foreground">₱{(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium text-foreground">₱{cart.subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="font-medium text-foreground">₱{cart.tax.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium text-foreground">{cart.shipping === 0 ? 'Free' : `₱${cart.shipping}`}</dd>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-border">
                  <dt className="text-foreground">Total</dt>
                  <dd className="text-foreground">₱{cart.grandTotal.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
