import { db } from "@/server/db";
import { CourseClassYear } from "@prisma/client";

export type Course = {
  name: string;
  code?: string;
  classYear: CourseClassYear;
};

const lt1Courses: Course[] = [
  { name: "Solun rakenne ja toiminta", code: "SORATO", classYear: "LT1" },
  { name: "Genomin toiminta", code: "GETO", classYear: "LT1" },
  {
    name: "Verenkierto, hengitys ja nestetasapaino",
    code: "VERHE",
    classYear: "LT1",
  },
  {
    name: "Kehitys- ja lisääntymisbiologia",
    code: "KEHLI",
    classYear: "LT1",
  },
  { name: "Ruoansulatus ja metabolia", code: "RUMBA", classYear: "LT1" },
  { name: "Tuki- ja liikuntaelimistö", code: "TULE", classYear: "LT1" },
  { name: "Embryologia", code: "EMB", classYear: "LT1" },
  {
    name: "Fysiikkaa lääketieteen opiskelijoille",
    code: "FLO",
    classYear: "LT1",
  },
  { name: "Latinan peruskurssi", code: "LAP", classYear: "LT1" },
  { name: "Johdanto ihmisen biologiaan", code: "JIBI", classYear: "LT1" },
  { name: "Histologia", classYear: "LT1" },
  {
    name: "Tuki- ja liikuntaelimistön anatomia",
    code: "TLA",
    classYear: "LT1",
  },
  { name: "Elinanatomia", code: "EAN", classYear: "LT1" },
  { name: "Biomolekyylit", code: "BIMO", classYear: "LT1" },
  {
    name: "Lääketieteellinen solu- ja molekyylibiologia",
    code: "SOMO",
    classYear: "LT1",
  },
  { name: "Biokemiallinen endokrinologia", code: "BEND", classYear: "LT1" },
  { name: "Lääketieteellinen biokemia", code: "LBK", classYear: "LT1" },
  {
    name: "Molekyylibologia ja -genetiikka",
    code: "MOBIGE",
    classYear: "LT1",
  },
  { name: "Genetiikkaa", classYear: "LT1" },
];

const lt2Courses: Course[] = [
  { name: "Kliininen mikrobiologia", classYear: "LT2" },
  { name: "Epidemiologia ja biostatistiikka", classYear: "LT2" },
  { name: "Farmakologiaa", code: "PEFA, SYFA, SYLFA", classYear: "LT2" },
  {
    name: "Immuunipuolustus ja virologia",
    code: "REPULSE",
    classYear: "LT2",
  },
  { name: "Ruoansulatus ja metabolia", code: "RUMBA", classYear: "LT2" },
  { name: "Hermosto", code: "HERMO", classYear: "LT2" },
  { name: "Ruotsi", classYear: "LT2" },
  { name: "Dissektiot", code: "LADIS", classYear: "LT2" },
  { name: "Tautiopin perusteet", code: "TAOP", classYear: "LT2" },
  { name: "Ympäristöterveydenhuollon perusteet", classYear: "LT2" },
  {
    name: "Lääketieteellinen yleisfysiologia",
    code: "LYF",
    classYear: "LT2",
  },
  { name: "Neurotieteet", code: "NET", classYear: "LT2" },
];

const lt3Courses: Course[] = [
  { name: "Potilas-lääkärisuhde", code: "PLS", classYear: "LT3" },
  { name: "Potilaan tutkiminen", code: "POTT", classYear: "LT3" },
  { name: "Määrittelemättömät sisätaudit", classYear: "LT3" },
  { name: "Kardiologia", classYear: "LT3" },
  { code: "TAO", name: "Tautioppi", classYear: "LT3" },
  {
    name: "Kliininen fysiologia ja isotooppilääketiede",
    code: "KFI",
    classYear: "LT3",
  },
  { name: "Kliininen kemia", code: "KK", classYear: "LT3" },
  { name: "Gastro, nefro, reuma", code: "GNR", classYear: "LT3" },
  { name: "Endokrinologia ja hematologia", code: "EnHe", classYear: "LT3" },
  { name: "Anestesiologia ja tehohoito", code: "ANE", classYear: "LT3" },
  { name: "Keuhkosairaudet", code: "KS", classYear: "LT3" },
  { name: "Radiologia", code: "RAD", classYear: "LT3" },
  { name: "Munuaiset ja virtsatiesairaudet", code: "MUUR", classYear: "LT3" },
  { name: "Shortly in English", classYear: "LT3" },
];

const lt4Courses: Course[] = [
  { name: "Geriatria", classYear: "LT4" },
  { name: "Kirurgia", classYear: "LT4" },
  { name: "Neurokirurgia", classYear: "LT4" },
  { name: "Neurologia", classYear: "LT4" },
  { name: "Psykiatria ja nuorisopsykiatria", classYear: "LT4" },
  { code: "FYS", name: "Fysiatria ja Ortopedia", classYear: "LT4" },
  { code: "RES", name: "Reseptioppi", classYear: "LT4" },
  {
    name: "Johdanto yleislääketieteeseen",
    code: "YLE I/JYL",
    classYear: "LT4",
  },
  { code: "INFEK", name: "Infektiosairaudet", classYear: "LT4" },
];

const lt5Courses: Course[] = [
  { name: "Naistentaudit", code: "GYNE", classYear: "LT5" },
  { name: "Lastentaudit", classYear: "LT5" },
  { name: "Silmätaudit", code: "SIL", classYear: "LT5" },
  { name: "Korva-, nenä-, kurkkutaudit", code: "KNK", classYear: "LT5" },
  { name: "Lastenpsykiatria", code: "LPSY", classYear: "LT5" },
  { name: "Johdanto yleislääketieteeseen", code: "YLE", classYear: "LT5" },
  { name: "Työlääketiede ja työterveyshuolto", code: "TL", classYear: "LT5" },
  { name: "Kliininen ravitsemustiede", code: "KLRAV", classYear: "LT5" },
];

const lt6Courses: Course[] = [
  { name: "Ihotaudit", classYear: "LT6" },
  { name: "Syöpätaudit", classYear: "LT6" },
  {
    name: "Sisätaudit ja sisätaudit täydentävä",
    code: "SIS & SIST",
    classYear: "LT6",
  },
  { name: "Kirurgian täydentävä", code: "KIRT", classYear: "LT6" },
  { name: "Psykiatrian täydentävä", code: "PSYT", classYear: "LT6" },
  { name: "Oikeuspsykiatria", code: "OPSY", classYear: "LT6" },
];

const allCourses = [
  ...lt1Courses,
  ...lt2Courses,
  ...lt3Courses,
  ...lt4Courses,
  ...lt5Courses,
  ...lt6Courses,
];

// Push all courses to the database
for (const course of allCourses) {
  await db.course.create({
    data: course,
  });
}
