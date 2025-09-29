export const ugandaDistricts = [
  'Abim', 'Adjumani', 'Agago', 'Alebtong', 'Amolatar', 'Amudat', 'Amuria', 'Amuru', 'Apac', 'Arua',
  'Budaka', 'Bududa', 'Bugiri', 'Buhweju', 'Buikwe', 'Bukedea', 'Bukomansimbi', 'Bukwo', 'Bulambuli', 'Buliisa',
  'Bundibugyo', 'Bushenyi', 'Busia', 'Butaleja', 'Butambala', 'Buvuma', 'Buyende',
  'Dokolo', 'Gomba', 'Gulu', 'Hoima', 'Ibanda', 'Iganga', 'Isingiro', 'Jinja', 'Kaabong', 'Kabale', 'Kabarole',
  'Kaberamaido', 'Kalangala', 'Kaliro', 'Kalungu', 'Kampala', 'Kamuli', 'Kamwenge', 'Kanungu', 'Kapchorwa',
  'Kasese', 'Katakwi', 'Kayunga', 'Kibaale', 'Kiboga', 'Kibuku', 'Kiruhura', 'Kiryandongo', 'Kisoro', 'Kitgum',
  'Koboko', 'Kole', 'Kotido', 'Kumi', 'Kween', 'Kyankwanzi', 'Kyegegwa', 'Kyenjojo', 'Lamwo', 'Lira', 'Luuka',
  'Luwero', 'Lwengo', 'Lyantonde', 'Manafwa', 'Maracha', 'Masaka', 'Masindi', 'Mayuge', 'Mbale', 'Mbarara',
  'Mitooma', 'Mityana', 'Mokono', 'Moroto', 'Moyo', 'Mpigi', 'Mubende', 'Mukono', 'Nakapiripirit', 'Nakaseke',
  'Nakasongola', 'Namayingo', 'Namutumba', 'Napak', 'Nebbi', 'Ngora', 'Ntoroko', 'Ntungamo', 'Nwoya', 'Otuke',
  'Oyam', 'Pader', 'Pallisa', 'Rakai', 'Rubirizi', 'Rukungiri', 'Sembabule', 'Serere', 'Sheema', 'Sironko',
  'Soroti', 'Tororo', 'Wakiso', 'Yumbe', 'Zombo'
];

export const kampalaAreas = [
  'Central Division', 'Kawempe Division', 'Makindye Division', 'Nakawa Division', 'Rubaga Division',
  'Kololo', 'Naguru', 'Bugolobi', 'Ntinda', 'Bukoto', 'Kisaasi', 'Kyanja', 'Kiwatule', 'Najera',
  'Muyenga', 'Buziga', 'Kabalagala', 'Kansanga', 'Ggaba', 'Munyonyo', 'Lukuli', 'Mengo', 'Kisenyi',
  'Katwe', 'Nsambya', 'Kibuli', 'Wabigalo', 'Bbunga', 'Mutungo', 'Luzira', 'Butabika', 'Kireka'
];

export const wakasoAreas = [
  'Entebbe', 'Nansana', 'Kira', 'Mukono', 'Kasangati', 'Gayaza', 'Namugongo', 'Seeta', 'Bweyogerere',
  'Kiwenda', 'Matugga', 'Wakiso Town', 'Kakiri', 'Nsangi', 'Busukuma', 'Mpererwe', 'Kyaliwajjala',
  'Namayumba', 'Buloba', 'Ssisa', 'Katabi', 'Kitala', 'Nangabo', 'Kasanje', 'Masulita'
];

export const getAreasByDistrict = (district: string): string[] => {
  switch (district.toLowerCase()) {
    case 'kampala':
      return kampalaAreas;
    case 'wakiso':
      return wakasoAreas;
    default:
      return [`${district} Central`, `${district} Town`, `${district} Municipality`];
  }
};