import fs from 'fs';

// Real skincare products with matching Google Images URLs
const products = [
  {
    name: "CeraVe Hydrating Cleanser",
    imageUrl: "https://www.google.com/search?q=CeraVe+Hydrating+Cleanser&tbm=isch&tbs=isz:m",
    category: "Cleanser",
    description: "Gentle foaming cleanser with ceramides and hyaluronic acid for normal to dry skin.",
    price: "1299"
  },
  {
    name: "The Ordinary Niacinamide 10% + Zinc",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Niacinamide+10%25+Zinc&tbm=isch",
    category: "Serum",
    description: "High-strength vitamin and mineral blemish formula that visibly refines skin texture.",
    price: "899"
  },
  {
    name: "La Roche-Posay Toleriane Double Repair Moisturizer",
    imageUrl: "https://www.google.com/search?q=La+Roche+Posay+Toleriane+Double+Repair&tbm=isch",
    category: "Moisturizer",
    description: "Daily face moisturizer with ceramides and niacinamide for sensitive skin.",
    price: "1899"
  },
  {
    name: "Paula's Choice 2% BHA Liquid Exfoliant",
    imageUrl: "https://www.google.com/search?q=Paula+Choice+2%25+BHA+Liquid+Exfoliant&tbm=isch",
    category: "Exfoliator",
    description: "Gentle leave-on exfoliant with salicylic acid to unclog pores and smooth skin.",
    price: "2499"
  },
  {
    name: "Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 50",
    imageUrl: "https://www.google.com/search?q=Neutrogena+Ultra+Sheer+SPF+50&tbm=isch",
    category: "Sunscreen",
    description: "Lightweight, non-greasy sunscreen with broad spectrum UVA/UVB protection.",
    price: "999"
  },
  {
    name: "Drunk Elephant C-Firma Vitamin C Day Serum",
    imageUrl: "https://www.google.com/search?q=Drunk+Elephant+C-Firma+Vitamin+C&tbm=isch",
    category: "Serum",
    description: "Antioxidant-rich serum with 15% L-ascorbic acid to brighten and firm skin.",
    price: "5499"
  },
  {
    name: "Kiehl's Ultra Facial Cream",
    imageUrl: "https://www.google.com/search?q=Kiehl+Ultra+Facial+Cream&tbm=isch",
    category: "Moisturizer",
    description: "24-hour hydration cream with squalane and glacial glycoprotein.",
    price: "3299"
  },
  {
    name: "Glow Recipe Watermelon Glow Niacinamide Dew Drops",
    imageUrl: "https://www.google.com/search?q=Glow+Recipe+Watermelon+Niacinamide+Dew+Drops&tbm=isch",
    category: "Serum",
    description: "Lightweight serum with 5% niacinamide and watermelon extract for glowing skin.",
    price: "2799"
  },
  {
    name: "COSRX Advanced Snail 96 Mucin Power Essence",
    imageUrl: "https://www.google.com/search?q=COSRX+Snail+96+Mucin+Essence&tbm=isch",
    category: "Serum",
    description: "Hydrating essence with 96% snail secretion filtrate to repair and soothe skin.",
    price: "1899"
  },
  {
    name: "First Aid Beauty Ultra Repair Cream",
    imageUrl: "https://www.google.com/search?q=First+Aid+Beauty+Ultra+Repair+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Intensive repair cream with colloidal oatmeal for dry, distressed skin.",
    price: "2299"
  },
  {
    name: "The Inkey List Retinol Serum",
    imageUrl: "https://www.google.com/search?q=The+Inkey+List+Retinol+Serum&tbm=isch",
    category: "Serum",
    description: "1% stabilized retinol serum to reduce fine lines and improve skin texture.",
    price: "999"
  },
  {
    name: "Cetaphil Daily Facial Cleanser",
    imageUrl: "https://www.google.com/search?q=Cetaphil+Daily+Facial+Cleanser&tbm=isch",
    category: "Cleanser",
    description: "Mild, non-irritating cleanser for normal to oily skin.",
    price: "799"
  },
  {
    name: "Olay Regenerist Micro-Sculpting Cream",
    imageUrl: "https://www.google.com/search?q=Olay+Regenerist+Micro+Sculpting+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Anti-aging moisturizer with amino-peptides and niacinamide.",
    price: "1999"
  },
  {
    name: "Supergoop! Unseen Sunscreen SPF 40",
    imageUrl: "https://www.google.com/search?q=Supergoop+Unseen+Sunscreen+SPF+40&tbm=isch",
    category: "Sunscreen",
    description: "Invisible, weightless sunscreen that feels like a primer.",
    price: "2999"
  },
  {
    name: "Sunday Riley Good Genes All-In-One Lactic Acid Treatment",
    imageUrl: "https://www.google.com/search?q=Sunday+Riley+Good+Genes+Lactic+Acid&tbm=isch",
    category: "Treatment",
    description: "Exfoliating treatment with lactic acid to brighten and smooth skin.",
    price: "5999"
  },
  {
    name: "Clinique Dramatically Different Moisturizing Lotion+",
    imageUrl: "https://www.google.com/search?q=Clinique+Dramatically+Different+Moisturizing+Lotion&tbm=isch",
    category: "Moisturizer",
    description: "Hydrating lotion that strengthens skin's moisture barrier.",
    price: "2499"
  },
  {
    name: "Estée Lauder Advanced Night Repair Serum",
    imageUrl: "https://www.google.com/search?q=Estee+Lauder+Advanced+Night+Repair+Serum&tbm=isch",
    category: "Serum",
    description: "Anti-aging serum with hyaluronic acid to repair and hydrate overnight.",
    price: "8999"
  },
  {
    name: "Garnier Micellar Cleansing Water",
    imageUrl: "https://www.google.com/search?q=Garnier+Micellar+Cleansing+Water&tbm=isch",
    category: "Cleanser",
    description: "Gentle micellar water that removes makeup and cleanses without rinsing.",
    price: "599"
  },
  {
    name: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+AHA+30+BHA+2+Peeling+Solution&tbm=isch",
    category: "Treatment",
    description: "Weekly exfoliating treatment with alpha and beta hydroxy acids.",
    price: "1299"
  },
  {
    name: "Laneige Water Bank Hyaluronic Cream",
    imageUrl: "https://www.google.com/search?q=Laneige+Water+Bank+Hyaluronic+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Intense hydration cream with hyaluronic acid and green mineral water.",
    price: "2799"
  },
  {
    name: "Biore UV Aqua Rich Watery Essence SPF 50",
    imageUrl: "https://www.google.com/search?q=Biore+UV+Aqua+Rich+Watery+Essence+SPF+50&tbm=isch",
    category: "Sunscreen",
    description: "Lightweight Japanese sunscreen with high UV protection.",
    price: "1199"
  },
  {
    name: "Ole Henriksen Truth Serum Vitamin C",
    imageUrl: "https://www.google.com/search?q=Ole+Henriksen+Truth+Serum+Vitamin+C&tbm=isch",
    category: "Serum",
    description: "Brightening serum with vitamin C complex and collagen boosters.",
    price: "3499"
  },
  {
    name: "Aveeno Daily Moisturizing Lotion",
    imageUrl: "https://www.google.com/search?q=Aveeno+Daily+Moisturizing+Lotion&tbm=isch",
    category: "Moisturizer",
    description: "Daily moisturizer with colloidal oatmeal for dry skin.",
    price: "899"
  },
  {
    name: "Tatcha The Water Cream",
    imageUrl: "https://www.google.com/search?q=Tatcha+Water+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Oil-free, pore-perfecting moisturizer with Japanese wild rose.",
    price: "6999"
  },
  {
    name: "Dermalogica Daily Microfoliant",
    imageUrl: "https://www.google.com/search?q=Dermalogica+Daily+Microfoliant&tbm=isch",
    category: "Exfoliator",
    description: "Rice-based powder exfoliant that activates with water.",
    price: "3999"
  },
  {
    name: "EltaMD UV Clear Broad-Spectrum SPF 46",
    imageUrl: "https://www.google.com/search?q=EltaMD+UV+Clear+SPF+46&tbm=isch",
    category: "Sunscreen",
    description: "Oil-free sunscreen with niacinamide for acne-prone and sensitive skin.",
    price: "2499"
  },
  {
    name: "Kiehl's Midnight Recovery Concentrate",
    imageUrl: "https://www.google.com/search?q=Kiehl+Midnight+Recovery+Concentrate&tbm=isch",
    category: "Serum",
    description: "Overnight face oil with botanical oils to restore and replenish skin.",
    price: "4499"
  },
  {
    name: "CeraVe Foaming Facial Cleanser",
    imageUrl: "https://www.google.com/search?q=CeraVe+Foaming+Facial+Cleanser&tbm=isch",
    category: "Cleanser",
    description: "Foaming cleanser with ceramides for normal to oily skin.",
    price: "1199"
  },
  {
    name: "The Ordinary Hyaluronic Acid 2% + B5",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Hyaluronic+Acid+2+B5&tbm=isch",
    category: "Serum",
    description: "Hydration support formula with multi-weight hyaluronic acid.",
    price: "699"
  },
  {
    name: "Olay Total Effects 7-in-1 Anti-Aging Moisturizer",
    imageUrl: "https://www.google.com/search?q=Olay+Total+Effects+7+in+1&tbm=isch",
    category: "Moisturizer",
    description: "Multi-benefit moisturizer with niacinamide and vitamins.",
    price: "1499"
  },
  {
    name: "La Mer Crème de la Mer",
    imageUrl: "https://www.google.com/search?q=La+Mer+Creme+de+la+Mer&tbm=isch",
    category: "Moisturizer",
    description: "Luxury moisturizing cream with Miracle Broth to renew skin.",
    price: "24999"
  },
  {
    name: "Shiseido Ultimate Sun Protector Lotion SPF 50+",
    imageUrl: "https://www.google.com/search?q=Shiseido+Ultimate+Sun+Protector+SPF+50&tbm=isch",
    category: "Sunscreen",
    description: "Water-resistant sunscreen with advanced UV protection technology.",
    price: "3499"
  },
  {
    name: "Peter Thomas Roth Water Drench Hyaluronic Cloud Cream",
    imageUrl: "https://www.google.com/search?q=Peter+Thomas+Roth+Water+Drench+Cloud+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Hydrating cloud cream with 30% hyaluronic acid complex.",
    price: "3999"
  },
  {
    name: "The Inkey List Salicylic Acid Cleanser",
    imageUrl: "https://www.google.com/search?q=The+Inkey+List+Salicylic+Acid+Cleanser&tbm=isch",
    category: "Cleanser",
    description: "BHA cleanser with 2% salicylic acid to unclog pores.",
    price: "899"
  },
  {
    name: "Dr. Jart+ Ceramidin Cream",
    imageUrl: "https://www.google.com/search?q=Dr+Jart+Ceramidin+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Intensive moisturizer with ceramides to strengthen skin barrier.",
    price: "3499"
  },
  {
    name: "Origins GinZing Energy-Boosting Gel Moisturizer",
    imageUrl: "https://www.google.com/search?q=Origins+GinZing+Energy+Boosting+Gel&tbm=isch",
    category: "Moisturizer",
    description: "Lightweight gel moisturizer with ginseng and coffee bean.",
    price: "2299"
  },
  {
    name: "Bioderma Sensibio H2O Micellar Water",
    imageUrl: "https://www.google.com/search?q=Bioderma+Sensibio+H2O+Micellar+Water&tbm=isch",
    category: "Cleanser",
    description: "Gentle micellar water for sensitive skin.",
    price: "1499"
  },
  {
    name: "Fresh Rose Deep Hydration Face Cream",
    imageUrl: "https://www.google.com/search?q=Fresh+Rose+Deep+Hydration+Face+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Hydrating cream with rosewater and hyaluronic acid.",
    price: "4499"
  },
  {
    name: "Murad Rapid Age Spot and Pigment Lightening Serum",
    imageUrl: "https://www.google.com/search?q=Murad+Rapid+Age+Spot+Pigment+Lightening+Serum&tbm=isch",
    category: "Serum",
    description: "Brightening serum with hydroquinone to fade dark spots.",
    price: "5999"
  },
  {
    name: "Neutrogena Hydro Boost Water Gel",
    imageUrl: "https://www.google.com/search?q=Neutrogena+Hydro+Boost+Water+Gel&tbm=isch",
    category: "Moisturizer",
    description: "Oil-free gel moisturizer with hyaluronic acid.",
    price: "1299"
  },
  {
    name: "The Ordinary Natural Moisturizing Factors + HA",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Natural+Moisturizing+Factors+HA&tbm=isch",
    category: "Moisturizer",
    description: "Lightweight moisturizer with natural moisturizing factors.",
    price: "799"
  },
  {
    name: "Kiehl's Calendula Herbal Extract Toner",
    imageUrl: "https://www.google.com/search?q=Kiehl+Calendula+Herbal+Extract+Toner&tbm=isch",
    category: "Toner",
    description: "Soothing toner with calendula petals for sensitive skin.",
    price: "2299"
  },
  {
    name: "Clinique Take The Day Off Cleansing Balm",
    imageUrl: "https://www.google.com/search?q=Clinique+Take+The+Day+Off+Cleansing+Balm&tbm=isch",
    category: "Cleanser",
    description: "Melting cleansing balm that removes all makeup.",
    price: "2799"
  },
  {
    name: "Glow Recipe Plum Plump Hyaluronic Serum",
    imageUrl: "https://www.google.com/search?q=Glow+Recipe+Plum+Plump+Hyaluronic+Serum&tbm=isch",
    category: "Serum",
    description: "Hydrating serum with 5 types of hyaluronic acid and plum.",
    price: "3299"
  },
  {
    name: "CeraVe Renewing SA Cleanser",
    imageUrl: "https://www.google.com/search?q=CeraVe+Renewing+SA+Cleanser&tbm=isch",
    category: "Cleanser",
    description: "Exfoliating cleanser with salicylic acid and ceramides.",
    price: "1399"
  },
  {
    name: "L'Oreal Paris Revitalift Anti-Aging Day Cream",
    imageUrl: "https://www.google.com/search?q=L+Oreal+Revitalift+Anti+Aging+Day+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Anti-aging moisturizer with pro-retinol and SPF.",
    price: "1799"
  },
  {
    name: "Paula's Choice Resist Super-Light Wrinkle Defense SPF 30",
    imageUrl: "https://www.google.com/search?q=Paula+Choice+Resist+Super+Light+Wrinkle+Defense+SPF+30&tbm=isch",
    category: "Sunscreen",
    description: "Mineral sunscreen with antioxidants for sensitive skin.",
    price: "2999"
  },
  {
    name: "Sunday Riley Luna Sleeping Night Oil",
    imageUrl: "https://www.google.com/search?q=Sunday+Riley+Luna+Sleeping+Night+Oil&tbm=isch",
    category: "Serum",
    description: "Retinoid night oil with blue tansy and chamomile.",
    price: "7999"
  },
  {
    name: "The Ordinary Granactive Retinoid 2% Emulsion",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Granactive+Retinoid+2+Emulsion&tbm=isch",
    category: "Serum",
    description: "Advanced retinoid formula for visible anti-aging benefits.",
    price: "999"
  },
  {
    name: "Aveeno Positively Radiant Daily Moisturizer SPF 30",
    imageUrl: "https://www.google.com/search?q=Aveeno+Positively+Radiant+Daily+Moisturizer+SPF+30&tbm=isch",
    category: "Moisturizer",
    description: "Daily moisturizer with soy complex and SPF protection.",
    price: "1199"
  },
  {
    name: "Dermalogica Special Cleansing Gel",
    imageUrl: "https://www.google.com/search?q=Dermalogica+Special+Cleansing+Gel&tbm=isch",
    category: "Cleanser",
    description: "Gentle foaming cleanser for all skin types.",
    price: "2499"
  },
  {
    name: "Clinique All About Eyes Rich",
    imageUrl: "https://www.google.com/search?q=Clinique+All+About+Eyes+Rich&tbm=isch",
    category: "Eye Cream",
    description: "Rich eye cream to reduce dark circles and puffiness.",
    price: "3499"
  },
  {
    name: "The Inkey List Caffeine Eye Cream",
    imageUrl: "https://www.google.com/search?q=The+Inkey+List+Caffeine+Eye+Cream&tbm=isch",
    category: "Eye Cream",
    description: "Caffeine eye cream to reduce puffiness and dark circles.",
    price: "899"
  },
  {
    name: "Kiehl's Avocado Eye Cream",
    imageUrl: "https://www.google.com/search?q=Kiehl+Avocado+Eye+Cream&tbm=isch",
    category: "Eye Cream",
    description: "Rich eye cream with avocado oil for dry, delicate eye area.",
    price: "3299"
  },
  {
    name: "Olay Eyes Ultimate Eye Cream",
    imageUrl: "https://www.google.com/search?q=Olay+Eyes+Ultimate+Eye+Cream&tbm=isch",
    category: "Eye Cream",
    description: "Anti-aging eye cream with peptides and niacinamide.",
    price: "1499"
  },
  {
    name: "La Roche-Posay Anthelios Melt-In Milk Sunscreen SPF 60",
    imageUrl: "https://www.google.com/search?q=La+Roche+Posay+Anthelios+Melt+In+Milk+SPF+60&tbm=isch",
    category: "Sunscreen",
    description: "High protection sunscreen with Cell-Ox Shield technology.",
    price: "1999"
  },
  {
    name: "Neutrogena Makeup Remover Cleansing Towelettes",
    imageUrl: "https://www.google.com/search?q=Neutrogena+Makeup+Remover+Cleansing+Towelettes&tbm=isch",
    category: "Cleanser",
    description: "Pre-moistened wipes that remove makeup and cleanse skin.",
    price: "699"
  },
  {
    name: "The Ordinary Azelaic Acid Suspension 10%",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Azelaic+Acid+Suspension+10&tbm=isch",
    category: "Treatment",
    description: "Brightening cream with azelaic acid to improve skin texture.",
    price: "799"
  },
  {
    name: "CeraVe PM Facial Moisturizing Lotion",
    imageUrl: "https://www.google.com/search?q=CeraVe+PM+Facial+Moisturizing+Lotion&tbm=isch",
    category: "Moisturizer",
    description: "Nighttime moisturizer with niacinamide and ceramides.",
    price: "1299"
  },
  {
    name: "Paula's Choice Clinical 1% Retinol Treatment",
    imageUrl: "https://www.google.com/search?q=Paula+Choice+Clinical+1+Retinol+Treatment&tbm=isch",
    category: "Treatment",
    description: "High-strength retinol treatment for advanced anti-aging.",
    price: "3999"
  },
  {
    name: "Glow Recipe Avocado Melt Retinol Sleeping Mask",
    imageUrl: "https://www.google.com/search?q=Glow+Recipe+Avocado+Melt+Retinol+Sleeping+Mask&tbm=isch",
    category: "Mask",
    description: "Overnight retinol mask with avocado and ceramides.",
    price: "3499"
  },
  {
    name: "Laneige Lip Sleeping Mask",
    imageUrl: "https://www.google.com/search?q=Laneige+Lip+Sleeping+Mask&tbm=isch",
    category: "Lip Care",
    description: "Overnight lip mask with vitamin C and hyaluronic acid.",
    price: "1999"
  },
  {
    name: "Fresh Sugar Advanced Therapy Lip Treatment",
    imageUrl: "https://www.google.com/search?q=Fresh+Sugar+Advanced+Therapy+Lip+Treatment&tbm=isch",
    category: "Lip Care",
    description: "Intensive lip treatment with peptides and hyaluronic acid.",
    price: "2499"
  },
  {
    name: "The Ordinary Squalane Cleanser",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Squalane+Cleanser&tbm=isch",
    category: "Cleanser",
    description: "Hydrating cleanser that transforms from balm to oil to milk.",
    price: "999"
  },
  {
    name: "Kiehl's Ultra Facial Oil-Free Gel Cream",
    imageUrl: "https://www.google.com/search?q=Kiehl+Ultra+Facial+Oil+Free+Gel+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Lightweight gel-cream for oily and combination skin.",
    price: "2999"
  },
  {
    name: "Drunk Elephant Protini Polypeptide Cream",
    imageUrl: "https://www.google.com/search?q=Drunk+Elephant+Protini+Polypeptide+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Peptide-rich moisturizer to improve skin firmness and tone.",
    price: "5999"
  },
  {
    name: "The Inkey List Omega Water Cream",
    imageUrl: "https://www.google.com/search?q=The+Inkey+List+Omega+Water+Cream&tbm=isch",
    category: "Moisturizer",
    description: "Lightweight water cream with omega fatty acids.",
    price: "1299"
  },
  {
    name: "COSRX Low pH Good Morning Gel Cleanser",
    imageUrl: "https://www.google.com/search?q=COSRX+Low+pH+Good+Morning+Gel+Cleanser&tbm=isch",
    category: "Cleanser",
    description: "Low pH gel cleanser with tea tree oil for morning routine.",
    price: "999"
  },
  {
    name: "Beauty of Joseon Relief Sun Rice + Probiotics SPF 50",
    imageUrl: "https://www.google.com/search?q=Beauty+of+Joseon+Relief+Sun+Rice+Probiotics+SPF+50&tbm=isch",
    category: "Sunscreen",
    description: "Korean sunscreen with rice and probiotics for sensitive skin.",
    price: "1499"
  },
  {
    name: "The Ordinary Multi-Peptide + HA Serum",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Multi+Peptide+HA+Serum&tbm=isch",
    category: "Serum",
    description: "Anti-aging serum with multiple peptides and hyaluronic acid.",
    price: "1299"
  },
  {
    name: "CeraVe Resurfacing Retinol Serum",
    imageUrl: "https://www.google.com/search?q=CeraVe+Resurfacing+Retinol+Serum&tbm=isch",
    category: "Serum",
    description: "Gentle retinol serum with ceramides and niacinamide.",
    price: "1499"
  },
  {
    name: "La Roche-Posay Effaclar Duo Acne Treatment",
    imageUrl: "https://www.google.com/search?q=La+Roche+Posay+Effaclar+Duo+Acne+Treatment&tbm=isch",
    category: "Treatment",
    description: "Acne treatment with benzoyl peroxide and salicylic acid.",
    price: "1799"
  },
  {
    name: "The Ordinary Lactic Acid 10% + HA",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Lactic+Acid+10+HA&tbm=isch",
    category: "Exfoliator",
    description: "Gentle exfoliating serum with lactic acid and hyaluronic acid.",
    price: "899"
  },
  {
    name: "Paula's Choice Skin Perfecting 2% BHA Liquid",
    imageUrl: "https://www.google.com/search?q=Paula+Choice+Skin+Perfecting+2+BHA+Liquid&tbm=isch",
    category: "Exfoliator",
    description: "Leave-on exfoliant with salicylic acid to clear pores.",
    price: "2299"
  },
  {
    name: "Glow Recipe Watermelon Glow PHA + BHA Pore-Tight Toner",
    imageUrl: "https://www.google.com/search?q=Glow+Recipe+Watermelon+Glow+PHA+BHA+Toner&tbm=isch",
    category: "Toner",
    description: "Gentle exfoliating toner with PHA and BHA for smooth pores.",
    price: "2799"
  },
  {
    name: "Kiehl's Rare Earth Deep Pore Cleansing Masque",
    imageUrl: "https://www.google.com/search?q=Kiehl+Rare+Earth+Deep+Pore+Cleansing+Masque&tbm=isch",
    category: "Mask",
    description: "Purifying clay mask with Amazonian white clay.",
    price: "2999"
  },
  {
    name: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+AHA+30+BHA+2+Peeling+Solution&tbm=isch",
    category: "Mask",
    description: "Weekly exfoliating mask with alpha and beta hydroxy acids.",
    price: "1299"
  },
  {
    name: "Fresh Rose Face Mask",
    imageUrl: "https://www.google.com/search?q=Fresh+Rose+Face+Mask&tbm=isch",
    category: "Mask",
    description: "Hydrating mask with real rose petals and cucumber extract.",
    price: "3999"
  },
  {
    name: "Origins Clear Improvement Active Charcoal Mask",
    imageUrl: "https://www.google.com/search?q=Origins+Clear+Improvement+Active+Charcoal+Mask&tbm=isch",
    category: "Mask",
    description: "Detoxifying mask with activated charcoal and white China clay.",
    price: "2299"
  },
  {
    name: "The Inkey List Kaolin Clay Mask",
    imageUrl: "https://www.google.com/search?q=The+Inkey+List+Kaolin+Clay+Mask&tbm=isch",
    category: "Mask",
    description: "Purifying clay mask to absorb excess oil and unclog pores.",
    price: "899"
  },
  {
    name: "CeraVe Hydrating Toner",
    imageUrl: "https://www.google.com/search?q=CeraVe+Hydrating+Toner&tbm=isch",
    category: "Toner",
    description: "Hydrating toner with ceramides and niacinamide.",
    price: "1199"
  },
  {
    name: "Thayers Witch Hazel Toner",
    imageUrl: "https://www.google.com/search?q=Thayers+Witch+Hazel+Toner&tbm=isch",
    category: "Toner",
    description: "Alcohol-free toner with rose petal and witch hazel.",
    price: "999"
  },
  {
    name: "The Ordinary Glycolic Acid 7% Toning Solution",
    imageUrl: "https://www.google.com/search?q=The+Ordinary+Glycolic+Acid+7+Toning+Solution&tbm=isch",
    category: "Toner",
    description: "Exfoliating toner with glycolic acid to brighten and smooth.",
    price: "999"
  },
  {
    name: "Paula's Choice Advanced Replenishing Toner",
    imageUrl: "https://www.google.com/search?q=Paula+Choice+Advanced+Replenishing+Toner&tbm=isch",
    category: "Toner",
    description: "Hydrating toner with ceramides and hyaluronic acid.",
    price: "1999"
  }
];

// Function to escape CSV fields
function escapeCSV(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

// Generate CSV content
const header = 'name,imageUrl,category,description,price';
const rows = products.map(p => 
  `${escapeCSV(p.name)},${escapeCSV(p.imageUrl)},${escapeCSV(p.category)},${escapeCSV(p.description)},${p.price}`
);

const csvContent = [header, ...rows].join('\n');

// Write to file
fs.writeFileSync('skincare_products_best.csv', csvContent, 'utf8');

console.log(`✅ Generated premium CSV file: skincare_products_best.csv`);
console.log(`   Total products: ${products.length}`);
console.log(`   Categories: ${[...new Set(products.map(p => p.category))].join(', ')}`);
console.log(`\n⚠️  Note: Google Images URLs are search links.`);
console.log(`   For production, replace with direct image URLs from product websites.`);



