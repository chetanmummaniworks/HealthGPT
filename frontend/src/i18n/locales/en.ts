const en = {
  translation: {
    app: {
      name: "HealthGPT",
      subtitle: "AI Healthcare Assistant",
    },
    history: {
  title: "Health History",

  description:
    "Review your previously analyzed medical reports and laboratory results.",

  loading:
    "Loading your health history...",

  errors: {
    load:
      "Unable to load your health history. Please try again.",
  },

  empty: {
    title:
      "No medical reports yet",

    description:
      "Analyze a medical report to start building your health history.",
  },

  result: "result",
  results: "results",

  reference:
    "Reference",

  viewExplanation:
    "View AI Explanation",

  hideExplanation:
    "Hide AI Explanation",

  reportNames: {
    medical_report:
      "Medical Report",
  },

  values: {
    negative:
      "Negative",

    positive:
      "Positive",

    normal:
      "Normal",

    abnormal:
      "Abnormal",

    detected:
      "Detected",

    not_detected:
      "Not detected",
  },

  tests: {
    urinary_ph:
      "Urine pH",

    urinary_specific_gravity:
      "Urine Specific Gravity",

    urinary_protein:
      "Urine Protein",

    urinary_glucose:
      "Urine Glucose",

    urinary_ketones:
      "Urine Ketones",

    urobilinogen:
      "Urobilinogen",

    urine_bilirubin:
      "Urine Bilirubin",

    urinary_nitrites:
      "Urine Nitrites",

    blood_in_urine:
      "Blood in Urine",

    leukocyte_esterase:
      "Leukocyte Esterase",

    pus_cells:
      "Pus Cells",

    hyaline_casts:
      "Hyaline Casts",

    yeast_cells:
      "Yeast Cells",

    hemoglobin:
      "Hemoglobin",

    wbc:
      "White Blood Cells",

    white_blood_cells:
      "White Blood Cells",

    rbc:
      "Red Blood Cells",

    red_blood_cells:
      "Red Blood Cells",

    platelets:
      "Platelets",

    glucose:
      "Glucose",

    cholesterol:
      "Cholesterol",

    triglycerides:
      "Triglycerides",

    hdl:
      "HDL Cholesterol",

    ldl:
      "LDL Cholesterol",

    creatinine:
      "Creatinine",

    urea:
      "Urea",

    uric_acid:
      "Uric Acid",

    bilirubin:
      "Bilirubin",

    albumin:
      "Albumin",

    total_protein:
      "Total Protein",

    sodium:
      "Sodium",

    potassium:
      "Potassium",

    calcium:
      "Calcium",

    tsh:
      "TSH",

    t3:
      "T3",

    t4:
      "T4",
  },

  trends: {
    title:
      "Laboratory Trends",

    description:
      "View changes in reported laboratory values across your uploaded reports.",

    noTrends:
      "More reports with repeated laboratory tests are needed to display trends.",

    measurements:
      "{{count}} measurements",

    disclaimer:
      "This chart displays values reported in your uploaded laboratory reports. It does not provide a medical diagnosis.",
  },
},

    register: {
      subtitle: "Create your account",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      passwordHint: "At least 8 characters",
      preferredLanguage: "Preferred Language",
      languageDescription:
        "Choose the language HealthGPT should use.",
      creating: "Creating account...",
      createAccount: "Create account",
      alreadyHaveAccount:
        "Already have an account?",
      signIn: "Sign in",
    },

    navigation: {
      dashboard: "Dashboard",
      symptomChecker: "Symptom Checker",
      medicalReports: "Medical Reports",
      aiChat: "AI Health Chat",
      findDoctors: "Find Doctors",
      settings: "Settings",
      logout: "Logout",
      healthHistory: "Health History",
    },

    dashboard: {
      greeting: {
  morning: "Good morning, {{name}} 👋",
  afternoon: "Good afternoon, {{name}} 👋",
  evening: "Good evening, {{name}} 👋",
  night: "Good night, {{name}} 👋",
},
      question: "How can HealthGPT help you today?",

      symptomChecker: {
        title: "Symptom Checker",
        description:
          "Check your symptoms and explore possible candidate conditions.",
        button: "Check Symptoms",
      },

      reports: {
        title: "Medical Reports",
        description:
          "Upload a laboratory report and get an easy-to-understand explanation.",
        button: "Analyze Report",
      },

      chat: {
        title: "AI Health Chat",
        description:
          "Ask HealthGPT questions about general health and medical concepts.",
        button: "Open Chat",
      },

      doctors: {
        title: "Find Doctors",
        description:
          "Find nearby hospitals, clinics and healthcare providers.",
        button: "Find Nearby",
      },

      disclaimer: {
        title: "Important:",
        text:
          "HealthGPT provides educational information and AI-generated assistance. It does not replace professional medical advice, diagnosis, or treatment.",
      },
    },

    settings: {
      title: "Settings",
      description:
        "Manage your HealthGPT preferences.",

      profile: "Profile",
      fullName: "Full Name",
      email: "Email",

      language: "Language",
      languageDescription:
        "Choose the language HealthGPT should use.",
      preferredLanguage: "Preferred language",

      save: "Save Preferences",
      saving: "Saving...",
      saved:
        "Language preference saved successfully.",
      error:
        "Unable to save language preference.",
    },

    common: {
      english: "English",
      hindi: "Hindi",
      telugu: "Telugu",
      tamil: "Tamil",
      bengali: "Bengali",
      marathi: "Marathi",
      kannada: "Kannada",
      malayalam: "Malayalam",
      gujarati: "Gujarati",
    },

    login: {
      subtitle: "Sign in to your account",
      email: "Email",
      password: "Password",
      invalidCredentials:
        "Invalid email or password",
      signingIn: "Signing in...",
      signIn: "Sign in",
      or: "OR",
      googleFailed:
        "Google sign-in failed. Please try again.",
      noAccount:
        "Don't have an account?",
      register: "Register",
    },

    symptomChecker: {
      title: "Symptom Checker",

      description:
        "Select the symptoms you are experiencing to generate model-based candidate conditions.",

      searchPlaceholder:
        "Search symptoms...",

      loading: "Loading symptoms...",

      selectedTitle: "Selected Symptoms",

      selectedCount: "{{count}} selected",

      noSymptoms:
        "No symptoms selected yet.",

      removeSymptom: "Remove symptom",

      analyzing: "Analyzing...",

      analyze: "Analyze Symptoms",

      errors: {
        loadSymptoms:
          "Unable to load symptoms. Please try again.",

        noSymptoms:
          "Please select at least one symptom.",

        prediction:
          "Unable to generate prediction.",
      },

      results: {
        title: "Model Results",

        description:
          "These results are candidate conditions generated by the ML model.",

        caution:
          "The selected symptoms overlap with multiple conditions. These results should not be treated as a diagnosis.",

        modelAssessment:
          "Model assessment: {{level}}",

        aiExplanation:
          "AI Explanation",

        askChat:
          "💬 Ask HealthGPT about these results",

        important: "Important",

        aiDisclaimer:
          "These results are generated by an AI model based on the symptoms you selected. They are candidate conditions, not a medical diagnosis.",

        medicalCare:
          "If your symptoms are severe, sudden, worsening, or concerning, seek professional medical care.",
      },

      confidence: {
        high: "High",
        moderate: "Moderate",
        low: "Low",
      },
    },

    doctors: {
      title: "Find Healthcare Near You",

      description:
        "Find nearby hospitals, clinics and healthcare providers.",

      currentLocation: {
        title: "Use your current location",

        description:
          "Allow location access to find healthcare providers near you.",

        button:
          "📍 Use My Current Location",

        loading:
          "Getting location...",

        searching:
          "Finding healthcare...",

        detected:
          "📍 Location detected",

        current:
          "Your current location",
      },

      search: {
        title: "Search another location",

        description:
          "Don't want to share your location? Search for a city, neighborhood or area instead.",

        placeholder:
          "e.g. Varanasi, Uttar Pradesh",

        button: "Search",

        searching: "Searching...",

        empty:
          "Please enter a location to search.",
      },

      results: {
        map: "Healthcare Map",

        title: "Nearby Healthcare",

        facility: "facility",

        facilities: "facilities",

        foundSuffix:
          "found near this location.",

        away: "away",

        viewMap:
          "🗺️ View Map",

        directions:
          "🧭 Directions",

        noResults:
          "No healthcare facilities found",

        noResultsDescription:
          "We couldn't find healthcare facilities within the nearby search area.",
      },

      errors: {
        unsupportedLocation:
          "Location services are not supported by your browser.",

        permissionDenied:
          "Location permission was denied. You can search for a city or area instead.",

        timeout:
          "Location request timed out. Please try again.",

        unableToDetermine:
          "Unable to determine your location. Please try again.",

        nearby:
          "Unable to find nearby healthcare providers. Please try again.",

        locationSearch:
          "Unable to find that location. Try a city, neighborhood or area name.",
      },

      searchingNearby: {
        title:
          "Finding healthcare providers...",

        description:
          "Searching nearby hospitals and clinics.",
      },

      attribution:
        "Healthcare location data provided using OpenStreetMap contributors.",
    },

    reports: {
      title: "Medical Report Analysis",

      description:
        "Upload a laboratory report to extract and understand the reported results.",

      upload: {
        title: "Upload Report",

        supportedFormats:
          "Supported formats: JPG, JPEG and PNG.",

        preview: "Report Preview",

        imageAlt:
          "Uploaded medical report",

        button: "Upload Report",

        extracting:
          "Extracting Report...",
      },

      errors: {
        noFile:
          "Please select a report image.",

        ocr:
          "Unable to process the report. Please make sure the image is clear and try again.",

        noValues:
          "No extracted report values are available.",

        analysis:
          "Unable to analyze the report. Please try again.",
      },

      ocr: {
        processing:
          "Processing report...",

        description:
          "OCR is extracting laboratory information from the uploaded image.",
      },

      results: {
        title: "Extracted Results",

        detected:
          "{{count}} laboratory result{{count, plural, one {} other {s}}} detected from the report.",

        result: "Result",

        referenceRange:
          "Reference range",

        notDetected:
          "Not detected",
      },

      analysis: {
        button: "Analyze Report",

        analyzing:
          "Analyzing Report...",

        title:
          "AI Report Analysis",

        loading:
          "Gemini is analyzing the extracted laboratory results...",

        explanation:
          "AI Report Explanation",
      },
    },

    chat: {
      title: "AI Health Chat",

      subtitle:
        "Ask general health questions",

      empty: {
        title:
          "How can I help?",

        description:
          "Ask HealthGPT about symptoms, medical concepts, laboratory results, or general health information.",
      },

      thinking: "Thinking...",

      inputPlaceholder:
        "Ask a health question...",

      send: "Send",

      errors: {
        response:
          "Unable to get a response. Please try again.",
      },

      disclaimer:
        "HealthGPT provides educational information and does not replace professional medical advice.",
    },
  },
};

export default en;