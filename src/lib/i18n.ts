export type Lang = "en" | "hi" | "mr";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

export type Dict = {
  brand: string;
  tagline: string;
  languageLabel: string;
  tabCheck: string;
  tabTrain: string;
  disclaimer: string;

  // check tab
  checkTitle: string;
  checkHelp: string;
  messageLabel: string;
  messagePlaceholder: string;
  charCount: (n: number, max: number) => string;
  screenshotLabel: string;
  screenshotHint: string;
  removeImage: string;
  checkNow: string;
  checking: string;
  tryExample: string;
  exampleKyc: string;
  exampleJob: string;
  exampleParcel: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  redFlags: string;
  whatToDo: string;
  reportIt: string;
  reportHelpline: string;
  reportPortal: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  fileTooBig: string;
  fileWrongType: string;

  // train tab
  trainTitle: string;
  trainHelp: string;
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  startScenario: string;
  simulationBanner: string;
  chatPlaceholder: string;
  send: string;
  endRound: string;
  turnsLeft: (n: number) => string;
  scoring: string;
  resultsTitle: string;
  caught: string;
  missed: string;
  tips: string;
  playAgain: string;
  anotherScenario: string;
  thinking: string;
  scenarioKyc: string;
  scenarioKycDesc: string;
  scenarioJob: string;
  scenarioJobDesc: string;
  scenarioArrest: string;
  scenarioArrestDesc: string;
  back: string;
};

const en: Dict = {
  brand: "ScamShield",
  tagline: "Spot scams. Practise saying no.",
  languageLabel: "Language",
  tabCheck: "Check a message",
  tabTrain: "Train yourself",
  disclaimer:
    "ScamShield gives guidance, not a guarantee. Always verify with your bank or official sources. We don't store your messages.",

  checkTitle: "Is this message a scam?",
  checkHelp: "Paste the message below. We'll explain what looks risky.",
  messageLabel: "Message text",
  messagePlaceholder: "Paste the SMS, WhatsApp or email text here…",
  charCount: (n, max) => `${n} / ${max} characters`,
  screenshotLabel: "Screenshot (optional)",
  screenshotHint: "PNG or JPG, up to 4 MB",
  removeImage: "Remove image",
  checkNow: "Check now",
  checking: "Checking…",
  tryExample: "Try an example",
  exampleKyc: "Bank KYC SMS",
  exampleJob: "Job offer",
  exampleParcel: "Parcel held",
  riskLow: "Low risk",
  riskMedium: "Medium risk",
  riskHigh: "High risk",
  redFlags: "Red flags",
  whatToDo: "What to do now",
  reportIt: "Report it",
  reportHelpline: "Call 1930 — National Cyber Crime Helpline",
  reportPortal: "Visit cybercrime.gov.in",
  errorTitle: "We couldn't check that",
  errorBody: "Something went wrong. Please try again in a moment.",
  retry: "Try again",
  fileTooBig: "That image is larger than 4 MB.",
  fileWrongType: "Please choose a PNG or JPG image.",

  trainTitle: "Practise with a pretend scammer",
  trainHelp: "Pick a situation. Reply as you would in real life. You'll get a score at the end.",
  difficulty: "Difficulty",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  startScenario: "Start",
  simulationBanner: "This is a simulation. The AI is pretending to be a scammer.",
  chatPlaceholder: "Type your reply…",
  send: "Send",
  endRound: "End round",
  turnsLeft: (n) => `${n} replies left`,
  scoring: "Scoring your round…",
  resultsTitle: "Your result",
  caught: "What you caught",
  missed: "What you missed",
  tips: "Tips",
  playAgain: "Play again",
  anotherScenario: "Try another scenario",
  thinking: "Typing…",
  scenarioKyc: "Fake bank KYC call",
  scenarioKycDesc: "A caller says your account will be blocked today.",
  scenarioJob: "Fake job offer",
  scenarioJobDesc: "Easy work from home, but there's a small fee first.",
  scenarioArrest: "Digital arrest call",
  scenarioArrestDesc: "Someone claims to be police on a video call.",
  back: "Back",
};

