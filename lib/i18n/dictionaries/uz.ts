import type { Dictionary } from "@/lib/i18n/types";

export const uz: Dictionary = {
  meta: {
    title: "Asad Nazarov — AI-arxitektor | Biznesga sun'iy intellekt joriy qilish",
    description:
      "Kompaniyalarga natija beradigan AI-agentlar va avtomatlashtirish joriy qilishda yordam beraman. Shaxsiy konsultatsiya — hammasini o'zi yozadigan mutaxassis bilan.",
  },
  nav: {
    items: [
      { label: "Men haqimda", href: "#about" },
      { label: "Keyslar", href: "#cases" },
      { label: "Fikrlar", href: "#testimonials" },
    ],
    cta: "Konsultatsiya",
  },
  hero: {
    overline: "AI-arxitektor",
    headline: "Biznesga sun'iy intellektni",
    headlineAccent: "real natija beradigan tarzda joriy qilaman.",
    subhead:
      "Xarajatlarni qisqartirishni, jarayonlarni tezlashtirishni va jamoani rutinadan ozod qilishni istagan kompaniyalar uchun AI-agentlar va avtomatlashtirish yarataman.",
    cta: "Konsultatsiyaga yozilish — $100",
    stat1Value: "50+",
    stat1Label: "amalga oshirilgan AI-loyiha",
    stat2Value: "6",
    stat2Label: "yillik dasturlash va AI tajribasi",
    stat3Value: "20+",
    stat3Label: "soat oyiga mijozlarda tejalgan vaqt",
  },
  about: {
    heading: "Men kimman va nega menga AI joriy qilishni ishonish mumkin",
    paragraphs: [
      "Men — dasturchi va AI-arxitektorman, o'zim loyihalashtiraman, kod yozaman va joriy qilaman, shunchaki \"so'zda\" maslahat bermayman. So'nggi bir necha yil davomida dasturlash va sun'iy intellekt chorrahasida ishlayapman: AI-agentlar quraman, ichki jarayonlarni avtomatlashtiraman va biznesga AI'dan investorlar uchun hisobot emas, real foyda olishga yordam beraman.",
      "Men chakana savdo, e-commerce, xizmatlar sohasi va IT kompaniyalari bilan ishlaganman — kichik kompaniyalardan tortib Markaziy Osiyo va MDH mintaqasidagi o'sib borayotgan kompaniyalargacha. Har bir loyihada vazifam bitta: AI qayerda real pul yoki vaqt tejashini aniqlash va yechimni \"pilot loyiha uchun pilot\" emas, ishlab chiqarishga olib chiqish.",
      "Men vositachi agentlik orqali ishlamayman — siz men bilan bevosita muloqot qilasiz, va taklif qiladigan yechimlarni o'zim amalga oshiraman.",
    ],
    credentials: [
      "50+ amalga oshirilgan AI-agent va avtomatlashtirish",
      "O'zbekiston, MDH va xalqaro bozorda biznes bilan ishlash tajribasi",
      "To'liq sikl: g'oyadan va arxitekturadan ishlab chiqarish va qo'llab-quvvatlashgacha",
      "Vositachisiz, bevosita ishlayman",
    ],
  },
  cases: {
    heading: "Men allaqachon nima joriy qildim",
    subhead: "Mijozlar duch keladigan real vazifalar — va AI ularni amalda qanday hal qiladi.",
    items: [
      {
        number: "01",
        industry: "Chakana savdo tarmog'i, 12 nuqta",
        challenge: "Operatorlar kuniga 300 tagacha mijoz murojaatini qo'lda qayta ishlar, ariza va vaqt yo'qotilardi.",
        solution: "Messenjerlarda arizalarni qayta ishlash uchun AI-agent: so'rovni aniqlash, tez-tez so'raladigan savollarga javob, murakkab holatlarni odamga uzatish.",
        result: "Arizani qayta ishlash vaqti −35%, birinchi oyda yo'qotilgan murojaat 0 ta.",
      },
      {
        number: "02",
        industry: "E-commerce, uy uchun tovarlar",
        challenge: "Marketing jamoasi mahsulot kartochkalari va tavsiflarini tayyorlashga soatlab vaqt sarflardi.",
        solution: "LLM asosida turli platformalar uchun mahsulot tavsiflarini yaratish va moslashtirishni avtomatlashtirish.",
        result: "Jamoada oyiga 20+ soat vaqt bo'shadi, yangi mahsulotlarni chiqarish vaqti 3 barobar qisqardi.",
      },
      {
        number: "03",
        industry: "IT-kompaniya, B2B xizmatlar",
        challenge: "Sotuv bo'limi turli kanallardan keladigan liderlarni ulgurib baholay olmasdi.",
        solution: "CRM bilan integratsiyalashgan va jamoaga xabar yuboradigan liderlarni birlamchi baholovchi AI-agent.",
        result: "Mijozga birinchi javob berish tezligi soatlardan daqiqalargacha qisqardi.",
      },
      {
        number: "04",
        industry: "Xizmatlar sohasi, konsalting",
        challenge: "Jamoa ishda AI'dan foydalanishni xohlardi, lekin qayerdan boshlashni bilmasdi.",
        solution: "Jarayonlar auditi + jamoani kundalik ishda AI vositalaridan amaliy foydalanishga o'rgatish.",
        result: "Jamoa o'qitishdan keyingi birinchi oyda 3 ta AI vositasini mustaqil joriy qildi.",
      },
    ],
    labels: {
      challenge: "Vazifa",
      solution: "Yechim",
      result: "Natija",
    },
  },
  testimonials: {
    heading: "Mijozlar nima deydi",
    items: [
      {
        quote:
          "Asad bizning jarayonimizni bitta qo'ng'iroqda tushundi va boshqa pudratchilar olti oyda va'da qilgan yechimni ikki haftada ishlab berdi.",
        name: "Dilnoza Karimova",
        role: "Marketing direktori, e-commerce",
      },
      {
        quote:
          "Biz \"prezentatsiya bilan konsultant\"ni emas, o'zi kod yozadigan odamni qidirgan edik. Asad ikkala rolni ham bajardi va bizga oylab vaqtni tejadi.",
        name: "Jasur Toshmatov",
        role: "Operatsion direktor, chakana savdo tarmog'i",
      },
      {
        quote:
          "Konsultatsiyadan keyin birinchi navbatda nimani avtomatlashtirish kerakligi haqida aniq tushunchaga ega bo'ldik. Ortiqcha gap yo'q — faqat aniq reja.",
        name: "Aziz Rahimov",
        role: "Asoschi, IT-kompaniya",
      },
    ],
  },
  consultation: {
    heading: "Shaxsiy konsultatsiya — $100",
    subhead:
      "Bu \"qo'ng'iroq uchun qo'ng'iroq\" emas. Bir suhbatda vazifangizni tahlil qilamiz va aynan sizning biznesingiz uchun maksimal natija beradigan yechimni aniqlaymiz.",
    price: "$100",
    priceNote: "To'lov va vaqt forma to'ldirilgandan keyin shaxsan kelishiladi.",
    outcomes: [
      {
        title: "Kompaniyada AI joriy qilish",
        description: "Birinchi navbatda qaysi jarayonlarni avtomatlashtirish kerakligini va buni qanday amalga oshirishni aniqlaymiz.",
      },
      {
        title: "Jamoani o'qitish",
        description: "Jamoangizga kundalik ishda AI vositalaridan amaliy foydalanishni o'rgataman.",
      },
      {
        title: "Ekspert konsultatsiyasi",
        description: "AI, arxitektura va vazifalarni ustuvorlashtirish bo'yicha aniq savollaringizga javoblar.",
      },
    ],
    processHeading: "Bu qanday ishlaydi",
    processSteps: [
      "Quyidagi formani to'ldirasiz — vazifangiz va byudjet haqida yozasiz",
      "Vaqt va to'lovni kelishish uchun men shaxsan siz bilan bog'lanaman",
      "Konsultatsiya o'tkazamiz va aniq harakatlar rejasi bilan yakunlaymiz",
    ],
  },
  form: {
    nameLabel: "Ism",
    namePlaceholder: "Sizga qanday murojaat qilish kerak",
    contactLabel: "Aloqa",
    contactPlaceholder: "Telegram, telefon yoki email",
    companyLabel: "Kompaniya",
    companyPlaceholder: "Kompaniya nomi (majburiy emas)",
    needLabel: "Sizga nima kerak?",
    needOptions: [
      { value: "implementation", label: "Kompaniyada AI joriy qilish" },
      { value: "training", label: "Jamoani o'qitish" },
      { value: "consultation", label: "Umumiy konsultatsiya" },
      { value: "other", label: "Boshqa" },
    ],
    budgetLabel: "Loyiha byudjeti",
    budgetOptions: [
      { value: "under-1000", label: "$1 000 gacha" },
      { value: "1000-5000", label: "$1 000–5 000" },
      { value: "5000-15000", label: "$5 000–15 000" },
      { value: "15000-plus", label: "$15 000+" },
      { value: "unknown", label: "Hali bilmayman" },
    ],
    messageLabel: "Vazifangiz haqida yozing",
    messagePlaceholder: "AI yordamida nimani hal qilmoqchisiz? Qancha aniq yozsangiz, konsultatsiya shuncha foydali bo'ladi.",
    submit: "Arizani yuborish",
    submitting: "Yuborilmoqda...",
    successTitle: "Ariza yuborildi",
    successBody: "Rahmat! Vaqt va to'lovni kelishish uchun 24 soat ichida siz bilan bog'lanaman.",
    errorTitle: "Yuborib bo'lmadi",
    errorBody: "Qayta urinib ko'ring yoki menga to'g'ridan-to'g'ri Telegram orqali yozing.",
    errorFallbackCta: "Telegram orqali yozish",
    validation: {
      nameRequired: "Ismingizni kiriting",
      contactRequired: "Aloqa uchun ma'lumot kiriting",
      needRequired: "Nima kerakligini tanlang",
      budgetRequired: "Byudjetni tanlang",
      messageRequired: "Vazifa haqida qisqacha yozing (kamida 10 belgi)",
    },
  },
  footer: {
    tagline: "AI-arxitektor. Biznesga real natija beradigan sun'iy intellektni joriy qilaman.",
    contactHeading: "Aloqa",
    email: "hello@asadnazarov.ai",
    telegram: "@asadnazarov",
    socialsHeading: "Ijtimoiy tarmoqlar",
    rights: "Barcha huquqlar himoyalangan.",
  },
};
