export interface District {
  id: string;
  nameBn: string;
  nameEn: string;
  divisionId: string;
  popularUpazilas: { bn: string; en: string }[];
}

export interface Division {
  id: string;
  nameBn: string;
  nameEn: string;
}

export const DIVISIONS: Division[] = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
];

export const DISTRICTS: District[] = [
  // Dhaka Division
  {
    id: 'dhaka',
    divisionId: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    popularUpazilas: [
      { bn: 'ধানমন্ডি', en: 'Dhanmondi' },
      { bn: 'মিরপুর', en: 'Mirpur' },
      { bn: 'গুলশান', en: 'Gulshan' },
      { bn: 'উত্তরা', en: 'Uttara' },
      { bn: 'মতিঝিল', en: 'Motijheel' },
      { bn: 'মোহাম্মদপুর', en: 'Mohammadpur' },
      { bn: 'বনানী', en: 'Banani' },
      { bn: 'বাড্ডা', en: 'Badda' },
      { bn: 'পল্টন', en: 'Paltan' },
      { bn: 'শাহবাগ', en: 'Shahbagh' },
      { bn: 'সাভার', en: 'Savar' },
      { bn: 'কেরানীগঞ্জ', en: 'Keraniganj' },
    ],
  },
  { id: 'gazipur', divisionId: 'dhaka', nameBn: 'গাজীপুর', nameEn: 'Gazipur', popularUpazilas: [{ bn: 'জয়দেবপুর', en: 'Joydebpur' }, { bn: 'টঙ্গী', en: 'Tongi' }, { bn: 'শ্রীপুর', en: 'Sreepur' }, { bn: 'কালিয়াকৈর', en: 'Kaliakair' }] },
  { id: 'narayanganj', divisionId: 'dhaka', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'সোনারগাঁও', en: 'Sonargaon' }, { bn: 'সিদ্ধিরগঞ্জ', en: 'Siddhirganj' }, { bn: 'রূপগঞ্জ', en: 'Rupganj' }] },
  { id: 'tangail', divisionId: 'dhaka', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'মির্জাপুর', en: 'Mirzapur' }, { bn: 'মধুপুর', en: 'Madhupur' }] },
  { id: 'kishoreganj', divisionId: 'dhaka', nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'ভৈরব', en: 'Bhairab' }, { bn: 'বাজিতপুর', en: 'Bajitpur' }] },
  { id: 'manikganj', divisionId: 'dhaka', nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'সিংগাইর', en: 'Singair' }] },
  { id: 'munshiganj', divisionId: 'dhaka', nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'শ্রীনগর', en: 'Sreenagar' }] },
  { id: 'narsingdi', divisionId: 'dhaka', nameBn: 'নরসিংদী', nameEn: 'Narsingdi', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'রায়পুরা', en: 'Raipura' }, { bn: 'পলাশ', en: 'Palash' }] },
  { id: 'faridpur', divisionId: 'dhaka', nameBn: 'ফরিদপুর', nameEn: 'Faridpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'ভাঙ্গা', en: 'Bhanga' }] },
  { id: 'gopalganj', divisionId: 'dhaka', nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'টুঙ্গিপাড়া', en: 'Tungipara' }] },
  { id: 'madaripur', divisionId: 'dhaka', nameBn: 'মাদারীপুর', nameEn: 'Madaripur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'শিবচর', en: 'Shibchar' }] },
  { id: 'rajbari', divisionId: 'dhaka', nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'গোয়ালন্দ', en: 'Goalanda' }] },
  { id: 'shariatpur', divisionId: 'dhaka', nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'জাজিরা', en: 'Zajira' }] },

  // Chattogram Division
  {
    id: 'chattogram',
    divisionId: 'chattogram',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    popularUpazilas: [
      { bn: 'আগ্রাবাদ', en: 'Agrabad' },
      { bn: 'পাঁচলাইশ', en: 'Panchlaish' },
      { bn: 'কোতোয়ালী', en: 'Kotwali' },
      { bn: 'হালিশহর', en: 'Halishahar' },
      { bn: 'খুলশী', en: 'Khulshi' },
      { bn: 'পতেঙ্গা', en: 'Patenga' },
      { bn: 'হাটহাজারী', en: 'Hathazari' },
      { bn: 'সীতাকুণ্ড', en: 'Sitakunda' },
    ],
  },
  { id: 'coxsbazar', divisionId: 'chattogram', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'টেকনাফ', en: 'Teknaf' }, { bn: 'উখিয়া', en: 'Ukhia' }, { bn: 'রামু', en: 'Ramu' }] },
  { id: 'cumilla', divisionId: 'chattogram', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', popularUpazilas: [{ bn: 'আদর্শ সদর', en: 'Adarsha Sadar' }, { bn: 'চান্দিনা', en: 'Chandina' }, { bn: 'দাউদকান্দি', en: 'Daudkandi' }] },
  { id: 'feni', divisionId: 'chattogram', nameBn: 'ফেনী', nameEn: 'Feni', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'দাগনভূঞা', en: 'Daganbhuiyan' }] },
  { id: 'brahmanbaria', divisionId: 'chattogram', nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'আশুগঞ্জ', en: 'Ashuganj' }] },
  { id: 'noakhali', divisionId: 'chattogram', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'বেগমগঞ্জ', en: 'Begumganj' }, { bn: 'মাইজদী', en: 'Maijdee' }] },
  { id: 'chandpur', divisionId: 'chattogram', nameBn: 'চাঁদপুর', nameEn: 'Chandpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'হাজীগঞ্জ', en: 'Hajiganj' }] },
  { id: 'lakshmipur', divisionId: 'chattogram', nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'রায়পুর', en: 'Raipur' }] },
  { id: 'rangamati', divisionId: 'chattogram', nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'কাপ্তাই', en: 'Kaptai' }] },
  { id: 'khagrachhari', divisionId: 'chattogram', nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'দীঘিনালা', en: 'Dighinala' }] },
  { id: 'bandarban', divisionId: 'chattogram', nameBn: 'বান্দরবান', nameEn: 'Bandarban', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'রুমা', en: 'Ruma' }] },

  // Rajshahi Division
  {
    id: 'rajshahi',
    divisionId: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    popularUpazilas: [
      { bn: 'বোয়ালিয়া', en: 'Boalia' },
      { bn: 'রাজপাড়া', en: 'Rajpara' },
      { bn: 'মতিহার', en: 'Motihar' },
      { bn: 'শাহ মখদুম', en: 'Shah Makhdum' },
      { bn: 'পবা', en: 'Paba' },
    ],
  },
  { id: 'bogura', divisionId: 'rajshahi', nameBn: 'বগুড়া', nameEn: 'Bogura', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'শেরপুর', en: 'Sherpur' }, { bn: 'শিবগঞ্জ', en: 'Shibganj' }] },
  { id: 'pabna', divisionId: 'rajshahi', nameBn: 'পাবনা', nameEn: 'Pabna', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'ঈশ্বরদী', en: 'Ishwardi' }] },
  { id: 'sirajganj', divisionId: 'rajshahi', nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'শাহজাদপুর', en: 'Shahjadpur' }] },
  { id: 'naogaon', divisionId: 'rajshahi', nameBn: 'নওগাঁ', nameEn: 'Naogaon', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'পত্নীতলা', en: 'Patnitala' }] },
  { id: 'natore', divisionId: 'rajshahi', nameBn: 'নাটোর', nameEn: 'Natore', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'সিংড়া', en: 'Singra' }] },
  { id: 'chapainawabganj', divisionId: 'rajshahi', nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'শিবগঞ্জ', en: 'Shibganj' }] },
  { id: 'joypurhat', divisionId: 'rajshahi', nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'পাঁচবিবি', en: 'Panchbibi' }] },

  // Khulna Division
  {
    id: 'khulna',
    divisionId: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'সোনাডাঙ্গা', en: 'Sonadanga' }, { bn: 'খালিশপুর', en: 'Khalishpur' }, { bn: 'দৌলতপুর', en: 'Daulatpur' }],
  },
  { id: 'jashore', divisionId: 'khulna', nameBn: 'যশোর', nameEn: 'Jashore', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'ঝিকরগাছা', en: 'Jhikargachha' }, { bn: 'বেনাপোল', en: 'Benapole' }] },
  { id: 'satkhira', divisionId: 'khulna', nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'শ্যামনগর', en: 'Shyamnagar' }] },
  { id: 'bagerhat', divisionId: 'khulna', nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'মোংলা', en: 'Mongla' }] },
  { id: 'kushtia', divisionId: 'khulna', nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'কুমারখালী', en: 'Kumarkhali' }] },
  { id: 'jhenaidah', divisionId: 'khulna', nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'কালীগঞ্জ', en: 'Kaliganj' }] },
  { id: 'chuadanga', divisionId: 'khulna', nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'দামুড়হুদা', en: 'Damurhuda' }] },
  { id: 'meherpur', divisionId: 'khulna', nameBn: 'মেহেরপুর', nameEn: 'Meherpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }] },
  { id: 'magura', divisionId: 'khulna', nameBn: 'মাগুরা', nameEn: 'Magura', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }] },
  { id: 'narail', divisionId: 'khulna', nameBn: 'নড়াইল', nameEn: 'Narail', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }] },

  // Barishal Division
  { id: 'barishal', divisionId: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'বাবুগঞ্জ', en: 'Babuganj' }] },
  { id: 'patuakhali', divisionId: 'barishal', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'কুয়াকাটা', en: 'Kuakata' }] },
  { id: 'bhola', divisionId: 'barishal', nameBn: 'ভোলা', nameEn: 'Bhola', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'চরফ্যাশন', en: 'Char Fasson' }] },
  { id: 'pirojpur', divisionId: 'barishal', nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'স্বরূপকাঠি', en: 'Swarupkathi' }] },
  { id: 'barguna', divisionId: 'barishal', nameBn: 'বরগুনা', nameEn: 'Barguna', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'আমতলী', en: 'Amtali' }] },
  { id: 'jhalokati', divisionId: 'barishal', nameBn: 'ঝালকাঠি', nameEn: 'Jhalokati', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }] },

  // Sylhet Division
  {
    id: 'sylhet',
    divisionId: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    popularUpazilas: [
      { bn: 'কোতোয়ালী', en: 'Kotwali' },
      { bn: 'শাহপরান', en: 'Shah Paran' },
      { bn: 'জালালাবাদ', en: 'Jalalabad' },
      { bn: 'বিমানবন্দর', en: 'Airport' },
      { bn: 'জৈন্তাপুর', en: 'Jaintiapur' },
    ],
  },
  { id: 'moulvibazar', divisionId: 'sylhet', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'শ্রীমঙ্গল', en: 'Sreemangal' }] },
  { id: 'habiganj', divisionId: 'sylhet', nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'মাধবপুর', en: 'Madhabpur' }] },
  { id: 'sunamganj', divisionId: 'sylhet', nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'তাহিরপুর', en: 'Tahirpur' }] },

  // Rangpur Division
  { id: 'rangpur', divisionId: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'পীরগঞ্জ', en: 'Pirganj' }] },
  { id: 'dinajpur', divisionId: 'rangpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'বিরামপুর', en: 'Birampur' }] },
  { id: 'gaibandha', divisionId: 'rangpur', nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'গোবিন্দগঞ্জ', en: 'Gobindaganj' }] },
  { id: 'kurigram', divisionId: 'rangpur', nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'চিলমারী', en: 'Chilmari' }] },
  { id: 'lalmonirhat', divisionId: 'rangpur', nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'পাটগ্রাম', en: 'Patgram' }] },
  { id: 'nilphamari', divisionId: 'rangpur', nameBn: 'নীলফামারী', nameEn: 'Nilphamari', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'সৈয়দপুর', en: 'Saidpur' }] },
  { id: 'panchagarh', divisionId: 'rangpur', nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'তেঁতুলিয়া', en: 'Tetulia' }] },
  { id: 'thakurgaon', divisionId: 'rangpur', nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'পীরগঞ্জ', en: 'Pirganj' }] },

  // Mymensingh Division
  { id: 'mymensingh', divisionId: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'মুক্তাগাছা', en: 'Muktagachha' }, { bn: 'ত্রিশাল', en: 'Trishal' }] },
  { id: 'jamalpur', divisionId: 'mymensingh', nameBn: 'জামালপুর', nameEn: 'Jamalpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'সরিষাবাড়ী', en: 'Sarishabari' }] },
  { id: 'netrokona', divisionId: 'mymensingh', nameBn: 'নেত্রকোণা', nameEn: 'Netrokona', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'মোহনগঞ্জ', en: 'Mohanganj' }] },
  { id: 'sherpur', divisionId: 'mymensingh', nameBn: 'শেরপুর', nameEn: 'Sherpur', popularUpazilas: [{ bn: 'সদর', en: 'Sadar' }, { bn: 'নকলা', en: 'Nakla' }] },
];

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  iconName: string;
  examplesBn: string;
  examplesEn: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'DOCUMENTS',
    nameBn: 'দলিল ও পরিচয়পত্র',
    nameEn: 'Documents & IDs',
    iconName: 'FileText',
    examplesBn: 'NID, পাসপোর্ট, ড্রাইভিং লাইসেন্স, পরীক্ষার প্রবেশপত্র, সার্টিফিকেট',
    examplesEn: 'NID, Passport, Driving License, Student ID, Certificates',
  },
  {
    id: 'ELECTRONICS',
    nameBn: 'ইলেকট্রনিক্স ও মোবাইল',
    nameEn: 'Electronics & Mobiles',
    iconName: 'Smartphone',
    examplesBn: 'স্মার্টফোন, ল্যাপটপ, ট্যাবলেট, হেডফোন, ক্যামেরা, পাওয়ার ব্যাংক',
    examplesEn: 'Smartphone, Laptop, Tablet, Headphones, Camera, Power Bank',
  },
  {
    id: 'BAGS_WALLETS',
    nameBn: 'ব্যাগ ও ওয়ালেট',
    nameEn: 'Bags & Wallets',
    iconName: 'Briefcase',
    examplesBn: 'লেদার ওয়ালেট, মানিব্যাগ, ব্যাকপ্যাক, হ্যান্ডব্যাগ, লাগেজ',
    examplesEn: 'Leather Wallet, Purse, Backpack, Handbag, Luggage',
  },
  {
    id: 'KEYS',
    nameBn: 'চাবি ও চাবির রিং',
    nameEn: 'Keys & Keychains',
    iconName: 'Key',
    examplesBn: 'বাইকের চাবি, গাড়ির চাবি, বাসার চাবি, স্মার্ট কি',
    examplesEn: 'Bike Keys, Car Keys, House Keys, Smart Key',
  },
  {
    id: 'PETS',
    nameBn: 'গৃহপালিত প্রাণী ও পোষা জীব',
    nameEn: 'Pets & Animals',
    iconName: 'Dog',
    examplesBn: 'বিড়াল, কুকুর, পাখি, খরগোশ',
    examplesEn: 'Cat, Dog, Bird, Rabbit',
  },
  {
    id: 'JEWELRY',
    nameBn: 'গহনা ও ঘড়ি',
    nameEn: 'Jewelry & Watches',
    iconName: 'Watch',
    examplesBn: 'হাতঘড়ি, আংটি, চেইন, কানের দুল, ব্রেসলেট',
    examplesEn: 'Wristwatch, Ring, Necklace, Earrings, Bracelet',
  },
  {
    id: 'CARDS_MONEY',
    nameBn: 'নগদ টাকা ও ব্যাংক কার্ড',
    nameEn: 'Cash & Bank Cards',
    iconName: 'CreditCard',
    examplesBn: 'ডেবিট/ক্রেডিট কার্ড, মেট্রোরেল র‍্যাপিড পাস, নগদ অর্থ',
    examplesEn: 'Debit/Credit Cards, Metro Rail Rapid Pass, Cash',
  },
  {
    id: 'BOOKS_STATIONERY',
    nameBn: 'বই ও শিক্ষাসামগ্রী',
    nameEn: 'Books & Study Items',
    iconName: 'BookOpen',
    examplesBn: 'গুরুত্বপূর্ণ নোটবুক, টেক্সটবুক, ফাইল ফোল্ডার, ডায়রি',
    examplesEn: 'Notebooks, Textbooks, File Folders, Diaries',
  },
  {
    id: 'OTHER',
    nameBn: 'অন্যান্য জিনিসপত্র',
    nameEn: 'Other Items',
    iconName: 'HelpCircle',
    examplesBn: 'চশমা, ছাতা, পরিধেয় বস্ত্র, ওষুধ সামগ্রী',
    examplesEn: 'Spectacles, Umbrella, Clothes, Medical Supplies',
  },
];
