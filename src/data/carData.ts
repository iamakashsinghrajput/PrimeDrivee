import { CarDetail } from '@/types';


import altoK10Img from '@/assets/images/edited/image_001.png';
import altoK10Back from '@/assets/images/edited/image_004.png';
import altoK10Left from '@/assets/images/edited/image_003.png';
import altoK10Right from '@/assets/images/edited/image_002.png';
import altoK10Int from '@/assets/images/edited/image_005.png';

import tharImg from '@/assets/images/edited/image_062.png';
import tharBack from '@/assets/images/edited/image_082.png';
import tharLeft from '@/assets/images/edited/image_061.png';
import tharRight from '@/assets/images/edited/image_060.png';
import tharInt from '@/assets/images/edited/image_059.png';


// be6 Placeholders
import be6Img from '@/assets/images/edited/image_007.png';
import be6Back from '@/assets/images/edited/image_006.png';
import be6Left from '@/assets/images/edited/image_083.png';
import be6Right from '@/assets/images/edited/image_009.png';
import be6Int from '@/assets/images/edited/image_008.png';

// Grand taisor Placeholders
import taisorImg from '@/assets/images/edited/image_063.png';
import taisorLeft from '@/assets/images/edited/image_066.png';
import taisorRight from '@/assets/images/edited/image_064.png';
import taisorInt from '@/assets/images/edited/image_065.png';
import taisorBack from '@/assets/images/edited/image_067.png';

// curvv Placeholders (e.g., Tata Curvv concept)
import curvvImg from '@/assets/images/edited/image_018.png';
import curvvBack from '@/assets/images/edited/image_017.png';
import curvvLeft from '@/assets/images/edited/image_016.png';
import curvvRight from '@/assets/images/edited/image_019.png';
import curvvInt from '@/assets/images/edited/image_015.png';

// Brezza Placeholders
import brezzaImg from '@/assets/images/edited/image_013.png';
import brezzaBack from '@/assets/images/edited/image_012.png';
import brezzaLeft from '@/assets/images/edited/image_011.png';
import brezzaRight from '@/assets/images/edited/image_014.png';
import brezzaInt from '@/assets/images/edited/image_010.png';

//dzire Placeholders
import dzireImg from '@/assets/images/edited/image_023.png';
import dzireBack from '@/assets/images/edited/image_022.png';
import dzireLeft from '@/assets/images/edited/image_021.png';
import dzireRight from '@/assets/images/edited/image_024.png';
import dzireInt from '@/assets/images/edited/image_020.png';

//nexon Placeholders
import nexonImg from '@/assets/images/edited/image_038.png';
import nexonBack from '@/assets/images/edited/image_037.png';
import nexonLeft from '@/assets/images/edited/image_036.png';
import nexonRight from '@/assets/images/edited/image_039.png';
import nexonInt from '@/assets/images/edited/image_035.png';

//scorpio Placeholder
import scorpioNImg from '@/assets/images/edited/image_048.png';
import scorpioNBack from '@/assets/images/edited/image_047.png';
import scorpioNLeft from '@/assets/images/edited/image_046.png';
import scorpioNRight from '@/assets/images/edited/image_045.png';
import scorpioNInt from '@/assets/images/edited/image_044.png';

//swift Placeholder
import swiftImg from '@/assets/images/edited/image_053.png';
import swiftBack from '@/assets/images/edited/image_052.png';
import swiftLeft from '@/assets/images/edited/image_051.png';
import swiftRight from '@/assets/images/edited/image_049.png';
import swiftInt from '@/assets/images/edited/image_050.png';

//syros Placeholder
import syrosImg from '@/assets/images/edited/image_058.png';
import syrosBack from '@/assets/images/edited/image_057.png';
import syrosLeft from '@/assets/images/edited/image_054.png';
import syrosRight from '@/assets/images/edited/image_055.png';
import syrosInt from '@/assets/images/edited/image_056.png';

//3xo Placeholder
import xuv3xoImg from '@/assets/images/edited/image_075.png';
import xuv3xoBack from '@/assets/images/edited/image_074.png';
import xuv3xoLeft from '@/assets/images/edited/image_073.png';
import xuv3xoRight from '@/assets/images/edited/image_076.png';
import xuv3xoInt from '@/assets/images/edited/image_072.png';

