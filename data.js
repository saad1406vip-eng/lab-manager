var REPORT_INFO={name:"سعد علي سعد القرني",title:"فني مختبر",facility:"تجمع عسير الصحي - مستشفى سبت العلايه",dept:"المختبر - قسم الكيمياء الحيويه والهرمونات"};
var WARN_DAYS=30,WARN_KIT_DAYS=7;
var DEVICES={
atellica:{id:"atellica",name:"Siemens Atellica Solution",short:"Atellica",company:"Siemens",type:"both",typeLabel:"كيمياء + هرمون",description:"CH + IM مدمج",sharedWith:null,isActive:true},
cobas_pure:{id:"cobas_pure",name:"Cobas Pure (C303 + e402)",short:"Pure",company:"Roche",type:"both",typeLabel:"كيمياء + هرمون",description:"C303 + e402 مدمج",sharedWith:null,isActive:true},
c311:{id:"c311",name:"Cobas c311",short:"c311",company:"Roche",type:"chem",typeLabel:"كيمياء",description:"جهاز كيمياء مستقل",sharedWith:"c303",sharedTypes:["Calibrator","QC"],isActive:true},
e411:{id:"e411",name:"Cobas e411",short:"e411",company:"Roche",type:"hormone",typeLabel:"هرمونات + فيروسات",description:"جهاز هرمونات مستقل",sharedWith:"e402",sharedTypes:["Calibrator","QC"],isActive:true},
dimension:{id:"dimension",name:"Dimension EXL 200",short:"EXL200",company:"Siemens",type:"chem",typeLabel:"كيمياء",description:"جهاز كيمياء",sharedWith:null,isActive:true},
vidas:{id:"vidas",name:"Mini VIDAS",short:"VIDAS",company:"bioMérieux",type:"emergency",typeLabel:"طوارئ",description:"طوارئ — bHCG + Troponin فقط",sharedWith:null,isActive:true},
variant:{id:"variant",name:"VARIANT II",short:"VARIANT",company:"Bio-Rad",type:"chem",typeLabel:"HbA1c",description:"جهاز HbA1c",sharedWith:null,isActive:true}};
var DEVICE_SHORT={atellica:"Atellica",cobas_pure:"Pure",c311:"c311",e411:"e411",dimension:"EXL200",vidas:"VIDAS",variant:"VARIANT"};
var SHARED_RULES={
c311:{with:"c303",displayName:"Cobas C303",shares:["Calibrator","QC"],note:"نفس محاليل المعايرة والـQC"},
e411:{with:"e402",displayName:"Cobas e402",shares:["Calibrator","QC"],note:"نفس محاليل المعايرة والـQC"}};
var ROUTINE_CHEM=["GLU","UREA","CREA","UA","Na","K","Cl","Ca","PHOS","Mg","ALT","AST","ALP","GGT","TBIL","DBIL","TP","ALB","CHOL","TG","HDL","LDL","CK","CK-MB","LDH","AMY","LIP","CRP","Fe","UIBC"];
var ROUTINE_HORMONE=["TSH","FT4","FT3","LH","FSH","Prolactin","Testosterone","Estradiol","Progesterone","Cortisol","HCG-Beta","Ferritin","Vitamin-B12","Vitamin-D","Folate","PSA","CEA","AFP","CA-125","CA-15-3","CA-19-9"];
var EMERGENCY_TESTS=["Troponin","Troponin-I","bHCG","HCG-Beta","GLU","UREA","CREA","Na","K","Cl","Amylase","AMY","Lipase","LIP","CK-MB","CRP"];
var RARE_TESTS=["NH3","Lactate","TIBC","IBCT","PTH","C-peptide","Insulin","DHEA-S","Her-2","CA-72-3","Anti-Tg","aTgII","Procalcitonin","PCT","NT-proBNP","PBNP","Estradiol-E2"];
var SAMPLE_TYPES=[{id:"all",label:"الكل",icon:"📋",priority:0},{id:"emergency",label:"طوارئ",icon:"🚨",priority:1},{id:"urgent",label:"مستعجل",icon:"⏱️",priority:2},{id:"centers",label:"مراكز",icon:"🏥",priority:3},{id:"routine",label:"غير مستعجل",icon:"🕐",priority:4}];
var TYPE_ICON={Reagent:"🧪",Calibrator:"⚖️",QC:"🔬",Solution:"💧",Part:"⚙️"};
var TYPE_AR={Reagent:"كاشف",Calibrator:"معايرة",QC:"ضبط جودة",Solution:"محلول تشغيل",Part:"قطعة / إلكترود"};
var DEFAULT_KIT_DAYS={GLU:14,HbA1c:21,UREA:14,CREA:14,UA:21,NH3:30,TP:21,ALB:21,ALT:21,AST:21,TBIL:21,DBIL:30,GGT:21,ALP:21,LIP:21,AMY:21,LDH:21,CK:14,"CK-MB":14,CHOL:14,TG:14,HDL:14,LDL:14,Na:30,K:30,Cl:30,Ca:21,PHOS:21,Mg:21,Fe:21,UIBC:21,CRP:14,TSH:21,FT4:21,FT3:21,LH:21,FSH:21,Prolactin:21,Testosterone:21,Estradiol:21,Progesterone:21,Cortisol:21,"DHEA-S":30,PTH:30,Insulin:21,"C-peptide":30,"Vitamin-B12":21,"Vitamin-D":21,Folate:30,Ferritin:21,AFP:21,"CA-125":21,"CA 15-3":21,"CA 19-9":21,"CA 72-3":21,CEA:21,PSA:21,"HCG-Beta":14,Troponin:14,"Troponin-I":14,bHCG:14,HBsII:21,aHCV:21,CHIV:21,SYPH:21};