const hi: Dict = {
  brand: "ScamShield",
  tagline: "धोखाधड़ी पहचानें। मना करना सीखें।",
  languageLabel: "भाषा",
  tabCheck: "संदेश जाँचें",
  tabTrain: "अभ्यास करें",
  disclaimer:
    "ScamShield मार्गदर्शन देता है, गारंटी नहीं। हमेशा अपने बैंक या आधिकारिक स्रोत से पुष्टि करें। हम आपके संदेश सहेजते नहीं हैं।",

  checkTitle: "क्या यह संदेश धोखाधड़ी है?",
  checkHelp: "संदेश नीचे चिपकाएँ। हम बताएँगे क्या जोखिम भरा लगता है।",
  messageLabel: "संदेश का पाठ",
  messagePlaceholder: "यहाँ SMS, WhatsApp या ईमेल का पाठ चिपकाएँ…",
  charCount: (n, max) => `${n} / ${max} अक्षर`,
  screenshotLabel: "स्क्रीनशॉट (वैकल्पिक)",
  screenshotHint: "PNG या JPG, अधिकतम 4 MB",
  removeImage: "छवि हटाएँ",
  checkNow: "अभी जाँचें",
  checking: "जाँच हो रही है…",
  tryExample: "उदाहरण आज़माएँ",
  exampleKyc: "बैंक KYC SMS",
  exampleJob: "नौकरी का प्रस्ताव",
  exampleParcel: "पार्सल रुका",
  riskLow: "कम जोखिम",
  riskMedium: "मध्यम जोखिम",
  riskHigh: "उच्च जोखिम",
  redFlags: "चेतावनी संकेत",
  whatToDo: "अब क्या करें",
  reportIt: "शिकायत करें",
  reportHelpline: "1930 पर कॉल करें — राष्ट्रीय साइबर क्राइम हेल्पलाइन",
  reportPortal: "cybercrime.gov.in पर जाएँ",
  errorTitle: "जाँच नहीं हो सकी",
  errorBody: "कुछ गड़बड़ हुई। कृपया थोड़ी देर बाद फिर कोशिश करें।",
  retry: "फिर कोशिश करें",
  fileTooBig: "यह छवि 4 MB से बड़ी है।",
  fileWrongType: "कृपया PNG या JPG छवि चुनें।",

  trainTitle: "नकली ठग के साथ अभ्यास करें",
  trainHelp: "एक स्थिति चुनें। असल जीवन की तरह जवाब दें। अंत में अंक मिलेंगे।",
  difficulty: "कठिनाई",
  easy: "आसान",
  medium: "मध्यम",
  hard: "कठिन",
  startScenario: "शुरू करें",
  simulationBanner: "यह एक अभ्यास है। AI ठग होने का नाटक कर रहा है।",
  chatPlaceholder: "अपना जवाब लिखें…",
  send: "भेजें",
  endRound: "राउंड समाप्त करें",
  turnsLeft: (n) => `${n} जवाब बाकी`,
  scoring: "आपका अंक बन रहा है…",
  resultsTitle: "आपका परिणाम",
  caught: "आपने क्या पकड़ा",
  missed: "क्या छूट गया",
  tips: "सुझाव",
  playAgain: "फिर खेलें",
  anotherScenario: "दूसरी स्थिति आज़माएँ",
  thinking: "लिख रहा है…",
  scenarioKyc: "नकली बैंक KYC कॉल",
  scenarioKycDesc: "कॉलर कहता है आज आपका खाता बंद हो जाएगा।",
  scenarioJob: "नकली नौकरी का प्रस्ताव",
  scenarioJobDesc: "घर से आसान काम, पर पहले छोटी फीस।",
  scenarioArrest: "डिजिटल अरेस्ट कॉल",
  scenarioArrestDesc: "कोई वीडियो कॉल पर पुलिस होने का दावा करता है।",
  back: "वापस",
};