//xuv700 Placeholder
import xuv700Img from '@/assets/images/edited/image_077.png';
import xuv700Back from '@/assets/images/edited/image_081.png';
import xuv700Left from '@/assets/images/edited/image_080.png';
import xuv700Right from '@/assets/images/edited/image_078.png';
import xuv700Int from '@/assets/images/edited/image_079.png';

//kushaq Placeholder
import kushaqImg from '@/assets/images/edited/image_032.png';
import kushaqBack from '@/assets/images/edited/image_031.png';
import kushaqLeft from '@/assets/images/edited/image_030.png';
import kushaqRight from '@/assets/images/edited/image_034.png';
import kushaqfront from '@/assets/images/edited/image_033.png';

//Fronx Placeholder
import fronxImg from '@/assets/images/edited/image_028.png';
import fronxBack from '@/assets/images/edited/image_027.png';
import fronxLeft from '@/assets/images/edited/image_026.png';
import fronxRight from '@/assets/images/edited/image_029.png';
import fronxfront from '@/assets/images/edited/image_025.png';

//Scorpio Placeholder
import scorpioImg from '@/assets/images/edited/image_089.png';
import scorpioBack from '@/assets/images/edited/image_088.png';
import scorpioLeft from '@/assets/images/edited/image_087.png';
import scorpioRight from '@/assets/images/edited/image_085.png';
import scorpiofront from '@/assets/images/edited/image_086.png';

//Sonet Placeholder
import sonetImg from '@/assets/images/edited/image_090.png';
import sonetBack from '@/assets/images/edited/image_091.png';
import sonetLeft from '@/assets/images/edited/image_092.png';
import sonetRight from '@/assets/images/edited/image_093.png';
import sonetfront from '@/assets/images/edited/image_094.png';

//Venue Placeholder
import venueImg from '@/assets/images/edited/image_095.png';
import venueBack from '@/assets/images/edited/image_096.png';
import venueLeft from '@/assets/images/edited/image_097.png';
import venueRight from '@/assets/images/edited/image_098.png';
import venuefront from '@/assets/images/edited/image_099.png';