var SUPPLY_DATA={atellica:[],cobas_pure:[],c311:[],e411:[],dimension:[],vidas:[],variant:[]};

/* ─── Atellica CH Reagents ─── */
SUPPLY_DATA.atellica.push(
{id:"a_ch_0",name:"Ammonia (AMM)",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"CH"},
{id:"a_ch_1",name:"Albumin (ALB)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_2",name:"Calcium (CA)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_3",name:"Cholesterol (CHOL_2)",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_4",name:"Creatinine (CREA_2)",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_5",name:"Glucose (GluH_3)",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_6",name:"Iron (Iron_2)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_7",name:"Magnesium (Mg)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_8",name:"Inorganic Phosphate (IP)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_9",name:"Total Protein (TP_2)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_10",name:"Triglycerides (Trig_2)",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_11",name:"Uric Acid (UA)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_12",name:"Urea Nitrogen (UN_c)",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_13",name:"Direct Bilirubin (DBil_2)",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"CH"},
{id:"a_ch_14",name:"Total Bilirubin (TBil_2)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_15",name:"Amylase (AMY_2)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_16",name:"Lactate (Lac_3)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH نادر"},
{id:"a_ch_17",name:"TIBC",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_18",name:"ALP_2",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_19",name:"GGT_2",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_20",name:"LDH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_21",name:"Lipase (LIP)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_22",name:"ALT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_23",name:"AST",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_24",name:"CK_L",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_25",name:"HDL Cholesterol",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_26",name:"LDL Cholesterol",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_27",name:"Electrolytes (Na, K, Cl)",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"CH"},
{id:"a_ch_28",name:"HbA1c (A1C_E)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_29",name:"CRP (RCRP)",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"CH"},
{id:"a_ch_30",name:"Microalbumin (uALB)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"},
{id:"a_ch_31",name:"Urine Protein (UCFP)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"CH"}
);

/* ─── Atellica CH Calibrators ─── */
SUPPLY_DATA.atellica.push(
{id:"a_cc_0",name:"CHEM CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_1",name:"BILI CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_2",name:"SPCL CHEM CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_3",name:"ENZ 1 CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_4",name:"ENZ 2 CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_5",name:"ENZ 3 CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_6",name:"CHDLC CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_7",name:"LDLC CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_8",name:"A1C_E CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_9",name:"RCRP CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_10",name:"uALB CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"},
{id:"a_cc_11",name:"UCFP CAL",type:"Calibrator",qty:0,minQty:5,kitDays:60,note:"CH"}
);

/* ─── Atellica CH QC ─── */
SUPPLY_DATA.atellica.push(
{id:"a_cq_0",name:"CHEM CAL QC",type:"QC",qty:0,minQty:3,kitDays:30,note:"CH"},
{id:"a_cq_1",name:"CH QC",type:"QC",qty:0,minQty:3,kitDays:30,note:"CH L2 & L3"},
{id:"a_cq_2",name:"A1c QC",type:"QC",qty:0,minQty:3,kitDays:30,note:"CH"},
{id:"a_cq_3",name:"RCRP QC",type:"QC",qty:0,minQty:3,kitDays:30,note:"CH"},
{id:"a_cq_4",name:"Specific Protein QC",type:"QC",qty:0,minQty:3,kitDays:30,note:"CH"},
{id:"a_cq_5",name:"Urine QC",type:"QC",qty:0,minQty:3,kitDays:30,note:"CH"}
);

/* ─── Atellica IM Reagents ─── */
SUPPLY_DATA.atellica.push(
{id:"a_im_0",name:"TSH3UL",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_1",name:"FT3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_2",name:"FT4",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_3",name:"LH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_4",name:"FSH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_5",name:"Prolactin (PRL)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_6",name:"THCG",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"IM"},
{id:"a_im_7",name:"Vitamin B12 (VB12)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_8",name:"Ferritin (FER)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_9",name:"AFP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_10",name:"CEA",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_11",name:"Progesterone (PRGE)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_12",name:"Cortisol (CORP)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_13",name:"PSA",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_14",name:"Free PSA (fPSA)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_15",name:"Estradiol (E2)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_16",name:"Folate (Fol)",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"IM"},
{id:"a_im_17",name:"Testosterone (TSTII)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_18",name:"PTH",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"IM نادر"},
{id:"a_im_19",name:"Vitamin D (VITD)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM"},
{id:"a_im_20",name:"CK-MB",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"IM قلبي"},
{id:"a_im_21",name:"NT-proBNP (PBNP)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM قلبي"},
{id:"a_im_22",name:"Troponin I (TNI)",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"IM قلبي"},
{id:"a_im_23",name:"Anti-Tg II (aTgII)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM نادر"},
{id:"a_im_24",name:"Procalcitonin (PCT)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM نادر"},
{id:"a_im_25",name:"HBsII",type:"Reagent",qty:0,minQty:3,kitDays:21,note:"IM فيروسات"},
{id:"a_im_26",name:"aHCV",type:"Reagent",qty:0,minQty:3,kitDays:21,note:"IM فيروسات"},
{id:"a_im_27",name:"CHIV",type:"Reagent",qty:0,minQty:3,kitDays:21,note:"IM فيروسات"},
{id:"a_im_28",name:"SYPH",type:"Reagent",qty:0,minQty:3,kitDays:21,note:"IM فيروسات"},
{id:"a_im_29",name:"aHBs2",type:"Reagent",qty:0,minQty:3,kitDays:21,note:"IM فيروسات"},
{id:"a_im_30",name:"C-peptide (Cps)",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"IM نادر"},
{id:"a_im_31",name:"Insulin (IRI)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM نادر"},
{id:"a_im_32",name:"CA19-9",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM أورام"},
{id:"a_im_33",name:"CA15-3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM أورام"},
{id:"a_im_34",name:"CA125",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM أورام"},
{id:"a_im_35",name:"Her-2/neu (H2n)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"IM أورام نادر"}
);

/* ─── Atellica IM Calibrators ─── */
SUPPLY_DATA.atellica.push(
{id:"a_ic_0",name:"TSH CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_1",name:"FT3 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_2",name:"FT4 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_3",name:"LH CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_4",name:"FSH CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_5",name:"PRL CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_6",name:"THCG CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_7",name:"VB12 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_8",name:"FER CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_9",name:"AFP CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_10",name:"CEA CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_11",name:"PRGE CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_12",name:"CORP CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_13",name:"PSA CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_14",name:"fPSA CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_15",name:"E2 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_16",name:"FOL CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_17",name:"TSTII CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_18",name:"PTH CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_19",name:"VITD CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_20",name:"CKMB CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_21",name:"PBNP CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_22",name:"TNI CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_23",name:"aTgII CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_24",name:"PCT CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_25",name:"HBsII CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_26",name:"aHCV CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_27",name:"CHIV CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_28",name:"SYPH CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_29",name:"aHBs2 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_30",name:"Cps CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_31",name:"IRI CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_32",name:"CA19-9 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_33",name:"CA15-3 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_34",name:"CA125 CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_35",name:"H2n CAL",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_36",name:"Multi-Dil 1",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_37",name:"Multi-Dil 2",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_38",name:"Multi-Dil 3",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_39",name:"Multi-Dil 10",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_40",name:"Multi-Dil 11",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_41",name:"Multi-Dil 13",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"},
{id:"a_ic_42",name:"Multi-Dil 15",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"IM"}
);

/* ─── Atellica IM QC ─── */
SUPPLY_DATA.atellica.push(
{id:"a_iq_0",name:"PTH QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_1",name:"VITD QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_2",name:"PCT QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_3",name:"CRD QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_4",name:"HBsII QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_5",name:"aHCV QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_6",name:"CHIV QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_7",name:"SYPH QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_8",name:"aHBs2 QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_9",name:"ATGII QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_10",name:"IA Premium 1",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_11",name:"IA Premium 3",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_iq_12",name:"TMR QC",type:"QC",qty:0,minQty:2,kitDays:30,note:"IM"}
);

/* ─── Atellica IM Solutions ─── */
SUPPLY_DATA.atellica.push(
{id:"a_is_0",name:"APW1",type:"Solution",qty:0,minQty:3,kitDays:30,note:"IM"},
{id:"a_is_1",name:"APW3",type:"Solution",qty:0,minQty:3,kitDays:30,note:"IM"},
{id:"a_is_2",name:"PW3",type:"Solution",qty:0,minQty:3,kitDays:30,note:"IM"},
{id:"a_is_3",name:"VB12 Dil",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_4",name:"VB12 DTT/REL",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_5",name:"T3/T4/VB12 ANC",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_6",name:"THCG Dil",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_7",name:"CEA Dil",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_8",name:"E2 Dil",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_9",name:"FPSA CAL/Dil",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_10",name:"Fol DTT/REL",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_11",name:"Fol DIL",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_12",name:"Folserum",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_13",name:"RBC Fol",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_14",name:"19-9 DIL",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_15",name:"VITD Dil",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_16",name:"CKMB Dil",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_17",name:"IRI DILI",type:"Solution",qty:0,minQty:2,kitDays:30,note:"IM"},
{id:"a_is_18",name:"Standard A",type:"Solution",qty:0,minQty:2,kitDays:30,note:""},
{id:"a_is_19",name:"Standard B",type:"Solution",qty:0,minQty:2,kitDays:30,note:""},
{id:"a_is_20",name:"Standard F",type:"Solution",qty:0,minQty:2,kitDays:30,note:""},
{id:"a_is_21",name:"Salt",type:"Solution",qty:0,minQty:2,kitDays:30,note:""},
{id:"a_is_22",name:"Diluent",type:"Solution",qty:0,minQty:2,kitDays:30,note:""}
);

/* ─── Atellica Parts ─── */
SUPPLY_DATA.atellica.push(
{id:"a_p_0",name:"Tips",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"a_p_1",name:"Cups",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"a_p_2",name:"Cell Wash Reaction",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"a_p_3",name:"Lamp",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"a_p_4",name:"Sensor",type:"Part",qty:0,minQty:1,kitDays:90,note:""}
);

/* ─── Cobas Pure C303 Reagents ─── */
SUPPLY_DATA.cobas_pure.push(
{id:"p_c3_0",name:"GLU",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_1",name:"UREA",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_2",name:"CREA",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_3",name:"UA",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_4",name:"TP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_5",name:"ALB",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_6",name:"ALT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_7",name:"AST",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_8",name:"TBIL",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_9",name:"DBIL",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"C303"},
{id:"p_c3_10",name:"GGT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_11",name:"ALP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_12",name:"LIP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_13",name:"AMY",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_14",name:"LDH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_15",name:"CK",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_16",name:"CK-MB",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_17",name:"CHOL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_18",name:"TG",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_19",name:"HDL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_20",name:"LDL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_21",name:"Ca",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_22",name:"PHOS",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_23",name:"Mg",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_24",name:"Fe-Iron",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_25",name:"UIBC",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_26",name:"NH3",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"C303"},
{id:"p_c3_27",name:"CRP",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"C303"},
{id:"p_c3_28",name:"HbA1c",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"C303"},
{id:"p_c3_29",name:"ALBU2",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"C303"},
{id:"p_c3_30",name:"TPU3",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"C303"}
);

/* ─── Cobas Pure e402 Reagents ─── */
SUPPLY_DATA.cobas_pure.push(
{id:"p_e4_0",name:"TSH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_1",name:"FT4",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_2",name:"FT3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_3",name:"HCG-Beta",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"e402"},
{id:"p_e4_4",name:"Prolactin",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_5",name:"LH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_6",name:"FSH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_7",name:"Testosterone (Total)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_8",name:"Estradiol (E2)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_9",name:"Progesterone",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_10",name:"Cortisol (AM)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_11",name:"DHEA-S",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"e402"},
{id:"p_e4_12",name:"PTH",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"e402 نادر"},
{id:"p_e4_13",name:"Insulin (Fasting)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402 نادر"},
{id:"p_e4_14",name:"C-peptide",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"e402 نادر"},
{id:"p_e4_15",name:"PSA (Total)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_16",name:"Vitamin B12",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_17",name:"Vitamin D Total",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_18",name:"Folate",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"e402"},
{id:"p_e4_19",name:"Ferritin",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_20",name:"AFP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_21",name:"CA-125",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_22",name:"CA 15-3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_23",name:"CA 19-9",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_24",name:"CA 72-3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402 نادر"},
{id:"p_e4_25",name:"CEA",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"e402"},
{id:"p_e4_26",name:"TnI",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"e402 قلبي"}
);

/* ─── Cobas Pure C303 Calibrators ─── */
SUPPLY_DATA.cobas_pure.push(
{id:"p_c3c_0",name:"CFAS",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_1",name:"MB Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_2",name:"Protein Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_3",name:"Fe Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_4",name:"Lipid Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_5",name:"A1c Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_6",name:"PUC Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_7",name:"AMM Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"},
{id:"p_c3c_8",name:"ISE Low Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303 ISE"},
{id:"p_c3c_9",name:"ISE High Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303 ISE"},
{id:"p_c3c_10",name:"Fe Standard",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"C303"}
);

/* ─── Cobas Pure e402 Calibrators ─── */
SUPPLY_DATA.cobas_pure.push(
{id:"p_e4c_0",name:"TSH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_1",name:"FT4 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_2",name:"FT3 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_3",name:"HCG Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_4",name:"Prolactin Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_5",name:"LH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_6",name:"FSH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_7",name:"Testosterone Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_8",name:"E2 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_9",name:"Progesterone Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_10",name:"Cortisol Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_11",name:"DHEA-S Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_12",name:"PTH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_13",name:"Insulin Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_14",name:"C-peptide Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_15",name:"PSA Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_16",name:"VB12 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_17",name:"VitD Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_18",name:"Folate Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_19",name:"Ferritin Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_20",name:"AFP Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_21",name:"Tumor Marker Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_22",name:"CEA Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"},
{id:"p_e4c_23",name:"TnI Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"e402"}
);

/* ─── Cobas Pure QC ─── */
SUPPLY_DATA.cobas_pure.push(
{id:"p_qc_0",name:"PreciControl TM L1",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"},
{id:"p_qc_1",name:"PreciControl MM",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"},
{id:"p_qc_2",name:"PreciControl Vit-D",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"},
{id:"p_qc_3",name:"PCC1",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"},
{id:"p_qc_4",name:"PCC2",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"},
{id:"p_qc_5",name:"Control V",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"},
{id:"p_qc_6",name:"Control U",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"},
{id:"p_qc_7",name:"Control MM",type:"QC",qty:0,minQty:2,kitDays:30,note:"C303"}
);

/* ─── Cobas Pure Solutions ─── */
SUPPLY_DATA.cobas_pure.push(
{id:"p_s_0",name:"ProCell 2M",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_1",name:"PreClean 2M",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_2",name:"CleanCell M",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_3",name:"ISE Inter Standard",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_4",name:"ISE Diluent G2",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_5",name:"ISE REF Electrolyte",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_6",name:"Basic Wash",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_7",name:"Acid Wash",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_8",name:"ECO-D",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_9",name:"NAOHD",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"},
{id:"p_s_10",name:"SMS",type:"Solution",qty:0,minQty:3,kitDays:30,note:"C303"}
);

/* ─── Cobas Pure Parts ─── */
SUPPLY_DATA.cobas_pure.push(
{id:"p_p_0",name:"Na Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"},
{id:"p_p_1",name:"K Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"},
{id:"p_p_2",name:"Cl Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"},
{id:"p_p_3",name:"REF Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"},
{id:"p_p_4",name:"Tips",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"},
{id:"p_p_5",name:"Cups",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"},
{id:"p_p_6",name:"Reaction Cell C303",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"},
{id:"p_p_7",name:"Lamp",type:"Part",qty:0,minQty:1,kitDays:90,note:"C303"}
);

/* ─── c311 ─── */
SUPPLY_DATA.c311.push(
{id:"c1_r_0",name:"GLU",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_1",name:"HbA1c",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_2",name:"UREA",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_3",name:"CREA",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_4",name:"UA",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_5",name:"TP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_6",name:"ALB",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_7",name:"ALT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_8",name:"AST",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_9",name:"TBIL",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_10",name:"DBIL",type:"Reagent",qty:0,minQty:5,kitDays:30,note:""},
{id:"c1_r_11",name:"LIP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_12",name:"AMY",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_13",name:"GGT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_14",name:"ALP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_15",name:"CHOL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_16",name:"TG",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_17",name:"HDL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_18",name:"LDL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_19",name:"CK",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_20",name:"CK-MB",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_21",name:"LDH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_22",name:"Ca",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_23",name:"PHOS",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_24",name:"Mg",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_25",name:"Fe-Iron",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_26",name:"UIBC",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"c1_r_27",name:"NH3",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"نادر"},
{id:"c1_r_28",name:"CRP",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"c1_r_29",name:"ALBU2",type:"Reagent",qty:0,minQty:5,kitDays:30,note:""},
{id:"c1_r_30",name:"TPU3",type:"Reagent",qty:0,minQty:5,kitDays:30,note:""},
{id:"c1_c_0",name:"CFAS",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_1",name:"MB Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_2",name:"Protein Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_3",name:"Fe Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_4",name:"Lipid Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_5",name:"A1c Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_6",name:"PUC Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_7",name:"AMM Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_8",name:"ISE Low Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_9",name:"ISE High Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_c_10",name:"Fe Standard",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع C303"},
{id:"c1_q_0",name:"PreciControl TM L1",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_q_1",name:"PreciControl MM",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_q_2",name:"PreciControl Vit-D",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_q_3",name:"PCC1",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_q_4",name:"PCC2",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_q_5",name:"Control V",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_q_6",name:"Control U",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_q_7",name:"Control MM",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع C303"},
{id:"c1_s_0",name:"ISE Inter Standard",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"c1_s_1",name:"ISE Diluent G2",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"c1_s_2",name:"ISE REF Electrolyte",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"c1_s_3",name:"Cell Wash Solution 1 / NAOHD",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"c1_s_4",name:"Cell Wash Solution 2 / Acid Wash",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"c1_s_5",name:"Sample Cleaner 1",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"c1_s_6",name:"Sample Cleaner 2",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"c1_p_0",name:"Na Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"c1_p_1",name:"K Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"c1_p_2",name:"Cl Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"c1_p_3",name:"REF Electrode",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"c1_p_4",name:"Reaction Cell c311",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"c1_p_5",name:"Halogen Lamp c311",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"c1_p_6",name:"Tips",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"c1_p_7",name:"Cups",type:"Part",qty:0,minQty:1,kitDays:90,note:""}
);

/* ─── e411 ─── */
SUPPLY_DATA.e411.push(
{id:"e4_r_0",name:"TSH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_1",name:"FT4",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_2",name:"FT3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_3",name:"HCG-Beta",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"e4_r_4",name:"Prolactin",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_5",name:"LH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_6",name:"FSH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_7",name:"Testosterone (Total)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_8",name:"Estradiol (E2)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_9",name:"Progesterone",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_10",name:"Cortisol (AM)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_11",name:"DHEA-S",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"نادر"},
{id:"e4_r_12",name:"PTH",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"نادر"},
{id:"e4_r_13",name:"Insulin (Fasting)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"نادر"},
{id:"e4_r_14",name:"C-peptide",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"نادر"},
{id:"e4_r_15",name:"PSA (Total)",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_16",name:"Vitamin B12",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_17",name:"Vitamin D Total",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_18",name:"Folate",type:"Reagent",qty:0,minQty:5,kitDays:30,note:""},
{id:"e4_r_19",name:"Ferritin",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_20",name:"AFP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_21",name:"CA-125",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_22",name:"CA 15-3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_23",name:"CA 19-9",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_24",name:"CA 72-3",type:"Reagent",qty:0,minQty:5,kitDays:21,note:"نادر"},
{id:"e4_r_25",name:"CEA",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"e4_r_26",name:"TnI",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"e4_c_0",name:"TSH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_1",name:"FT4 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_2",name:"FT3 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_3",name:"HCG Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_4",name:"Prolactin Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_5",name:"LH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_6",name:"FSH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_7",name:"Testosterone Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_8",name:"E2 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_9",name:"Progesterone Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_10",name:"Cortisol Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_11",name:"DHEA-S Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_12",name:"PTH Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_13",name:"Insulin Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_14",name:"C-peptide Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_15",name:"PSA Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_16",name:"VB12 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_17",name:"VitD Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_18",name:"Folate Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_19",name:"Ferritin Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_20",name:"AFP Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_21",name:"Tumor Marker Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_22",name:"CEA Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_c_23",name:"TnI Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:"مشترك مع e402"},
{id:"e4_q_0",name:"PreciControl TM L1",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع e402"},
{id:"e4_q_1",name:"PreciControl MM",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع e402"},
{id:"e4_q_2",name:"PreciControl Vit-D",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع e402"},
{id:"e4_q_3",name:"Control V",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع e402"},
{id:"e4_q_4",name:"Control U",type:"QC",qty:0,minQty:2,kitDays:30,note:"مشترك مع e402"},
{id:"e4_s_0",name:"ProCell",type:"Solution",qty:0,minQty:3,kitDays:30,note:"خاص e411"},
{id:"e4_s_1",name:"CleanCell",type:"Solution",qty:0,minQty:3,kitDays:30,note:"خاص e411"},
{id:"e4_s_2",name:"PreClean",type:"Solution",qty:0,minQty:3,kitDays:30,note:"خاص e411"},
{id:"e4_s_3",name:"SysClean",type:"Solution",qty:0,minQty:3,kitDays:30,note:"خاص e411"},
{id:"e4_p_0",name:"Tips",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"e4_p_1",name:"Cups",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"e4_p_2",name:"Probe",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"e4_p_3",name:"Syringe",type:"Part",qty:0,minQty:1,kitDays:90,note:""}
);

/* ─── Dimension ─── */
SUPPLY_DATA.dimension.push(
{id:"d_r_0",name:"GLU",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_1",name:"HbA1c",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_2",name:"UREA",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_3",name:"CREA",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_4",name:"UA",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_5",name:"TP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_6",name:"ALB",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_7",name:"ALT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_8",name:"AST",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_9",name:"TBIL",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_10",name:"DBIL",type:"Reagent",qty:0,minQty:5,kitDays:30,note:""},
{id:"d_r_11",name:"AMY",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_12",name:"LIP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_13",name:"GGT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_14",name:"ALP",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_15",name:"CHOL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_16",name:"TG",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_17",name:"HDL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_18",name:"LDL",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_19",name:"CK",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_20",name:"CK-MB",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_r_21",name:"LDH",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_22",name:"Ca",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_23",name:"PHOS",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_24",name:"Mg",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_25",name:"Fe-Iron",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_26",name:"IBCT",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"d_r_27",name:"NH3",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"نادر"},
{id:"d_r_28",name:"CRP",type:"Reagent",qty:0,minQty:5,kitDays:14,note:""},
{id:"d_c_0",name:"Enz Cal CK-MB",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_1",name:"Multi Calibrator 2",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_2",name:"ALP Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_3",name:"ALT Calibrator",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_4",name:"TP/ALB Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_5",name:"Bil T/D Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_6",name:"Chem 1 Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_7",name:"Iron Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_8",name:"AMM Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_9",name:"Lipase Cal",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_10",name:"Verify Enz",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_c_11",name:"Chek Lyte Solution",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"d_q_0",name:"QC Level 2 & 3",type:"QC",qty:0,minQty:3,kitDays:30,note:""},
{id:"d_q_1",name:"A1c Control",type:"QC",qty:0,minQty:3,kitDays:30,note:""},
{id:"d_q_2",name:"CRP Control",type:"QC",qty:0,minQty:3,kitDays:14,note:""},
{id:"d_s_0",name:"Standard A",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"d_s_1",name:"Standard B",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"d_s_2",name:"Standard F",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"d_s_3",name:"Salt",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"d_s_4",name:"Diluent",type:"Solution",qty:0,minQty:3,kitDays:30,note:""},
{id:"d_s_5",name:"CHE",type:"Solution",qty:0,minQty:3,kitDays:21,note:""},
{id:"d_p_0",name:"Sensor",type:"Part",qty:0,minQty:1,kitDays:30,note:""},
{id:"d_p_1",name:"Probe",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"d_p_2",name:"Cuvette",type:"Part",qty:0,minQty:1,kitDays:90,note:""}
);

/* ─── VIDAS ─── */
SUPPLY_DATA.vidas.push(
{id:"v_0",name:"Troponin I TestPak",type:"Reagent",qty:0,minQty:5,kitDays:14,note:"طوارئ"},
{id:"v_1",name:"bHCG Kit",type:"Reagent",qty:0,minQty:5,kitDays:30,note:"طوارئ"},
{id:"v_2",name:"Troponin Calibrator",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"v_3",name:"bHCG Calibrator S1",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"v_4",name:"Cardiac Control",type:"QC",qty:0,minQty:2,kitDays:30,note:""},
{id:"v_5",name:"bHCG Control QC1",type:"QC",qty:0,minQty:2,kitDays:30,note:""},
{id:"v_6",name:"SPR",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"v_7",name:"VIDAS Waste Bag",type:"Part",qty:0,minQty:1,kitDays:90,note:""}
);

/* ─── VARIANT ─── */
SUPPLY_DATA.variant.push(
{id:"vn_0",name:"HbA1c Kit",type:"Reagent",qty:0,minQty:5,kitDays:21,note:""},
{id:"vn_1",name:"Calibrator D1 / D2",type:"Calibrator",qty:0,minQty:3,kitDays:60,note:""},
{id:"vn_2",name:"HbA1c Control L1 / L2",type:"QC",qty:0,minQty:2,kitDays:30,note:""},
{id:"vn_3",name:"Column / Cartridge",type:"Part",qty:0,minQty:1,kitDays:90,note:""},
{id:"vn_4",name:"Buffer A",type:"Solution",qty:0,minQty:2,kitDays:30,note:""},
{id:"vn_5",name:"Buffer B",type:"Solution",qty:0,minQty:2,kitDays:30,note:""}
);

var DEVICE_TEST_NAMES={
atellica:["GLU","UREA","CREA","UA","Na","K","Cl","Ca","PHOS","Mg","ALT","AST","ALP","GGT","TBIL","DBIL","TP","ALB","CHOL","TG","HDL","LDL","CK","CK-MB","LDH","AMY","LIP","CRP","Fe-Iron","TIBC","NH3","Lactate","HbA1c","Microalbumin","UCFP","TSH","FT4","FT3","LH","FSH","Prolactin","HCG-Beta","Vitamin-B12","Ferritin","AFP","CEA","Progesterone","Cortisol","PSA","Estradiol","Folate","Testosterone","PTH","Vitamin-D","NT-proBNP","Troponin","Anti-Tg","Procalcitonin","HBsII","aHCV","CHIV","SYPH","aHBs2","C-peptide","Insulin","CA-19-9","CA-15-3","CA-125","Her-2"],
cobas_pure:["GLU","UREA","CREA","UA","TP","ALB","ALT","AST","TBIL","DBIL","GGT","ALP","LIP","AMY","LDH","CK","CK-MB","CHOL","TG","HDL","LDL","Ca","PHOS","Mg","Fe-Iron","UIBC","NH3","CRP","HbA1c","ALBU2","TPU3","TSH","FT4","FT3","HCG-Beta","Prolactin","LH","FSH","Testosterone","Estradiol","Progesterone","Cortisol","DHEA-S","PTH","Insulin","C-peptide","PSA","Vitamin-B12","Vitamin-D","Folate","Ferritin","AFP","CA-125","CA-15-3","CA-19-9","CA-72-3","CEA","TnI"],
c311:["GLU","UREA","CREA","UA","TP","ALB","ALT","AST","TBIL","DBIL","LIP","AMY","GGT","ALP","CHOL","TG","HDL","LDL","CK","CK-MB","LDH","Ca","PHOS","Mg","Fe-Iron","UIBC","NH3","CRP","HbA1c","ALBU2","TPU3"],
e411:["TSH","FT4","FT3","HCG-Beta","Prolactin","LH","FSH","Testosterone","Estradiol","Progesterone","Cortisol","DHEA-S","PTH","Insulin","C-peptide","PSA","Vitamin-B12","Vitamin-D","Folate","Ferritin","AFP","CA-125","CA-15-3","CA-19-9","CA-72-3","CEA","TnI"],
dimension:["GLU","UREA","CREA","UA","TP","ALB","ALT","AST","TBIL","DBIL","AMY","LIP","GGT","ALP","CHOL","TG","HDL","LDL","CK","CK-MB","LDH","Ca","PHOS","Mg","Fe-Iron","IBCT","NH3","CRP","HbA1c"],
vidas:["Troponin","bHCG"],
variant:["HbA1c"]
};
