import React from 'react';
import BaseProductPage, { ProductData } from './BaseProductPage';
import {
      Dumbbell,
      Users,
      CreditCard
} from "lucide-react";

const clubData: ProductData = {
      name: "Club Management",
      description: "A comprehensive digital solution for managing residential and commercial clubhouses, gyms, and shared amenities.",
      brief: "Manage memberships, booking for squash/tennis courts, gym access control, and cafe billings in one unified system integrated with the residents app.",
      userStories: [
            {
                  title: "Club Manager",
                  items: [
                        "Manage member tiers and subscription renewals.",
                        "Monitor facility usage and peak hours via heatmaps.",
                        "Automated billing for guests and event bookings.",
                  ],
            },
            {
                  title: "Resident Member",
                  items: [
                        "Pre-book amenities to avoid crowding.",
                        "Pay membership dues via the integrated wallet.",
                        "Check live gym occupancy before visiting.",
                  ],
            },
      ],
      industries: "Residential Societies, Corporate Parks, Gym Chains",
      usps: [
            "Seamless integration with resident mobile apps.",
            "Hardware-level access control (Biometric/QR/RFID).",
            "Comprehensive inventory management for club cafes.",
      ],
      includes: ["Admin Dashboard", "Member App Module", "POS Integration"],
      upSelling: ["Hi Society, Loyalty"],
      integrations: ["Payment Gateways, Access Control Hardware"],
      decisionMakers: ["Society Manager, HR Admin"],
      keyPoints: [
            "Improved Amenities ROI",
            "Reduced Pilferage at Club Cafes",
            "Enhanced Member Satisfaction",
      ],
      roi: [
            "Recover membership dues 40% faster with automated reminders.",
      ],
      assets: [],
      credentials: [
            {
                  title: "Club Admin",
                  url: "#",
                  id: "club@admin.com",
                  pass: "123456",
                  icon: <Dumbbell className="w-5 h-5" />,
            },
      ],
      owner: "Abdul Ghaffar",
      ownerImage: "/assets/product_owner/abdul_ghaffar.jpeg",
      excelLikeFeatures: true,
      excelLikeMetrics: true,
      modernSummary: true,
      extendedContent: {
            detailedEnhancementRoadmap: {
                  "isClubEnhancement": true,
                  "innovations": [
                        {
                              "id": 1,
                              "enhancement": "LLM-Powered Member Communication Assistant",
                              "type": "AI - LLM",
                              "description": "A large language model assistant embedded in the admin panel that drafts personalised member communications. Admin describes the intent (e.g. re-engage members who have not booked in 3 weeks with a half-price offer) and the LLM generates the message, selects the right audience segment, and schedules delivery. Reduces marketing effort by 80%.",
                              "segment": "All segments",
                              "impact": "HIGH"
                        },
                        {
                              "id": 2,
                              "enhancement": "AI-Powered Dynamic Pricing Engine",
                              "type": "AI - Predictive",
                              "description": "Real-time pricing algorithm that adjusts slot prices based on current demand, historical patterns, weather, and competitor availability. Surge pricing during high demand and automatic discounts during low-demand windows. Maximises revenue per available court hour by 15-25%.",
                              "segment": "Premium Sports Clubs, Hotel Amenities",
                              "impact": "HIGH"
                        },
                        {
                              "id": 3,
                              "enhancement": "NLP-Based Member Feedback Analysis",
                              "type": "AI - NLP",
                              "description": "Natural language processing applied to member reviews, support tickets, and community post comments to identify recurring sentiment themes. Auto-surfaces: top 3 complaints this month, most praised features, trainer-specific feedback patterns. Weekly digest report for admin. Eliminates manual feedback reading.",
                              "segment": "Fitness Chains, Corporate Wellness",
                              "impact": "HIGH"
                        },
                        {
                              "id": 4,
                              "enhancement": "AI Fitness Progress Coach (Member-Facing)",
                              "type": "AI - LLM",
                              "description": "Member-facing conversational AI coach that asks about fitness goals during onboarding, tracks attendance patterns, and provides personalised weekly session recommendations. Example: You have done 3 cardio sessions this week. A Pilates class on Saturday morning would complement your routine. Three slots open. Reserve one? Drives 30%+ increase in session frequency.",
                              "segment": "Fitness Studios, Sports Clubs",
                              "impact": "HIGH"
                        },
                        {
                              "id": 5,
                              "enhancement": "Predictive Equipment Maintenance (IoT + AI)",
                              "type": "AI - Predictive + IoT",
                              "description": "Sensor-optional predictive maintenance: even without IoT sensors, the AI model uses booking frequency data per court or machine and manufacturer maintenance schedules to predict optimal maintenance timing before failure. Admin receives 72-hour advance alert. Optional IoT sensor integration enhances precision.",
                              "segment": "Large Sports Clubs, Hotels",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 6,
                              "enhancement": "MCP Integration with HR Systems (Darwinbox, Workday)",
                              "type": "MCP - Cross-Platform",
                              "description": "Model Context Protocol connector enabling bidirectional data flow between Lockated and major Indian HRMS platforms. New employee appears in HRMS - wallet credits allocated automatically in Lockated. Employee exits company - Lockated membership paused automatically. Eliminates manual HR-to-wellness admin completely.",
                              "segment": "Corporate Wellness",
                              "impact": "HIGH"
                        },
                        {
                              "id": 7,
                              "enhancement": "MCP Integration with Property Management Systems (Hotel PMS)",
                              "type": "MCP - Cross-Platform",
                              "description": "MCP connector to leading hotel PMS platforms (Oracle OPERA, IDS Next, Hotelogix). Hotel guest checks in - automatically granted temporary club access for stay duration. Guest checks out - access revoked. Club usage billed to room folio automatically. Zero front desk intervention.",
                              "segment": "Hotels and Resorts",
                              "impact": "HIGH"
                        },
                        {
                              "id": 8,
                              "enhancement": "MCP Smart Home and Access Control Automation",
                              "type": "MCP - Cross-Platform",
                              "description": "MCP integration with residential smart building platforms (Hikvision, Lenel, Honeywell building management). Resident books a pool slot - building BMS unlocks the pool area at the exact slot time and locks it after. No physical key or card needed. Security and convenience combined.",
                              "segment": "Residential Societies, Gated Communities",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 9,
                              "enhancement": "Voice Booking via Smart Speaker",
                              "type": "AI - LLM + Voice",
                              "description": "Integration with Google Assistant and Amazon Alexa enabling voice-activated bookings. Hey Google, book a padel court at my club tomorrow at 7 PM for two players. System confirms availability, places booking, and confirms via push notification. Reduces booking friction to zero for repeat users.",
                              "segment": "Premium Sports Clubs, Corporate Wellness",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 10,
                              "enhancement": "Blockchain-Verified Membership Certificate",
                              "type": "Blockchain",
                              "description": "On-chain issuance of membership certificates for premium clubs that use membership as a social status signal (country clubs, golf clubs, elite padel clubs). Verifiable, non-duplicable, and transferable under admin-controlled rules. Adds perceived exclusivity and technological modernity to high-ACV club memberships.",
                              "segment": "Country Clubs, Premium Sports Clubs",
                              "impact": "LOW"
                        },
                        {
                              "id": 11,
                              "enhancement": "AI Tournament Bracket and Match Scheduling",
                              "type": "AI - Predictive",
                              "description": "AI engine that generates optimal tournament brackets based on member skill ratings, availability, and historical match data. Automatically schedules all matches, assigns courts, and generates a public-facing tournament leaderboard. Handles substitutions, walkovers, and rescheduling automatically.",
                              "segment": "Premium Sports Clubs, Academies",
                              "impact": "HIGH"
                        },
                        {
                              "id": 12,
                              "enhancement": "Gamified Member Loyalty and Rewards Engine",
                              "type": "Product Enhancement",
                              "description": "Points-based rewards system: members earn points for bookings, attendance streaks, co-player invitations accepted, community posts, and referrals. Points redeemable for amenity credits, merchandise, or membership discounts. Leaderboard creates healthy competition. Proven 25-40% increase in monthly session frequency in comparable platforms.",
                              "segment": "All segments",
                              "impact": "HIGH"
                        },
                        {
                              "id": 13,
                              "enhancement": "Video Analysis Integration for Coaching Feedback",
                              "type": "AI - Computer Vision",
                              "description": "Integration with court-side camera systems (optional) to record coaching sessions. AI computer vision analyses player posture, swing mechanics, and movement patterns. Auto-generates a feedback PDF for the trainer to share with the member. Transforms coaching from subjective to data-driven.",
                              "segment": "Academies, Premium Sports Clubs",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 14,
                              "enhancement": "Real-Time Occupancy Display (Lobby Screen)",
                              "type": "Product Enhancement",
                              "description": "Digital signage integration showing real-time court and amenity availability on lobby screens. Members arriving without a booking can see open slots and book on a self-service kiosk at the entrance. Captures walk-in revenue that currently requires front desk attention.",
                              "segment": "Large Sports Clubs, Hotels",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 15,
                              "enhancement": "Multi-Language Interface (Hindi, Tamil, Telugu, Kannada)",
                              "type": "Localisation",
                              "description": "Full platform translation into 5 languages: Hindi, Tamil, Telugu, Kannada, and Marathi. Member-facing app and web portal in vernacular languages. Critical for Tier-2 and Tier-3 India market expansion and government facility procurement. Covers 80%+ of non-English internet users in India.",
                              "segment": "Government Facilities, Tier-2 Cities",
                              "impact": "HIGH"
                        },
                        {
                              "id": 16,
                              "enhancement": "AI Member Segmentation and Persona Builder",
                              "type": "AI - LLM + Clustering",
                              "description": "LLM-assisted member segmentation that combines booking patterns, amenity preferences, peak hour behaviour, and community engagement to auto-generate member personas (e.g. Morning Warrior, Weekend Social Player, Corporate Regular). Admin uses personas for targeted campaigns and facility investment decisions.",
                              "segment": "Fitness Chains, Country Clubs",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 17,
                              "enhancement": "Wearable Device Integration (Fitbit, Apple Watch, Garmin)",
                              "type": "Product Enhancement",
                              "description": "Integration with popular fitness wearables to sync workout completion data with the member's Lockated attendance record. Wearable confirms that a member actually exercised during their booked gym slot (vs just checking in). Adds a health engagement data layer for corporate wellness ROI reporting.",
                              "segment": "Corporate Wellness, Fitness Studios",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 18,
                              "enhancement": "API Marketplace for Third-Party Developers",
                              "type": "Platform Enhancement",
                              "description": "Developer marketplace where third-party developers can build and publish apps that integrate with Lockated's REST and GraphQL API. Tournament scoring apps, nutrition tracking integrations, wearable connectors. Creates a platform ecosystem that increases Lockated's feature surface without engineering cost.",
                              "segment": "All segments",
                              "impact": "HIGH"
                        },
                        {
                              "id": 19,
                              "enhancement": "Subscription Revenue Sharing for Multi-Club Networks",
                              "type": "Business Model Innovation",
                              "description": "Enable club networks (e.g. padel chain with 10 locations) to offer a network membership - one fee grants access to all network clubs. Lockated manages the revenue sharing calculation between clubs automatically based on actual member visits. Enables new membership product tier.",
                              "segment": "Premium Sports Club Chains",
                              "impact": "HIGH"
                        },
                        {
                              "id": 20,
                              "enhancement": "AI Demand Forecasting for Staff and Resource Planning",
                              "type": "AI - Predictive",
                              "description": "AI model that forecasts next 30 days of member demand per amenity per time slot with 85%+ accuracy. Allows admin to optimally schedule trainer availability, cleaning staff, and equipment maintenance windows around predicted demand peaks and troughs. Reduces overtime costs and staffing gaps.",
                              "segment": "Large Chains, Corporate Wellness, Hotels",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 21,
                              "enhancement": "NLP Support Ticket Auto-Resolution",
                              "type": "AI - NLP",
                              "description": "NLP model trained on historical support tickets categorises and auto-resolves common member queries (how do I freeze my membership, why was I charged, how do I invite a co-player) with accurate responses. Escalates only unresolved or complex issues to human support. Targets 60% reduction in support ticket volume.",
                              "segment": "All segments",
                              "impact": "HIGH"
                        },
                        {
                              "id": 22,
                              "enhancement": "Carbon Footprint Reporting Module",
                              "type": "Sustainability",
                              "description": "Track and report energy usage per facility and per session based on occupancy data and configured energy consumption parameters. Generate a monthly carbon footprint report for ESG-conscious corporate clients. Increasingly required for corporate sustainability reporting under SEBI BRSR requirements.",
                              "segment": "Corporate Wellness, Large Hotel Groups",
                              "impact": "LOW"
                        },
                        {
                              "id": 23,
                              "enhancement": "AI Dynamic Menu Pricing for F&B (Demand-Based Surge Pricing)",
                              "type": "AI - Predictive",
                              "description": "Real-time demand-based pricing for F&B items: surge pricing on popular items during peak post-match hours, automatic discounts on slow-moving items nearing end of service window. Integrates with recipe costing to ensure gross margin floor is never breached. Estimated F&B revenue uplift of 12-18% at clubs with high post-activity F&B demand.",
                              "segment": "Country Clubs, Sports Clubs with F&B",
                              "impact": "HIGH"
                        },
                        {
                              "id": 24,
                              "enhancement": "LLM-Powered Revenue Management for Channel Controller",
                              "type": "AI - LLM",
                              "description": "Large language model assistant that analyses booking pace, competitor rate intelligence from OTA public data, and historical demand patterns to recommend optimal rate strategies per channel per day. Admin approves recommendations in one click. Eliminates need for a dedicated revenue manager at smaller club-hotels.",
                              "segment": "Club-Hotels, Country Clubs with Rooms",
                              "impact": "HIGH"
                        },
                        {
                              "id": 25,
                              "enhancement": "AI Accounts Payable Automation (Invoice OCR and 3-Way Match)",
                              "type": "AI - Computer Vision",
                              "description": "Optical character recognition (OCR) on vendor invoice images. AI extracts invoice line items and auto-matches to purchase orders and goods received notes (3-way match). Unmatched items are flagged for manual review. Reduces accounts payable processing time by 80% and eliminates duplicate payment risk.",
                              "segment": "All segments (Finance teams)",
                              "impact": "HIGH"
                        },
                        {
                              "id": 26,
                              "enhancement": "Loyalty Blockchain Ledger for Cross-Club Partner Network",
                              "type": "Blockchain + Loyalty",
                              "description": "Distributed ledger recording all cross-club loyalty point transfers in the Lockated partner network. Eliminates inter-club reconciliation disputes. Each club maintains a verifiable transaction record. Smart contracts auto-settle monthly net point balances between partner clubs in INR. Scales the partner network to 500+ clubs without central reconciliation overhead.",
                              "segment": "All segments in Loyalty Partner Network",
                              "impact": "MEDIUM"
                        },
                        {
                              "id": 27,
                              "enhancement": "IoT-Integrated Asset Condition Monitoring",
                              "type": "AI - Predictive + IoT",
                              "description": "Optional IoT sensor integration (vibration, temperature, usage cycle sensors) on gym equipment, HVAC, and court court surfaces. Sensor data feeds the predictive maintenance AI to detect anomalies before failure. Admin receives condition score per asset daily. Predictive alerts 72 hours before failure probability exceeds 85%. Reduces unplanned equipment downtime by up to 85% vs calendar-based maintenance.",
                              "segment": "Large Sports Clubs, Hotels, Corporate Wellness",
                              "impact": "MEDIUM"
                        }
                  ],
                  "top5": [
                        {
                              "id": 1,
                              "enhancement": "LLM-Powered Member Communication Assistant",
                              "type": "AI - LLM",
                              "whyItMatters": "Reduces admin marketing effort by 80%. Personalised communication at scale drives 25%+ improvement in retention campaign conversion vs generic blasts. No competitor offers this for mid-market India clubs.",
                              "competitor": "Replaces manual WhatsApp admin work done by Shawman users. Outpaces MINDBODY AI marketing tools at 50% lower price.",
                              "timeline": "Phase 2 - Month 10-12"
                        },
                        {
                              "id": 2,
                              "enhancement": "MCP Integration with HR Systems (Darwinbox, Workday)",
                              "type": "MCP - Cross-Platform",
                              "whyItMatters": "Zero-friction corporate wellness management. New employee auto-enrolled, departed employee auto-suspended. Eliminates the primary admin friction that stops HR departments from scaling corporate wellness programmes digitally.",
                              "competitor": "No competitor has MCP-based HR integration. Makes Lockated the default choice for any enterprise deploying Darwinbox or Workday.",
                              "timeline": "Phase 3 - Month 18-20"
                        },
                        {
                              "id": 3,
                              "enhancement": "AI Tournament Bracket and Scheduling",
                              "type": "AI - Predictive",
                              "whyItMatters": "Tournaments are a major revenue driver for padel and squash clubs. Manual bracket management is the #1 operational pain point for club operators who run regular events. Automating this eliminates an entire admin workflow.",
                              "competitor": "No competitor offers AI tournament scheduling. Shawman has basic event management. Lockated would be the only platform where tournaments are a first-class feature.",
                              "timeline": "Phase 2 - Month 14-16"
                        },
                        {
                              "id": 4,
                              "enhancement": "Multi-Language Interface (Hindi, Tamil, Telugu, Kannada)",
                              "type": "Localisation",
                              "whyItMatters": "Government facility procurement and Tier-2 city expansion require vernacular language support. This single feature unlocks 2,000+ government facilities and 5,000+ Tier-2 city clubs that will not adopt an English-only platform.",
                              "competitor": "Leapfrogs all global competitors (MINDBODY, Glofox, EZFacility) who have zero India vernacular support. Differentiates sharply from Omnify and Zenoti which are English-only.",
                              "timeline": "Phase 3 - Month 19-22"
                        },
                        {
                              "id": 5,
                              "enhancement": "Gamified Member Loyalty and Rewards Engine",
                              "type": "Product Enhancement",
                              "whyItMatters": "Gamification has the highest proven ROI of any retention feature in fitness and sports club software. Points + leaderboard + streak badges drive a 25-40% increase in monthly session frequency. Lockated's attendance streak is a start; a full rewards engine is the next evolution.",
                              "competitor": "MINDBODY has basic rewards but only on Enterprise tier. No India-market competitor offers this. Becomes a marketing differentiator that clubs highlight to recruit members.",
                              "timeline": "Phase 2 - Month 12-14"
                        }
                  ]
            },

            detailedSWOT: {
                  "strengths": [
                        {
                              "headline": "Data Sovereignty Architecture",
                              "explanation": "Only club management platform where all member data is stored on the client's own servers. Directly addresses India's DPDPA requirements and enterprise procurement requirements. Competitors cannot replicate this without a complete rebuild."
                        },
                        {
                              "headline": "Co-Player AI Matching (Zero Competitor)",
                              "explanation": "AI-powered skill-level and availability matching for court sports is completely absent from all 10 mapped competitors. This directly increases court utilisation and member engagement with no equivalent available in the market."
                        },
                        {
                              "headline": "India-First Payment Rails",
                              "explanation": "UPI, Razorpay, RuPay, and GST auto-invoicing are native to the platform, not afterthoughts. This removes the primary barrier for Indian clubs to adopt digital payments and satisfies finance team compliance needs from Day 1."
                        },
                        {
                              "headline": "Community Features Driving Retention",
                              "explanation": "Built-in member directory, community posts linked to bookings, and co-player ratings create social bonds within the club that competitors entirely lack. Social bonds are the most durable churn prevention mechanism."
                        },
                        {
                              "headline": "AI Analytics at India Mid-Market Price",
                              "explanation": "Churn prediction, no-show prediction, revenue optimisation AI, menu engineering analytics, channel performance analytics, and loyalty ROI dashboard are all available at INR 30,000-1,20,000/month – a price accessible to India's mid-market clubs. Competitors charge 5-10x more for equivalent AI on global enterprise tiers. F&B food cost analytics alone deliver 8-12% food cost reduction within 90 days, paying for the module subscription 3x over."
                        },
                        {
                              "headline": "GoPhygital.work Ecosystem Advantage",
                              "explanation": "Part of the Lockated product suite with existing relationships in real estate and workplace management. These relationships provide warm introductions to hotel groups, corporate real estate operators, and gated community developers."
                        },
                        {
                              "headline": "Role-Based Multi-Depth Admin Access",
                              "explanation": "7 distinct user roles with granular permission control - from Super Admin viewing all branches to Front Desk Staff restricted to single branch check-in. Most competitors offer 2-3 roles. This enables safe delegation without data exposure risk."
                        },
                        {
                              "headline": "Multi-Branch Consolidated Reporting",
                              "explanation": "Super Admin views real-time P&L, occupancy, member metrics, and staff performance across all branches in one screen without switching accounts. This alone replaces a part-time analyst role at any multi-location chain."
                        },
                        {
                              "headline": "Comprehensive Compliance Framework",
                              "explanation": "PCI-DSS for payment security, GDPR compatibility, DPDPA-native, ISO 27001 roadmap. 99.5% SLA, 1-hour RTO, 15-minute RPO. This compliance posture is necessary for enterprise procurement and government contracts."
                        },
                        {
                              "headline": "Native Mobile Apps with Sub-1.5s Performance",
                              "explanation": "iOS and Android apps built natively (not hybrid) with offline SQLite, biometric login, and sub-1.5 second startup target. Performance and offline capability outclass hybrid-app competitors on low-end devices common in India."
                        }
                  ],
                  "weaknesses": [
                        {
                              "headline": "No Current Brand Recognition in Club Market",
                              "explanation": "Lockated is known in workplace management but unknown in sports and fitness club management. Every deal requires educating buyers about the brand, increasing CAC and extending sales cycles in the early months."
                        },
                        {
                              "headline": "Small Engineering Team for Scope",
                              "explanation": "The feature scope across 11 modules with AI, mobile apps, and integrations is large for a team building v1. Risk of quality issues or delayed shipping if team is thin. Phase 1 delivery requires disciplined scope management."
                        },
                        {
                              "headline": "No Market References Yet",
                              "explanation": "Without a first cohort of 10-20 live clubs with measurable outcomes, sales conversations rely on product demos rather than social proof. The first 3-6 months are reference-free, which slows enterprise sales cycles."
                        },
                        {
                              "headline": "Long Sales Cycle for Multi-Branch Accounts",
                              "explanation": "Enterprise chains and hotel groups require 3-6 month sales cycles with multiple stakeholders. This creates revenue unpredictability in the first 12 months and requires patient capital."
                        },
                        {
                              "headline": "Dependence on Client IT Infrastructure for Data Sovereignty",
                              "explanation": "The on-premise data sovereignty model requires the client to have functional AWS or GCP infrastructure. Smaller clubs without IT capability need guided setup support, adding implementation complexity and cost."
                        },
                        {
                              "headline": "No Offline Cash Payment Mode",
                              "explanation": "Government and municipal sports facilities primarily operate with cash payments. Without an offline cash collection mode in Phase 1, this segment is inaccessible until Phase 3. Limits addressable market in Phase 1."
                        },
                        {
                              "headline": "Limited International Market Readiness",
                              "explanation": "Current platform is optimised for India: UPI, GST, INR, and DPDPA. Expansion to global markets requires currency, language, tax, and regulatory localisation. Global ambition requires separate investment."
                        },
                        {
                              "headline": "No Marketplace for Member Discovery",
                              "explanation": "MINDBODY has a 50M+ consumer marketplace where people discover new studios. Lockated has no equivalent consumer-facing discovery platform in Phase 1. Members can only find the app through their own club."
                        },
                        {
                              "headline": "Phase 2 Community Features are Post-Launch",
                              "explanation": "The co-player matching and community features that are primary differentiators are not in Phase 1. Clubs that sign in Phase 1 have to wait 6+ months for the features most prominently marketed. Expectation management is critical."
                        },
                        {
                              "headline": "No Free Tier or Freemium Model",
                              "explanation": "There is no free tier, which eliminates viral self-serve growth from small gyms and solo trainers. Every acquisition requires a sales conversation. This limits top-of-funnel volume compared to freemium competitors like Omnify."
                        }
                  ],
                  "opportunities": [
                        {
                              "headline": "India Padel Boom",
                              "explanation": "India named a high-growth padel market. 400+ courts in India as of Q1 2026 (Padel Federation of India), growing 45% YoY. 15 new padel clubs opened in January-March 2026 alone. New padel clubs typically launch with a café/F&B facility, court management, and a loyalty programme as Day 1 requirements. Lockated's full suite addresses all three needs in a single platform."
                        },
                        {
                              "headline": "India DPDPA Enforcement",
                              "explanation": "India's Digital Personal Data Protection Act 2023 enforcement is increasing. Enterprises will face compliance audits on data storage. Lockated's on-premise architecture is the only compliant option among club management platforms."
                        },
                        {
                              "headline": "Digital India Sports Infrastructure Push",
                              "explanation": "Government of India's Sports Policy 2023 and Khelo India programme are funding 1,900+ sports facilities. Digital management is being mandated in funded facilities. Lockated can enter government procurement."
                        },
                        {
                              "headline": "Corporate Wellness Budgets Rising",
                              "explanation": "Post-COVID, 70%+ of large India enterprises have increased wellness budgets (Deloitte India Wellness Survey 2025). Corporate gyms and sports facilities increasingly require integrated loyalty programmes and F&B management as employee experience differentiators. The corporate wellness software market in India is growing at 22% YoY. ESIC and government wellness mandates are expanding."
                        },
                        {
                              "headline": "Padel, Squash, Pickleball Infrastructure Investment",
                              "explanation": "JSW Sports funding PadelPark India, Decathlon opening padel courts, real estate developers building multi-sport lifestyle centres. Each new court or facility is a potential Lockated client from Day 1."
                        },
                        {
                              "headline": "Multi-City Club Chain Rollout",
                              "explanation": "India's premium fitness and sports club market is consolidating. Chains like CULT.fit, Gold's Gym India, and boutique padel chains are expanding to 10-50 locations. One chain contract at INR 50,000/branch/month is INR 25 lakh/month ARR."
                        },
                        {
                              "headline": "Hotel Group Amenity Tech Upgrade",
                              "explanation": "Premium hotel chains (ITC, Taj, Marriott India, Oberoi) are investing in sports amenities to compete for staycation and wellness tourism revenue. They need a guest + external member management system that no competitor offers."
                        },
                        {
                              "headline": "White-Label App as Revenue Multiplier",
                              "explanation": "Premium clubs and hotel groups want a branded app under their own name. The white-label add-on converts Lockated from a SaaS tool to an infrastructure platform - increasing both ACV and switching costs significantly."
                        },
                        {
                              "headline": "Government Facility Management Mandate",
                              "explanation": "Smart City Mission and Digital India initiatives are pushing municipal sports facilities to digital management. Government procurement, while slow, represents hundreds of facilities in each metro with stable multi-year contracts."
                        },
                        {
                              "headline": "Integration into Real Estate Developer Sales Pitch",
                              "explanation": "Real estate developers can market Lockated-powered amenity management as a selling point for premium residential projects. Lockated becomes part of the property's lifestyle infrastructure value proposition."
                        },
                        {
                              "headline": "India Club F&B Digitalisation Gap",
                              "explanation": "Less than 12% of India's 15,000+ organised clubs have an integrated digital F&B system (NRAI 2025). Average food cost at unmanaged club kitchens is 42-48% vs industry benchmark of 28-32%. Lockated's recipe management and F&B POS directly address this gap with a measurable ROI that pays for the module within 60 days."
                        },
                        {
                              "headline": "GST Compliance Pressure Drives Accounting Adoption",
                              "explanation": "GST Council's enhanced scrutiny of club and hospitality businesses in 2025-26 is forcing clubs to move from manual Tally-based accounting to integrated, audit-ready systems. GSTR-1/3B errors attract 18% interest per annum plus penalties. Lockated's native accounting module with auto-GSTR generation is a compliance necessity, not a feature differentiator."
                        }
                  ],
                  "threats": [
                        {
                              "headline": "MINDBODY India Push",
                              "explanation": "MINDBODY or Glofox could add UPI, GST, and DPDPA compliance within 18 months with adequate investment. Their global brand and marketplace reach would make them a formidable competitor if India-localised."
                        },
                        {
                              "headline": "Zenoti India Expansion into Sports",
                              "explanation": "Zenoti is an India-founded company with a Hyderabad office and strong AI capabilities. If they pivot from salon/spa to sports club management, they bring 20,000 existing clients and deep local relationships. In the hospitality module space, Prologic First (WISH PMS) is a credible threat if they expand from luxury hotels to mid-market clubs – though their current pricing (INR 8–25 lakh/year) and minimum property size (100+ rooms) keeps them out of the 15,000 club market. IDS Next and eZee could add sports/club features but have no India brand in the sports club segment."
                        },
                        {
                              "headline": "Shawman Feature Modernisation",
                              "explanation": "Shawman's 20+ years of India market presence gives them deep club relationships. If they launch a modern mobile app and add community features, incumbent loyalty could prevent switching even with a superior product."
                        },
                        {
                              "headline": "WhatsApp-Based Club Management Tools",
                              "explanation": "Several small operators are building WhatsApp Business API automation tools for basic booking and payment. For smaller clubs with under 100 members, these tools may be good enough and cost under INR 2,000/month."
                        },
                        {
                              "headline": "Long Sales Cycles Drain Capital",
                              "explanation": "Multi-branch chains and hotel groups take 3-6 months to decide. If the company runs out of capital before these enterprise accounts close, the high-ACV pipeline evaporates. Managing sales cycle length is critical."
                        },
                        {
                              "headline": "Open-Source or Low-Cost Alternatives",
                              "explanation": "A developer could build a basic booking and membership system on WordPress + WooCommerce for INR 50,000 one-time. Educating clubs on the difference between a custom-built tool and a maintained SaaS platform is an ongoing sales challenge."
                        },
                        {
                              "headline": "Talent War for India SaaS Engineers",
                              "explanation": "India's SaaS talent market is competitive. Engineering team attrition could delay Phase 2 feature delivery, particularly AI model development and mobile app performance tuning."
                        },
                        {
                              "headline": "Economic Sensitivity of Club Membership Market",
                              "explanation": "Club memberships are semi-discretionary. A macroeconomic downturn in India (inflation, job losses) could lead to membership cancellations, which would reduce per-club subscription value and increase churn."
                        },
                        {
                              "headline": "Data Breach Risk Reputational Damage",
                              "explanation": "Even with on-premise architecture, a client's poorly configured server could result in a member data breach. If associated with Lockated brand, this could damage trust across the entire client base regardless of contractual data sovereignty."
                        },
                        {
                              "headline": "Regulatory Changes to SaaS Pricing or Data Localisation",
                              "explanation": "GST regulations on SaaS, potential changes to India's data localisation requirements, or foreign investment restrictions in tech could add compliance complexity or create pricing challenges not anticipated today."
                        }
                  ]
            },
            detailedBusinessPlan: {
                  "planQuestions": [
                        {
                              "question": "Q1: What problem does Club Management solve, and for whom?",
                              "answer": "We solve the operational chaos that premium sports, country clubs, and club-hotels in India face every day: manual court bookings via WhatsApp, no-show revenue leakage, Excel-based membership management, disconnected F&B POS systems with uncontrolled food costs, rooms managed on a separate PMS with no connection to the club, and zero digital loyalty programme. Our primary buyers are club owners and operations directors of premium sports clubs, country clubs, and hotel amenity operators in Tier-1 India cities. These operators run INR 50 lakh to 20 crore businesses on a patchwork of 6-8 disconnected tools. We give them one platform – built on their own servers – covering every revenue-generating function: membership, bookings, F&B, rooms, channel distribution, recipe costing, asset management, accounting, and loyalty.",
                              "source": "Product Summary Tab - Core Identity, Problem It Solves",
                              "flag": "Ready to use as-is. Verify: confirm target city list is correct (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune)."
                        },
                        {
                              "question": "Q2: What is the market size and growth opportunity?",
                              "answer": "The India sports and fitness club industry is estimated at INR 4,500 crore with 15,000 to 20,000 organised clubs, and currently less than 15% have any digital management system. With the addition of F&B, room inventory, channel management, and accounting modules, our expanded total addressable market reaches INR 2,500–3,800 crore over 5 years (up from INR 800–1,200 crore for core club management alone). Key market data (2025): India F&B management software in hospitality: INR 2,900–3,700 crore, CAGR 16–19% (Mordor Intelligence). India hotel PMS/room management: INR 1,500–1,900 crore, CAGR 12–14% (MarketsandMarkets). India channel management software: INR 330–500 crore, CAGR 18–22% (Allied Market Research). India hospitality loyalty management: INR 2,900–4,100 crore, CAGR 20–23% (MarketsandMarkets). India cloud accounting hospitality segment: INR 660–1,000 crore, CAGR 14–16% (Grand View Research). Digital loyalty penetration in India private clubs: only 15–20% of metro clubs (FHRAI 2025). Integrated F&B + room management adoption: only 8–12% of India clubs use any integrated digital system. India padel courts: 400+ as of Q1 2026 (Padel Federation of India), growing 45% YoY. Our SAM: 1,500–2,000 premium clubs and club-hotels that can pay INR 5–15 lakh/year – representing a near-term revenue opportunity of INR 750–3,000 crore per year.",
                              "source": "Market Analysis Tab - Section 1: Global Market Size, Section 3: Industry Segments",
                              "flag": "Ready to use as-is. Verify: confirm internal revenue target assumption (INR 25,000-35,000 avg ACV) is aligned with actual pricing decisions."
                        },
                        {
                              "question": "Q3: Who are the competitors and how do we win?",
                              "answer": "Our 10 mapped competitors split into three groups. Legacy India players: Shawman (strong billing, no mobile, no community, no AI, no F&B management, no loyalty). Global platforms: MINDBODY, Glofox, Virtuagym, Zen Planner, EZFacility (powerful but US-data-stored, expensive, India-unfit, none with channel controller or integrated accounting). India-founded startups: Omnify and Zenoti (Zenoti has F&B and accounting for salons/spas but not sports clubs; no channel management, no co-player matching). We win on eight pillars no competitor combines: (1) data sovereignty, (2) co-player community AI, (3) India payment rails, (4) AI analytics at India price points, (5) integrated F&B POS with recipe-driven food costing, (6) channel controller for OTA distribution, (7) full double-entry accounting with GSTR-1/3B auto-generation, and (8) tiered loyalty management with cross-club partner network.",
                              "source": "Market Analysis Tab - Section 2: Competitors | Features and Pricing Tab - Section 1 and 2",
                              "flag": "Ready to use as-is. Verify: confirm the 4 pillars remain accurate after any late feature additions."
                        },
                        {
                              "question": "Q4: What is the business model and pricing?",
                              "answer": "We charge a monthly SaaS subscription per branch: INR 20,000/month for a single-branch starter club up to INR 1,20,000+/month for full-suite multi-branch deployments. Revenue streams: (1) Core platform SaaS per branch (INR 20,000-60,000/month), (2) F&B module add-on (INR 8,000-15,000/month), (3) Room + Channel Controller add-on (INR 10,000-20,000/month), (4) Accounting module add-on (INR 5,000-10,000/month), (5) Loyalty module add-on (INR 6,000-12,000/month), (6) per-member volume tiers above 500 active members, (7) white-label mobile app (one-time + monthly), (8) API access for enterprise, (9) one-time onboarding and data migration fee of INR 50,000-3,00,000. Target gross margin above 75% at scale. Annual contracts with monthly payment option at 10% premium. A full-suite country club or club-hotel deploying all modules pays INR 80,000-1,20,000/month.",
                              "source": "Features and Pricing Tab - Section 2A: India Pricing Landscape | Product Summary - Revenue Model",
                              "flag": "Requires founder input: confirm exact pricing tiers, per-member threshold, and white-label app fee structure before investor meetings."
                        },
                        {
                              "question": "Q5: What are the key metrics and early traction?",
                              "answer": "Our target business KPIs for Year 1: CAC below INR 50,000 per club, LTV above INR 5,00,000 per club (5-year retention), monthly churn below 3%, NPS above 50. Product KPIs: DAU above 40% of enrolled members per club, MAU above 70%, booking conversion above 15% of monthly sessions, community engagement above 30% of active members posting or reacting monthly, payment success rate above 99%. We track MRR, net new clubs per month, and average sessions booked per member per month as the north star metric.",
                              "source": "Metrics Tab - all sections",
                              "flag": "Requires founder input: replace projected targets with actual traction data (live clubs, MRR, NPS scores) before any investor meeting."
                        },
                        {
                              "question": "Q6: What is the go-to-market strategy?",
                              "answer": "We focus on three target groups in sequence. First, premium sports clubs in Mumbai and Bengaluru (padel, squash): high willingness to pay, social network effects drive word-of-mouth, and the padel boom gives us a specific market entry wedge. We acquire through direct sales with a 30-day free pilot and sports club industry associations. Second, multi-branch fitness chains: we reach them through fitness industry events (FitEx India, Active India) and broker referrals from club equipment suppliers. Third, corporate wellness: HR technology procurement channels and facility management companies with existing corporate client relationships.",
                              "source": "GTM Strategy Tab - all three target groups",
                              "flag": "Requires founder input: confirm which cities are Month 1-3 priority and whether a channel partner programme is ready."
                        },
                        {
                              "question": "Q7: What is the product roadmap and innovation plan?",
                              "answer": "Phase 1 (Months 1-6): Core platform launch - web admin portal, native apps, UPI integration, QR check-in, membership lifecycle, multi-branch, trainer module, family membership, prepaid wallet, and basic reporting. Phase 2 (Months 7-15): Community and AI launch - co-player matching, community posts, member directory, AI no-show prediction, AI churn prediction, guest invite with split payment, WhatsApp integration, corporate module, and revenue optimisation AI. Phase 3 (Months 16-24): Enterprise moat - RFID integration, white-label app, government module, tournament management, ERP connectors, and AI personal coach. Estimated ARR targets: INR 4 crore by Month 6, INR 15 crore by Month 15, INR 50 crore by Month 24.",
                              "source": "Product Roadmap Tab - all three phases",
                              "flag": "Requires founder input: validate timeline feasibility with engineering team before sharing with investors."
                        },
                        {
                              "question": "Q8: What are the risks and how do we mitigate them?",
                              "answer": "Three primary risks: (1) Incumbent inertia - clubs on Shawman for 10+ years resist migration. Mitigation: we offer guided data migration service, 30-day parallel running, and a dedicated onboarding manager for first 90 days. (2) Global platform India push - MINDBODY or Zenoti adds UPI and DPDPA compliance within 18 months. Mitigation: our data sovereignty architecture is not replicable by cloud-native platforms without a fundamental rewrite; co-player community is a social network that compounds with each new member. (3) Slow enterprise sales cycle - clubs take 3-6 months to decide. Mitigation: 30-day self-serve pilot with no credit card required for Phase 1 clubs, reducing commitment barrier.",
                              "source": "SWOT Analysis Tab - Threats and Weaknesses | Features and Pricing Tab - Competitive Position Summary",
                              "flag": "Requires founder input: confirm the migration service capacity and pricing, and the free pilot terms before public commitment."
                        },
                        {
                              "question": "Q9: What is the funding ask and use of proceeds?",
                              "answer": "We are raising [amount to be specified by founder] to fund 18 months of operations. Allocation: 40% engineering (mobile app polish, Phase 2 AI features, RFID integration), 25% sales and marketing (3 city sales team, industry events, content marketing), 20% operations and customer success (onboarding managers, support team), 15% general and administrative. Key milestones funded by this round: 100 paying clubs by Month 12, INR 4 crore ARR by Month 15, first enterprise anchor client (chain or hotel group) by Month 9, Phase 2 AI features shipped by Month 12.",
                              "source": "Business Plan Builder - all previous questions | Metrics Tab",
                              "flag": "Requires founder input: replace [amount] with actual raise target, and adjust allocation percentages to match actual budget plan."
                        },
                        {
                              "question": "Q10: Why is this team uniquely positioned to win?",
                              "answer": "We are building on the foundation of Lockated (GoPhygital.work), a B2B SaaS platform already serving workplace and operations management with data sovereignty as its core architectural principle. Our unique positioning comes from: (1) proven B2B SaaS delivery capability within the Lockated product suite, (2) existing enterprise relationships that provide credibility for club management sales, (3) deep understanding of India's DPDPA regulatory landscape - our on-premise data architecture is not a feature addition, it is a foundational design choice made from Day 1, and (4) the padel and sports club boom gives us a specific, high-growth vertical that is underserved by every competitor in the market today.",
                              "source": "Product Summary Tab - Where We Are Today | SWOT - Strengths",
                              "flag": "Requires founder input: add specific team member names, prior company exits or notable achievements, and any advisory board members relevant to sports or club industry."
                        }
                  ],
                  founderChecklist: [
                        {
                              "reference": "Q4 - Pricing",
                              "action": "Confirm exact pricing tiers per branch and per-member volume thresholds"
                        },
                        {
                              "reference": "Q4 - White-Label Fee",
                              "action": "Confirm one-time and monthly fee structure for white-label mobile app"
                        },
                        {
                              "reference": "Q5 - Traction Data",
                              "action": "Replace all projected metrics with actual live club count, MRR, NPS, and DAU data"
                        },
                        {
                              "reference": "Q6 - City Priority",
                              "action": "Confirm Month 1-3 priority cities and whether channel partner programme is ready for launch"
                        },
                        {
                              "reference": "Q7 - Timeline",
                              "action": "Validate Phase 1 through 3 timeline with engineering team; adjust if needed"
                        },
                        {
                              "reference": "Q8 - Migration Service",
                              "action": "Confirm data migration service capacity, team size, and whether it is included or priced separately"
                        },
                        {
                              "reference": "Q8 - Pilot Terms",
                              "action": "Confirm 30-day free pilot terms: feature scope, support level, data kept or deleted after trial"
                        },
                        {
                              "reference": "Q9 - Funding Amount",
                              "action": "Insert actual fundraise target and verify allocation percentages match budget"
                        },
                        {
                              "reference": "Q9 - Milestone Dates",
                              "action": "Confirm 100-club and INR 4 crore ARR milestone dates with leadership team"
                        },
                        {
                              "reference": "Q10 - Team Bios",
                              "action": "Add founder and key team member names, prior achievements, and relevant advisory board members"
                        }
                  ]
            },
            detailedGTM: {
                  "targetGroups": [
                        {
                              "title": "TARGET GROUP 1: PREMIUM SPORTS CLUBS (Padel, Squash, Badminton, Pickleball) - INDIA TIER-1 CITIES",
                              "components": [
                                    {
                                          "component": "Why This TG",
                                          "detail": "This is the highest-fit TG: the product's co-player matching, court sport amenity configuration, community features, and now integrated F&B POS and loyalty management are purpose-built for this segment. India's padel market grew 45% in 2025 and now exceeds 400 courts (Q1 2026). A new padel club opening has zero existing software habit to break and typically launches with a café/F&B facility requiring a POS from Day 1. Loyalty programmes are increasingly expected by premium members: 65% of premium sports club members surveyed indicate they would visit more frequently if a rewards programme existed (FICCI Wellness 2025). This is the wedge market."
                                    },
                                    {
                                          "component": "Sales Motion",
                                          "detail": "Direct sales with 30-day free pilot, no credit card required. Target: club owners and operations directors in Mumbai, Bengaluru, Delhi NCR, Hyderabad, and Pune. Initial outreach via LinkedIn and sports club associations (Padel Federation of India, Squash Rackets Federation of India). Demo focuses on: court booking calendar, co-player matching demo, live no-show penalty walkthrough, and Super Admin revenue dashboard. Sales cycle: 3-6 weeks for new clubs, 2-4 months for clubs replacing Shawman. Deal size: INR 25,000 to 60,000/month."
                                    },
                                    {
                                          "component": "Marketing Channels",
                                          "detail": "LinkedIn targeting (club owners, sports entrepreneurs, real estate developers building sports facilities). Sports and fitness industry events: Active India Summit, FitEx India, India Sports Show, Padel India Pro events. Content marketing: YouTube video series on running a profitable padel club in India. WhatsApp community for padel and squash club operators. Search ads targeting: padel club management software India, court booking system India, squash club software India. PR: stories in Business Standard Sports, Mint Lounge fitness, and Economic Times hospitality tech."
                                    },
                                    {
                                          "component": "90-Day Launch Sequence",
                                          "detail": "Days 1-30: Identify 50 target clubs in Mumbai and Bengaluru. Begin outreach via LinkedIn and sports association introductions. Run 10 product demos per week. Convert 5 pilot clubs on free 30-day trial. Days 31-60: Activate 5 pilots. Assign dedicated onboarding manager to each. Collect daily feedback. Begin content marketing with 2 YouTube videos per month. Run retargeting ads to demo attendees. Target: 3 of 5 pilots convert to paid. Days 61-90: Scale demo volume to 20/week. Activate second-round pilots in Delhi and Hyderabad. Launch padel club WhatsApp community with 30+ operators. Target: 10 paying clubs, 2 case studies published, first referral from paying club."
                                    },
                                    {
                                          "component": "Partnership Strategy",
                                          "detail": "Padel court construction companies (PFS Padel, Padel Park India, PadelPark India - JSW-funded): integration partnership where new court builders recommend Lockated as day-1 management software. Sports equipment distributors (Head, Wilson, Decathlon India): co-marketing. Sports-focused real estate developers building integrated lifestyle developments. Fitness equipment suppliers who already have relationships with 500+ clubs."
                                    }
                              ],
                              "summaryBox": "TG 1 is the highest-velocity, highest-fit segment. We are entering at the exact moment India's padel boom is creating new clubs that have no incumbent software relationship. The co-player matching and community features are unmatched differentiators that make Lockated the only platform actively increasing court utilisation rather than just managing it. Key assumption: club owners value member retention features over cost minimisation. The one metric that tells us it is working: 5+ new paying sports clubs signed per month by Month 3."
                        },
                        {
                              "title": "TARGET GROUP 2: MULTI-BRANCH FITNESS CHAINS AND CORPORATE WELLNESS OPERATORS",
                              "components": [
                                    {
                                          "component": "Why This TG",
                                          "detail": "Multi-branch chains have the highest ACV potential (INR 40,000-80,000/month) and are actively seeking a unified platform to replace their current patchwork of branch-level tools. Corporate wellness operators are high-volume, low-churn accounts with HR department buyers who are accustomed to procurement processes. Both need multi-branch reporting and data sovereignty for enterprise procurement compliance."
                                    },
                                    {
                                          "component": "Sales Motion",
                                          "detail": "Enterprise sales with a longer cycle (3-6 months). Engage Finance Director and HR Head alongside club operations head. Lead with data sovereignty and DPDPA compliance as the primary enterprise procurement hook. Build ROI case from: (1) reduced admin headcount (typically 1-2 FTEs saved per chain), (2) no-show revenue recovery, (3) member retention improvement. Pilot: offer one branch free for 60 days before full chain rollout. Deal size: INR 40,000-80,000/month (chain) or INR 20,000-45,000/month (corporate wellness). Prioritise chains with 3-10 branches in a single metro."
                                    },
                                    {
                                          "component": "Marketing Channels",
                                          "detail": "HR technology events: People Matters TechHR, SHRM India. Facility management industry events and publications. Targeted outreach to fitness chain operators via LinkedIn (CEO, COO, Head of Operations titles at companies with 3+ gym locations). Referral programme: give first month free to existing club that refers a chain. Content: ROI calculator web tool (how much revenue does your chain lose to no-shows and manual admin annually). Digital advertising: Google search for multi-location gym software India, gym chain management system."
                                    },
                                    {
                                          "component": "90-Day Launch Sequence",
                                          "detail": "Days 1-30: Map top 30 multi-branch fitness chains in Tier-1 India cities (by branch count). Identify 10 corporate wellness operators via LinkedIn. Begin outreach. Target 5 demos with chain decision-makers. Days 31-60: Close 2 enterprise pilots (60-day free on first branch). Assign senior onboarding manager. Begin corporate wellness module development inputs from pilot clients. Days 61-90: Convert at least 1 chain to full paid contract. Publish chain case study. Target: 3 paying enterprise accounts, INR 1.2 lakh/month incremental MRR from this TG."
                                    },
                                    {
                                          "component": "Partnership Strategy",
                                          "detail": "Facility management companies (Jones Lang LaSalle, CBRE India, Colliers India) who manage corporate real estate including on-site gyms. HRMS vendors (Darwinbox, Keka) for co-sell and integration partnership. Corporate health insurance providers (Star Health, ICICI Lombard Wellness) who want digital wellness utilisation data as underwriting input."
                                    }
                              ],
                              "summaryBox": "TG 2 generates the highest ACV per account and the stickiest contracts because multi-branch configuration and consolidated reporting create deep switching costs after 6 months of data accumulation. The key assumption is that finance directors at fitness chains will prioritise consolidated reporting and DPDPA compliance above cost when comparing to Shawman. The one metric that tells us it is working: at least 1 enterprise chain (3+ branches) signed by Month 4."
                        },
                        {
                              "title": "TARGET GROUP 3: HOTELS, RESORTS, AND PREMIUM RESIDENTIAL DEVELOPMENTS WITH MANAGED AMENITIES",
                              "components": [
                                    {
                                          "component": "Why This TG",
                                          "detail": "This TG is underserved by all competitors. Hotels and resorts have both external paying members and hotel guests using the same amenity infrastructure. No software handles this mixed-access model cleanly – and none combines it with a channel controller for OTA room distribution, recipe-driven F&B management, and a unified guest folio. Lockated is the only platform that covers the full hotel club operation: room inventory, OTA channel distribution, F&B with recipe costing, club amenity management, loyalty, and accounting – all on the client's own servers. Premium residential society amenity management is a volume play with 5,000+ target properties. Both are accessed through Lockated's broader real estate and facilities management relationships within the GoPhygital.work product suite."
                                    },
                                    {
                                          "component": "Sales Motion",
                                          "detail": "Cross-sell motion through existing Lockated relationships with property developers and hotel groups. Target: property management companies managing multiple hotel or residential assets. Demonstrate the mixed guest and member management capability (unique to Lockated). Entry point: property developer launching a new sports facility and needing a management system from Day 1. Deal size: INR 30,000-70,000/month for hotels; INR 8,000-20,000/month for residential societies."
                                    },
                                    {
                                          "component": "Marketing Channels",
                                          "detail": "Property and real estate exhibitions (CREDAI NATCON, Realty Plus Summit). Hotel and hospitality technology events (Hotel Tech Summit India). Content targeting architects and developers designing sports amenities into new properties. Partnership announcements with construction and design firms. Referral programme through Lockated's existing real estate relationships."
                                    },
                                    {
                                          "component": "90-Day Launch Sequence",
                                          "detail": "Days 1-30: Map 20 premium hotel groups in Mumbai, Delhi, Bengaluru with managed sports amenities (5-star and boutique properties). Identify 10 premium residential projects with multi-amenity sports facilities. Leverage GoPhygital.work relationship database for warm introductions. Days 31-60: Complete 8 demos. Convert 2 hotels to 30-day pilot. Days 61-90: Close 1 hotel and 2 residential society accounts. Begin building residential society lightweight onboarding flow (self-service vs white-glove enterprise)."
                                    },
                                    {
                                          "component": "Partnership Strategy",
                                          "detail": "Real estate developers (DLF, Godrej Properties, Lodha, Prestige) building integrated lifestyle destinations with padel and tennis courts. Hotel property management system (PMS) vendors for integration and co-sell. Interior design and architecture firms specialising in amenity-rich developments."
                                    }
                              ],
                              "summaryBox": "TG 3 extends Lockated's addressable market by leveraging the GoPhygital.work real estate ecosystem. Hotels and resorts are high-ACV, low-churn accounts once the mixed guest-member access model is configured. Residential societies are a volume play at lower ACV but create high brand visibility within premium gated communities. The key assumption is that existing GoPhygital.work property relationships can generate warm introductions to reduce the enterprise sales cycle by 30%. The one metric that tells us it is working: first hotel group contract signed by Month 5."
                        }
                  ]
            },
            detailedRoadmap: {
                  phases: [
                        {
                              title: "PHASE 1: FOUNDATION LAUNCH (Months 1-6)",
                              summary: "PHASE 1 SUMMARY: 10 initiatives | Core platform live | India-market UPI and GST compliance | Mobile apps launched | Estimated ARR impact: INR 5-12 crore by Month 6",
                              initiatives: [
                                    { initiative: "Full Web Admin Portal Launch", feature: "Full Web Admin Portal Launch", segment: "All 10 industry segments + hotel and country club F&B/rooms", impact: "Complete web admin portal with all role-based dashboards across all 18 modules: member management, amenity configuration, F&B POS setup, room inventory configuration, accounting ledger, loyalty programme setup, and asset register. All 10 industry segments supported at launch.", timeline: "Month 1-2" },
                                    { initiative: "Native iOS and Android App Release", feature: "Native iOS and Android App Release", segment: "Premium Sports Clubs, Fitness Chains", impact: "Launch iOS and Android apps with core booking, QR check-in, digital membership card, wallet, and notifications. SQLite offline support and biometric login included.", timeline: "Month 2-3" },
                                    { initiative: "UPI and Razorpay Integration Live", feature: "UPI and Razorpay Integration Live", segment: "All India segments", impact: "Full UPI payment acceptance via NPCI through Razorpay. Fallback to CCAvenue. Auto-generated GST invoices and tax reports. Required for India market launch.", timeline: "Month 1" },
                                    { initiative: "QR Check-In and Attendance Engine", feature: "QR Check-In and Attendance Engine", segment: "Premium Sports Clubs, Corporate Wellness", impact: "QR code check-in with 15-minute validity window, single scan enforcement, manual check-in with admin approval, real-time occupancy dashboard per amenity.", timeline: "Month 2" },
                                    { initiative: "Membership Lifecycle Automation", feature: "Membership Lifecycle Automation", segment: "All segments", impact: "Auto-renewal with 3-attempt retry logic, expiry notifications at 30/7/1 days, grace period logic, auto-suspension on non-payment. Loyalty points auto-earned on renewal. Renewal reminders linked to loyalty tier upgrade notifications.", timeline: "Month 2-3" },
                                    { initiative: "Multi-Branch Configuration Module", feature: "Multi-Branch Configuration Module", segment: "Fitness Chains, Country Clubs, Hotel Groups", impact: "Branch setup, cross-branch membership and booking, separate P&L per branch, Super Admin consolidated view. Required for any multi-location club or chain.", timeline: "Month 3-4" },
                                    { initiative: "Trainer Module and Commission Engine", feature: "Trainer Module and Commission Engine", segment: "Sports Clubs, Fitness Chains, Academies", impact: "Trainer profiles with certification upload, availability calendar, session-based attendance tracking, automatic commission calculation and payroll-ready export.", timeline: "Month 3-4" },
                                    { initiative: "Family and Group Membership Module", feature: "Family and Group Membership Module", segment: "Premium Sports Clubs, Country Clubs, Residential", impact: "Family accounts with sub-IDs, consolidated billing, shared guest quota, shared calendar, age-based access restrictions for dependents.", timeline: "Month 4-5" },
                                    { initiative: "Prepaid Wallet and Credit Engine", feature: "Prepaid Wallet and Credit Engine", segment: "Corporate Wellness, Country Clubs, Hotel", impact: "INR 1,000 to 10,000 top-up denominations, bonus credits on bundles, credit transfer between family members, low balance alerts, corporate bulk load API.", timeline: "Month 5-6" },
                                    { initiative: "Core Reporting Suite", feature: "Core Reporting Suite", segment: "All segments", impact: "Membership, revenue, attendance, booking, trainer, F&B cost, asset maintenance, accounting (P&L, trial balance, GSTR), and loyalty programme reports in PDF/Excel/CSV with scheduled email delivery and role-based access.", timeline: "Month 5-6" },
                              ]
                        },
                        {
                              title: "PHASE 2: GROWTH AND COMMUNITY (Months 7-15)",
                              summary: "PHASE 2 SUMMARY: 9 initiatives | Community and AI features live | Co-player matching drives retention | AI churn and no-show prediction | Estimated ARR impact: INR 15-25 crore by Month 15 (300-500 clubs)",
                              initiatives: [
                                    { initiative: "Co-Player Matching (AI Skill-Level)", feature: "Co-Player Matching (AI Skill-Level)", segment: "Premium Sports Clubs, Country Clubs", impact: "AI model trained on booking history and declared skill level to match members for sports sessions. Radius-based search (5km default), availability matching, partnership success rate tracking. Primary churn-reduction feature.", timeline: "Month 7-9" },
                                    { initiative: "Community Posts with Booking Links", feature: "Community Posts with Booking Links", segment: "Premium Sports Clubs, Fitness Chains, Academies", impact: "Member-created posts in 4 categories with hashtags, image support, and direct links to open booking slots. Admin moderation queue, pinned announcements, post analytics, auto-cleanup policy.", timeline: "Month 8-9" },
                                    { initiative: "Member Directory with Privacy Controls", feature: "Member Directory with Privacy Controls", segment: "Premium Sports Clubs, Country Clubs", impact: "Searchable directory filtered by interests, tier, and activity level. 3-level privacy (Public/Semi-Private/Private). Direct messaging between members. Block and report function.", timeline: "Month 8-10" },
                                    { initiative: "AI No-Show Prediction Engine", feature: "AI No-Show Prediction Engine", segment: "All segments with high-value amenities", impact: "ML model predicting no-show likelihood per booking based on member history, amenity type, day/time, and weather. High-risk bookings flagged for proactive outreach in operations dashboard.", timeline: "Month 9-11" },
                                    { initiative: "AI Churn Prediction and Retention List", feature: "AI Churn Prediction and Retention List", segment: "Fitness Chains, Corporate Wellness", impact: "Member-level churn risk scoring based on attendance frequency, booking recency, community engagement, and support tickets. At-risk members surface in retention priority queue with recommended action.", timeline: "Month 10-12" },
                                    { initiative: "Guest Invite System with Split Payment", feature: "Guest Invite System with Split Payment", segment: "Premium Sports Clubs, Country Clubs", impact: "Member invites other members to joint bookings. Invitee accepts/declines within 24 hours. Auto-creates group booking on acceptance. Payment split equally or custom ratio. Digital waiver for non-member guests.", timeline: "Month 9-11" },
                                    { initiative: "Corporate Wellness Module", feature: "Corporate Wellness Module", segment: "Corporate Wellness Centres", impact: "Enhanced corporate membership management: bulk wallet API, employee cohort reporting, HR system data export (Excel/CSV), department-level usage analytics, wellness ROI dashboard for HR.", timeline: "Month 10-12" },
                                    { initiative: "Revenue Optimisation AI Engine", feature: "Revenue Optimisation AI Engine", segment: "Multi-branch chains, Country Clubs", impact: "AI analyses slot utilisation, F&B peak hours, room RevPAR data, loyalty redemption patterns, and pricing elasticity to suggest optimal pricing changes. Recommends double-points promotions for off-peak slots to drive utilisation.", timeline: "Month 12-14" },
                                    { initiative: "Advanced Analytics Suite (Cohort, Heatmap, Segment)", feature: "Advanced Analytics Suite (Cohort, Heatmap, Segment)", segment: "Finance Managers, Investors, Super Admins", impact: "Retention cohort table by join month, peak hour demand heatmap, VIP vs casual member segment comparison, 12-month AI revenue forecast with sensitivity analysis, pro-forma P&L statement.", timeline: "Month 13-15" },
                              ]
                        },
                        {
                              title: "PHASE 3: ENTERPRISE AND AI MOAT (Months 16-24)",
                              initiatives: [
                                    { initiative: "RFID and Biometric Access Control Integration", feature: "RFID and Biometric Access Control Integration", segment: "Country Clubs, Corporate Wellness, Gated Communities", impact: "Production-ready RFID card tap and facial recognition via Wiegand protocol and biometric hardware API. Hardware-agnostic: supports ZKTeco, HikVision, ESSL. Member tap replaces QR check-in at turnstile-level access points.", timeline: "Month 16-18" },
                                    { initiative: "White-Label Mobile App for Club Brands", feature: "White-Label Mobile App for Club Brands", segment: "Country Clubs, Fitness Chains, Hotel Groups", impact: "Club operator gets a fully branded iOS and Android app under their own app store account. All Lockated features available under the club's brand identity. Separate app pricing tier. Enables premium club brand differentiation.", timeline: "Month 16-19" },
                                    { initiative: "Government and Municipal Module", feature: "Government and Municipal Module", segment: "Government Sports Complexes, Municipal Bodies", impact: "Offline payment mode for cash-on-collection scenarios. Multi-language interface (Hindi, regional languages). Government reporting templates. Public facility booking via UPI QR at facility entrance. Tailored for SAI and state sports authority procurement.", timeline: "Month 17-20" },
                                    { initiative: "Tournament and Event Management Module", feature: "Tournament and Event Management Module", segment: "Premium Sports Clubs, Academies", impact: "Full tournament bracket management, event registration with entry fee collection, leaderboard display, prize pool management, and event-specific notifications. Targets padel, squash, and badminton club tournament calendars.", timeline: "Month 17-20" },
                                    { initiative: "ERP and HRMS Integration Connectors", feature: "ERP and HRMS Integration Connectors", segment: "Corporate Wellness (Enterprise)", impact: "Pre-built connectors for SAP SuccessFactors, Darwinbox, and Workday for corporate wellness seat. Pre-built Tally connector for accounting export. Reduces enterprise procurement friction significantly.", timeline: "Month 19-22" },
                                    { initiative: "Marketplace and Network Discovery", feature: "Marketplace and Network Discovery", segment: "All India segments", impact: "Allow clubs on Lockated to optionally list themselves in a member-accessible marketplace. Members with Lockated profiles at one club can discover and visit partner clubs. Opt-in for clubs; no mandatory participation.", timeline: "Month 20-24" },
                                    { initiative: "AI Personal Fitness Coach (Member-Facing)", feature: "AI Personal Fitness Coach (Member-Facing)", segment: "Fitness Chains, Sports Clubs", impact: "Member-facing AI suggests optimal booking times based on personal goals, historical patterns, and class availability. Sends proactive nudges (You have not done pilates in 2 weeks, a slot opened tonight). Increases session frequency per member.", timeline: "Month 20-24" },
                                    { initiative: "Predictive Maintenance Module", feature: "Predictive Maintenance Module", segment: "Large Sports Clubs, Hotel Amenities", impact: "Sensor-integrated (IoT optional) or manual maintenance logging that uses booking utilisation data to predict when equipment or courts need service before failure. Admin receives predictive maintenance alerts.", timeline: "Month 21-24" },
                              ],
                              summary: "PHASE 3 SUMMARY: 8 initiatives | Enterprise and government segments unlocked | White-label capability expands addressable market 3x | Full ERP-grade platform with accounting, asset management, F&B, rooms, loyalty, and channel management | Estimated ARR impact: INR 35-65 crore by Month 24 (700-1,100 clubs and properties)"
                        }
                  ]
            },
            detailedUseCases: {
                  "industryUseCases": [
                        {
                              rank: "1",
                              profile: "Multi-court padel, squash, or badminton club with 200–1,000 members and 4–12 courts; INR 2,000–5,000/month membership fee",
                              currentTool: "WhatsApp groups, Excel sheets, or basic billing software",
                              "industry": "1. Premium Sports Clubs (Padel, Squash, Badminton, Pickleball)",
                              "workflow": "Member joins padel club, books a court, invites a co-player, splits payment, rates their partner after the session. Admin tracks court utilisation and no-show patterns by time slot.",
                              "features": "Member Registration (OTP onboarding), Membership Plan Selection, Court Sports Amenity Configuration, Peak/Off-Peak Pricing Engine, Member-to-Member Invites with Split Payment, Co-Player Ratings, AI No-Show Prediction, Waitlist Auto-Promotion, Attendance Heatmaps",
                              "outcome": "Court utilisation rises from 55% to 80%+ as co-player matching fills previously unfilled slots. No-show rate drops by 12 percentage points. Member NPS increases as social engagement becomes a built-in feature."
                        },
                        {
                              rank: "2",
                              profile: "Multi-branch fitness chain with 3–10 locations, 500–5,000 members per branch, monthly and annual memberships",
                              currentTool: "Manual Excel, branch-level POS terminals, WhatsApp for staff coordination",
                              "industry": "2. Premium and Multi-Branch Fitness Chains",
                              "workflow": "Branch manager reviews daily occupancy across 3 locations, identifies an underperforming branch, triggers a targeted promotion to at-risk members, and reviews trainer commission for the month.",
                              "features": "Multi-Branch Comparison Dashboard (Super Admin), Real-Time Occupancy View, AI Churn Prediction and Retention Priority List, Targeted Broadcast by Segment, Trainer Commission Engine, Revenue Forecast, PDF Report Export",
                              "outcome": "Chain owner reduces manual reporting from 3 days per month to real-time dashboards. Churn rate on flagged members decreases by 18% after targeted promotions. Trainer payroll disputes eliminated."
                        },
                        {
                              rank: "3",
                              profile: "HR department managing 100–1,000 employee wellness benefits at a corporate campus fitness facility",
                              currentTool: "Manual reimbursement, Excel tracking, HR portal for budget allocation",
                              "industry": "3. Corporate Wellness Centres and Office Fitness Facilities",
                              "workflow": "HR manager bulk-allocates monthly wallet credits to 200 employees via API. Employees self-book gym slots, yoga classes, and personal training. HR reviews aggregate utilisation report for quarterly wellness ROI report.",
                              "features": "Corporate Membership API (Bulk Wallet Load), Family and Group Billing Options, Self-Service Web Portal (Employee), Group Classes Amenity Type, Attendance Report by Employee Cohort, Monthly Billing Summary, PDF Report for HR",
                              "outcome": "HR eliminates 40 hours/month of manual reimbursement processing. Employee wellness programme participation rises 35% when self-booking is mobile-enabled. Finance receives automated monthly utilisation summary for ROI reporting."
                        },
                        {
                              rank: "4",
                              profile: "3–5 star hotel or resort with amenity complex including courts, pool, gym, F&B; 50–300 rooms; mixed member and guest usage",
                              currentTool: "PMS for rooms, separate manual systems for amenity and F&B, no unified management",
                              "industry": "4. Hotel and Resort Amenity Management",
                              "workflow": "Hotel guest arrives and is added as a Pay-Per-Use member. They book the padel court for 6 PM, then order food and beverages from the club's F&B app after the match — the charge posts directly to their member tab. The front desk uses Room Inventory Management to assign the guest's overnight stay room, and the system syncs room rates to OTA channels via the Channel Controller. At checkout, a single unified folio covers room, amenity bookings, F&B spend, and any extras.",
                              "features": "Pay-Per-Use Plan (30-day pass), QR Code Check-In, Amenity Configuration for Multiple Amenity Types, F&B Mobile Ordering with Member Tab Billing, Room Inventory Management (Availability Grid, e-Registration Card, Unified Folio), Channel Controller (OTA Two-Way Sync, BAR Management), Consolidated Guest Billing across Room + Amenity + F&B",
                              "outcome": "Hotel generates INR 8,000–15,000 per guest per stay from amenity and F&B bookings vs INR 500–800 without digital upselling. F&B revenue per cover increases 35%+ when mobile ordering replaces counter queues. Room RevPAR rises 15–20% via OTA reach expansion. Checkout time drops from 15 minutes to under 3 minutes with unified folio."
                        },
                        {
                              rank: "5",
                              profile: "Gated community with 200–2,000 resident units, shared amenities including pool, gym, sports courts, managed by resident committee",
                              currentTool: "Excel-based slot allocation, manual check-in register, WhatsApp group notifications",
                              "industry": "5. Residential Society and Gated Community Amenity Management",
                              "workflow": "Resident logs in, books the swimming pool slot for Saturday morning, adds two family members, and receives QR check-in codes for all three. Society committee member reviews weekly utilisation report.",
                              "features": "Member Registration (Resident), Family Member Accounts with Age-Based Access, Equipment Amenity Configuration (Pool, Gym), Per-Slot Capacity Limits, QR Code Check-In, Real-Time Occupancy, Facility Utilisation Report",
                              "outcome": "Booking disputes drop by 90% when residents have a visible, fair slot allocation system. Committee time spent on amenity management drops from 5 hours/week to 30 minutes/week. Overcrowding incidents eliminated."
                        },
                        {
                              rank: "6",
                              profile: "Government sports complex or SAI-affiliated facility with 500–5,000 daily visitors, publicly funded",
                              currentTool: "Cash payments, paper booking register, manual attendance, government reporting by Excel",
                              "industry": "6. Government and Municipal Sports Complexes",
                              "workflow": "Citizen registers online, selects a badminton court slot (Pay-Per-Use), pays via UPI, receives QR confirmation, and checks in at the facility. Admin reviews daily revenue and footfall for the monthly government report.",
                              "features": "User Registration (Phone OTP), Pay-Per-Use Plan, Court Sports Amenity (Badminton), UPI Payment Integration, QR Code Check-In, Real-Time Occupancy, Attendance Report, Revenue Report (PDF/Excel)",
                              "outcome": "Facility moves from cash-only to digital payments, increasing audit readiness. Queue at front desk eliminated. Monthly revenue reporting to government body is automated. Slot utilisation increases 40% as advance booking drives planning."
                        },
                        {
                              rank: "7",
                              profile: "Standalone premium gym or CrossFit box with 100–500 members, single location, owner-operated",
                              currentTool: "Basic gym management software (ProGym, Fitness Manager) or Excel plus WhatsApp",
                              "industry": "7. Standalone Premium Gyms and Boutique Fitness Studios",
                              "workflow": "Member joins a CrossFit box, books group WOD classes for the week, adds a 1:1 personal training session, and tops up their wallet to pay. Club manager uses Recipe Management to set standard food costs for the juice bar, tracks equipment via the Asset Register (QR-tagged treadmills, rowers), and runs the month-end close through the Accounting module — journal entries auto-post from all membership payments and F&B sales.",
                              "features": "Membership Plan Selection, Group Classes Amenity Type, Coaching Services Amenity Type, Prepaid Wallet Top-Up, QR Check-In, Recipe Management (Food Cost Calculation, Ingredient BOM), Asset Management (QR-Tagged Register, Preventive Maintenance Scheduling), Accounting Module (Auto Journal Entries, GST Reports, Month-End Close)",
                              "outcome": "Gym owner replaces Excel + WhatsApp group with a single app. Member retention improves from 72% to 89% in 90 days. Recipe management reduces juice bar food cost from 44% to 29%. Equipment downtime drops 60% via preventive maintenance alerts. Month-end close cut from 5 working days to 1 day."
                        },
                        {
                              rank: "8",
                              profile: "Sports academy or coaching centre with 50–500 enrolled students, batch-based coaching structure",
                              currentTool: "Manual attendance registers, Excel billing, WhatsApp groups for parent communication",
                              "industry": "8. Sports Academies and Coaching Centres",
                              "workflow": "Academy student is enrolled in a tennis coaching batch, parent receives booking confirmations and attendance reports, coach marks session attendance, and admin calculates monthly coach fee from session count.",
                              "features": "Membership Registration with Document Upload, Coaching Services Amenity Type, Trainer Profiles with Session Types, Trainer Attendance Tracking, Commission Calculation, Multi-Channel Notifications (Email to Parent), Attendance Report Export",
                              "outcome": "Academy eliminates paper attendance registers. Coach productivity is measurable for the first time. Parent satisfaction improves with proactive notifications. Monthly fee settlement reduced from 2 days to 10 minutes."
                        },
                        {
                              rank: "9",
                              profile: "University or college sports facility with 500–5,000 students, multiple sports courts and facilities",
                              currentTool: "Manual booking process, paper registers, Excel reports, ad-hoc WhatsApp coordination",
                              "industry": "9. University and College Sports Facilities",
                              "workflow": "Student books a badminton court for Tuesday evening, receives QR confirmation, checks in, and the facility manager views the week's facility utilisation by sport to plan maintenance windows.",
                              "features": "Student Membership Registration, Court Sports Amenity Configuration, Slot Selection with Calendar View, QR Code Check-In, Maintenance Slot Blocking, Facility Utilisation Report, Real-Time Occupancy View",
                              "outcome": "Facility utilisation data enables evidence-based investment decisions. Maintenance scheduling conflicts eliminated. Student disputes over bookings drop to zero. Administrative workload for facility office reduced by 60%."
                        },
                        {
                              rank: "10",
                              profile: "Premium country club or recreational member club with 500–3,000 members, multiple amenities including F&B, rooms, courts",
                              currentTool: "Legacy club management software (Shawman), Tally for accounting, separate POS for F&B",
                              "industry": "10. Country Clubs and Recreational Member Clubs",
                              "workflow": "Long-standing member family renews their annual plan, books a golf lesson and pool lane. After golf, the member orders lunch through the F&B app — points are automatically earned on F&B spend under the club's tiered Loyalty Programme (Bronze to Platinum). Finance manager runs the quarterly close through the Accounting module: all membership, F&B, and amenity revenue auto-posts as journal entries, GSTR-3B is generated in one click.",
                              "features": "Annual Membership Plan, Family Membership with Consolidated Billing, Coaching Services Amenity, F&B POS with Member Tab Billing, Recipe Management (Menu Engineering, Food Cost Control), Loyalty Programme (Tiered Points on Bookings + F&B + Referrals, Tier Upgrade Notifications), Accounting Module (Auto Journal Entries, GSTR-1/3B Generation, Bank Reconciliation)",
                              "outcome": "Member self-service reduces front desk calls by 70%. F&B revenue grows 40%+ when members order digitally and earn loyalty points on spend. Loyalty programme lifts monthly retention from 82% to 94% within 6 months. Month-end accounting close reduced from 7 days to 2 days. Consolidated family billing eliminates billing disputes."
                        }
                  ],
                  "internalTeamUseCases": [
                        {
                              "team": "Club Operations Manager",
                              process: "Starts day with real-time occupancy dashboard, reviews today's bookings, checks trainer schedules, blocks a maintenance slot for court resurfacing, scans QR code on a treadmill to log a repair request in the Asset Register, and reviews the preventive maintenance schedule for gym equipment due this week.",
                              "features": "Real-Time Occupancy View, Trainer Schedule Dashboard, Maintenance Slot Blocking, Asset Management Register (QR Tagging, Custodian Assignment, Maintenance Alerts, Preventive Maintenance Calendar, AMC Alert Engine), Notification Centre",
                              benefit: "Reduces morning operations review from 45 minutes to 10 minutes. No double-bookings. Equipment downtime reduced by 60% as preventive maintenance prevents unexpected failures. AMC renewals tracked proactively — zero lapsed contracts. Maintenance history exportable for insurance and audit."
                        },
                        {
                              "team": "Finance and Billing Team",
                              process: "Runs monthly revenue report, reviews GST liability for filing, downloads aging of receivables for follow-up, reconciles bank statement against system receipts, generates GSTR-1 and GSTR-3B JSON files directly from the Accounting module for upload to GST portal, and closes the books without touching Tally or a separate accounting package.",
                              "features": "Revenue Report by Amenity and Tier, GST Tax Report, Aging of Receivables, Manual Invoice for Corporate Clients, Accounting Module (Auto Journal Entries from All Modules, GSTR-1 and GSTR-3B JSON Generation, TDS Compliance, Bank Reconciliation, Trial Balance, P&L Report)",
                              benefit: "Month-end close reduced by 2 days. CA reconciliation time drops 50%. GSTR filing errors drop to zero — JSON file uploads directly to GST portal. All data audit-ready with double-entry ledger. Eliminates the 15–30 hours/month previously spent exporting to Tally."
                        },
                        {
                              "team": "Front Desk Staff",
                              process: "Checks in members via QR scan tablet, processes walk-in payments for Pay-Per-Use slots, adds a guest booking with waiver, and escalates one membership query to the Branch Manager.",
                              "features": "QR Code Check-In (Staff Tablet Mode), Walk-In Payment Processing, Guest Data Capture and Digital Waiver, Member Profile Quick View, Role-Based Access (Front Desk scope)",
                              benefit: "Front desk handles 3x more check-ins per hour with QR vs manual log. Walk-in revenue captured digitally. Membership queries escalated in one tap."
                        },
                        {
                              "team": "Trainers and Coaches",
                              process: "Logs into trainer app, views today's assigned sessions, marks attendance for group class participants, reviews their own commission accrued this month, and responds to a member review.",
                              "features": "Trainer Availability Calendar, Session Assignment Workflow, Group Class Attendance Marking, Commission Dashboard, Rating and Review Response",
                              benefit: "Trainer self-service eliminates scheduling calls with admin. Commission visibility increases trainer motivation and reduces payroll disputes."
                        },
                        {
                              "team": "Marketing and Retention Team",
                              process: "Pulls AI churn prediction list, segments members by last booking date and amenity preference, sends targeted WhatsApp campaigns with personalised offers, monitors loyalty tier distribution to identify members close to Gold/Platinum upgrade, and sets up double-points promotions for off-peak booking slots to drive utilisation.",
                              "features": "AI Churn Prediction List, Audience Segmentation by Activity Level and Tier, Scheduled WhatsApp Notification Campaigns, Loyalty Programme Management (Tier Upgrade Notifications, Configurable Points Earn Rules, Double-Points Promotions, Partner Network Redemption), Retention Dashboard",
                              benefit: "Targeted retention campaigns achieve 25–30% conversion on at-risk members vs 5% for broadcast messages. Loyalty programme lifts monthly visit frequency by 35%+ for Gold and Platinum tier members. Double-points promotions fill off-peak slots, raising utilisation from 45% to 68% for those periods."
                        },
                        {
                              "team": "HR / Employee Wellness Coordinator (Corporate Clients)",
                              process: "Loads INR 500 monthly wellness credits to all 300 employees via the corporate API, downloads monthly utilisation report to measure ROI, and adds 10 new joiners to the corporate membership plan.",
                              "features": "Corporate Bulk Wallet Load API, Corporate Membership Sub-IDs, Monthly Utilisation Report by Employee, Individual Account Activation/Deactivation",
                              benefit: "HR eliminates 20 hours/month of manual reimbursement. Wellness programme ROI is measurable and reportable to leadership. New employee onboarding to wellness programme takes 2 minutes."
                        }
                  ]
            },
            detailedMetrics: {
                  clientImpact: [],
                  businessTargets: [],
                  "sheet": {
                        "title": "CLUB MANAGEMENT - METRICS AND KPIs",
                        "sections": [
                              {
                                    "title": "Section 1: Client Impact | Section 2: Product Health | Section 3: Business KPIs | All metrics have 4 time targets",
                                    "columns": [],
                                    "rows": []
                              },
                              {
                                    "title": "SECTION 1: CLIENT-FACING IMPACT METRICS (10 metrics with landing page claims)",
                                    "columns": [
                                          "Metric",
                                          "How Measured",
                                          "Landing Page Claim",
                                          "Current State (No Software)",
                                          "With Lockated (Target)"
                                    ],
                                    "rows": [
                                          [
                                                "Court / Facility Utilisation Rate",
                                                "Total completed bookings / total available slots x 100 per week",
                                                "Fill 80%+ of your courts every week with smart booking and co-player matching",
                                                "45-60% average utilisation typical",
                                                "Target: 75-85% utilisation within 90 days of launch"
                                          ],
                                          [
                                                "No-Show Rate per Amenity",
                                                "Total no-shows / total bookings x 100 by amenity per month",
                                                "Cut no-show losses by 60% with automated penalties and AI prediction",
                                                "18-25% no-show rate typical with manual booking",
                                                "Target: below 8% no-show rate via AI prediction and penalty engine"
                                          ],
                                          [
                                                "Member Monthly Retention Rate",
                                                "Active members at end of month / active members at start of month x 100",
                                                "Retain 95%+ of members month on month with community features, AI retention engine, and tiered loyalty programme (Bronze to Platinum)",
                                                "Typical India club retention: 70-80%/month without digital tools",
                                                "Target: 93-95% monthly retention within 6 months"
                                          ],
                                          [
                                                "Average Sessions per Member per Month",
                                                "Total completed check-ins / total active members per month",
                                                "Increase member visit frequency by 2.5x with co-player matching, streak tracking, and loyalty points earned per visit and F&B spend",
                                                "Typical: 3-5 sessions/member/month at clubs without an app",
                                                "Target: 7-10 sessions/member/month within 90 days"
                                          ],
                                          [
                                                "Revenue Recovered from No-Show Penalties",
                                                "Sum of all no-show penalties collected per month in INR",
                                                "Recover INR 50,000+ per month in previously lost no-show revenue automatically",
                                                "INR 0 - no-shows typically go unpenalised",
                                                "Target: INR 40,000-80,000/month recovered for a 200-member club"
                                          ],
                                          [
                                                "Digital Payment Adoption Rate",
                                                "UPI + card + wallet payments / total payments x 100",
                                                "Move 95%+ of transactions digital within 30 days - no more cash handling headaches",
                                                "Typical: 40-60% cash at India sports clubs",
                                                "Target: 95%+ digital payment rate within 30 days of launch"
                                          ],
                                          [
                                                "Admin Hours Saved per Week",
                                                "Self-reported by club manager at 30-day and 90-day check-in",
                                                "Save 20+ hours per week of manual admin work from Day 1 — including GST filing, bank reconciliation, and F&B inventory management",
                                                "Estimated 30-40 hours/week on manual bookings, renewals, and invoicing",
                                                "Target: reduction to under 10 hours/week within 30 days"
                                          ],
                                          [
                                                "Member App Adoption Rate",
                                                "Members who have logged into the app at least once / total active members x 100",
                                                "Get 80%+ of your members booking digitally within 60 days",
                                                "0% - no app exists before Lockated",
                                                "Target: 60% app adoption within 30 days, 80% within 60 days"
                                          ],
                                          [
                                                "Trainer Commission Dispute Rate",
                                                "Disputed commission calculations / total trainer sessions per month x 100",
                                                "Eliminate trainer commission disputes with automated, transparent calculations",
                                                "Typical: 2-4 disputes per trainer per month at manually-managed clubs",
                                                "Target: 0 disputes within 60 days as automation replaces manual calculation"
                                          ],
                                          [
                                                "Co-Player Match Success Rate (Phase 2)",
                                                "Accepted invite sessions / total co-player invites sent x 100",
                                                "Connect your members for 70%+ of co-player sessions automatically",
                                                "0% - no matching mechanism exists without Lockated",
                                                "Target: 65-75% invite acceptance rate within 3 months of Phase 2 launch"
                                          ]
                                    ]
                              },
                              {
                                    "title": "SECTION 2: PRODUCT HEALTH METRICS (8 core metrics - 4 targets each)",
                                    "columns": [
                                          "Metric (with activation definition)",
                                          "30-Day (Current Product)",
                                          "30-Day (with Phase 1)",
                                          "3-Month (Current Product)",
                                          "3-Month (with Phase 1)"
                                    ],
                                    "rows": [
                                          [
                                                "New Club Signups(Pilot started)",
                                                "5 pilots signed",
                                                "10 pilots signed (Phase 1 launch momentum)",
                                                "15 cumulative clubs",
                                                "30 cumulative clubs"
                                          ],
                                          [
                                                "Activated Clubs(Activation = at least 10 member bookings completed in first 14 days)",
                                                "3 of 5 pilots activated",
                                                "8 of 10 activated (improved onboarding)",
                                                "12 of 15 activated",
                                                "26 of 30 activated"
                                          ],
                                          [
                                                "Paid Conversions(Pilot to paid after 30 days)",
                                                "2 of 3 activated convert",
                                                "6 of 8 activated convert",
                                                "10 paying clubs",
                                                "22 paying clubs"
                                          ],
                                          [
                                                "Feature Adoption Rate(% of paying clubs using 5+ modules actively)",
                                                "40% of paying clubs",
                                                "55% with Phase 1 onboarding checklist",
                                                "60% of paying clubs",
                                                "70% of paying clubs"
                                          ],
                                          [
                                                "NPS Proxy(Post-90-day survey: Would you recommend Lockated to another club?)",
                                                "Target NPS 40+",
                                                "Target NPS 50+ (Phase 1 quality improvements)",
                                                "Target NPS 45+",
                                                "Target NPS 55+"
                                          ],
                                          [
                                                "Support Ticket Volume(tickets per paying club per month)",
                                                "Under 8 tickets/club/month",
                                                "Under 5 tickets/club/month (better documentation)",
                                                "Under 6 tickets/club/month",
                                                "Under 4 tickets/club/month"
                                          ],
                                          [
                                                "Monthly Churn Rate(clubs cancelled / total paying clubs x 100)",
                                                "Below 5%/month",
                                                "Below 4%/month",
                                                "Below 4%/month",
                                                "Below 3%/month"
                                          ],
                                          [
                                                "North Star Metric: Sessions Booked per Active Member per Month(Proxy for platform value delivered)",
                                                "Target 5 sessions/member/month",
                                                "Target 6 sessions/member/month (app + notifications)",
                                                "Target 6 sessions/member/month",
                                                "Target 8 sessions/member/month (co-player, streaks)"
                                          ]
                                    ]
                              },
                              {
                                    "title": "SECTION 3: BUSINESS KPIs",
                                    "columns": [
                                          "KPI",
                                          "Target (Month 6)",
                                          "Target (Month 12)",
                                          "Target (Month 18)",
                                          "Target (Month 24)"
                                    ],
                                    "rows": [
                                          [
                                                "Monthly Recurring Revenue (MRR)",
                                                "INR 20-30 lakh",
                                                "INR 70-100 lakh",
                                                "INR 1.8-2.5 crore",
                                                "INR 3.5-6.5 crore"
                                          ],
                                          [
                                                "Paying Clubs",
                                                "30-50 clubs",
                                                "100-150 clubs",
                                                "250-350 clubs",
                                                "500-700 clubs"
                                          ],
                                          [
                                                "Customer Acquisition Cost (CAC)",
                                                "Below INR 75,000/club",
                                                "Below INR 60,000/club",
                                                "Below INR 50,000/club",
                                                "Below INR 40,000/club"
                                          ],
                                          [
                                                "Average Contract Value (ACV)",
                                                "INR 35,000–55,000/month (core platform; F&B + accounting upsell drives uplift)",
                                                "INR 50,000–80,000/month (full-service clubs: F&B + rooms + accounting + loyalty)",
                                                "INR 65,000–1,00,000/month (expanded module adoption)",
                                                "INR 80,000–1,20,000/month (country clubs + club-hotels with all 18 modules)"
                                          ],
                                          [
                                                "LTV:CAC Ratio",
                                                "Target 4:1",
                                                "Target 6:1",
                                                "Target 8:1",
                                                "Target 10:1+"
                                          ],
                                          [
                                                "Gross Revenue Retention (GRR)",
                                                "85%+",
                                                "88%+",
                                                "90%+",
                                                "92%+"
                                          ],
                                          [
                                                "Net Revenue Retention (NRR)",
                                                "100%+ (expansion via F&B, accounting, loyalty module upsells)",
                                                "108%+",
                                                "112%+",
                                                "118%+"
                                          ],
                                          [
                                                "Monthly Active Clubs (using platform weekly)",
                                                "85% of paying clubs",
                                                "88% of paying clubs",
                                                "90% of paying clubs",
                                                "92% of paying clubs"
                                          ]
                                    ]
                              }
                        ]
                  }
            },
            detailedMarketAnalysis: {
                  "globalMarketSize": [
                        {
                              "metric": "Global Club Management Software Market (2024)",
                              "value": "USD 1.64 billion",
                              "source": "Research and Markets 2025 - conservative estimate across multiple forecasts"
                        },
                        {
                              "metric": "Global Market Projected 2030",
                              "value": "USD 2.4 - 8.9 billion (consensus range)",
                              "source": "CAGR estimates range 6.5% to 14.6% depending on scope definition"
                        },
                        {
                              "metric": "India Market Estimated Share (2024)",
                              "value": "USD 85 - 120 million",
                              "source": "India estimated at 5-7% of APAC market; APAC is fastest growing region"
                        },
                        {
                              "metric": "India Fitness Industry TAM (2024)",
                              "value": "INR 4,500 crores (approx USD 540M)",
                              "source": "IHRSA and CII estimates; includes gyms, sports clubs, wellness centres"
                        },
                        {
                              "metric": "Number of Organised Fitness and Sports Clubs in India (2024)",
                              "value": "Estimated 15,000-20,000",
                              "source": "Includes premium gyms, sports clubs, hotel amenity operations - CII/FICCI wellness reports"
                        },
                        {
                              "metric": "Padel Courts in India (2025)",
                              "value": "400+ and growing rapidly (45% YoY; 15 new padel clubs opened Jan–Mar 2026 alone)",
                              "source": "India named high-growth market in Playtomic Global Padel Report 2025 - PwC Strategy&"
                        },
                        {
                              "metric": "India Club Management SaaS Penetration",
                              "value": "Below 15% of clubs use any digital system",
                              "source": "Majority still use Excel, WhatsApp, or basic billing software"
                        },
                        {
                              "metric": "India Serviceable Market for Lockated (SAM)",
                              "value": "INR 2,500 – 3,800 crore over 5 years (expanded from INR 800–1,200 crore core platform with addition of F&B, Room Management, Accounting, and Loyalty modules raising ACV per club from INR 25,000–35,000/month to INR 55,000–1,20,000/month for full-service clubs)",
                              "source": "Based on 3,000 target clubs at INR 25,000-35,000/month average ACV"
                        }
                  ],
                  "competitors": [
                        { name: "Shawman Club Management System", hq: "India (Mumbai)", indiaPrice: "INR 8,000 - 25,000/month (quote-based, per branch)", globalPrice: "N/A - India-only product", strength: "20+ years India market presence, ISO 9001 certified, integrated POS, 99.9% uptime SLA, strong billing module, multi-location support", weakness: "No mobile app for members, no community or co-player features, legacy UI/UX with no AI analytics, no loyalty programme engine, no recipe management or food cost module, inflexible pricing structure, no data sovereignty architecture", sovereignty: "India servers — client data within India jurisdiction but on vendor infrastructure", segment: "India - Premium and Mid-market Sports Clubs and Country Clubs" },
                        { name: "MINDBODY (ABC Fitness)", hq: "USA (San Luis Obispo)", indiaPrice: "INR 12,000 - 60,000+/month (USD 139-599 converted)", globalPrice: "USD 139 - 599/month (Starter to Ultimate)", strength: "Largest wellness marketplace with 50M+ consumer app users, strong brand, deep feature set for wellness, global presence, AI-assisted scheduling", weakness: "US data storage violates India DPDPA, expensive for India SMBs, no UPI/RuPay payment rails, no GST invoicing, no F&B POS or recipe management module, no room inventory/PMS capability, no India-market channel controller for OTA sync", sovereignty: "US servers — violates India DPDPA; member data outside India jurisdiction", segment: "USA/Global - Premium Wellness, Spa, and Fitness Studios" },
                        { name: "ABC Glofox", hq: "Ireland (Dublin)", indiaPrice: "INR 10,000 - 50,000/month (USD 110-600 approx)", globalPrice: "USD 110 - 600/month (undisclosed tiers)", strength: "Strong branded mobile app, boutique fitness focus, clean UX, good class management, integrates with ClassPass", weakness: "No data sovereignty (EU servers), limited analytics depth, poor multi-branch support, no community or co-player features, no F&B module, no accounting integration, no room management or OTA channel capability", sovereignty: "EU servers — GDPR compliant but not India DPDPA compliant", segment: "Global - Boutique Fitness Studios and Gyms" },
                        { name: "Zen Planner (Daxko)", hq: "USA (Homewood AL)", indiaPrice: "INR 8,500 - 30,000/month (USD 99-350 converted)", globalPrice: "USD 99 - 350/month depending on member count", strength: "Strong for CrossFit and martial arts, workout tracking (SugarWOD integration), mobile app, solid scheduling, good customer support", weakness: "US data storage, no UPI/GST invoice, no community features, weak multi-location management, no F&B or recipe management module, no accounting module, no room inventory management", sovereignty: "US servers — not India DPDPA compliant", segment: "USA/Global - CrossFit, Martial Arts, and Niche Fitness" },
                        { name: "Virtuagym", hq: "Netherlands (Amsterdam)", indiaPrice: "INR 12,000 - 45,000/month (USD 140-550 approx)", globalPrice: "USD 140 - 550/month (SMB to Enterprise)", strength: "White-label app capability, good nutrition and fitness tracking integration, enterprise-grade scaling, European GDPR compliance, video workout library", weakness: "No India payment rails, no GST compliance, data stored on Virtuagym servers (not client-owned), no F&B or recipe module, no room management, no OTA channel controller, no loyalty programme engine", sovereignty: "Virtuagym EU servers — not client-owned infrastructure, not India DPDPA compliant", segment: "Europe/Global - Mid-to-Enterprise Gym Chains" },
                        { name: "EZFacility (Jonas Software)", hq: "USA (Woodbury NY)", indiaPrice: "INR 7,500 - 28,000/month (USD 85-325 approx)", globalPrice: "USD 85 - 325/month (tiered by features)", strength: "Strong sports-specific features (leagues, tournaments, court rental), facility management depth, good for multi-sport clubs, established brand", weakness: "No mobile-first approach, aging UI, no community or co-player features, no AI analytics, US data storage, no F&B module, no accounting integration, no loyalty programme", sovereignty: "US servers — not India DPDPA compliant", segment: "USA/Global - Multi-Sport Facilities and Club Management" },
                        { name: "Omnify", hq: "India (Bangalore)", indiaPrice: "INR 2,000 - 12,000/month (Starter to Business)", globalPrice: "USD 29 - 199/month", strength: "India-founded SaaS, affordable pricing, good for small-to-mid fitness studios, clean booking interface, Stripe and Razorpay integration", weakness: "Limited community features, no co-player matching, weak multi-branch support, no AI analytics, no F&B or recipe module, no room management, no accounting module, no loyalty engine", sovereignty: "Cloud shared infrastructure — not client-owned, India-based servers", segment: "India + Global - Small-to-Mid Fitness Studios and Academies" },
                        { name: "TeamUp", hq: "UK (London)", indiaPrice: "INR 9,000 - 35,000/month (GBP 104-400 converted)", globalPrice: "GBP 104 - 400/month based on active member count", strength: "Usage-based pricing (good for growing clubs), strong class-based scheduling, solid CRM, good integrations (Zapier, Kisi, Mailchimp, ClassPass)", weakness: "No India-specific payments, no GST invoicing, UK data storage, no community or co-player features, no F&B module, no accounting, no room management capability", sovereignty: "UK servers — not India DPDPA compliant", segment: "UK/Europe - Group Fitness and Martial Arts" },
                        { name: "WellnessLiving", hq: "Canada (Markham ON)", indiaPrice: "INR 12,000 - 50,000/month (CAD 150-600 approx)", globalPrice: "CAD 150 - 600/month", strength: "Comprehensive wellness platform covering spa, salon, and fitness, strong automation, rewards programme built-in, good mobile experience", weakness: "No India market localisation, Canadian data storage, no UPI/GST, no co-player matching, no room management or channel controller, no recipe management, weak F&B integration", sovereignty: "Canadian servers — not India DPDPA compliant", segment: "North America - Spa, Salon, and Fitness" },
                        { name: "Zenoti", hq: "India/USA (Hyderabad + Bellevue WA)", indiaPrice: "INR 15,000 - 80,000+/month (enterprise pricing)", globalPrice: "USD 200 - 1,000+/month (enterprise quote)", strength: "India-founded, strong AI capabilities, 20,000+ wellness business clients globally, deep POS and inventory, good app, strong enterprise track record", weakness: "Designed for salon/spa/wellness chains — not sports or club management, no co-player matching, no court booking, no room inventory/PMS module, no OTA channel controller, no India-native F&B POS with recipe costing", sovereignty: "US servers with India hosting option on request", segment: "India + Global - Salon, Spa, and Wellness Chains" }
                  ],
                  "competitorSummary": "COMPETITOR SUMMARY: Lockated Club Management is the only India-market platform combining data sovereignty + co-player AI + GST compliance + multi-branch analytics + UPI-native payments + integrated F&B POS with recipe management + native double-entry accounting with GSTR-1/3B + tiered loyalty management + channel controller for OTA distribution + room inventory management + asset management with depreciation. Closest functional competitor is Shawman (India) but lacks mobile, community, AI, F&B management, recipe costing, channel management, and loyalty. Global leaders (MINDBODY, Glofox) are expensive, US-data-stored, and India-unfit. Zenoti comes closest on F&B and accounting (salon/spa focus) but is not purpose-built for sports clubs and lacks channel management and co-player features.",
                  "industries": [
                        {
                              "rank": "1",
                              "segment": "Premium Sports Clubs (Padel, Squash, Badminton, Pickleball)",
                              "indicator": "300+ padel courts in India 2025, growing 40%+ YoY; 1,200+ squash courts; 5,000+ badminton clubs",
                              "whyMatters": "Multi-amenity booking, co-player matching, and membership tiers are core operations",
                              "painPoints": "Manual court booking via WhatsApp/calls, no digital waitlists, no skill-based matching, revenue leakage from unmanaged no-shows",
                              "revenuePotential": "INR 25,000-60,000/month per club; 500+ target clubs in Tier-1 cities within 2 years"
                        },
                        {
                              "rank": "2",
                              "segment": "Premium and Multi-Branch Fitness Chains",
                              "indicator": "India fitness industry INR 4,500 crore; 15,000+ organised gyms; growing at 12% CAGR",
                              "whyMatters": "Membership lifecycle, trainer commission, class booking, and multi-branch reporting are all critical",
                              "painPoints": "Branch managers have no unified view, member retention tracked manually, trainer performance unmeasured",
                              "revenuePotential": "INR 40,000-80,000/month for multi-branch; 200+ chains with 3+ branches are immediate targets"
                        },
                        {
                              "rank": "3",
                              "segment": "Corporate Wellness Centres and Office Fitness Facilities",
                              "indicator": "1,500+ large Indian companies offer on-site fitness; corporate wellness market INR 800 crore and growing",
                              "whyMatters": "Corporate memberships, bulk employee wallet loading, HR system integration, and occupancy reporting are needed",
                              "painPoints": "Separate billing per employee, no digital check-in, no attendance reporting to HR, manual invoice reconciliation",
                              "revenuePotential": "INR 20,000-45,000/month; decision made by HR/Facilities head; strong Lockated multi-tenant fit"
                        },
                        {
                              "rank": "4",
                              "segment": "Hotel and Resort Amenity Management (Fitness, Spa, Courts)",
                              "indicator": "India hotel industry 1.5 million rooms; premium hotels invest in sports and wellness amenity as differentiator",
                              "whyMatters": "Guest and member management, court booking for hotel guests vs external members, combined billing",
                              "painPoints": "No system to manage both hotel guest access and paid external memberships on the same platform; F&B run on a disconnected POS with no member tab billing; no room inventory integration means amenity + F&B + room spend reconciled manually; OTA rate parity errors cause revenue leakage; no loyalty programme for repeat guests",
                              "revenuePotential": "INR 30,000–70,000/month for premium properties with full F&B + rooms + channel modules; 3,000+ properties with club-quality amenities are an immediate addressable opportunity; highest ACV segment in Lockated's portfolio"
                        },
                        {
                              "rank": "5",
                              "segment": "Residential Society and Gated Community Amenity Management",
                              "indicator": "5,000+ premium gated communities in India; society amenity booking is a recurring friction point for 2.5 crore flat owners",
                              "whyMatters": "Slot booking for gym, pool, sports courts; society member digital card; occupancy visibility for society committee",
                              "painPoints": "Manual booking registers, no digital check-in, WhatsApp groups for slot announcements, frequent disputes over bookings",
                              "revenuePotential": "INR 8,000-20,000/month; large volume, lower ACV; potential for Lockated residential product tier"
                        },
                        {
                              "rank": "6",
                              "segment": "Government and Municipal Sports Complexes",
                              "indicator": "Sports Authority of India (SAI) operates 1,900+ facilities; state governments add several thousand more",
                              "whyMatters": "Member registration, pay-per-use booking, attendance, and public reporting are all required",
                              "painPoints": "Paper-based registration, cash payments, no digital waitlists, no attendance analytics for planning",
                              "revenuePotential": "INR 10,000-25,000/month; longer sales cycle but high volume; requires offline payment support"
                        },
                        {
                              "rank": "7",
                              "segment": "Standalone Premium Gyms and Boutique Fitness Studios",
                              "indicator": "30,000+ standalone gyms and studios; boutique segment (CrossFit, pilates, yoga studios) growing 20% YoY",
                              "whyMatters": "Membership plans, class booking, trainer scheduling, wallet credits, and community engagement",
                              "painPoints": "Using basic billing software or Tally; no app, no waitlists, no co-player features, no analytics",
                              "revenuePotential": "INR 6,000-18,000/month; large volume opportunity; Lockated needs lightweight onboarding for this segment"
                        },
                        {
                              "rank": "8",
                              "segment": "Sports Academies and Coaching Centres",
                              "indicator": "India has 12,000+ registered sports academies; cricket, football, tennis, swimming academies are largest",
                              "whyMatters": "Student/member management, batch scheduling, trainer assignment, fee collection, parent notifications",
                              "painPoints": "Fee collection is cash or bank transfer, no digital class schedules, no parent-facing app, no progress tracking",
                              "revenuePotential": "INR 8,000-20,000/month; coaching module is key differentiator for this segment"
                        },
                        {
                              "rank": "9",
                              "segment": "University and College Sports Facilities",
                              "indicator": "900+ universities, 40,000+ colleges; most have multi-sport facilities; sports infrastructure under-utilised",
                              "whyMatters": "Student membership management, facility booking, inter-college tournament management, coach assignment",
                              "painPoints": "Facilities are booked informally, no digital attendance, coaches have no performance metrics, equipment not tracked",
                              "revenuePotential": "INR 5,000-15,000/month; long sales cycle; potential via EdTech or government procurement channels"
                        },
                        {
                              "rank": "10",
                              "segment": "Country Clubs and Recreational Member Clubs",
                              "indicator": "2,000+ traditional country clubs in India (DLF, Gymkhana, golf clubs, social clubs); these are high-ACV accounts",
                              "whyMatters": "Complex multi-amenity (golf, pool, tennis, dining) member management, family accounts, guest policies",
                              "painPoints": "Legacy club management systems (Shawman, custom ERP) with poor UX and no mobile app; F&B run on separate POS disconnected from member accounts; no loyalty programme for multi-amenity engagement; month-end accounting requires manual Tally export taking 15–30 hours; recipe costs uncontrolled leading to F&B margins of 10–18%",
                              "revenuePotential": "INR 50,000–1,20,000/month for full-service country clubs with F&B + rooms + loyalty + accounting modules; 2,000+ traditional country clubs in India; highest willingness to pay for integrated solution; flagship reference customers for Lockated enterprise pitch"
                        }
                  ]
            },
            featureSummary: "18 Modules | 160+ Sub-features\nMembership Management · Court & Amenity Booking · Payments & Wallet · QR Check-in · Trainer & Coaching · Multi-Branch · Family & Group · F&B POS & Mobile Ordering · Room Inventory Management (PMS) · Channel Controller (OTA Sync) · Recipe Management · Asset Management · Accounting (GSTR-1/3B, TDS, Bank Recon) · Loyalty Programme · AI Analytics · Community & Co-Player Matching · Corporate Wellness · Reporting Suite",
            detailedFeatures: [
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Member Registration and Onboarding",
                        "subFeatures": "User Registration",
                        "works": "Users register via email or mobile OTP verification. The system captures name, DOB, emergency contact, address, and identity documents (Aadhaar, PAN, DL) in a single guided flow. Verification triggers instantly on OTP confirmation and the member enters Draft status.",
                        "userType": "Member, Front Desk Staff",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Member Registration and Onboarding",
                        "subFeatures": "Profile Data Capture",
                        "works": "Admin and member can both update personal information, emergency contacts, and address fields. All changes are timestamped in an audit trail visible to admin. Members in Private mode hide their profile from directory search.",
                        "userType": "Member, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Member Registration and Onboarding",
                        "subFeatures": "Document Upload",
                        "works": "Members upload identity proof and medical health declaration forms as part of onboarding. Documents are stored on the client's own cloud storage (AWS S3 or GCP). Admin can request re-upload if document is expired.",
                        "userType": "Member, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Selection",
                        "subFeatures": "Plan Selection at Onboarding",
                        "works": "Member selects from 7 types: Monthly, Quarterly, Half-Yearly, Annual, Family, Corporate, Pay-Per-Use. Each plan displays included amenities, peak-hour access, guest allowance, and pricing before confirmation. Admin can override and assign a plan manually.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Selection",
                        "subFeatures": "Payment at Onboarding",
                        "works": "Member completes payment via card, UPI, digital wallet, or bank transfer before membership activates. Payment failure holds the account in Draft status. Retry logic allows 3 attempts before abandoning the session.",
                        "userType": "Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Selection",
                        "subFeatures": "Digital Membership Card Issuance",
                        "works": "A unique QR code-embedded digital membership card is generated immediately upon payment confirmation. The card is accessible in the mobile app and can be shared as a PDF. QR validity is enforced at check-in.",
                        "userType": "Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Configuration",
                        "subFeatures": "Custom Plan Creation",
                        "works": "Admin creates unlimited custom plans by naming the plan, setting duration, price, renewal terms, discount eligibility, and selecting which amenities are included at no extra charge. No developer involvement needed.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Configuration",
                        "subFeatures": "Access Permissions per Plan",
                        "works": "Each plan specifies exactly which amenities are included (free) and which require pay-per-use payment. Access can be further refined by quantity per day, peak vs off-peak restriction, and guest allowance per booking.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Configuration",
                        "subFeatures": "Amenity Access Control with Quantity Limits",
                        "works": "Admin sets maximum uses per amenity per day or per week for each plan. Peak hour surcharge (configurable, default 20%) applies automatically. Off-peak slots carry standard pricing. All limits enforced at booking.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Configuration",
                        "subFeatures": "Cancellation and No-Show Policies",
                        "works": "Admin configures cancellation window (0-72 hours before slot, default 24 hours) and no-show penalty (credit deduction of INR 100 by default, or booking limit reduction). A 3-strike warning system is optionally enabled.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Plan Configuration",
                        "subFeatures": "Upgrade and Downgrade Rules",
                        "works": "Admin enables or disables mid-cycle plan changes for members. When enabled, pro-rata billing applies automatically. Downgrade takes effect at the next renewal cycle.",
                        "userType": "Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Types",
                        "subFeatures": "Family Memberships",
                        "works": "One primary member registers up to 4 dependents under a single family plan. Billing is consolidated into one invoice. Each dependent gets a sub-ID (e.g. RC25001-1) and individual booking history. Shared guest pool and family calendar view included.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Types",
                        "subFeatures": "Corporate Memberships",
                        "works": "Employer purchases bulk memberships via API or admin console. Corporate rates apply. Each employee gets an individual sub-ID. Employer receives consolidated billing. Admin can activate, pause, or suspend individual employee accounts without affecting others.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Types",
                        "subFeatures": "Pay-Per-Use Plans",
                        "works": "30-day casual visitor pass grants access to pay-per-use amenities only. No recurring billing. Ideal for guests and trial members. Auto-expires after 30 days with email notification at Day 25.",
                        "userType": "Front Desk Staff, Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Member Profile Management",
                        "subFeatures": "Privacy Settings",
                        "works": "Member sets profile visibility to Public (full name, photo, interests visible in directory), Semi-Private (name only), or Private (hidden from all member searches). Privacy level does not affect admin visibility.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Member Profile Management",
                        "subFeatures": "Audit Trail",
                        "works": "Admin views a chronological log of all changes to a member's profile including who made the change, from what value to what value, and when. Stored for 24 months minimum.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Member Profile Management",
                        "subFeatures": "Membership Freeze and Unfreeze",
                        "works": "Member or admin can freeze an active membership for 7-90 days (configurable). Renewal date automatically extends by the frozen duration. Frozen members cannot book amenities but retain their digital card and wallet balance.",
                        "userType": "Member, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Group and Family Membership",
                        "subFeatures": "Group Membership Setup",
                        "works": "Minimum 2 primary members form a group. Group admin manages member additions, billing mode (individual or consolidated), and shared guest quota. Each group member retains an independent booking history and individual sub-ID.",
                        "userType": "Admin, Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Group and Family Membership",
                        "subFeatures": "Family Member Accounts with Age-Based Access",
                        "works": "Dependents under 12 are automatically restricted from specific amenities (configurable per amenity). Dependents aged 12-17 may require adult accompaniment, also configurable. Access restrictions are enforced at booking.",
                        "userType": "Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Group and Family Membership",
                        "subFeatures": "Shared Calendar View",
                        "works": "All family or group members see a unified calendar showing their collective upcoming bookings. Each member's bookings are colour-coded. Admin can view any family's shared calendar from the admin panel.",
                        "userType": "Member, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Lifecycle",
                        "subFeatures": "Auto-Renewal Logic",
                        "works": "System initiates auto-renewal 7 days before expiry. If payment succeeds, membership activates for next cycle immediately. If payment fails, 3 retry attempts are made on Day 1, Day 3, and Day 5 post-expiry. Member receives email and SMS at each attempt.",
                        "userType": "Member, Finance Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Lifecycle",
                        "subFeatures": "Expiry Notifications",
                        "works": "Automated reminders sent via email, SMS, and push notification at 30 days, 7 days, and 1 day before expiry. All notification content is customisable from the admin panel. Members can configure quiet hours to prevent late-night alerts.",
                        "userType": "Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 1: MEMBERSHIP MANAGEMENT",
                        "feature": "Membership Lifecycle",
                        "subFeatures": "Access Revocation on Expiry",
                        "works": "Membership access is automatically revoked at midnight on the expiry date if renewal payment has not been received. QR code is deactivated. Admin can manually reinstate with override reason logged.",
                        "userType": "Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Amenity Configuration",
                        "subFeatures": "5 Amenity Types Support",
                        "works": "Platform natively supports Group Classes (yoga, pilates, CrossFit, spin), Court Sports (squash, padel, badminton, pickleball), Equipment Amenities (gym floor, pool, sauna), Coaching Services (1:1 personal training), and Event Management (tournaments, workshops). Each type has distinct booking and capacity rules.",
                        "userType": "Super Admin, Operations Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Amenity Configuration",
                        "subFeatures": "Peak and Off-Peak Pricing",
                        "works": "Admin configures peak hours (default 6-9 AM and 5-8 PM, fully adjustable). Peak slots carry a 20% surcharge by default (configurable). Off-peak slots are priced at the base rate. Pricing tiers display to members before booking confirmation.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Amenity Configuration",
                        "subFeatures": "Multi-Location Amenity Configuration",
                        "works": "The same amenity type (e.g. padel court) can be configured separately per branch with different capacities, pricing, and access rules. Super Admin can view and modify all branch amenity settings from the central console.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Time Slot Management",
                        "subFeatures": "Configurable Slot Durations",
                        "works": "Admin sets default slot durations per amenity (30 min, 1 hour, 1.5 hour, 2 hour). Custom non-standard durations are also supported. Maintenance and cleaning blocks are schedulable within the same calendar, preventing member bookings during those windows.",
                        "userType": "Operations Manager, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Time Slot Management",
                        "subFeatures": "Waitlist Configuration per Slot",
                        "works": "Each slot can have waitlist enabled or disabled individually. When enabled, members joining the waitlist see their queue position in real time. Admin can toggle waitlist off for specific slots without affecting others.",
                        "userType": "Operations Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Time Slot Management",
                        "subFeatures": "Seasonal Slot Variations",
                        "works": "Admin creates seasonal schedule templates that override default slot times and pricing for defined date ranges. Useful for summer hours, festival closures, and holiday pricing. Changes apply automatically on the configured start date.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Trainer and Staff Management",
                        "subFeatures": "Trainer Profiles with Certification Documents",
                        "works": "Each trainer has a profile including qualifications, certifications (uploaded and admin-verified), specialisations, session types supported (group, private, coaching), and preferred amenities. Members can view trainer ratings before booking.",
                        "userType": "Admin, Trainer",
                        "usp": true
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Trainer and Staff Management",
                        "subFeatures": "Commission Structure",
                        "works": "Admin configures trainer commissions as a percentage of session fee or a flat fee per session. Commission is auto-calculated from attendance data and displayed in the trainer's performance dashboard. Payroll export is available in CSV and PDF.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 2: FACILITY AND AMENITY MANAGEMENT",
                        "feature": "Trainer and Staff Management",
                        "subFeatures": "Trainer Rating and Review System",
                        "works": "After each completed session, members are prompted to rate the trainer (1-5 stars with optional text). Ratings are publicly visible on the trainer's profile. Admin can respond to or moderate reviews. Average rating drives trainer assignment priority.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Member Booking Workflow",
                        "subFeatures": "Browse and Book Amenities",
                        "works": "Member opens calendar view filtered by amenity type, time, included-vs-paid status, or trainer. Selecting a slot shows real-time availability, price, and guest allowance. Booking confirms instantly on payment. Unique QR code and reference number are issued via email, SMS, and push notification.",
                        "userType": "Member, Front Desk Staff",
                        "usp": false
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Member Booking Workflow",
                        "subFeatures": "Multi-Channel Booking Notifications",
                        "works": "Confirmation sent simultaneously across email, SMS, and push notification. Reminder notifications fire at 24 hours, 2 hours, and 30 minutes before the slot. Member controls notification channel preferences and quiet hours in their profile.",
                        "userType": "Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Booking Rules Engine",
                        "subFeatures": "Advance Booking Window",
                        "works": "Default 30 days configurable from 1 to 90 days per membership plan. Corporate and annual members may receive extended windows as a benefit. Admin can override for specific events or promotions.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Booking Rules Engine",
                        "subFeatures": "Configurable Cancellation Window",
                        "works": "Default 24 hours before slot start, configurable from 0 to 72 hours per plan. Members cancelling within the window lose the configured no-show penalty. Cancellations before the window receive a full refund to wallet or original payment method.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Booking Rules Engine",
                        "subFeatures": "Peak vs Off-Peak Pricing Enforcement",
                        "works": "20% peak premium is applied automatically at booking for slots falling in configured peak hours. Premium is displayed transparently before confirmation. Admin can run off-peak promotions to shift demand.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Booking Rules Engine",
                        "subFeatures": "Concurrent and Monthly Booking Limits",
                        "works": "Maximum 2 concurrent same-day bookings per member by default (configurable per plan). Monthly booking count can be capped at a plan level. Limits are enforced in real time and displayed in the member's booking dashboard.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Booking Lifecycle States",
                        "subFeatures": "8-State Booking Model",
                        "works": "States: Confirmed (paid, slot reserved), Waitlisted (queue position assigned), Pending Payment (slot held for 10 minutes), Cancelled (member-initiated before window), No-Show (auto-marked 30 minutes post-slot-end), Completed (checked in), Refunded (cancellation within window), Rescheduled (admin-moved). Each state triggers the appropriate notification.",
                        "userType": "Member, Admin, Front Desk Staff",
                        "usp": false
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Waitlist Management",
                        "subFeatures": "Auto-Add to Waitlist on Capacity",
                        "works": "When a slot reaches its configured capacity, subsequent booking requests are automatically added to the FIFO waitlist. Member sees their queue position and estimated wait. Admin can view and manually reorder the waitlist.",
                        "userType": "Member, Operations Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Waitlist Management",
                        "subFeatures": "Auto-Promotion with Confirmation Window",
                        "works": "When a slot opens up (cancellation or no-show), the first waitlisted member receives an SMS and push notification. A 2-hour window (configurable) is given to confirm. If not confirmed, the slot passes to the next member in queue. Waitlist analytics track acceptance rates and bottleneck slots.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Guest and Co-Player System",
                        "subFeatures": "Member-to-Member Invites with Split Payment",
                        "works": "Member books a slot, then invites other club members via in-app notification or SMS. Invitees accept or decline within a 24-hour window. If accepted, a group booking is auto-created and the payment is split equally or in a custom ratio chosen by the host.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Guest and Co-Player System",
                        "subFeatures": "Co-Player Ratings and History",
                        "works": "After a joint session, both members can rate each other. Rating history is visible on each member's profile. The system tracks partnership success rate, enabling smarter matching suggestions. Members with a history of no-shows in group bookings are flagged.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 3: BOOKING MANAGEMENT",
                        "feature": "Guest and Co-Player System",
                        "subFeatures": "Guest Data Capture and Digital Waiver",
                        "works": "Non-member guests provide name, phone, and email at booking. System sends a digital waiver link to the guest's phone for e-signature before arrival. Waiver data is stored under the inviting member's record. Admin can review all guest visit history.",
                        "userType": "Member, Front Desk Staff",
                        "usp": false
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Payment Methods",
                        "subFeatures": "UPI and Indian Payment Rails",
                        "works": "All major UPI apps (Google Pay, PhonePe, Paytm, BHIM) supported via NPCI integration through Razorpay. Credit and debit cards (Visa, Mastercard, RuPay), digital wallets, and bank transfer for bulk/corporate payments also supported. Payment method is stored securely and used for auto-renewal.",
                        "userType": "Member, Finance Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Payment Methods",
                        "subFeatures": "In-App Prepaid Wallet",
                        "works": "Members pre-load credits in denominations of INR 1,000, 2,500, 5,000, or 10,000. Bonus credits of 5-10% are applied to bundle purchases. Credits never expire unless admin configures a policy. Credits transfer between family members on request.",
                        "userType": "Member, Finance Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Payment Methods",
                        "subFeatures": "Bulk Corporate API for Credit Purchase",
                        "works": "Corporate employers can top up employee wallets via API without employee intervention. Useful for corporate wellness programmes where the employer subsidises club usage. Purchase history tracked separately under corporate account.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Payment Processing",
                        "subFeatures": "Auto-Renewal and Payment Retry Logic",
                        "works": "Auto-renewal initiates 7 days before expiry. Three attempts on Day 1, Day 3, Day 5 post-failure with increasing urgency notifications. Membership pauses after 3 failed attempts and member enters a 7-day grace period to update payment method before suspension.",
                        "userType": "Member, Finance Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Invoicing and Receipts",
                        "subFeatures": "Auto-Generated GST Invoices",
                        "works": "Invoice is generated automatically within seconds of payment. It includes membership period, itemised amenities used, GST breakdown (CGST+SGST or IGST depending on state), and total amount. Invoice is emailed within 24 hours and stored in the member's dashboard as downloadable PDF.",
                        "userType": "Member, Finance Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Invoicing and Receipts",
                        "subFeatures": "Revenue Reports with MRR Tracking",
                        "works": "Finance dashboard shows monthly recurring revenue trend, revenue breakdown by amenity type and membership tier, payment success rate, failed transaction list with retry status, and 12-month revenue forecast. All reports exportable as PDF, Excel, or CSV.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Refunds and Chargebacks",
                        "subFeatures": "Structured Refund Policy",
                        "works": "Full refund for cancellations before the configured window. 50% refund for cancellations within 24 hours. Full refund for payment processing errors within 24 hours of error. Pro-rata membership refund for cancellations within 30 days. Admin can manually override any refund via the admin panel with audit trail.",
                        "userType": "Finance Manager, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 4: PAYMENTS AND BILLING",
                        "feature": "Refunds and Chargebacks",
                        "subFeatures": "Suspicious Pattern Detection and Account Freeze",
                        "works": "System auto-flags transactions matching abnormal patterns (multiple rapid bookings, cancellations with immediate refund requests, unusual wallet top-ups). Flagged accounts are surfaced in the admin alert queue. Admin freezes account pending investigation. Chargeback dispute window is 30 days.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "Check-In Methods",
                        "subFeatures": "QR Code Check-In",
                        "works": "Member's digital membership card QR code is scanned at the facility entrance or at the amenity station. QR is valid from 15 minutes before to 30 minutes after the slot start time. Single scan enforced per booking. Staff-assisted scan via tablet or handheld scanner also supported.",
                        "userType": "Member, Front Desk Staff",
                        "usp": false
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "Check-In Methods",
                        "subFeatures": "Manual Check-In with Admin Approval",
                        "works": "Front Desk Staff can manually mark a member as checked in (e.g. if phone is dead). Manual check-ins require admin approval and the reason is logged in the audit trail. Admin receives a real-time alert for each manual check-in request.",
                        "userType": "Front Desk Staff, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "Check-In Methods",
                        "subFeatures": "Biometric Integration (Roadmap)",
                        "works": "RFID card tap, fingerprint recognition, and facial recognition are supported as future integration points via standard access control hardware API. The integration framework is built; hardware vendor onboarding is required.",
                        "userType": "Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "Attendance Tracking",
                        "subFeatures": "Attendance Streak Tracking",
                        "works": "System tracks consecutive calendar days on which a member has at least one completed check-in. Streaks are displayed on the member dashboard as a motivational metric. Admin can see which members have the highest streaks for retention and reward campaigns.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "Attendance Tracking",
                        "subFeatures": "Real-Time Occupancy View",
                        "works": "Operations Manager sees a live dashboard tile per amenity showing current occupancy vs configured capacity. Colour-coded (green/amber/red) by occupancy percentage. Historical peak hour heatmap shows patterns by day of week and time of day.",
                        "userType": "Operations Manager, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "Attendance Tracking",
                        "subFeatures": "Trainer Commission Calculation from Attendance",
                        "works": "Trainer attendance per session is automatically synced to the commission calculation engine. Commission reports are generated monthly and available for payroll export. Discrepancies (e.g. session ran but trainer not marked) are flagged for admin review.",
                        "userType": "Finance Manager, Trainer",
                        "usp": false
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "No-Show Management",
                        "subFeatures": "Auto-Detection and Penalty Application",
                        "works": "No-show is automatically flagged 30 minutes after slot end if no check-in was recorded. Configured penalty (default INR 100 credit deduction or 1 booking reduction) is applied instantly. Member receives SMS notification of penalty. No-show record is logged against member profile.",
                        "userType": "Member, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 5: ATTENDANCE AND CHECK-IN",
                        "feature": "No-Show Management",
                        "subFeatures": "AI Predictive No-Show Analytics",
                        "works": "Machine learning model trained on member history, amenity type, day of week, and weather data to predict likelihood of no-show per booking. High-risk bookings are surfaced in the operations dashboard for proactive outreach (reminder call or extra notification).",
                        "userType": "Operations Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 6: NOTIFICATIONS AND COMMUNICATION",
                        "feature": "Notification Channels",
                        "subFeatures": "Multi-Channel Notification Engine",
                        "works": "System dispatches across email (SendGrid/AWS SES), SMS (Twilio/AWS SNS), push notification (Firebase Cloud Messaging), and in-app message. Channel priority is configurable. Critical alerts (payment failure, suspension) always attempt all channels regardless of member preferences.",
                        "userType": "Member, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 6: NOTIFICATIONS AND COMMUNICATION",
                        "feature": "Notification Channels",
                        "subFeatures": "WhatsApp Integration (Roadmap)",
                        "works": "WhatsApp Business API integration is planned for Phase 2. Will support booking confirmations, reminders, and club announcements via WhatsApp. Members opt in separately from SMS.",
                        "userType": "Member, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 6: NOTIFICATIONS AND COMMUNICATION",
                        "feature": "Notification Types",
                        "subFeatures": "Booking Lifecycle Notifications",
                        "works": "Confirmation, reminder (24h, 2h, 30 min), cancellation, no-show penalty, waitlist promotion, and completion notifications are automated. Each message template is editable from the admin panel. Admin can A/B test subject lines and message copy.",
                        "userType": "Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 6: NOTIFICATIONS AND COMMUNICATION",
                        "feature": "Notification Types",
                        "subFeatures": "Club Announcements and Targeted Broadcasts",
                        "works": "Admin composes announcements and targets them by membership tier, activity level, amenity preference, or join date cohort. Broadcasts can be scheduled for future delivery. Engagement metrics (open rate, click-through) are tracked per campaign.",
                        "userType": "Admin, Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 6: NOTIFICATIONS AND COMMUNICATION",
                        "feature": "User Notification Preferences",
                        "subFeatures": "Per-Channel Toggle and Quiet Hours",
                        "works": "Member enables or disables each notification channel (email, SMS, push, in-app) independently. Quiet hours are set per member (default 10 PM to 8 AM). During quiet hours, non-critical notifications are queued and delivered at the quiet hours end time.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 6: NOTIFICATIONS AND COMMUNICATION",
                        "feature": "User Notification Preferences",
                        "subFeatures": "Marketing Opt-Out and Category Preferences",
                        "works": "Member opts out of promotional emails without affecting transactional notifications. Notification categories (booking updates, payment alerts, community activity, special offers) are individually toggled. Admin cannot override member opt-outs for marketing category.",
                        "userType": "Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Member Directory",
                        "subFeatures": "Member Search with Privacy Respect",
                        "works": "Members search the directory by name, interests, or location. Only members with Public or Semi-Private profiles appear in results. Private members are completely hidden. Admins can search all members regardless of privacy setting.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Member Directory",
                        "subFeatures": "Rating System for Co-Players",
                        "works": "After any joint booking, both participating members rate each other on a 5-star scale. Ratings accumulate into a public co-player score visible on the member's profile. Members with consistently low ratings are flagged in the admin panel for review.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Member Directory",
                        "subFeatures": "Block and Report Function",
                        "works": "Member blocks another member from seeing their profile or sending invites. Reporting a member submits the report to the admin moderation queue with the reporting member's note. Admin reviews and can warn, suspend, or ban the reported user.",
                        "userType": "Member, Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Community Posts",
                        "subFeatures": "Post Types with Booking Links",
                        "works": "Members create posts in 4 categories: Looking for Co-Player (links directly to available booking slots), Tournament Arrangement (links to event management), Tips and Technique, General Discussion. Posts support text and images. Hashtags (#padel, #squash, #yoga) create filterable threads.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Community Posts",
                        "subFeatures": "Admin Moderation and Pinned Announcements",
                        "works": "Admin pins up to 3 posts as announcements visible above all member posts. Flagged content enters the moderation queue where admin can approve, edit, or remove. Auto-cleanup policy removes posts with no engagement after 30 days (configurable).",
                        "userType": "Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Community Posts",
                        "subFeatures": "Community Post Analytics",
                        "works": "Admin sees post view counts, engagement rates (comments plus reactions per view), and trending hashtags. Most-engaged posts are surfaced in the weekly analytics digest. Member activity level (posts, comments, reactions) feeds into churn risk scoring.",
                        "userType": "Admin, Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Guest Invites and Co-Player Matching",
                        "subFeatures": "AI Skill-Level Matching",
                        "works": "AI model categorises members by skill level within each sport based on booking history, trainer assessments, and self-declared level. Co-player suggestions are ranked by skill proximity, availability overlap, and partnership history. Member opts in to recommendation system.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Guest Invites and Co-Player Matching",
                        "subFeatures": "Radius-Based Co-Player Search",
                        "works": "Member searches for co-players within a configurable radius (default 5 km). Results show matching members' availability for the next 7 days. One-tap invite sends in-app notification and SMS to the matched member.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 7: COMMUNITY FEATURES",
                        "feature": "Guest Invites and Co-Player Matching",
                        "subFeatures": "Availability Matching",
                        "works": "System cross-references member booking patterns and open calendar slots to suggest the best co-player candidates. Suggestions update daily based on new bookings. Members with consistent availability during the same time windows are ranked higher.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Member Dashboard",
                        "subFeatures": "Attendance Streak and Co-Player Ratings Display",
                        "works": "Member dashboard shows current attendance streak, all-time best streak, co-player rating received, recent booking history, credit balance, and personalised upcoming events. Data is refreshed in real time.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Member Dashboard",
                        "subFeatures": "Personalised Event and Offer Suggestions",
                        "works": "AI recommendation engine analyses member's amenity usage history and suggests relevant upcoming group classes, open tournaments, and promotional offers. Suggestions are served on the dashboard and in weekly digest emails.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Admin Dashboard - Club Managers",
                        "subFeatures": "Revenue and Retention KPIs",
                        "works": "Dashboard shows total active members, new signups (week/month/YTD), membership breakdown by tier, retention rate month-over-month, churn rate by tier, total membership revenue trending, prepaid credit sales volume, and amenity-wise revenue breakdown. All metrics refresh every 15 minutes.",
                        "userType": "Branch Manager, Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Admin Dashboard - Club Managers",
                        "subFeatures": "Real-Time Occupancy and Operations View",
                        "works": "Live tile per amenity showing current occupancy percentage with colour-coded status. Trainer schedule and today's assignment list. Equipment maintenance schedule and upcoming facility closures. No-show patterns by amenity and time of day.",
                        "userType": "Operations Manager, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Admin Dashboard - Finance",
                        "subFeatures": "Revenue Forecast and Pro-forma P&L",
                        "works": "12-month AI-generated revenue forecast based on current MRR, churn rate, and seasonal patterns. Pro-forma P&L statement available for investor meetings. GST and TDS tax reports generated on demand. Aging of receivables tracked with overdue flagging.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Admin Dashboard - Super Admin",
                        "subFeatures": "Multi-Branch Comparison and System Health",
                        "works": "Super Admin sees all branches on a single dashboard: comparative KPIs, branch-level P&L, staff performance metrics, system uptime, API usage logs, backup status, and complete audit logs. Drill-down into any branch without switching accounts.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Analytics Features",
                        "subFeatures": "AI Churn Prediction",
                        "works": "Machine learning model identifies members at risk of cancellation based on attendance decline, booking frequency drop, community disengagement, and support ticket history. At-risk members appear in a retention priority list with recommended outreach action.",
                        "userType": "Admin, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Analytics Features",
                        "subFeatures": "Revenue Optimisation Engine",
                        "works": "AI analyses slot utilisation, peak vs off-peak demand, and membership tier distribution to suggest optimal pricing changes, promotion timing, and capacity adjustments. Recommendations are presented as actionable cards in the Super Admin dashboard.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Analytics Features",
                        "subFeatures": "Cohort Analysis and Heatmaps",
                        "works": "Retention cohort table shows member retention rates by join month. Peak hour heatmaps show day-of-week and time-of-day demand patterns per amenity. Segment analysis compares VIP, regular, and casual member behaviour across revenue and engagement metrics.",
                        "userType": "Super Admin, Finance Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 8: REPORTING AND ANALYTICS",
                        "feature": "Downloadable Reports",
                        "subFeatures": "Multi-Format Report Export",
                        "works": "All reports (membership, revenue, attendance, booking, financial, trainer, facility utilisation, churn analysis, forecast) are exportable as PDF, Excel, or CSV. Reports can be scheduled for automated email delivery (daily, weekly, monthly) to configured recipients.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 9: ADMIN MANAGEMENT AND SETTINGS",
                        "feature": "User Roles and Permissions",
                        "subFeatures": "7-Tier Role-Based Access Control",
                        "works": "Super Admin: all functions, all branches, system settings, financials. Branch Manager: operations, staff, reports for single branch. Operations Manager: facilities, trainer schedules, limited financials. Finance Manager: payments, invoices, reports across branches. Trainer: own schedule, attendance marking, assigned classes. Front Desk Staff: bookings, check-in, walk-in payments for single branch. Member: self-service bookings and profile.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 9: ADMIN MANAGEMENT AND SETTINGS",
                        "feature": "Multi-Branch Configuration",
                        "subFeatures": "Cross-Branch Membership and Booking",
                        "works": "Members on eligible plans can book amenities at any authorised branch. Cross-branch booking history appears in the central member record. Branch-specific pricing applies even for cross-branch bookings. Super Admin defines which branches are included in cross-branch access per plan.",
                        "userType": "Super Admin, Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 9: ADMIN MANAGEMENT AND SETTINGS",
                        "feature": "Multi-Branch Configuration",
                        "subFeatures": "Separate or Shared Member Database per Branch",
                        "works": "Admin chooses between isolated member databases per branch (maximum privacy) or a shared database with role-based data visibility. Financial tracking is always separate per branch regardless of database configuration.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 9: ADMIN MANAGEMENT AND SETTINGS",
                        "feature": "Multi-Branch Configuration",
                        "subFeatures": "Consolidated Reporting for Super Admin",
                        "works": "Super Admin views unified analytics across all branches without switching accounts. Can drill into any branch's member list, revenue report, or occupancy data. Branch comparison charts are built in as a standard dashboard component.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 9: ADMIN MANAGEMENT AND SETTINGS",
                        "feature": "System Settings",
                        "subFeatures": "Payment Gateway and SMS/Email Configuration",
                        "works": "Admin configures Razorpay, CCAvenue, or PayU as primary and fallback gateways. API keys are stored encrypted. SMS gateway choice (Twilio, AWS SNS) and email provider (SendGrid, AWS SES) are configured per club. Failover between providers is automatic.",
                        "userType": "Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 9: ADMIN MANAGEMENT AND SETTINGS",
                        "feature": "System Settings",
                        "subFeatures": "Tax Configuration",
                        "works": "Admin configures GST rates, applicable TDS rules, and state-specific tax variations. Tax is auto-calculated and broken down on every invoice. Tax liability report is available for monthly filing.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 9: ADMIN MANAGEMENT AND SETTINGS",
                        "feature": "Policy Configuration",
                        "subFeatures": "Comprehensive Policy Engine",
                        "works": "Single configuration panel for: cancellation window, no-show penalty, refund conditions, guest rules, advance booking window, waitlist auto-promotion timing, payment retry schedule, and auto-renewal timing. Every policy change is logged with timestamp and admin identity.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 10: MOBILE AND WEB PLATFORMS",
                        "feature": "Web Admin Portal",
                        "subFeatures": "Multi-Role Customisable Dashboards",
                        "works": "Admin portal renders correctly on desktop and tablet. Each role sees a tailored dashboard: Finance Manager sees revenue tiles; Operations Manager sees occupancy and maintenance; Branch Manager sees daily bookings and staff attendance. No custom development needed to configure role views.",
                        "userType": "Admin Roles",
                        "usp": true
                  },
                  {
                        "module": "MODULE 10: MOBILE AND WEB PLATFORMS",
                        "feature": "Member Web Portal",
                        "subFeatures": "Full Self-Service Portal",
                        "works": "Web portal for members without the app: browse and book amenities, manage profile, view booking history, download invoices, access community features, and configure notification preferences. Consistent feature parity with mobile app.",
                        "userType": "Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 10: MOBILE AND WEB PLATFORMS",
                        "feature": "Mobile Apps (iOS and Android)",
                        "subFeatures": "Native Apps with Offline Support",
                        "works": "iOS and Android apps built natively (not hybrid). SQLite local storage enables offline viewing of upcoming bookings and membership card when internet is unavailable. Sync occurs automatically when connectivity resumes.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 10: MOBILE AND WEB PLATFORMS",
                        "feature": "Mobile Apps (iOS and Android)",
                        "subFeatures": "Biometric Login and Quick Check-In",
                        "works": "Members log in with Face ID or fingerprint (device-native biometric). One-tap check-in button on the home screen opens the QR code scanner mode instantly. App startup time target is under 1.5 seconds on mid-range devices.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 10: MOBILE AND WEB PLATFORMS",
                        "feature": "Mobile Apps (iOS and Android)",
                        "subFeatures": "Dark Mode and Performance Optimisation",
                        "works": "Full dark mode theme supported on iOS and Android, toggled from device system setting or within app. App startup target under 1.5 seconds. API response target under 200 milliseconds. Page load target under 2 seconds on 4G.",
                        "userType": "Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 11: API AND INTEGRATIONS",
                        "feature": "Payment Gateway Integration",
                        "subFeatures": "Multi-Gateway with Auto-Fallback",
                        "works": "Razorpay is configured as primary gateway. CCAvenue and PayU are fallback gateways. If Razorpay returns an error, the system automatically retries on the fallback gateway within 3 seconds without user action. Subscription management, webhook events, and refund APIs are fully integrated.",
                        "userType": "Super Admin, Finance Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 11: API AND INTEGRATIONS",
                        "feature": "SMS and Email Service Integration",
                        "subFeatures": "Multi-Provider Redundancy",
                        "works": "Twilio is primary SMS provider with AWS SNS as fallback. SendGrid is primary email provider with AWS SES as fallback. Bounce handling automatically removes invalid email addresses. Template library with pre-built, editable templates for all 12 notification types.",
                        "userType": "Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 11: API AND INTEGRATIONS",
                        "feature": "Cloud Storage Integration",
                        "subFeatures": "Auto-Backup on Client's Own Infrastructure",
                        "works": "All document and image storage uses the client's own AWS S3 or GCP bucket. Lockated has zero access to stored files. Daily incremental backups are automated. Backup status is visible in the Super Admin dashboard. RTO is 1 hour; RPO is 15 minutes.",
                        "userType": "Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 11: API AND INTEGRATIONS",
                        "feature": "Access Control Integration",
                        "subFeatures": "RFID and Biometric Hardware Integration",
                        "works": "RFID card tap and turnstile integration via standard Wiegand protocol. Fingerprint and facial recognition hardware supported via partner API. Member QR codes sync with access control system in real time. Admin manages all hardware devices from the admin panel.",
                        "userType": "Super Admin, Operations Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 11: API AND INTEGRATIONS",
                        "feature": "API for Third Parties",
                        "subFeatures": "REST and GraphQL API with OAuth 2.0",
                        "works": "Full REST API and GraphQL endpoint available for third-party integrations (HR systems, CRM, property management systems). OAuth 2.0 handles secure third-party authentication. Rate limit 100 requests per minute per API key. Complete developer documentation and sandbox environment provided. Webhooks for all major events (booking, payment, member lifecycle).",
                        "userType": "Super Admin, Developers",
                        "usp": true
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Point-of-Sale (POS)",
                        "subFeatures": "POS Terminal and Mobile Ordering",
                        "works": "Members and guests place F&B orders from a club-facing POS terminal or directly from their mobile app. Orders are routed to the kitchen display system (KDS) with table, court-side, or poolside delivery tags. All F&B charges are posted to the member's club wallet or billed to their membership account in real time.",
                        "userType": "Front Desk Staff, Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Point-of-Sale (POS)",
                        "subFeatures": "Menu Configuration and Category Management",
                        "works": "Admin creates unlimited menus with categories (Beverages, Main Course, Snacks, Specials), sub-categories, item descriptions, images, GST rates, and pricing. Menus are schedulable by time of day (breakfast, lunch, evening) and branch. Items can be marked as available, 86'd (out of stock), or seasonal.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Point-of-Sale (POS)",
                        "subFeatures": "Tab and Running Bill Management",
                        "works": "Members open a tab against their wallet or membership account at the start of a session. All orders in the session are accumulated on the tab. Tab settlement is automated at check-out or manually triggered by staff. Partial payments and split bills among group members are supported.",
                        "userType": "Front Desk Staff, Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Inventory and Stock Management",
                        "subFeatures": "Real-Time Stock Deduction on Order",
                        "works": "Every confirmed order triggers automatic deduction of ingredients from the digital inventory based on recipe-defined quantities. Low-stock alerts fire when an ingredient falls below the configured threshold. Admin sees live stock levels per ingredient per branch from the dashboard.",
                        "userType": "Operations Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Inventory and Stock Management",
                        "subFeatures": "Supplier Management and Purchase Orders",
                        "works": "Admin creates a vendor directory with supplier contacts, lead times, and preferred payment terms. Purchase orders are generated from within the platform when stock falls below par level. PO approval workflow requires manager sign-off above a configurable INR threshold. GRN (Goods Received Note) updates stock automatically.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Inventory and Stock Management",
                        "subFeatures": "Wastage and Spoilage Tracking",
                        "works": "Staff logs wastage events by item, quantity, reason (expired, spoiled, incorrect preparation), and shift. Wastage reports are generated weekly and monthly. AI flags branches with wastage percentage above category benchmark, triggering a process review alert.",
                        "userType": "Operations Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Analytics and Revenue Reporting",
                        "subFeatures": "F&B Revenue Dashboard",
                        "works": "Dedicated F&B revenue dashboard showing: total F&B revenue vs membership revenue ratio, top-selling items by revenue and volume, per-member average F&B spend, peak ordering hours by category, and gross margin per menu item. All data refreshes in real time.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 12: F&B MANAGEMENT",
                        "feature": "F&B Analytics and Revenue Reporting",
                        "subFeatures": "Member Spend Analytics",
                        "works": "Individual member F&B spend history is visible in their profile. Admin segments members by F&B spend quartile for targeted upsell campaigns. High-spend members receive personalised F&B offers. Members can view their own order history and monthly F&B spend in the member app.",
                        "userType": "Admin, Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 13: ROOM INVENTORY MANAGEMENT",
                        "feature": "Room Configuration and Inventory",
                        "subFeatures": "Room Type and Rate Plan Setup",
                        "works": "Admin configures room types (Deluxe, Suite, Cottage, Dormitory) with room count, amenities, bed configuration, and check-in/check-out rules. Multiple rate plans per room type: member rate, guest rate, corporate rate, weekend rate, and seasonal rate. Rate plans activate automatically by date range.",
                        "userType": "Super Admin, Branch Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 13: ROOM INVENTORY MANAGEMENT",
                        "feature": "Room Configuration and Inventory",
                        "subFeatures": "Real-Time Room Availability Grid",
                        "works": "Admin and front desk see a live availability grid showing all rooms across a configurable date range (1 day to 90 days). Room status is colour-coded: Available (green), Occupied (red), Dirty/In Maintenance (amber), Reserved (blue). One-click reservation initiation from the grid.",
                        "userType": "Operations Manager, Front Desk Staff",
                        "usp": true
                  },
                  {
                        "module": "MODULE 13: ROOM INVENTORY MANAGEMENT",
                        "feature": "Room Configuration and Inventory",
                        "subFeatures": "Room Status and Housekeeping Workflow",
                        "works": "Housekeeping staff receive daily room-cleaning task lists on a dedicated mobile interface. Room status updates (Clean, Dirty, Inspected, Out of Order) sync in real time to the front desk availability grid. Maintenance requests logged against specific rooms with photo evidence and resolution tracking.",
                        "userType": "Operations Manager, Front Desk Staff",
                        "usp": false
                  },
                  {
                        "module": "MODULE 13: ROOM INVENTORY MANAGEMENT",
                        "feature": "Reservation Management",
                        "subFeatures": "Member and Guest Reservation Flow",
                        "works": "Members reserve rooms directly from the app with check-in/check-out date selection, room type preference, and special requests. Non-member guests are booked by front desk staff with digital ID capture, digital registration card (e-sign), and advance payment collection. Confirmation sent via email, SMS, and app.",
                        "userType": "Member, Front Desk Staff",
                        "usp": true
                  },
                  {
                        "module": "MODULE 13: ROOM INVENTORY MANAGEMENT",
                        "feature": "Reservation Management",
                        "subFeatures": "Group and Corporate Booking",
                        "works": "Corporate accounts book multiple rooms under a single folio with consolidated billing. Group bookings support rooming lists, shared facilities, and event-linked room blocks. Attrition policies and cut-off dates are configurable per group contract.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 13: ROOM INVENTORY MANAGEMENT",
                        "feature": "Reservation Management",
                        "subFeatures": "Early Check-In, Late Check-Out, and Extension Management",
                        "works": "Admin sets configurable early check-in and late check-out charges. Members request extensions from the app; system checks next reservation before auto-approving. All room time extensions are billed to the member's account or folio automatically.",
                        "userType": "Front Desk Staff, Member",
                        "usp": false
                  },
                  {
                        "module": "MODULE 13: ROOM INVENTORY MANAGEMENT",
                        "feature": "Folio and Billing Integration",
                        "subFeatures": "Unified Folio (Room + Club Charges)",
                        "works": "All charges during a guest stay—room rate, F&B orders, spa services, court bookings, and amenity access—are accumulated on a single unified folio. Folio is visible to the guest in real time via the app. Final bill settles in one transaction via UPI, card, or corporate account.",
                        "userType": "Finance Manager, Front Desk Staff",
                        "usp": true
                  },
                  {
                        "module": "MODULE 14: CHANNEL CONTROLLER",
                        "feature": "OTA and Distribution Channel Management",
                        "subFeatures": "Multi-Channel Room Inventory Distribution",
                        "works": "Real-time two-way synchronisation of room availability, rates, and restrictions across all connected distribution channels: club's own website booking engine, MakeMyTrip, Goibibo, Booking.com, Agoda, Airbnb, and Expedia. A single update in the channel controller reflects across all channels within 30 seconds, eliminating overbooking risk.",
                        "userType": "Super Admin, Revenue Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 14: CHANNEL CONTROLLER",
                        "feature": "OTA and Distribution Channel Management",
                        "subFeatures": "Rate Parity Management and BAR Strategy",
                        "works": "Best Available Rate (BAR) engine ensures rate parity across channels or enables deliberate rate differentials per channel strategy. Admin defines minimum and maximum rates per room type. Automated alerts notify admin if an OTA is listing a rate outside the configured band. Rate strategies (last-room availability, early-bird, restricted) are applied per channel.",
                        "userType": "Super Admin, Revenue Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 14: CHANNEL CONTROLLER",
                        "feature": "OTA and Distribution Channel Management",
                        "subFeatures": "Channel Performance Analytics",
                        "works": "Dashboard comparing revenue, occupancy, and Average Daily Rate (ADR) contribution by channel. Identifies highest-revenue channels, lowest-cost-of-acquisition channels, and underperforming OTA listings. Commission cost is factored into net revenue calculation per channel.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 14: CHANNEL CONTROLLER",
                        "feature": "Own Website Booking Engine",
                        "subFeatures": "White-Label Direct Booking Widget",
                        "works": "Embeddable booking widget for the club's own website allowing direct reservations at the best available rate. Members who book direct receive a loyalty points bonus. Booking engine handles room selection, add-on packages, payment, and instant confirmation. Commission-free channel with full data capture.",
                        "userType": "Member, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 14: CHANNEL CONTROLLER",
                        "feature": "Own Website Booking Engine",
                        "subFeatures": "Restriction and Stop-Sell Management",
                        "works": "Admin applies stop-sell, minimum length of stay (MinLOS), and close-to-arrival (CTA) restrictions per room type per channel per date range. Restrictions sync instantly across all connected channels. Useful for peak season yield management and minimum stay enforcement during events.",
                        "userType": "Super Admin, Revenue Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 15: RECIPE MANAGEMENT",
                        "feature": "Recipe Library and Costing",
                        "subFeatures": "Recipe Creation with Ingredient Bill of Materials",
                        "works": "F&B manager creates digital recipes for every menu item with exact ingredient quantities (grams, ml, pieces), preparation method, plating instructions, and allergen flags. Each recipe links to the ingredient inventory so actual cost per dish is calculated automatically using live purchase prices.",
                        "userType": "Operations Manager, F&B Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 15: RECIPE MANAGEMENT",
                        "feature": "Recipe Library and Costing",
                        "subFeatures": "Automatic Food Cost Calculation",
                        "works": "System calculates food cost percentage per dish (ingredient cost / selling price x 100) and compares to the configured target food cost (default 28-32%). Dishes with food cost percentage above threshold are highlighted in red. Admin sees overall menu food cost percentage and margin contribution per category.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 15: RECIPE MANAGEMENT",
                        "feature": "Recipe Library and Costing",
                        "subFeatures": "Recipe Scaling for Batch Preparation",
                        "works": "Chef selects a recipe and inputs the required portion count. System auto-scales all ingredient quantities proportionally and generates a prep sheet for the kitchen. Scaled quantities are pre-deducted from inventory as soon as the batch prep is confirmed, maintaining accurate live stock levels.",
                        "userType": "Operations Manager, F&B Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 15: RECIPE MANAGEMENT",
                        "feature": "Menu Engineering and Profitability",
                        "subFeatures": "Menu Engineering Matrix (Stars, Plowhorses, Puzzles, Dogs)",
                        "works": "Automated menu engineering analysis classifying each item by popularity (order count) and profitability (contribution margin). Stars (high popularity, high margin) are promoted; Dogs (low popularity, low margin) are flagged for removal. Monthly menu engineering report drives menu optimisation decisions.",
                        "userType": "Super Admin, F&B Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 15: RECIPE MANAGEMENT",
                        "feature": "Menu Engineering and Profitability",
                        "subFeatures": "Portion Control and Yield Tracking",
                        "works": "Each recipe specifies the standard yield percentage for raw ingredients (e.g. 70% yield on boneless chicken after trimming). System tracks actual yield against standard yield, flagging branches with consistently low yields for process audit. Portion control variance directly impacts food cost accuracy.",
                        "userType": "Operations Manager, F&B Manager",
                        "usp": false
                  },
                  {
                        "module": "MODULE 16: ASSET MANAGEMENT",
                        "feature": "Asset Registry and Tracking",
                        "subFeatures": "Digital Asset Register with QR Tagging",
                        "works": "Every physical asset (gym equipment, court fixtures, F&B equipment, AV systems, vehicles, IT hardware, furniture) is registered with a unique asset ID, QR code label, purchase date, cost, depreciation method, location, and responsible custodian. Assets are discoverable by scanning their QR code label with a mobile device.",
                        "userType": "Operations Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 16: ASSET MANAGEMENT",
                        "feature": "Asset Registry and Tracking",
                        "subFeatures": "Depreciation Calculation and Useful Life Tracking",
                        "works": "System applies straight-line or written-down-value (WDV) depreciation per asset class as per Indian Companies Act 2013 and IT Act schedules. Monthly depreciation is auto-posted to the accounting module. Asset net book value, accumulated depreciation, and remaining useful life are visible in the asset dashboard.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 16: ASSET MANAGEMENT",
                        "feature": "Asset Registry and Tracking",
                        "subFeatures": "Asset Movement and Custody Transfer",
                        "works": "Asset transfers between locations, departments, or custodians are logged digitally with date, approver, reason, and condition note. Custody transfer requires QR scan confirmation at origin and destination. Annual physical verification process is managed through the platform with discrepancy flagging.",
                        "userType": "Operations Manager, Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 16: ASSET MANAGEMENT",
                        "feature": "Preventive Maintenance Scheduling",
                        "subFeatures": "Maintenance Schedule and Work Order Management",
                        "works": "Admin creates preventive maintenance schedules per asset (monthly court resurfacing, quarterly HVAC service, annual equipment certification). System auto-generates work orders on the scheduled date, assigns to facility staff or external vendor, and tracks completion with photo evidence. Overdue maintenance is escalated automatically.",
                        "userType": "Operations Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 16: ASSET MANAGEMENT",
                        "feature": "Preventive Maintenance Scheduling",
                        "subFeatures": "Vendor and AMC Contract Management",
                        "works": "Annual Maintenance Contracts (AMC) for key assets are stored with vendor details, contract period, cost, SLA response time, and renewal date. System sends AMC renewal alerts 60 days before expiry. Work orders under AMC are auto-routed to the contracted vendor with SLA timer tracking.",
                        "userType": "Finance Manager, Operations Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 16: ASSET MANAGEMENT",
                        "feature": "Capital Expenditure Planning",
                        "subFeatures": "Asset Replacement and CapEx Forecasting",
                        "works": "Dashboard shows assets approaching end of useful life within the next 12, 24, and 36 months with estimated replacement cost at current market prices. Finance manager uses this to plan CapEx budget. Board-level CapEx forecast report is available as a one-click export.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "Chart of Accounts and Ledger Management",
                        "subFeatures": "Configurable Chart of Accounts (CoA)",
                        "works": "Admin configures a full chart of accounts structured for club operations: membership revenue, F&B revenue, room revenue, amenity revenue, trainer commission expense, maintenance expense, payroll, and capital accounts. The CoA is pre-loaded with a club-standard template and fully customisable. Multi-branch accounting with branch-level P&L supported.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "Chart of Accounts and Ledger Management",
                        "subFeatures": "Automated Journal Entry from Operations",
                        "works": "Every transaction in the platform (membership payment, F&B sale, room booking, asset purchase, refund, penalty collection) generates an automatic double-entry journal in the accounting ledger. Manual journal entries are supported with mandatory approver sign-off above a configurable threshold. Audit trail on every entry.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "Chart of Accounts and Ledger Management",
                        "subFeatures": "Bank Reconciliation Module",
                        "works": "Platform imports bank statements (CSV/OFX) and auto-matches transactions against recorded receipts and payments. Unmatched items are flagged for manual reconciliation. Bank reconciliation report is generated daily. Eliminates month-end manual reconciliation effort.",
                        "userType": "Finance Manager",
                        "usp": true
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "GST and Statutory Compliance",
                        "subFeatures": "GSTR-1, GSTR-3B Auto-Generation",
                        "works": "Platform computes GST liability from all taxable transactions and generates GSTR-1 (outward supplies) and GSTR-3B (summary return) in the JSON format required for direct upload to the GST portal. HSN/SAC code mapping is configured per revenue category. Inter-state and intra-state supply classification is automatic.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "GST and Statutory Compliance",
                        "subFeatures": "TDS Deduction and Form 16A / 26Q Compliance",
                        "works": "System auto-calculates TDS deductions on applicable vendor payments (trainer fees, contractor payments, rent) per applicable section (194J, 194C, 194I). TDS certificates and Form 26Q filing data are generated quarterly. Compliance dashboard shows TDS payment and filing status.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "GST and Statutory Compliance",
                        "subFeatures": "Tally Export and ERP Integration",
                        "works": "One-click export of all accounting data in Tally-compatible XML format for clubs that maintain Tally as their primary accounting system. Alternatively, the native accounting module serves as a standalone Tally replacement. API-based accounting sync is available for SAP, QuickBooks, and Zoho Books.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": false
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "Financial Reporting",
                        "subFeatures": "P&L, Balance Sheet, and Cash Flow Statements",
                        "works": "GAAP-compliant financial statements (Income Statement, Balance Sheet, Cash Flow) are generated on demand for any date range, branch, or consolidated entity. Statements are formatted for CA review and investor presentation. PDF and Excel export supported. Comparative period analysis (vs prior month, vs prior year) is built in.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 17: ACCOUNTING",
                        "feature": "Financial Reporting",
                        "subFeatures": "Budget vs Actual Variance Analysis",
                        "works": "Finance team loads annual budget for each account head at the start of the financial year. Monthly Budget vs Actual report shows variance in absolute INR and percentage, with drill-down to transaction level. Significant variances (&gt;10% or &gt;INR 1 lakh) trigger automated alerts to the Finance Manager.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 18: LOYALTY MANAGEMENT",
                        "feature": "Points and Rewards Engine",
                        "subFeatures": "Configurable Points Earn Rules",
                        "works": "Admin defines earn rules for every member action: points per INR spent on membership renewal, per F&B order, per court booking, per class attendance, per co-player invite accepted, per referral conversion, and per community post. Bonus multiplier events (2x points on weekdays, 3x on off-peak hours) are schedulable. Rules activate and deactivate automatically by date.",
                        "userType": "Super Admin, Marketing Team",
                        "usp": true
                  },
                  {
                        "module": "MODULE 18: LOYALTY MANAGEMENT",
                        "feature": "Points and Rewards Engine",
                        "subFeatures": "Tiered Loyalty Programme (Bronze, Silver, Gold, Platinum)",
                        "works": "Membership loyalty tiers are defined by annual points accumulated. Each tier unlocks incremental benefits: priority booking windows, F&B discounts, complimentary guest passes, exclusive event access, and higher co-player match priority. Tier upgrade and downgrade logic is fully automated with member notification.",
                        "userType": "Super Admin, Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 18: LOYALTY MANAGEMENT",
                        "feature": "Points and Rewards Engine",
                        "subFeatures": "Redemption Catalogue and Instant Redemption",
                        "works": "Members redeem points from a digital catalogue: amenity credits, F&B vouchers, merchandise, guest passes, or membership extension days. Redemption can be instant (applied to current booking or bill) or via a voucher code valid for 90 days. Minimum redemption threshold and maximum redemption per transaction are configurable.",
                        "userType": "Member, Front Desk Staff",
                        "usp": true
                  },
                  {
                        "module": "MODULE 18: LOYALTY MANAGEMENT",
                        "feature": "Loyalty Analytics and Campaign Management",
                        "subFeatures": "Loyalty Programme ROI Dashboard",
                        "works": "Finance dashboard showing: total points issued vs redeemed, redemption rate by tier, revenue attributable to loyalty-enrolled members vs non-enrolled, and incremental visit frequency for loyalty members. Liability dashboard shows total outstanding point value in INR at current redemption rates.",
                        "userType": "Finance Manager, Super Admin",
                        "usp": true
                  },
                  {
                        "module": "MODULE 18: LOYALTY MANAGEMENT",
                        "feature": "Loyalty Analytics and Campaign Management",
                        "subFeatures": "Personalised Loyalty Campaigns",
                        "works": "AI-driven campaign engine identifies members close to tier upgrade thresholds and sends personalised nudges (You are 200 points away from Gold status - book two more sessions this month). Double points events are targeted to members with declining visit frequency. Campaign performance is tracked by points earned per campaign and subsequent visit increase.",
                        "userType": "Admin, Marketing Team",
                        "usp": true
                  },
                  {
                        "module": "MODULE 18: LOYALTY MANAGEMENT",
                        "feature": "Loyalty Analytics and Campaign Management",
                        "subFeatures": "Partner Loyalty Network",
                        "works": "Clubs can join a Lockated partner loyalty network where member points earned at one club are redeemable at partner clubs. Admin controls which clubs are included in the network. Cross-club point transfers are logged and reconciled monthly. Creates a network effect that increases the loyalty programme's perceived value.",
                        "userType": "Super Admin, Member",
                        "usp": true
                  },
                  {
                        "module": "MODULE 18: LOYALTY MANAGEMENT",
                        "feature": "Referral and Advocacy Programme",
                        "subFeatures": "Member Referral Tracking and Rewards",
                        "works": "Each member receives a unique referral code shareable via WhatsApp, email, or in-app. When a new member joins using the code, both referrer and referee receive configurable points or credits. Referral tracking is automated end-to-end. Top referrers appear on a leaderboard visible in the community section.",
                        "userType": "Member, Admin",
                        "usp": true
                  }
            ],
            productSummaryNew: {
                  summarySubtitle: "Part of Lockated / GoPhygital.work | B2B SaaS | India Primary, Global Secondary",
                  identity: [
                        { field: "Product Name", detail: "Club Management by Lockated (GoPhygital.work)" },
                        { field: "One-Line Description", detail: "All-in-one club operations platform with data sovereignty: membership, bookings, payments, attendance, F&B POS, room inventory, channel controller, recipe management, asset management, accounting, and loyalty management — all data stored exclusively on the client's own infrastructure, never on Lockated servers." },
                        { field: "Product Category", detail: "Club & Facility Management SaaS - B2B" },
                        { field: "Core Mission", detail: "Empower sports and fitness club operators across India to replace fragmented spreadsheets and legacy tools with a unified, AI-assisted, mobile-first platform that returns full data ownership to the operator." },
                        { field: "Geography Focus", detail: "India - Primary | Global - Secondary (Never GCC)" },
                        { field: "Data Sovereignty", detail: "All client data stored exclusively on the client's own infrastructure. Lockated never holds, mines, or monetises client data. Full DPDPA, GDPR, and PCI-DSS compliance baked in." }
                  ],
                  problemSolves: [
                        { painPoint: "Core Pain Point", solution: "Club managers in India operate on a patchwork of Excel, WhatsApp groups, and outdated desktop software. Bookings are done manually, no-shows go unpenalised, and members are retained through relationships, not data. 70%+ of premium clubs in Tier-1 cities still use manual processes for member renewals." },
                        { painPoint: "Data Sovereignty Gap", solution: "Global platforms (MINDBODY, Glofox) store all member data on their US-based servers. Indian operators have no visibility into how that data is used, shared, or sold. Lockated's on-premise data architecture is the only model that fully satisfies India's DPDPA requirements out of the box." },
                        { painPoint: "Switching Cost Trap", solution: "Legacy India-market tools like Shawman offer deep billing features but zero community engagement, no mobile-first experience, and no AI analytics. Operators are trapped because migration is complex. Lockated breaks this by offering a modern stack with guided migration and white-label branding." },
                        { painPoint: "Community Void", solution: "No competitor in India provides built-in co-player matching, community posts linked to bookings, skill-level pairing, or partner ratings. These features directly reduce churn by creating social bonds within the club." }
                  ],
                  whoItIsFor: [
                        { role: "Club Owners and Senior Management", useCase: "Revenue reporting, occupancy tracking, branch comparison, investor-ready P&L.", frustration: "Manually compiling data across branches every month-end.", gain: "Real-time Super Admin dashboard with AI revenue forecast and automated financial reporting." },
                        { role: "Operations and Facility Managers", useCase: "Amenity scheduling, trainer assignment, maintenance blocking, real-time occupancy.", frustration: "Double-bookings, trainer no-shows, no live view of which courts are occupied.", gain: "Conflict-free slot engine, trainer performance dashboard, live occupancy heatmap." },
                        { role: "Club Members (End Users)", useCase: "Booking courts, finding co-players, tracking attendance streaks, managing wallet and invoices.", frustration: "Calling front desk, no visibility on waitlists, no way to find a partner for a game.", gain: "3-tap self-service booking, co-player matching with skill-level AI, attendance gamification." }
                  ],
                  today: [
                        { dimension: "Product Status", state: "Feature-complete v1 across all 18 modules. iOS and Android apps in build. Web admin portal live. QR check-in engine tested. F&B POS, Room Inventory, Channel Controller, Recipe Management, Asset Management, Accounting, and Loyalty modules integrated and in active pilot testing with club clients." },
                        { dimension: "What Is Missing Right Now", state: "Biometric hardware integrations (RFID/facial recognition) are roadmap items. WhatsApp notification channel not yet live. AI prediction models require minimum 3 months of live data per club before activating." },
                        { dimension: "Competitive Moat Today", state: "Only India-market club management platform with: (1) data sovereignty architecture — client data never leaves client infrastructure; (2) built-in co-player matching and community engine; (3) native F&B POS with recipe-driven food cost control; (4) full double-entry accounting with GSTR-1/3B JSON generation; (5) integrated 4-tier loyalty programme with UPI-native redemption; (6) room inventory + OTA channel controller in one" },
                        { dimension: "Key Target Markets", state: "Tier-1 India cities first: Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune. Segments: premium sports clubs (padel, squash, badminton), multi-branch fitness chains, corporate wellness centres, hotel and resort amenity management." },
                        { dimension: "Revenue Model", state: "Monthly SaaS subscription per branch [Base + per-member tiers]. One-time onboarding and setup fee. Optional module add-ons: F&B POS, Room PMS, Channel Management, Accounting, Loyalty at incremental monthly fees. ACV ranges INR 25,000–35,000/month (core platform) to INR 55,000–1,20,000/month for full-service country clubs and club-hotels with all modules active." },
                        { dimension: "The Investor and Partner Case", state: "India has 15,000+ organised sports and fitness clubs with zero modern, data-sovereign management software. The padel market alone added 26% new clubs globally in 2024 with India named a high-growth market. Lockated enters as the only platform built for Indian compliance, Indian payment rails, and the social/community need that drives club retention." }
                  ]
            },
            detailedPricing: {
                  featureComparison: [
                        { feature: "Data Sovereignty (client-owned servers)", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "India Payment Rails (UPI, RuPay)", lockated: "AHEAD", shawman: "AT PAR", mindbody: "GAP", glofox: "GAP", omnify: "AT PAR" },
                        { feature: "GST-Compliant Auto-Invoicing", lockated: "AHEAD", shawman: "AT PAR", mindbody: "GAP", glofox: "GAP", omnify: "AT PAR" },
                        { feature: "DPDPA Compliance", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Native iOS and Android App", lockated: "AHEAD", shawman: "GAP", mindbody: "AHEAD", glofox: "AHEAD", omnify: "AT PAR" },
                        { feature: "Offline Mode (SQLite)", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Co-Player Matching (AI Skill-Level)", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Community Posts with Booking Links", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Member Rating and Review System", lockated: "AHEAD", shawman: "GAP", mindbody: "AT PAR", glofox: "GAP", omnify: "GAP" },
                        { feature: "Multi-Branch with Cross-Branch Booking", lockated: "AHEAD", shawman: "AT PAR", mindbody: "AHEAD", glofox: "AT PAR", omnify: "GAP" },
                        { feature: "Waitlist with Auto-Promotion Logic", lockated: "AHEAD", shawman: "GAP", mindbody: "AT PAR", glofox: "AT PAR", omnify: "AT PAR" },
                        { feature: "AI Churn Prediction", lockated: "AHEAD", shawman: "GAP", mindbody: "AT PAR", glofox: "GAP", omnify: "GAP" },
                        { feature: "AI No-Show Prediction", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "AI Revenue Optimisation Engine", lockated: "AHEAD", shawman: "GAP", mindbody: "AT PAR", glofox: "GAP", omnify: "GAP" },
                        { feature: "Prepaid Wallet with Credit Transfer", lockated: "AHEAD", shawman: "AT PAR", mindbody: "AT PAR", glofox: "GAP", omnify: "AT PAR" },
                        { feature: "Corporate Bulk Membership API", lockated: "AHEAD", shawman: "AT PAR", mindbody: "AHEAD", glofox: "GAP", omnify: "GAP" },
                        { feature: "Family Accounts with Age-Based Access", lockated: "AHEAD", shawman: "AT PAR", mindbody: "AT PAR", glofox: "GAP", omnify: "GAP" },
                        { feature: "Role-Based Multi-Level Admin Access", lockated: "AHEAD", shawman: "AT PAR", mindbody: "AHEAD", glofox: "AT PAR", omnify: "AT PAR" },
                        { feature: "RFID and Biometric Access Integration", lockated: "AT PAR", shawman: "AT PAR", mindbody: "AT PAR", glofox: "GAP", omnify: "GAP" },
                        { feature: "REST and GraphQL API", lockated: "AHEAD", shawman: "GAP", mindbody: "AHEAD", glofox: "AT PAR", omnify: "GAP" },
                        { feature: "Peak/Off-Peak Pricing Engine", lockated: "AHEAD", shawman: "AT PAR", mindbody: "AT PAR", glofox: "GAP", omnify: "GAP" },
                        { feature: "Trainer Commission and Rating Engine", lockated: "AHEAD", shawman: "AT PAR", mindbody: "AT PAR", glofox: "AT PAR", omnify: "GAP" },
                        { feature: "Attendance Streak Gamification", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Dark Mode and Sub-1.5s App Performance", lockated: "AHEAD", shawman: "GAP", mindbody: "AT PAR", glofox: "AT PAR", omnify: "GAP" },
                        { feature: "F&B POS with Member Tab Billing", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Recipe Management and Food Cost Engine", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Room Inventory and Guest Folio Management", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Channel Controller (OTA Sync: MMT, Booking.com)", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Asset Management with QR Tagging and Depreciation", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "GAP", omnify: "GAP" },
                        { feature: "Native Double-Entry Accounting with GSTR-1/3B", lockated: "AHEAD", shawman: "GAP", mindbody: "GAP", glofox: "AT PAR", omnify: "GAP" },
                        { feature: "Tiered Loyalty Programme with Partner Network", lockated: "AHEAD", shawman: "GAP", mindbody: "AT PAR", glofox: "GAP", omnify: "GAP" },
                  ],
                  priceCompetitiveness: "Lockated is priced at a 10-30% premium over Omnify and TeamUp but at a 30-50% discount to MINDBODY and Virtuagym. The premium vs Omnify is justified by AI features and data sovereignty. The discount vs MINDBODY removes the primary budget objection for Indian clubs.",
                  pricingLandscapeRows: [
                        { competitor: "Lockated Club Management", model: "Per branch SaaS + module add-ons (F&B, Rooms, Accounting, Loyalty) + white-label app", entryPrice: "INR 20,000", midPrice: "INR 45,000", enterprisePrice: "INR 1,20,000+", segment: "India-native, primary market" },
                        { competitor: "Shawman", model: "Per-location license, annual contract common", entryPrice: "INR 8,000", midPrice: "INR 15,000", enterprisePrice: "INR 25,000+", segment: "Strong India presence, legacy" },
                        { competitor: "Omnify", model: "Per-month, member-count tiers", entryPrice: "INR 2,000", midPrice: "INR 6,000", enterprisePrice: "INR 12,000", segment: "India-founded, growing" },
                        { competitor: "MINDBODY (USD converted)", model: "Per-location tiered subscription", entryPrice: "INR 12,000 (USD 139)", midPrice: "INR 30,000 (USD 350)", enterprisePrice: "INR 52,000+ (USD 599+)", segment: "Limited India direct sales" },
                        { competitor: "Glofox", model: "Undisclosed tiers, quote-based", entryPrice: "INR 10,000 (approx)", midPrice: "INR 25,000 (approx)", enterprisePrice: "INR 50,000+ (approx)", segment: "Minimal India presence" },
                        { competitor: "TeamUp", model: "Per active member, usage-based", entryPrice: "INR 9,000 (GBP 104)", midPrice: "INR 18,000 (GBP 200)", enterprisePrice: "INR 35,000+ (GBP 400)", segment: "No India sales team" },
                        { competitor: "Zenoti", model: "Enterprise quote-based", entryPrice: "INR 15,000 (estimate)", midPrice: "INR 40,000 (estimate)", enterprisePrice: "INR 80,000+ (quote)", segment: "India office, focused on salon/spa" },
                        { competitor: "EZFacility", model: "Tiered by feature set", entryPrice: "INR 7,500 (USD 85)", midPrice: "INR 18,000 (USD 200)", enterprisePrice: "INR 28,000 (USD 325)", segment: "No dedicated India presence" }
                  ],
                  positioning: [
                        { dimension: "Value Proposition Statement", statement: "The only club management platform built for India-first data sovereignty, with integrated F&B, room inventory, channel management, recipe costing, asset tracking, full accounting, and tiered loyalty – plus community-driven member retention and AI-powered operations – at a price Indian sports and country clubs can actually afford." },
                        { dimension: "Primary Differentiator", statement: "Data sovereignty: client data stays on client's own servers. No competitor offers this. Relevant for DPDPA compliance and enterprise procurement requirements." },
                        { dimension: "Secondary Differentiator", statement: "Community and co-player features that no competitor provides: member directory with privacy controls, co-player matching by skill level and availability, posts linked to bookings." },
                        { dimension: "Tertiary Differentiator", statement: "AI predictions (no-show, churn, revenue optimisation) available at India mid-market price points vs global platforms that restrict AI features to expensive enterprise tiers." },
                        { dimension: "Brand Positioning", statement: "Premium over Omnify and TeamUp. Value alternative to MINDBODY. India-first alternative to Shawman for clubs that want modern UX and mobile-first experience." }
                  ],
                  valuePropositions: [
                        { currentProp: "Real-time multi-branch P&L and 12-month AI revenue forecast without manual data assembly", segment: "Club Owner / Investor", weakness: "Shawman requires manual Excel consolidation; MINDBODY forecast only on Enterprise tier", sharpened: "Yes it costs INR 30,000/month but saves 40+ hours of admin per month and prevents INR 2L+ in revenue leakage from no-shows", role: "Club Owner / Investor", prop: "Real-time multi-branch P&L and 12-month AI revenue forecast without manual data assembly", outcome: "Reduces monthly finance close from 3 days to real-time; improves investor reporting credibility", feature: "Super Admin dashboard with branch comparison and revenue forecast engine" },
                        { currentProp: "Eliminate double-bookings and trainer no-shows through automated conflict detection and AI prediction", segment: "Operations Manager", weakness: "No competitor offers AI no-show prediction at mid-market price", sharpened: "Our bookings are simple - our members call in. Response: Members who can self-book on mobile book 3x more frequently per month.", role: "Operations Manager", prop: "Eliminate double-bookings and trainer no-shows through automated conflict detection and AI prediction", outcome: "Reduces no-show rate from typical 18-25% to under 10%, saving court revenue", feature: "Conflict-free booking engine, trainer availability sync, AI no-show prediction per booking" },
                        { currentProp: "Automated GST invoicing and tax reporting that eliminates manual CA reconciliation", segment: "Finance Manager", weakness: "Shawman has GST but no aging report; MINDBODY has no GST support", sharpened: "We already use Tally for invoicing. Response: Lockated exports GST data to Tally in one click via CSV.", role: "Finance Manager", prop: "Automated GST invoicing and tax reporting that eliminates manual CA reconciliation", outcome: "Reduces month-end close by 2 days; CA audit cost savings of INR 30,000-50,000/year", feature: "Auto-generated GST invoices (CGST+SGST/IGST), tax liability report, aging of receivables" },
                        { currentProp: "Find a padel partner in 3 taps, book the court, split the payment - all from the app", segment: "Club Member", weakness: "Zero competitors offer co-player matching. WhatsApp groups are the current method.", sharpened: "Our members are not tech-savvy. Response: 3-tap navigation rule; dark mode; biometric login; tested at sub-1.5s startup.", role: "Club Member", prop: "Find a padel partner in 3 taps, book the court, split the payment - all from the app", outcome: "Member books 2.5x more sessions/month when they can find a partner vs booking solo", feature: "Co-player matching with skill-level AI, in-app invite with split payment, one-tap booking" }
                  ]
            }
      }
};

const ClubManagementPage: React.FC = () => {
      return <BaseProductPage productData={clubData} tabsVariant="snag360" />;
};

export default ClubManagementPage;