export const allCarsDetailData: CarDetail[] = [
    {
        id: 1, // Assign a new unique ID
        image: taisorImg,
        imageGallery: {
            front: taisorInt,
            left: taisorLeft,
            right: taisorRight,
            back: taisorBack,
        },
        model: 'Urban Cruiser Taisor',
        brand: 'Toyota',
        bodyType: 'SUV Coupe',
        transmission: 'Automatic',
        seats: 5,
        pricePerDay: 4250,
        engine: "1.0L Turbo Petrol",
        mileage: "20.01 kmpl (Turbo AT)",
        fuelType: 'Petrol',
        description: "Toyota's stylish SUV Coupe based on the Maruti Suzuki taisor. Offers a striking design, modern features, and a choice of efficient petrol engines, including a turbo option.",
        featuresList: [
            "9-inch Smart Playcast Touchscreen",
            "Wireless Apple CarPlay & Android Auto",
            "Automatic Climate Control",
            "Head-Up Display",
            "360 View Camera",
            "6 Airbags (Top variants)",
            "Vehicle Stability Control",
            "Connected Car Tech (Toyota i-Connect)",
        ]
    },
    {
        id: 2,
        image: tharImg,
        imageGallery: {
            front: tharInt,
            left: tharLeft,
            right: tharRight,
            back: tharBack,
        },
        model: 'Thar',
        brand: 'Mahindra',
        bodyType: 'Off-Road SUV',
        transmission: 'Manual',
        seats: 4,
        pricePerDay: 5500,
        engine: "2.2L mHawk Diesel",
        mileage: "15.2 kmpl (Diesel MT)",
        fuelType: 'Diesel',
        description: "The iconic Mahindra Thar is a lifestyle off-roader known for its legendary capability, rugged design, and go-anywhere attitude. Perfect for adventure seekers.",
        featuresList: [
            "4x4 Capability with Low Range Transfer Case",
            "Removable Roof Panels (Hard/Soft Top options)",
            "Touchscreen Infotainment System (7-inch)",
            "Adventure Statistics Display",
            "Washable Floor with Drain Plugs",
            "Dual Front Airbags",
            "ABS with EBD & Brake Assist",
            "Roll Cage",
        ]
    },
    {
        id: 3,
        image: altoK10Img,
        imageGallery: {
            front: altoK10Int,
            left: altoK10Left,
            right: altoK10Right,
            back: altoK10Back,
        },
        model: 'Alto K10',
        brand: 'Maruti Suzuki',
        bodyType: 'Hatchback',
        transmission: 'Automatic',
        seats: 5,
        pricePerDay: 150,
        engine: "1.0L K10C Petrol",
        mileage: "24.90 kmpl (AGS)",
        fuelType: 'Petrol',
        description: "India's favorite entry-level hatchback, the Alto K10 offers exceptional fuel efficiency, easy maneuverability, and low maintenance costs. Ideal for first-time buyers and city driving.",
        featuresList: [
            "SmartPlay Studio Touchscreen (7-inch)",
            "Apple CarPlay & Android Auto",
            "Steering Mounted Audio Controls",
            "Digital Speedometer",
            "Remote Keyless Entry",
            "Dual Front Airbags",
            "ABS with EBD",
            "Rear Parking Sensors",
        ]
    },
    {
        id: 4, // Assign a new unique ID
        image: brezzaImg,
        imageGallery: {
            front: brezzaInt,
            left: brezzaLeft,
            right: brezzaRight,
            back: brezzaBack,
        },
        model: 'Brezza',
        brand: 'Maruti Suzuki',
        bodyType: 'SUV',
        transmission: 'Automatic', // 6-speed AT variant
        seats: 5,
        pricePerDay: 5950, // Example price
        engine: "1.5L K-Series Petrol (Smart Hybrid)",
        mileage: "19.80 kmpl (AT)",
        fuelType: 'Petrol',
        description: "A stylish and feature-packed compact SUV from Maruti Suzuki. The Brezza boasts a bold look, spacious interiors, a refined petrol engine with mild-hybrid tech, and advanced safety features.",
        featuresList: [
            "Electric Sunroof",
            "SmartPlay Pro+ Infotainment (9-inch)",
            "Wireless Apple CarPlay & Android Auto",
            "Wireless Phone Charger",
            "Head-Up Display",
            "360 View Camera",
            "6 Airbags",
            "Electronic Stability Program (ESP)",
            "Paddle Shifters (AT)",
        ],
    },
     {
        id: 5, // Assign a new unique ID
        image: curvvImg, // Using the 'ev' placeholder import
        imageGallery: {
            front: curvvInt,
            left: curvvLeft,
            right: curvvRight,
            back: curvvBack,
        },
        model: 'Curvv EV', // Based on concept
        brand: 'Tata',
        bodyType: 'SUV Coupe',
        transmission: 'Automatic', // Single Speed EV
        seats: 5,
        pricePerDay: 5200, // Estimate for a new EV model
        engine: "Electric Motor (Specifics TBC)",
        mileage: "450-500 km/charge (Projected Range)",
        fuelType: 'Electric',
        description: "Tata's upcoming electric SUV Coupe, based on the striking Curvv concept. Expected to feature a futuristic design, long driving range, and Tata's latest Ziptron EV technology.",
        featuresList: [
            "Large Floating Touchscreen Display",
            "Full Digital Instrument Cluster",
            "Panoramic Glass Roof (Expected)",
            "Connected Car Features (iRA)",
            "Multi-Mode Regenerative Braking",
            "Advanced Driver Assistance Systems (ADAS) Features",
            "Premium Interior Materials",
            "Multiple Airbags & Advanced Safety",
        ],
    },
     {
        id: 6, // Assign a new unique ID
        image: be6Img,
        imageGallery: {
            front: be6Int,
            left: be6Left,
            right: be6Right,
            back: be6Back,
        },
        model: 'BE.06', // Based on concept
        brand: 'Mahindra',
        bodyType: 'SUV Coupe',
        transmission: 'Automatic', // Single Speed EV
        seats: 5,
        pricePerDay: 6000, // Estimate for premium EV
        engine: "Electric Motor (INGLO Platform - Specs TBC)",
        mileage: "400-450 km/charge (Projected Range)",
        fuelType: 'Electric',
        description: "Part of Mahindra's 'Born Electric' vision, the BE.06 is a concept for a premium electric SUV Coupe built on the advanced INGLO platform. It showcases Mahindra's future design language and electric vehicle technology.",
        featuresList: [
            "Edge-to-Edge Screen Layout (Concept)",
            "Augmented Reality Head-Up Display (Concept)",
            "Over-the-Air (OTA) Updates",
            "Level 2+ Autonomous Driving Features (Expected)",
            "Sustainable Interior Materials",
            "Vehicle-to-Load (V2L) Capability (Possible)",
            "Fast Charging Support",
            "Advanced Safety Suite",
        ],
    },

    {
        id: 7,
        image: dzireImg,
        imageGallery: {
            front: dzireInt,
            left: dzireLeft,
            right: dzireRight,
            back: dzireBack,
        },
        model: 'Dzire',
        brand: 'Maruti Suzuki',
        bodyType: 'Sedan', // Compact Sedan
        transmission: 'Automatic', // AGS/AMT variant (Manual also exists)
        seats: 5,
        pricePerDay: 3250, // Example rental price (adjust as needed)
        engine: "1.2L K12N DualJet Petrol",
        mileage: "22.61 kmpl (AGS)", // Official mileage for AGS variant
        fuelType: 'Petrol', // Also available in CNG
        description: "The Maruti Suzuki Dzire is India's best-selling compact sedan, renowned for its exceptional fuel efficiency, comfortable ride, spacious cabin, and reliable performance. Its elegant design and practical features make it a popular choice for families and city driving.",
        featuresList: [
            "SmartPlay Studio Touchscreen Infotainment (7-inch)",
            "Apple CarPlay & Android Auto",
            "Automatic Climate Control",
            "Cruise Control (Top variants)",
            "Push Start/Stop Button",
            "Rear AC Vents",
            "Electrically Adjustable & Foldable ORVMs",
            "Dual Front Airbags",
            "ABS with EBD & Brake Assist",
            "ISOFIX Child Seat Anchorages",
            "Rear Parking Sensors",
            "ESP with Hill Hold (AGS variants)",
        ]
    },

    {
        id: 8, // Assign a NEW unique ID
        image: nexonImg, // Main image
        imageGallery: { // Gallery images
            front: nexonInt,
            left: nexonLeft,
            right: nexonRight,
            back: nexonBack,
        },
        model: 'Nexon',
        brand: 'Tata',
        bodyType: 'SUV', // Compact SUV
        transmission: 'Automatic', // Example: AMT or DCT variant (Manual also exists)
        seats: 5,
        pricePerDay: 4800, // Example rental price (adjust as needed)
        engine: "1.2L Revotron Petrol", // Common petrol option (Diesel also available)
        mileage: "17.05 kmpl (Petrol AMT)", // Example mileage for a specific variant
        fuelType: 'Petrol', // Also available in Diesel and EV
        description: "The Tata Nexon is a popular and safe compact SUV known for its bold design, 5-star Global NCAP safety rating, feature-rich cabin, and multiple powertrain options including petrol, diesel, and electric. It offers a comfortable ride and good ground clearance.",
        featuresList: [
            "Floating Touchscreen Infotainment (Often 7-inch or 10.25-inch)",
            "Apple CarPlay & Android Auto (Wired/Wireless)",
            "Digital Instrument Cluster",
            "Ventilated Front Seats (Higher variants)",
            "Electric Sunroof",
            "Automatic Climate Control",
            "Connected Car Tech (iRA)",
            "Multiple Airbags (Standard 2, up to 6)",
            "ABS with EBD",
            "Electronic Stability Program (ESP)",
            "Rear Parking Camera & Sensors",
            "Wireless Charger (Higher variants)",
            "JBL Sound System (Higher variants)",
        ]
    },

    {
        id: 9, // Assign a new unique ID
        image: scorpioNImg,
        imageGallery: {
            front: scorpioNInt,
            left: scorpioNLeft,
            right: scorpioNRight,
            back: scorpioNBack,
        },
        model: 'Scorpio-N',
        brand: 'Mahindra',
        bodyType: 'SUV', // Full-size SUV
        transmission: 'Automatic', // Both MT and AT are available.
        seats: 7, // Or 6 in some top-end trims
        pricePerDay: 6800, // Example rental price (adjust)
        engine: "2.2L mHawk Diesel", // Commonly used diesel engine (also 2.0L Petrol)
        mileage: "14.2 kmpl (Diesel AT)", // Approximate, can vary
        fuelType: 'Diesel', // Petrol option also available
        description: "The Mahindra Scorpio-N is a modern and powerful full-size SUV that builds upon the legacy of the Scorpio brand. It offers a commanding presence, comfortable interiors, robust engine options, and a wide array of features.",
        featuresList: [
            "8-inch Touchscreen Infotainment",
            "AdrenoX Connected Car Technology",
            "Dual Zone Automatic Climate Control",
            "Sony Premium Sound System (Higher variants)",
            "Electric Sunroof",
            "Wireless Android Auto & Apple CarPlay",
            "6 Airbags",
            "Electronic Stability Control (ESP)",
            "Hill Hold Control & Hill Descent Control",
            "Front & Rear Parking Sensors",
            "4x4 Capability (Selectable Trims)",
            "Push Button Start/Stop",
        ],
    },

    {
        id: 10, // Assign a NEW unique ID
        image: swiftImg, // Main display image
        imageGallery: { // Gallery images (Front, Back, Left, Right ONLY)
            front: swiftInt, // Can use main image if it's the front view
            back: swiftBack,
            left: swiftLeft,
            right: swiftRight,
        },
        model: 'Swift',
        brand: 'Maruti Suzuki',
        bodyType: 'Hatchback',
        transmission: 'Automatic', // AGS variant (Manual also exists)
        seats: 5,
        pricePerDay: 2950, // Example rental price (adjust as needed)
        engine: "1.2L K12N DualJet Petrol", // Same engine as Dzire often
        mileage: "22.56 kmpl (AGS)", // Official ARAI mileage for AGS variant
        fuelType: 'Petrol', // Also available in CNG
        description: "The Maruti Suzuki Swift is a sporty and popular hatchback known for its peppy performance, agile handling, and stylish design. It's a fun-to-drive car ideal for city commutes and occasional highway trips, offering a good balance of efficiency and features.",
        featuresList: [
            "SmartPlay Studio Touchscreen (7-inch)",
            "Apple CarPlay & Android Auto",
            "Automatic Climate Control",
            "Cruise Control (Higher variants)",
            "Push Start/Stop Button",
            "Steering Mounted Controls",
            "Electrically Adjustable ORVMs",
            "Dual Front Airbags",
            "ABS with EBD & Brake Assist",
            "ESP with Hill Hold (AGS variants)",
            "Rear Parking Sensors & Camera (Higher variants)",
            "LED Projector Headlamps (Higher variants)",
        ]
    },

    {
        id: 11, // Assign a NEW unique ID
        image: syrosImg, // Main display image (Placeholder/Concept)
        imageGallery: { // Gallery images (Placeholders/Concept)
            front: syrosInt,
            back: syrosBack,
            left: syrosLeft,
            right: syrosRight,
            // No interior defined yet
        },
        model: 'Syros', // Clearly label as speculative
        brand: 'Kia',
        bodyType: 'Compact SUV', // Often described as Micro SUV / Punch Rival
        transmission: 'Automatic', // Expected AMT/iMT/Manual options. Defaulting to Auto.
        seats: 5,
        pricePerDay: 3500, // Purely speculative rental price estimate
        engine: "1.2L Kappa Petrol (Expected)", // Common engine in this segment for Kia/Hyundai
        mileage: "19-21 kmpl (Projected)", // Estimated mileage
        fuelType: 'Petrol', // EV version might come later
        description: "[SPECULATIVE] The upcoming Kia syros (rumored codename Syros/AY) is expected to be a compact SUV positioned below the Sonet. It aims to offer a blend of rugged styling, practical features, and Kia's modern technology in a smaller footprint.",
        featuresList: [
            "Touchscreen Infotainment System (Size TBD)",
            "Apple CarPlay & Android Auto",
            "Automatic Climate Control (Likely higher trims)",
            "Multiple Airbags (Potentially up to 6)",
            "ABS with EBD",
            "Rear Parking Sensors/Camera",
            "Connected Car Features (Possible)",
            "Sunroof (Possible on higher trims)",
            "LED DRLs",
        ]
    },

    {
        id: 12, // Assign a NEW unique ID
        image: xuv3xoImg, // Main display image
        imageGallery: { // Gallery images (Front, Back, Left, Right ONLY)
            front: xuv3xoInt,
            back: xuv3xoBack,
            left: xuv3xoLeft,
            right: xuv3xoRight,
            // No interior key here
        },
        model: 'XUV 3XO',
        brand: 'Mahindra',
        bodyType: 'SUV', // Compact SUV
        transmission: 'Automatic', // Example: 6-speed AT (AMT & MT also available)
        seats: 5,
        pricePerDay: 4950, // Example rental price (adjust as needed)
        engine: "1.2L mStallion TGDi Petrol", // Turbo-petrol option (Diesel & lower Petrol also available)
        mileage: "18.2 kmpl (TGDi AT)", // ARAI mileage for this specific variant
        fuelType: 'Petrol', // Diesel option also available
        description: "The Mahindra XUV 3XO (facelifted XUV300) is a feature-loaded compact SUV boasting a modern design, premium interiors with segment-first features like a panoramic sunroof, and powerful engine options. It continues to offer strong safety credentials.",
        featuresList: [
            "Dual-Pane Panoramic Sunroof (Segment First)",
            "Dual 10.25-inch Screens (Infotainment & Instrument Cluster)",
            "Wireless Apple CarPlay & Android Auto",
            "AdrenoX Connected Car Technology",
            "Dual-Zone Automatic Climate Control",
            "Harman Kardon Premium Audio System (Higher variants)",
            "Level 2 ADAS Features (Higher variants)",
            "360 Surround View Camera",
            "6 Airbags (Standard across variants)",
            "Electronic Stability Control (ESC)",
            "All Wheel Disc Brakes",
            "Wireless Charger",
        ]
    },

    {
        id: 13, // Assign a NEW unique ID
        image: xuv700Img, // Main display image
        imageGallery: { // Gallery images (Front, Back, Left, Right ONLY)
            front: xuv700Int,
            back: xuv700Back,
            left: xuv700Left,
            right: xuv700Right,
            // No interior key here
        },
        model: 'XUV700',
        brand: 'Mahindra',
        bodyType: 'SUV', // Mid-size SUV
        transmission: 'Automatic', // Example: 6-speed AT (MT also available)
        seats: 7, // Commonly 7-seater, 5-seater options exist for lower trims
        pricePerDay: 7500, // Example rental price (adjust as needed)
        engine: "2.0L mStallion Turbo-Petrol", // Powerful petrol option (Diesel also popular)
        mileage: "13 kmpl (Petrol AT)", // Approximate ARAI mileage, varies
        fuelType: 'Petrol', // Diesel option also available
        description: "The Mahindra XUV700 is a technologically advanced and feature-rich mid-size SUV that has set benchmarks in its segment. Known for its powerful engines, sophisticated design, premium interiors, and advanced safety features including ADAS.",
        featuresList: [
            "Dual HD Superscreen (10.25-inch Infotainment + 10.25-inch Digital Cluster)",
            "AdrenoX Connected Car Technology with Alexa Built-in",
            "Advanced Driver Assistance Systems (ADAS) - Level 1/2",
            "Panoramic Sunroof ('Skyroof')",
            "Flush-fitting Door Handles",
            "Sony 3D Sound System (12 Speakers)",
            "Dual-Zone Automatic Climate Control",
            "Wireless Charging",
            "6 or 7 Airbags (Depending on variant)",
            "Electronic Stability Program (ESP)",
            "360 Surround View Monitor",
            "Driver Drowsiness Detection",
            "All Wheel Drive (AWD) Option (Diesel)",
        ]
    },

    {
        id: 14, // Assign a NEW unique ID (Incremented from the example)
        image: kushaqImg, // Main display image placeholder
        imageGallery: { // Gallery images (Front, Back, Left, Right ONLY)
            front: kushaqfront,
            back: kushaqBack,
            left: kushaqLeft,
            right: kushaqRight,
            // No interior key here
        },
        model: 'Kushaq',
        brand: 'Skoda',
        bodyType: 'Compact SUV', // Specifically a Compact SUV
        transmission: 'Automatic', // Example: 6-speed AT / 7-speed DSG available (MT also available)
        seats: 5, // Strictly a 5-seater
        pricePerDay: 5500, // Example rental price (adjust as needed, likely lower than XUV700)
        engine: "1.0L TSI Petrol", // Common petrol option (1.5L TSI also available)
        mileage: "17.88 kmpl (1.0 TSI AT)", // Approximate ARAI mileage, varies (1.5 TSI DSG ~17.71 kmpl)
        fuelType: 'Petrol', // Only petrol options available
        description: "The Skoda Kushaq is a stylish and robust compact SUV built on the MQB-A0-IN platform, specifically designed for India. It's known for its solid build quality, European driving dynamics, choice of efficient TSI petrol engines (1.0L & 1.5L), and a strong focus on safety features.",
        featuresList: [
            "10-inch Touchscreen Infotainment System (Higher variants)",
            "MyŠKODA Connect (Connected Car Tech)",
            "Automatic Climate Control (Climatronic)",
            "Ventilated Front Seats (Higher variants)",
            "Electric Sunroof",
            "Wireless Charging",
            "Up to 6 Airbags",
            "Electronic Stability Control (ESC) - Standard",
            "Multi-Collision Braking (MKB)",
            "Tyre Pressure Monitoring System (TPMS)",
            "Cruise Control",
            "LED Headlamps with DRLs",
            "Ambient Lighting",
        ]
    },

    {
        id: 15, // Assigning a new unique ID
        image: fronxImg, // Replace with your actual Fronx image variable
        imageGallery: {
            front: fronxfront,   // Replace with your actual Fronx front image variable
            left: fronxLeft,    // Replace with your actual Fronx left image variable
            right: fronxRight,   // Replace with your actual Fronx right image variable
            back: fronxBack,     // Replace with your actual Fronx back image variable
        },
        model: 'Fronx',
        brand: 'Maruti Suzuki',
        bodyType: 'SUV Coupe', // Shares the same body style description
        transmission: 'Automatic', // Available in AGS (AMT) and 6-Speed AT
        seats: 5,
        pricePerDay: 4000, // Example price, adjust as needed (often slightly less than Toyota equivalent)
        engine: "1.0L Turbo Petrol (Boosterjet)", // Also available with 1.2L NA Petrol
        mileage: "20.01 kmpl (Turbo AT)", // ARAI figure for the 1.0L Turbo AT variant
        fuelType: 'Petrol',
        description: "Maruti Suzuki's sporty SUV Coupe, blending sharp design with modern features and practicality. Available with efficient petrol engines, including the powerful Boosterjet turbo.",
        featuresList: [
            "9-inch SmartPlay Pro+ Touchscreen", // Maruti's infotainment system name
            "Wireless Apple CarPlay & Android Auto",
            "Automatic Climate Control",
            "Head-Up Display",
            "360 View Camera",
            "6 Airbags (Top variants)",
            "Electronic Stability Program (ESP)", // Maruti's term for VSC
            "Connected Car Tech (Suzuki Connect)", // Maruti's connected tech name
        ]
    },

    {
        id: 16, // Assigning a new unique ID
        image: scorpioImg, // Replace with your actual Scorpio Classic image variable
        imageGallery: {
            front: scorpiofront,   // Replace with your actual Scorpio Classic front image variable
            left: scorpioLeft,    // Replace with your actual Scorpio Classic left image variable
            right: scorpioRight,   // Replace with your actual Scorpio Classic right image variable
            back: scorpioBack,     // Replace with your actual Scorpio Classic back image variable
        },
        model: 'Scorpio Classic',
        brand: 'Mahindra',
        bodyType: 'SUV', // Traditional Body-on-frame SUV
        transmission: 'Manual', // Scorpio Classic primarily comes in Manual
        seats: 7, // Commonly available as a 7-seater (also 9-seater option exists)
        pricePerDay: 3500, // Example price, adjust as needed (typically less than modern compact SUVs)
        engine: "2.2L mHawk Diesel", // The specific engine used
        mileage: "15 kmpl", // Approximate ARAI certified mileage
        fuelType: 'Diesel',
        description: "The iconic Mahindra Scorpio Classic, a rugged and reliable body-on-frame SUV known for its commanding presence, tough build, and dependable mHawk diesel engine. Offers a traditional SUV experience with essential features.",
        featuresList: [
            "9-inch Touchscreen Infotainment (Higher variants)", // Newer models have this
            "Bluetooth & USB Connectivity",
            "Manual Air Conditioning",
            "Power Steering",
            "All 4 Power Windows",
            "Dual Front Airbags",
            "ABS (Anti-lock Braking System)",
            "Projector Headlamps",
            // Note: Features are generally more basic compared to Fronx/Taisor
        ]
    },

    {
        id: 17, // Assigning a new unique ID
        image: sonetImg, // Replace with your actual Sonet image variable
        imageGallery: {
            front: sonetfront,   // Replace with your actual Sonet front image variable
            left: sonetLeft,    // Replace with your actual Sonet left image variable
            right: sonetRight,   // Replace with your actual Sonet right image variable
            back: sonetBack,     // Replace with your actual Sonet back image variable
        },
        model: 'Sonet',
        brand: 'Kia',
        bodyType: 'Compact SUV', // Falls under the sub-4m compact SUV segment
        transmission: 'Automatic', // Available in iMT, DCT, and 6AT depending on engine
        seats: 5,
        pricePerDay: 4100, // Example price, adjust as needed (competitive with Fronx/Taisor)
        engine: "1.0L Turbo GDi Petrol", // Also available with 1.2L NA Petrol & 1.5L Diesel
        mileage: "18.3 kmpl (Turbo DCT)", // ARAI figure for the 1.0L Turbo DCT variant
        fuelType: 'Petrol',
        description: "Kia's feature-packed compact SUV, the Sonet boasts a bold design, premium interiors, and a wide array of engine-transmission options. Known for its segment-first features and connected technology.",
        featuresList: [
            "10.25-inch Touchscreen Infotainment", // Larger screen option
            "Wireless Apple CarPlay & Android Auto",
            "Automatic Climate Control",
            "Ventilated Front Seats", // Segment-first feature
            "Electric Sunroof",
            "Bose Premium Sound System", // Available on higher trims
            "6 Airbags (Standard on facelift)", // Updated safety standard
            "Electronic Stability Control (ESC)",
            "Connected Car Tech (Kia Connect)", // Kia's connected tech name
            "Front Parking Sensors", // Often available on higher trims
        ]
    },

    {
        id: 18, // Assigning a new unique ID
        image: venueImg, // Replace with your actual Venue image variable
        imageGallery: {
            front: venuefront,   // Replace with your actual Venue front image variable
            left: venueLeft,    // Replace with your actual Venue left image variable
            right: venueRight,   // Replace with your actual Venue right image variable
            back: venueBack,     // Replace with your actual Venue back image variable
        },
        model: 'Venue',
        brand: 'Hyundai',
        bodyType: 'Compact SUV', // Falls under the sub-4m compact SUV segment
        transmission: 'Automatic', // Available in DCT (Turbo Petrol) and IVT (NA Petrol)
        seats: 5,
        pricePerDay: 4050, // Example price, adjust as needed (competitive with Sonet/Fronx)
        engine: "1.0L Turbo GDi Petrol", // Also available with 1.2L NA Petrol & 1.5L Diesel
        mileage: "18.1 kmpl (Turbo DCT)", // ARAI figure for the 1.0L Turbo DCT variant
        fuelType: 'Petrol',
        description: "Hyundai's popular compact SUV, the Venue offers a blend of modern styling, connected features, and versatile engine options. Known for its urban-friendly size and comprehensive equipment list.",
        featuresList: [
            "8-inch Touchscreen Infotainment with Navigation", // Standard size, navigation often included
            "Wireless Apple CarPlay & Android Auto",
            "Automatic Climate Control",
            "Electric Sunroof",
            "Air Purifier", // Often a Hyundai highlight
            "Wireless Phone Charger",
            "6 Airbags (Higher variants/standard on some trims)",
            "Electronic Stability Control (ESC)",
            "Connected Car Tech (Hyundai BlueLink)", // Hyundai's connected tech name
            "Rear Parking Camera & Sensors",
        ]
    }

];