const mr: Dict = {
  brand: "ScamShield",
  tagline: "फसवणूक ओळखा. नकार द्यायला शिका.",
  languageLabel: "भाषा",
  tabCheck: "संदेश तपासा",
  tabTrain: "सराव करा",
  disclaimer:
    "ScamShield मार्गदर्शन देते, हमी नाही. नेहमी तुमच्या बँकेकडून किंवा अधिकृत स्रोताकडून खात्री करा. आम्ही तुमचे संदेश साठवत नाही.",

  checkTitle: "हा संदेश फसवणूक आहे का?",
  checkHelp: "संदेश खाली पेस्ट करा. काय धोकादायक वाटते ते सांगू.",
  messageLabel: "संदेशाचा मजकूर",
  messagePlaceholder: "इथे SMS, WhatsApp किंवा ईमेलचा मजकूर पेस्ट करा…",
  charCount: (n, max) => `${n} / ${max} अक्षरे`,
  screenshotLabel: "स्क्रीनशॉट (ऐच्छिक)",
  screenshotHint: "PNG किंवा JPG, कमाल 4 MB",
  removeImage: "प्रतिमा काढा",
  checkNow: "आता तपासा",
  checking: "तपासत आहे…",
  tryExample: "उदाहरण पहा",
  exampleKyc: "बँक KYC SMS",
  exampleJob: "नोकरीची ऑफर",
  exampleParcel: "पार्सल अडकले",
  riskLow: "कमी धोका",
  riskMedium: "मध्यम धोका",
  riskHigh: "जास्त धोका",
  redFlags: "धोक्याची चिन्हे",
  whatToDo: "आता काय करावे",
  reportIt: "तक्रार करा",
  reportHelpline: "1930 वर कॉल करा — राष्ट्रीय सायबर क्राइम हेल्पलाइन",
  reportPortal: "cybercrime.gov.in ला भेट द्या",
  errorTitle: "तपासणी होऊ शकली नाही",
  errorBody: "काहीतरी चुकले. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
  retry: "पुन्हा प्रयत्न करा",
  fileTooBig: "ही प्रतिमा 4 MB पेक्षा मोठी आहे.",
  fileWrongType: "कृपया PNG किंवा JPG प्रतिमा निवडा.",

  trainTitle: "खोट्या फसवणूक करणाऱ्यासोबत सराव",
  trainHelp: "एक परिस्थिती निवडा. खऱ्या आयुष्यासारखे उत्तर द्या. शेवटी गुण मिळतील.",
  difficulty: "अवघडपणा",
  easy: "सोपे",
  medium: "मध्यम",
  hard: "कठीण",
  startScenario: "सुरू करा",
  simulationBanner: "हा सराव आहे. AI फसवणूक करणाऱ्याचे नाटक करत आहे.",
  chatPlaceholder: "तुमचे उत्तर लिहा…",
  send: "पाठवा",
  endRound: "फेरी संपवा",
  turnsLeft: (n) => `${n} उत्तरे बाकी`,
  scoring: "तुमचे गुण मोजत आहोत…",
  resultsTitle: "तुमचा निकाल",
  caught: "तुम्ही काय ओळखले",
  missed: "काय सुटले",
  tips: "टिप्स",
  playAgain: "पुन्हा खेळा",
  anotherScenario: "दुसरी परिस्थिती",
  thinking: "लिहित आहे…",
  scenarioKyc: "खोटा बँक KYC कॉल",
  scenarioKycDesc: "कॉल करणारा म्हणतो आज खाते बंद होईल.",
  scenarioJob: "खोटी नोकरीची ऑफर",
  scenarioJobDesc: "घरून सोपे काम, पण आधी छोटी फी.",
  scenarioArrest: "डिजिटल अरेस्ट कॉल",
  scenarioArrestDesc: "कोणीतरी व्हिडिओ कॉलवर पोलिस असल्याचा दावा करतो.",
  back: "मागे",
};

export const dictionaries: Record<Lang, Dict> = { en, hi, mr };

export const EXAMPLES: Record<Lang, { kyc: string; job: string; parcel: string }> = {
  en: {
    kyc: "Dear Customer, your bank KYC has EXPIRED. Your account will be blocked within 24 hours. Update immediately at http://kyc-update-verify.in/sbi or call 90XXXXXX21. - Bank Security Team",
    job: "Hello! I am Priya from HR, Amazon India. We saw your profile. Work from home job, 3-4 hrs daily, salary Rs 25,000-40,000/month. Only registration fee Rs 1,850 for ID card. Send on this UPI to confirm your seat today.",
    parcel:
      "Your parcel (ID: IN884219) is HELD at customs due to incomplete address. Pay Rs 47 redelivery charge within 12 hours or the package will be returned: http://indiapost-redeliver.top/pay",
  },
  hi: {
    kyc: "प्रिय ग्राहक, आपका बैंक KYC समाप्त हो गया है। 24 घंटे में खाता बंद हो जाएगा। तुरंत अपडेट करें http://kyc-update-verify.in/sbi या 90XXXXXX21 पर कॉल करें। - बैंक सुरक्षा टीम",
    job: "नमस्ते! मैं प्रिया, HR Amazon India से। घर से काम, रोज़ 3-4 घंटे, वेतन 25,000-40,000 रु/माह। केवल रजिस्ट्रेशन फीस 1,850 रु ID कार्ड के लिए। आज ही इस UPI पर भेजें।",
    parcel:
      "आपका पार्सल (ID: IN884219) अधूरे पते के कारण कस्टम में रुका है। 12 घंटे में 47 रु री-डिलीवरी शुल्क भरें वरना पैकेज वापस चला जाएगा: http://indiapost-redeliver.top/pay",
  },
  mr: {
    kyc: "प्रिय ग्राहक, तुमचे बँक KYC संपले आहे. 24 तासांत खाते बंद होईल. लगेच अपडेट करा http://kyc-update-verify.in/sbi किंवा 90XXXXXX21 वर कॉल करा. - बँक सुरक्षा टीम",
    job: "नमस्कार! मी प्रिया, HR Amazon India. घरून काम, दररोज 3-4 तास, पगार 25,000-40,000 रु/महिना. फक्त नोंदणी फी 1,850 रु ओळखपत्रासाठी. आजच या UPI वर पाठवा.",
    parcel:
      "तुमचे पार्सल (ID: IN884219) अपूर्ण पत्त्यामुळे कस्टममध्ये अडकले आहे. 12 तासांत 47 रु शुल्क भरा अन्यथा पॅकेज परत जाईल: http://indiapost-redeliver.top/pay",
  },
};

export const MAX_TEXT = 2000;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_HISTORY = 20;
export const MAX_USER_TURNS = 6;
