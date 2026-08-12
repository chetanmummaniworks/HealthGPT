const mr = {
  translation: {
    app: {
      name: "HealthGPT",
      subtitle: "AI आरोग्य सहाय्यक",
    },
    history: {
  title: "आरोग्य इतिहास",

  description:
    "तुमच्या पूर्वी विश्लेषित केलेल्या वैद्यकीय अहवालांचे आणि प्रयोगशाळेतील निकालांचे पुनरावलोकन करा.",

  loading:
    "तुमचा आरोग्य इतिहास लोड होत आहे...",

  errors: {
    load:
      "तुमचा आरोग्य इतिहास लोड करता आला नाही. कृपया पुन्हा प्रयत्न करा.",
  },

  empty: {
    title:
      "अद्याप कोणतेही वैद्यकीय अहवाल नाहीत",

    description:
      "तुमचा आरोग्य इतिहास तयार करण्यासाठी वैद्यकीय अहवालाचे विश्लेषण करा.",
  },

  result: "निकाल",
  results: "निकाल",

  reference: "संदर्भ",

  viewExplanation:
    "AI स्पष्टीकरण पहा",

  hideExplanation:
    "AI स्पष्टीकरण लपवा",

  reportNames: {
    medical_report:
      "वैद्यकीय अहवाल",
  },

  values: {
    negative: "नकारात्मक",
    positive: "सकारात्मक",
    normal: "सामान्य",
    abnormal: "असामान्य",
    detected: "आढळले",
    not_detected:
      "आढळले नाही",
  },

  tests: {
    urinary_ph: "मूत्र pH",
    urinary_specific_gravity:
      "मूत्राचे विशिष्ट गुरुत्व",
    urinary_protein:
      "मूत्र प्रथिने",
    urinary_glucose:
      "मूत्र ग्लुकोज",
    urinary_ketones:
      "मूत्र कीटोन्स",
    urobilinogen:
      "युरोबिलिनोजेन",
    urine_bilirubin:
      "मूत्र बिलीरुबिन",
    urinary_nitrites:
      "मूत्र नायट्राइट्स",
    blood_in_urine:
      "मूत्रातील रक्त",
    leukocyte_esterase:
      "ल्युकोसाइट एस्टरेज",
    pus_cells:
      "पू पेशी",
    hyaline_casts:
      "हायलिन कास्ट",
    yeast_cells:
      "यीस्ट पेशी",

    hemoglobin:
      "हिमोग्लोबिन",
    wbc:
      "पांढऱ्या रक्तपेशी",
    white_blood_cells:
      "पांढऱ्या रक्तपेशी",
    rbc:
      "लाल रक्तपेशी",
    red_blood_cells:
      "लाल रक्तपेशी",
    platelets:
      "प्लेटलेट्स",
    glucose:
      "ग्लुकोज",
    cholesterol:
      "कोलेस्ट्रॉल",
    triglycerides:
      "ट्रायग्लिसराइड्स",
    hdl:
      "HDL कोलेस्ट्रॉल",
    ldl:
      "LDL कोलेस्ट्रॉल",
    creatinine:
      "क्रिएटिनिन",
    urea:
      "युरिया",
    uric_acid:
      "युरिक अॅसिड",
    bilirubin:
      "बिलीरुबिन",
    albumin:
      "अल्ब्युमिन",
    total_protein:
      "एकूण प्रथिने",
    sodium:
      "सोडियम",
    potassium:
      "पोटॅशियम",
    calcium:
      "कॅल्शियम",
    tsh: "TSH",
    t3: "T3",
    t4: "T4",
  },

  trends: {
    title:
      "प्रयोगशाळेतील निकालांचे कल",

    description:
      "तुम्ही अपलोड केलेल्या अहवालांमधील प्रयोगशाळेतील नोंदवलेल्या निकालांमधील बदल पहा.",

    noTrends:
      "कल दाखवण्यासाठी समान प्रयोगशाळा चाचणी असलेले आणखी अहवाल आवश्यक आहेत.",

    measurements:
      "{{count}} मोजमाप",

    disclaimer:
      "हा चार्ट तुम्ही अपलोड केलेल्या प्रयोगशाळेतील अहवालांमध्ये नोंदवलेले निकाल दाखवतो. हे वैद्यकीय निदान प्रदान करत नाही.",
  },
},
    register: {
      subtitle: "तुमचे खाते तयार करा",
      fullName: "पूर्ण नाव",
      email: "ईमेल",
      password: "पासवर्ड",
      passwordHint: "किमान 8 अक्षरे",
      preferredLanguage: "पसंतीची भाषा",
      languageDescription:
        "HealthGPT ने वापरावी अशी भाषा निवडा.",
      creating: "खाते तयार होत आहे...",
      createAccount: "खाते तयार करा",
      alreadyHaveAccount:
        "आधीपासून खाते आहे?",
      signIn: "साइन इन करा",
    },

    navigation: {
      dashboard: "डॅशबोर्ड",
      symptomChecker: "लक्षण तपासणी",
      medicalReports: "वैद्यकीय अहवाल",
      aiChat: "AI आरोग्य चॅट",
      findDoctors: "डॉक्टर शोधा",
      settings: "सेटिंग्ज",
      logout: "लॉग आउट",
      healthHistory: "आरोग्य इतिहास",
    },

    dashboard: {
      greeting: {
  morning: "शुभ सकाळ, {{name}} 👋",
  afternoon: "शुभ दुपार, {{name}} 👋",
  evening: "शुभ संध्याकाळ, {{name}} 👋",
  night: "शुभ रात्री, {{name}} 👋",
},
      question:
        "आज HealthGPT तुम्हाला कशी मदत करू शकते?",

      symptomChecker: {
        title: "लक्षण तपासणी",
        description:
          "तुमची लक्षणे तपासा आणि संभाव्य परिस्थितींबद्दल जाणून घ्या.",
        button: "लक्षणे तपासा",
      },

      reports: {
        title: "वैद्यकीय अहवाल",
        description:
          "तुमचा प्रयोगशाळा अहवाल अपलोड करा आणि सोप्या भाषेत त्याचे स्पष्टीकरण मिळवा.",
        button: "अहवालाचे विश्लेषण करा",
      },

      chat: {
        title: "AI आरोग्य चॅट",
        description:
          "सामान्य आरोग्य आणि वैद्यकीय विषयांबद्दल HealthGPT ला विचारा.",
        button: "चॅट उघडा",
      },

      doctors: {
        title: "डॉक्टर शोधा",
        description:
          "जवळील रुग्णालये, क्लिनिक आणि आरोग्य सेवा प्रदाते शोधा.",
        button: "जवळील शोधा",
      },

      disclaimer: {
        title: "महत्त्वाचे:",
        text:
          "HealthGPT शैक्षणिक माहिती आणि AI सहाय्य प्रदान करते. हे व्यावसायिक वैद्यकीय सल्ला, निदान किंवा उपचाराचा पर्याय नाही.",
      },
    },

    settings: {
      title: "सेटिंग्ज",
      description:
        "तुमच्या HealthGPT प्राधान्यांचे व्यवस्थापन करा.",

      profile: "प्रोफाइल",
      fullName: "पूर्ण नाव",
      email: "ईमेल",

      language: "भाषा",
      languageDescription:
        "HealthGPT ने वापरावी अशी भाषा निवडा.",
      preferredLanguage:
        "पसंतीची भाषा",

      save: "प्राधान्ये जतन करा",
      saving: "जतन करत आहे...",
      saved:
        "भाषेचे प्राधान्य यशस्वीरित्या जतन केले.",
      error:
        "भाषेचे प्राधान्य जतन करता आले नाही.",
    },

    common: {
      english: "इंग्रजी",
      hindi: "हिंदी",
      telugu: "तेलुगू",
      tamil: "तमिळ",
      bengali: "बंगाली",
      marathi: "मराठी",
      kannada: "कन्नड",
      malayalam: "मल्याळम",
      gujarati: "गुजराती",
    },

    login: {
      subtitle: "तुमच्या खात्यात साइन इन करा",
      email: "ईमेल",
      password: "पासवर्ड",
      invalidCredentials:
        "चुकीचा ईमेल किंवा पासवर्ड",
      signingIn: "साइन इन होत आहे...",
      signIn: "साइन इन",
      or: "किंवा",
      googleFailed:
        "Google साइन-इन अयशस्वी झाले. पुन्हा प्रयत्न करा.",
      noAccount:
        "खाते नाही?",
      register: "नोंदणी करा",
    },

    symptomChecker: {
      title: "लक्षण तपासणी",

      description:
        "तुम्हाला जाणवत असलेली लक्षणे निवडा आणि मॉडेलच्या आधारे संभाव्य परिस्थिती मिळवा.",

      searchPlaceholder:
        "लक्षणे शोधा...",

      loading:
        "लक्षणे लोड होत आहेत...",

      selectedTitle:
        "निवडलेली लक्षणे",

      selectedCount:
        "{{count}} निवडले",

      noSymptoms:
        "अद्याप कोणतीही लक्षणे निवडलेली नाहीत.",

      removeSymptom:
        "लक्षण काढा",

      analyzing:
        "विश्लेषण होत आहे...",

      analyze:
        "लक्षणांचे विश्लेषण करा",

      errors: {
        loadSymptoms:
          "लक्षणे लोड करता आली नाहीत. पुन्हा प्रयत्न करा.",

        noSymptoms:
          "किमान एक लक्षण निवडा.",

        prediction:
          "अंदाज तयार करता आला नाही.",
      },

      results: {
        title:
          "मॉडेलचे परिणाम",

        description:
          "हे परिणाम ML मॉडेलने तयार केलेल्या संभाव्य परिस्थिती आहेत.",

        caution:
          "निवडलेली लक्षणे अनेक परिस्थितींशी संबंधित असू शकतात. या परिणामांना वैद्यकीय निदान समजू नका.",

        modelAssessment:
          "मॉडेल मूल्यांकन: {{level}}",

        aiExplanation:
          "AI स्पष्टीकरण",

        askChat:
          "💬 या परिणामांबद्दल HealthGPT ला विचारा",

        important:
          "महत्त्वाचे",

        aiDisclaimer:
          "तुम्ही निवडलेल्या लक्षणांच्या आधारे AI मॉडेलने हे परिणाम तयार केले आहेत. ही संभाव्य परिस्थिती आहेत, वैद्यकीय निदान नाही.",

        medicalCare:
          "तुमची लक्षणे गंभीर, अचानक, वाढत जाणारी किंवा चिंताजनक असल्यास वैद्यकीय मदत घ्या.",
      },

      confidence: {
        high: "उच्च",
        moderate: "मध्यम",
        low: "कमी",
      },
    },

    doctors: {
      title:
        "तुमच्या जवळील आरोग्य सेवा शोधा",

      description:
        "जवळील रुग्णालये, क्लिनिक आणि आरोग्य सेवा प्रदाते शोधा.",

      currentLocation: {
        title:
          "तुमचे सध्याचे स्थान वापरा",

        description:
          "तुमच्या जवळील आरोग्य सेवा प्रदाते शोधण्यासाठी स्थानाची परवानगी द्या.",

        button:
          "📍 माझे सध्याचे स्थान वापरा",

        loading:
          "स्थान मिळवत आहे...",

        searching:
          "आरोग्य सेवा शोधत आहे...",

        detected:
          "📍 स्थान शोधले गेले",

        current:
          "तुमचे सध्याचे स्थान",
      },

      search: {
        title:
          "दुसरे स्थान शोधा",

        description:
          "तुमचे स्थान शेअर करायचे नाही? त्याऐवजी शहर, परिसर किंवा भाग शोधा.",

        placeholder:
          "उदा. Varanasi, Uttar Pradesh",

        button: "शोधा",

        searching:
          "शोधत आहे...",

        empty:
          "शोधण्यासाठी स्थान प्रविष्ट करा.",
      },

      results: {
        map:
          "आरोग्य सेवा नकाशा",

        title:
          "जवळील आरोग्य सेवा",

        facility:
          "आरोग्य सेवा केंद्र",

        facilities:
          "आरोग्य सेवा केंद्रे",

        foundSuffix:
          "या स्थानाजवळ आढळली.",

        away:
          "अंतरावर",

        viewMap:
          "🗺️ नकाशावर पहा",

        directions:
          "🧭 दिशानिर्देश",

        noResults:
          "आरोग्य सेवा केंद्रे आढळली नाहीत",

        noResultsDescription:
          "जवळच्या शोध क्षेत्रात कोणतेही आरोग्य सेवा केंद्र सापडले नाही.",
      },

      errors: {
        unsupportedLocation:
          "तुमच्या ब्राउझरमध्ये स्थान सेवा समर्थित नाहीत.",

        permissionDenied:
          "स्थानाची परवानगी नाकारली गेली. त्याऐवजी तुम्ही शहर किंवा परिसर शोधू शकता.",

        timeout:
          "स्थान विनंतीची वेळ संपली. पुन्हा प्रयत्न करा.",

        unableToDetermine:
          "तुमचे स्थान निश्चित करता आले नाही. पुन्हा प्रयत्न करा.",

        nearby:
          "जवळील आरोग्य सेवा प्रदाते शोधता आले नाहीत. पुन्हा प्रयत्न करा.",

        locationSearch:
          "हे स्थान सापडले नाही. शहर, परिसर किंवा भागाचे नाव वापरून पहा.",
      },

      searchingNearby: {
        title:
          "आरोग्य सेवा प्रदाते शोधत आहे...",

        description:
          "जवळील रुग्णालये आणि क्लिनिक शोधत आहे.",
      },

      attribution:
        "आरोग्य सेवा स्थानाची माहिती OpenStreetMap योगदानकर्त्यांच्या डेटावर आधारित आहे.",
    },

    reports: {
      title:
        "वैद्यकीय अहवालाचे विश्लेषण",

      description:
        "तुमचा प्रयोगशाळा अहवाल अपलोड करा आणि त्यातील निकाल समजून घ्या.",

      upload: {
        title:
          "अहवाल अपलोड करा",

        supportedFormats:
          "समर्थित स्वरूप: JPG, JPEG आणि PNG.",

        preview:
          "अहवाल पूर्वावलोकन",

        imageAlt:
          "अपलोड केलेला वैद्यकीय अहवाल",

        button:
          "अहवाल अपलोड करा",

        extracting:
          "अहवालातील माहिती काढत आहे...",
      },

      errors: {
        noFile:
          "कृपया अहवालाची प्रतिमा निवडा.",

        ocr:
          "अहवालावर प्रक्रिया करता आली नाही. प्रतिमा स्पष्ट असल्याची खात्री करून पुन्हा प्रयत्न करा.",

        noValues:
          "अहवालातून कोणतेही निकाल मिळाले नाहीत.",

        analysis:
          "अहवालाचे विश्लेषण करता आले नाही. पुन्हा प्रयत्न करा.",
      },

      ocr: {
        processing:
          "अहवालावर प्रक्रिया होत आहे...",

        description:
          "OCR अपलोड केलेल्या प्रतिमेतून प्रयोगशाळेची माहिती काढत आहे.",
      },

      results: {
        title:
          "मिळालेले निकाल",

        detected:
          "अहवालातून {{count}} प्रयोगशाळेचे निकाल आढळले.",

        result:
          "निकाल",

        referenceRange:
          "संदर्भ श्रेणी",

        notDetected:
          "आढळले नाही",
      },

      analysis: {
        button:
          "अहवालाचे विश्लेषण करा",

        analyzing:
          "अहवालाचे विश्लेषण होत आहे...",

        title:
          "AI अहवाल विश्लेषण",

        loading:
          "Gemini प्रयोगशाळेच्या निकालांचे विश्लेषण करत आहे...",

        explanation:
          "AI अहवाल स्पष्टीकरण",
      },
    },

    chat: {
      title:
        "AI आरोग्य चॅट",

      subtitle:
        "सामान्य आरोग्य प्रश्न विचारा",

      empty: {
        title:
          "मी तुम्हाला कशी मदत करू शकतो?",

        description:
          "लक्षणे, वैद्यकीय संकल्पना, प्रयोगशाळेचे निकाल किंवा सामान्य आरोग्य माहितीबद्दल HealthGPT ला विचारा.",
      },

      thinking:
        "विचार करत आहे...",

      inputPlaceholder:
        "आरोग्याशी संबंधित प्रश्न विचारा...",

      send: "पाठवा",

      errors: {
        response:
          "उत्तर मिळू शकले नाही. पुन्हा प्रयत्न करा.",
      },

      disclaimer:
        "HealthGPT शैक्षणिक आरोग्य माहिती प्रदान करते आणि व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही.",
    },
  },
};

export default mr;