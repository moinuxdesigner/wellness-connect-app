
// ===== MASTER DATA =====
var EMPLOYEES = [{"id": "1016309", "firstName": "JAIKAR RAI", "lastName": "GARIKAPATI", "name": "Jaikar Rai Garikapati", "designation": "Executive Engineer/Const/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "EE", "orgUnit": "Construction/Division Off/Vijayawada", "email": "JAIKARRAIG@GMAIL.COM", "tel": "9440810986"}, {"id": "1071320", "firstName": "HARI PRASAD", "lastName": "KOUTARAPU", "name": "Hari Prasad Koutarapu", "designation": "DEE/Const/Substation SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "ED", "orgUnit": "Construction/Substation SD-1/Vijayawada", "email": "HARIAPTRANSCO@GMAIL.COM", "tel": "9505422660"}, {"id": "1071711", "firstName": "VENKATA KRISHNA MOHAN", "lastName": "GATLA", "name": "Venkata Krishna Mohan Gatla", "designation": "DEE/Const/Lines SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "ED", "orgUnit": "Construction/Lines Maint SD-2/Vijayawada", "email": "MOHANG15@GMAIL.COM", "tel": "9505623930"}, {"id": "1072543", "firstName": "NAGESWARA RAO", "lastName": "MANDA", "name": "Nageswara Rao Manda", "designation": "AEE-2/Const/Lines SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "EC", "orgUnit": "Construction/Lines Maint SD-2/Vijayawada", "email": "NAGESWARARAO219@GMAIL.COM", "tel": "9652000986"}, {"id": "1072868", "firstName": "SATEESH BABU", "lastName": "GALINKI", "name": "Sateesh Babu Galinki", "designation": "AEE Tech-1/Const Division Off/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "EC", "orgUnit": "Construction/Division Off/Vijayawada", "email": "SATESHBABU.G@GMAIL.COM", "tel": "nan"}, {"id": "1072955", "firstName": "DEVASAHAYAM", "lastName": "MEKA", "name": "Devasahayam Meka", "designation": "AEE-4/Const/Lines SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "EC", "orgUnit": "Construction/Lines Maint SD-2/Vijayawada", "email": "DEVA.MEKA@GMAIL.COM", "tel": "9705672896"}, {"id": "1073008", "firstName": "NAGA NIKHIL BABU", "lastName": "NELAVELLI", "name": "Naga Nikhil Babu Nelavelli", "designation": "AEE-3/Const/Substation SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "EC", "orgUnit": "Construction/Substation SD-1/Vijayawada", "email": "nan", "tel": "nan"}, {"id": "1073108", "firstName": "ANUSHA", "lastName": "CHIRRI", "name": "Anusha Chirri", "designation": "AEE-1/Const/Substation SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "EC", "orgUnit": "Construction/Substation SD-1/Vijayawada", "email": "nan", "tel": "9603976772"}, {"id": "1073110", "firstName": "MOSES BABU", "lastName": "BATTULA", "name": "Moses Babu Battula", "designation": "AEE-4/Const/Substation SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Ele", "subGroup": "EC", "orgUnit": "Construction/Substation SD-1/Vijayawada", "email": "MOSESBABUBATTULA@GMAIL.COM", "tel": "7013180089"}, {"id": "1033577", "firstName": "VENKATA SUBBAIAH", "lastName": "MATHA", "name": "Venkata Subbaiah Matha", "designation": "Superintending Eng/Civil/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "EF", "orgUnit": "Civil /Circle Office/Vijayawada", "email": "VENSUB1967@GMAIL.COM", "tel": "9491854558"}, {"id": "1062466", "firstName": "KRISHNA KISHORE JAGADEESH KUMA", "lastName": "MALLULA", "name": "Krishna Kishore Jagadeesh Kuma Mallula", "designation": "EE/Civil/Construction & Maintenance/VJA", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "EE", "orgUnit": "Civil/Const & Maint/Div Off/Vijayawada", "email": "MALLULAKKJKUMAR@GMAIL.COM", "tel": "9490154043"}, {"id": "1070962", "firstName": "RAVI KIRAN", "lastName": "ARASAVILLI", "name": "Ravi Kiran Arasavilli", "designation": "DEE Civil/Civ-Survey SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "ED", "orgUnit": "Civil/Survey SD/Vijayawada", "email": "HAIKIRAN25@YAHOO.CO.IN", "tel": "9491030748"}, {"id": "1071521", "firstName": "VARAPRASAD BABU", "lastName": "PAPATHOTI", "name": "Varaprasad Babu Papathoti", "designation": "DEE Civil/Civ-Const SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "ED", "orgUnit": "Civil/Construction SD/Vijayawada", "email": "PRASADPAPATHOTI@GMAIL.COM", "tel": "9490154067"}, {"id": "1071556", "firstName": "SATYAVATHI", "lastName": "MADDUMALA", "name": "Satyavathi Maddumala", "designation": "DEE Civil/Tech-1/Civil-Circle Off/VJA", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "ED", "orgUnit": "Civil /Circle Office/Vijayawada", "email": "SATYAVATHI982@GMAIL.COM", "tel": "9490154024"}, {"id": "1072137", "firstName": "JOSHNA KIRAN", "lastName": "KANAMALA", "name": "Joshna Kiran Kanamala", "designation": "DEE Civil-1/Civ-O&M SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "ED", "orgUnit": "Civil/O&M SD/Vijayawada", "email": "KIRANJOSHNA.K@GMAIL.COM", "tel": "8522021383"}, {"id": "1072261", "firstName": "SRINIVASA RAO", "lastName": "SANGAPALLI", "name": "Srinivasa Rao Sangapalli", "designation": "AEE Civil/Tech/Civ-Cons&Main/Div Off/VJA", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "EC", "orgUnit": "Civil/Const & Maint/Div Off/Vijayawada", "email": "NIVAS_ROYAL@YAHOO.CO.IN", "tel": "9491074169"}, {"id": "1072285", "firstName": "SWARNA KUMARI", "lastName": "BAGADI", "name": "Swarna Kumari Bagadi", "designation": "AEE Civil-1/Civ-Const SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "EC", "orgUnit": "Civil/Construction SD/Vijayawada", "email": "BAGADI.SWARNA@YAHOO.COM", "tel": "7382943944"}, {"id": "1072373", "firstName": "NIKHILA", "lastName": "GUDIPUDI", "name": "Nikhila Gudipudi", "designation": "AEE Civil-1/Civ-O&M SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "EC", "orgUnit": "Civil/O&M SD/Vijayawada", "email": "nan", "tel": "nan"}, {"id": "1072982", "firstName": "RAJ KUMAR", "lastName": "KOLAVENTI", "name": "Raj Kumar Kolaventi", "designation": "AEE Civil-2/Civ-O&M SD/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Engineering-Civ", "subGroup": "EC", "orgUnit": "Civil/O&M SD/Vijayawada", "email": "KOLAVENTIRAJKUMAR@GMAIL.COM", "tel": "8464848895"}, {"id": "1060611", "firstName": "ANGEL ARUNA LATHA", "lastName": "PAKALA", "name": "Angel Aruna Latha Pakala", "designation": "AAO-1/Zonal Office/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Accounts", "subGroup": "AD", "orgUnit": "Zonal Office/ Vijayawada", "email": "DASARIAARON72@GMAIL.COM", "tel": "9502635718"}, {"id": "1068682", "firstName": "SASIKALA", "lastName": "VEMPATI", "name": "Sasikala Vempati", "designation": "SAO-1/Zonal Office/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Accounts", "subGroup": "AF", "orgUnit": "Zonal Office/ Vijayawada", "email": "SHASHIKALAVEMPATI@GMAIL.COM", "tel": "9885756249"}, {"id": "1071400", "firstName": "KIRANJI", "lastName": "THOKALA", "name": "Kiranji Thokala", "designation": "AAO-1/O&M Circle Office/Vijayawada", "department": "APTRANSCO", "busArea": "SE/O&M/VIJAYAWADA", "subArea": "Accounts", "subGroup": "AD", "orgUnit": "O&M /Circle Office/Vijayawada", "email": "KIRANJISHANE@GMAIL.COM", "tel": "9966876433"}];
var PO_DATA   = [{"poNo": "3000001477", "projId": "SI-19-11-01", "projDesc": "220/132/33KV TIRUVURU SS,KRISHNA DIST.", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Supply, construction, Erection, Testing and commissioning of(i)220/132/33kV Sub-Station at Tiruvuru in Krishna District.Sch A -   1A", "poValue": 88448337.85, "valueGR": 81045473.38, "balanceGR": 7402864.47, "valueInv": 80396098.11, "balanceInv": 649375.27, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2022-04-15 00:00:00"}, {"poNo": "3000001490", "projId": "SI-19-11-01", "projDesc": "220/132/33KV TIRUVURU SS,KRISHNA DIST.", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "TIRUVURU SCH-B  SSSupply,Construction,Erection, Testing and commissioning of (i)220/132/33kV SS at Tiruvuru in Krishna District with 3X100MVA +2X31.5MVA PTR Capacity (with Automation features)", "poValue": 100808260.64, "valueGR": 66614493.37, "balanceGR": 34193767.27, "valueInv": 66614493.36, "balanceInv": 0.01, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2022-04-15 00:00:00"}, {"poNo": "3000001478", "projId": "SI-19-11-02", "projDesc": "220KV LILO  OF KTPS-NUNNA LN TO TIRUVURU", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 220kV DC Line (5km) for making of existing 220kV Nunn- KTPSSingle Circuit line to the proposed 220/132/33 kV Sub- Station atTiruvuruSchedule -2A", "poValue": 56858743.5, "valueGR": 49437742.47, "balanceGR": 7421001.03, "valueInv": 41691233.68, "balanceInv": 7746508.79, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2021-09-30 00:00:00", "completionDate": "2022-09-29 00:00:00"}, {"poNo": "3000001495", "projId": "SI-19-11-02", "projDesc": "220KV LILO  OF KTPS-NUNNA LN TO TIRUVURU", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 220 kC DC line(5km) for making LILO of existing 220kVNunna-KTPS Single circuitline to the proposed 220/132/33kV SS at TiruvuruSch-2B", "poValue": 25264712.64, "valueGR": 7508879.98, "balanceGR": 17755832.66, "valueInv": 7508879.98, "balanceInv": 0.0, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2021-09-30 00:00:00", "completionDate": "2022-09-29 00:00:00"}, {"poNo": "3000001480", "projId": "SI-19-11-03", "projDesc": "132KV DC LN FROM NARSAPURAM TO TIRUVURU", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 132kV DC line from 1323kV SS Narasapuram to proposed220/132/33kV SS Tiruvuru in Krishna DistrictSCHEDULE - 4A", "poValue": 66720388.2, "valueGR": 22379933.59, "balanceGR": 44340454.61, "valueInv": 18831677.24, "balanceInv": 3548256.35, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2021-05-26 00:00:00", "completionDate": "2022-05-25 00:00:00"}, {"poNo": "3000001499", "projId": "SI-19-11-03", "projDesc": "132KV DC LN FROM NARSAPURAM TO TIRUVURU", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 132kV DC line from 132kV SS Narasapuram to proposed220/132/33kV SS Tiruvuru, Krishna District on turn key basisSchedule - 4B", "poValue": 33906359.62, "valueGR": 9079635.92, "balanceGR": 24826723.7, "valueInv": 9079635.91, "balanceInv": 0.01, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2021-05-26 00:00:00", "completionDate": "2022-05-25 00:00:00"}, {"poNo": "3000001479", "projId": "SI-19-11-04", "projDesc": "132KVLILO-KAMBHAMPADU-NUZVIDU TO TIRUVUR", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 132 kV DC Line (15 km) for making LILO of existing 132kVKhambampaduk - Nuzvid line to proposed 220/132/33 kV SS TiruvuruSCHEDULE - 3A", "poValue": 9922915.36, "valueGR": 5209408.76, "balanceGR": 4713506.6, "valueInv": 5209408.76, "balanceInv": 0.0, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2022-04-30 00:00:00"}, {"poNo": "3000001498", "projId": "SI-19-11-04", "projDesc": "132KVLILO-KAMBHAMPADU-NUZVIDU TO TIRUVUR", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 132 kV DC line for making LILO of existing 132kV Khambampadu- Nuzvidu line proposed 220/132/33kV SS TiruvuruSchedule - 3B", "poValue": 2666565.68, "valueGR": 1122354.16, "balanceGR": 1544211.52, "valueInv": 1122354.16, "balanceInv": 0.0, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2022-04-30 00:00:00"}, {"poNo": "3000001481", "projId": "SI-19-11-05", "projDesc": "132KV BAY AT NARSAPURAM FOR TIRUVURU", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 2 Nos 132kV Bays at Narasapuram Sub- Station  in KrishnaDistrictSCHEDULE - 5A", "poValue": 5557495.51, "valueGR": 3147893.44, "balanceGR": 2409602.07, "valueInv": 1894745.13, "balanceInv": 1253148.31, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2022-04-30 00:00:00"}, {"poNo": "3000001500", "projId": "SI-19-11-05", "projDesc": "132KV BAY AT NARSAPURAM FOR TIRUVURU", "schemeId": "SI-19-11", "schemeDesc": "220/132/33 kV SS at Tiruvuru in krishna", "workName": "Erection of 2 Nos 132kV Bays at Narsapuram Sub-station in KrishnadistrictSCHEDULE - 5B", "poValue": 2533497.14, "valueGR": 644802.12, "balanceGR": 1888695.02, "valueInv": 644802.12, "balanceInv": 0.0, "vendorCode": "101161", "plant": "5105", "vendorName": "KMV PROJECTS LIMITED", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2022-04-30 00:00:00"}, {"poNo": "3000001405", "projId": "SI-19-12-01", "projDesc": "132/33KV SS AT RAMANAKKAPETA", "schemeId": "SI-19-12", "schemeDesc": "132/33 kV SS at Ramanakkapeta in Krishna", "workName": "ScheduleA-Erection of 132kv Ramanakkapeta SS in Krishna District", "poValue": 25509536.81, "valueGR": 17385010.79, "balanceGR": 8124526.02, "valueInv": 17385010.79, "balanceInv": 0.0, "vendorCode": "100720", "plant": "5105", "vendorName": "G.V.PRATAP REDDY", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2021-10-02 00:00:00"}, {"poNo": "3000001406", "projId": "SI-19-12-01", "projDesc": "132/33KV SS AT RAMANAKKAPETA", "schemeId": "SI-19-12", "schemeDesc": "132/33 kV SS at Ramanakkapeta in Krishna", "workName": "132 kV SS Ramanakkapeta  Schedule A2(Telecom)", "poValue": 3110841.21, "valueGR": 0.0, "balanceGR": 3110841.21, "valueInv": 0.0, "balanceInv": 0.0, "vendorCode": "100720", "plant": "5105", "vendorName": "G.V.PRATAP REDDY", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2021-10-02 00:00:00"}, {"poNo": "3000001527", "projId": "SI-19-12-01", "projDesc": "132/33KV SS AT RAMANAKKAPETA", "schemeId": "SI-19-12", "schemeDesc": "132/33 kV SS at Ramanakkapeta in Krishna", "workName": "Erection of 132/33 kV SS SS at Ramanakkapeta  in Krishna DistrictSchedule - B", "poValue": 47846392.01, "valueGR": 9306623.25, "balanceGR": 38539768.76, "valueInv": 9306623.24, "balanceInv": 0.01, "vendorCode": "100720", "plant": "5105", "vendorName": "G.V.PRATAP REDDY", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2020-09-04 00:00:00", "completionDate": "2021-10-02 00:00:00"}, {"poNo": "3000001569", "projId": "SI-19-12-04", "projDesc": "LILO OF 132KV NUZVID-NARSAPURAM (35-36 )", "schemeId": "SI-19-12", "schemeDesc": "132/33 kV SS at Ramanakkapeta in Krishna", "workName": "Supply, Erection, testing and commissioning of 132kV Multi circuit line(1.847 km) for making DC LILO to proposed Ramanakkapeta 132kV SS fromLoc.No.35 <(>&<)> 36 of 132kV Nuzvid- Narasapuram Line in krishna DtSchedule A1 And A2", "poValue": 10984207.01, "valueGR": 9543731.12, "balanceGR": 1440475.89, "valueInv": 9543731.12, "balanceInv": 0.0, "vendorCode": "101992", "plant": "5105", "vendorName": "S & S ELECTRICALS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2021-07-06 00:00:00", "completionDate": "2022-01-05 00:00:00"}, {"poNo": "3000001570", "projId": "SI-19-12-04", "projDesc": "LILO OF 132KV NUZVID-NARSAPURAM (35-36 )", "schemeId": "SI-19-12", "schemeDesc": "132/33 kV SS at Ramanakkapeta in Krishna", "workName": "Supply, Erection, Testing and commissioning of 132kV Multi Circuit line(1.847 km) for making DC LILO to proposed Ramanakkapeta 132kV SS From(Nuz-Narasapuram Line in krishna districtRamanakkapeta line Sch -B", "poValue": 4725670.99, "valueGR": 3176296.08, "balanceGR": 1549374.91, "valueInv": 3176296.1, "balanceInv": -0.02, "vendorCode": "101992", "plant": "5105", "vendorName": "S & S ELECTRICALS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2021-07-06 00:00:00", "completionDate": "2022-01-05 00:00:00"}, {"poNo": "3000002037", "projId": "SI-23-31-01", "projDesc": "132/33 KV SS @ BANTUMILLI(Balance Works)", "schemeId": "SI-23-31", "schemeDesc": "BALANCE WORKS@132KV BANTUMILLI SS& LINES", "workName": "Balance works of 132/33 kV SS at Bantumilli in Krishna dtSCH B1  SS", "poValue": 65485018.97, "valueGR": 23283716.95, "balanceGR": 42201302.02, "valueInv": 13180867.12, "balanceInv": 10102849.83, "vendorCode": "102984", "plant": "5105", "vendorName": "VERTEX ENGINEERS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2024-11-19 00:00:00", "completionDate": "2025-08-18 00:00:00"}, {"poNo": "3000002065", "projId": "SI-23-31-01", "projDesc": "132/33 KV SS @ BANTUMILLI(Balance Works)", "schemeId": "SI-23-31", "schemeDesc": "BALANCE WORKS@132KV BANTUMILLI SS& LINES", "workName": "Balance works of 132/33 kV SS at Bantumilli in Krishna districtSCH A1 SS", "poValue": 23706677.23, "valueGR": 22593307.35, "balanceGR": 1113369.88, "valueInv": 18446648.99, "balanceInv": 4146658.36, "vendorCode": "102984", "plant": "5105", "vendorName": "VERTEX ENGINEERS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2024-11-19 00:00:00", "completionDate": "2025-08-18 00:00:00"}, {"poNo": "3000002063", "projId": "SI-23-31-02", "projDesc": "132KV DC/SC LINE PEDANA SW TO BANTUMILLI", "schemeId": "SI-23-31", "schemeDesc": "BALANCE WORKS@132KV BANTUMILLI SS& LINES", "workName": "132 kV DC line from 132 kV Switching station pedana to proposed 132/33kV SS at Bantumilli in Krishna districtSCH B2 LINE", "poValue": 43233221.0, "valueGR": 9296070.45, "balanceGR": 33937150.55, "valueInv": 3112367.6, "balanceInv": 6183702.85, "vendorCode": "102984", "plant": "5105", "vendorName": "VERTEX ENGINEERS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2024-11-19 00:00:00", "completionDate": "2025-08-18 00:00:00"}, {"poNo": "3000002066", "projId": "SI-23-31-02", "projDesc": "132KV DC/SC LINE PEDANA SW TO BANTUMILLI", "schemeId": "SI-23-31", "schemeDesc": "BALANCE WORKS@132KV BANTUMILLI SS& LINES", "workName": "sch A2   LINE  BANTUMILLI IN KRISHNA DT", "poValue": 83667068.48, "valueGR": 39085713.9, "balanceGR": 44581354.58, "valueInv": 2340938.33, "balanceInv": 36744775.57, "vendorCode": "102984", "plant": "5105", "vendorName": "VERTEX ENGINEERS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2024-11-19 00:00:00", "completionDate": "2025-08-18 00:00:00"}, {"poNo": "3000002064", "projId": "SI-23-31-03", "projDesc": "2 NOS 132kV BAYS AT 132KV SS PEDANA SW", "schemeId": "SI-23-31", "schemeDesc": "BALANCE WORKS@132KV BANTUMILLI SS& LINES", "workName": "2 nos 132kV Bay extension with Bus extension at 132kV SWS pedana inKrishna DistrictSCH B3 Bay", "poValue": 4751649.42, "valueGR": 0.0, "balanceGR": 4751649.42, "valueInv": 0.0, "balanceInv": 0.0, "vendorCode": "102984", "plant": "5105", "vendorName": "VERTEX ENGINEERS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2024-11-19 00:00:00", "completionDate": "2025-08-18 00:00:00"}, {"poNo": "3000002067", "projId": "SI-23-31-03", "projDesc": "2 NOS 132kV BAYS AT 132KV SS PEDANA SW", "schemeId": "SI-23-31", "schemeDesc": "BALANCE WORKS@132KV BANTUMILLI SS& LINES", "workName": "SCHEDULE A3 : 2 NOS BAY EXTENSION WITH BUS EXTENSION AT 132 KV SWSPEDANA", "poValue": 9456622.18, "valueGR": 5379498.88, "balanceGR": 4077123.3, "valueInv": 2661339.71, "balanceInv": 2718159.17, "vendorCode": "102984", "plant": "5105", "vendorName": "VERTEX ENGINEERS", "baDesc": "SE/O&M/VIJAYAWADA", "purchDocType": "ZPRO", "commencDate": "2024-11-19 00:00:00", "completionDate": "2025-08-18 00:00:00"}];

// HQ Accounts Wing employees (busArea 9000 = HQ)
var HQ_EMPLOYEES = [
  {"id":"1099876","firstName":"PATTABHI RAMA RAO","lastName":"","name":"Pattabhi Rama Rao","designation":"SAO/HQ/APTRANSCO","department":"APTRANSCO","busArea":"9100","subArea":"Accounts-HQ","subGroup":"AF","orgUnit":"HQ Accounts/APTRANSCO","email":"","tel":""},
  {"id":"1097865","firstName":"ANJANEYULU","lastName":"","name":"Anjaneyulu","designation":"AAO/HQ/APTRANSCO","department":"APTRANSCO","busArea":"9100","subArea":"Accounts-HQ","subGroup":"AD","orgUnit":"HQ Accounts/APTRANSCO","email":"","tel":""}
];
// Merge HQ employees into EMPLOYEES for login & display
EMPLOYEES = EMPLOYEES.concat(HQ_EMPLOYEES);

var VMAT_DATA = [{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000008245","grYear":"2021","grPostingDate":"2021-05-15","accountingDocNo":"5100003366","accountingYear":"2021","grossAmt":4873118.56,"itBankCharges":41343.9,"penalty":0.0,"retention":974623.9,"otherRecovery":82595.21,"netAmt":3774555.55,"loaNo":"LOA21-5105-0070","amtPaid":3774555.55,"paymentDate":"2021-08-25","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000008246","grYear":"2021","grPostingDate":"2021-05-15","accountingDocNo":"5100003366","accountingYear":"2021","grossAmt":109469.51,"itBankCharges":928.75,"penalty":0.0,"retention":21893.91,"otherRecovery":1855.42,"netAmt":84791.44,"loaNo":"LOA21-5105-0070","amtPaid":84791.44,"paymentDate":"2021-08-25","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000010737","grYear":"2021","grPostingDate":"2021-07-05","accountingDocNo":"5100003366","accountingYear":"2021","grossAmt":280920.71,"itBankCharges":2383.35,"penalty":0.0,"retention":56184.15,"otherRecovery":4761.37,"netAmt":217591.84,"loaNo":"LOA21-5105-0070","amtPaid":217591.84,"paymentDate":"2021-08-25","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000016883","grYear":"2021","grPostingDate":"2021-11-06","accountingDocNo":"5100006725","accountingYear":"2021","grossAmt":2314564.36,"itBankCharges":39244.34,"penalty":0.0,"retention":462912.93,"otherRecovery":39229.77,"netAmt":1773177.31,"loaNo":"LOA21-5105-0126","amtPaid":1773177.31,"paymentDate":"2022-01-03","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000016885","grYear":"2021","grPostingDate":"2021-11-06","accountingDocNo":"5100006725","accountingYear":"2021","grossAmt":1240129.41,"itBankCharges":21026.88,"penalty":0.0,"retention":248025.91,"otherRecovery":21019.07,"netAmt":950057.55,"loaNo":"LOA21-5105-0126","amtPaid":950057.55,"paymentDate":"2022-01-03","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000016886","grYear":"2021","grPostingDate":"2021-11-06","accountingDocNo":"5100006725","accountingYear":"2021","grossAmt":717804.1,"itBankCharges":12170.65,"penalty":0.0,"retention":143560.84,"otherRecovery":12166.13,"netAmt":549906.48,"loaNo":"LOA21-5105-0126","amtPaid":549906.48,"paymentDate":"2022-01-03","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000016887","grYear":"2021","grPostingDate":"2021-11-06","accountingDocNo":"5100006725","accountingYear":"2021","grossAmt":1224658.58,"itBankCharges":20764.56,"penalty":0.0,"retention":244931.75,"otherRecovery":20756.86,"netAmt":938205.41,"loaNo":"LOA21-5105-0126","amtPaid":938205.41,"paymentDate":"2022-01-03","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000016888","grYear":"2021","grPostingDate":"2021-11-06","accountingDocNo":"5100006725","accountingYear":"2021","grossAmt":650686.83,"itBankCharges":11032.65,"penalty":0.0,"retention":130137.38,"otherRecovery":11028.55,"netAmt":498488.25,"loaNo":"LOA21-5105-0126","amtPaid":498488.25,"paymentDate":"2022-01-03","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000016899","grYear":"2021","grPostingDate":"2021-11-06","accountingDocNo":"5100006725","accountingYear":"2021","grossAmt":274372.83,"itBankCharges":4652.1,"penalty":0.0,"retention":54874.57,"otherRecovery":4650.37,"netAmt":210195.79,"loaNo":"LOA21-5105-0126","amtPaid":210195.79,"paymentDate":"2022-01-03","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000017580","grYear":"2021","grPostingDate":"2021-11-18","accountingDocNo":"5100006725","accountingYear":"2021","grossAmt":1519682.65,"itBankCharges":25766.81,"penalty":0.0,"retention":303936.57,"otherRecovery":25757.25,"netAmt":1164222.02,"loaNo":"LOA21-5105-0126","amtPaid":1164222.02,"paymentDate":"2022-01-03","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000017582","grYear":"2021","grPostingDate":"2021-11-18","accountingDocNo":"5100008757","accountingYear":"2021","grossAmt":347295.1,"itBankCharges":5936.1,"penalty":14343.0,"retention":69460.0,"otherRecovery":5886.0,"netAmt":251670.0,"loaNo":"LOA21-5105-0149","amtPaid":251670.0,"paymentDate":"2022-03-14","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000001571","grYear":"2022","grPostingDate":"2022-02-08","accountingDocNo":"5100009418","accountingYear":"2021","grossAmt":2300476.74,"itBankCharges":39041.0,"penalty":244310.97,"retention":460095.95,"otherRecovery":38992.0,"netAmt":1518036.83,"loaNo":"LOA21-5105-0157","amtPaid":1518036.83,"paymentDate":"2022-03-21","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000001573","grYear":"2022","grPostingDate":"2022-02-08","accountingDocNo":"5100009707","accountingYear":"2021","grossAmt":524387.07,"itBankCharges":8938.07,"penalty":55691.0,"retention":104878.0,"otherRecovery":40904.0,"netAmt":313976.0,"loaNo":"LOA21-5105-0159","amtPaid":313976.0,"paymentDate":"2022-05-30","type":"Material"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001405","plant":"5105","grDocNo":"5000002279","grYear":"2022","grPostingDate":"2022-02-24","accountingDocNo":"5100010248","accountingYear":"2021","grossAmt":1007444.35,"itBankCharges":17125.35,"penalty":118878.0,"retention":201488.0,"otherRecovery":617497.0,"netAmt":52456.0,"loaNo":"LOA21-5105-0169","amtPaid":52456.0,"paymentDate":"2022-04-25","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000002845","grYear":"2021","grPostingDate":"2021-02-19","accountingDocNo":"5100010468","accountingYear":"2020","grossAmt":1434454.45,"itBankCharges":18285.46,"penalty":0.0,"retention":286890.0,"otherRecovery":24312.0,"netAmt":1104966.99,"loaNo":"LOA20-5105-0139","amtPaid":1104966.99,"paymentDate":"2021-03-26","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000003490","grYear":"2021","grPostingDate":"2021-03-02","accountingDocNo":"5100010765","accountingYear":"2020","grossAmt":8831891.12,"itBankCharges":112320.11,"penalty":0.0,"retention":1766378.0,"otherRecovery":149694.01,"netAmt":6803499.0,"loaNo":"LOA20-5105-0145","amtPaid":6803499.0,"paymentDate":"2021-03-30","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000003959","grYear":"2021","grPostingDate":"2021-03-08","accountingDocNo":"5100010965","accountingYear":"2020","grossAmt":7544646.35,"itBankCharges":95957.35,"penalty":0.0,"retention":1508930.0,"otherRecovery":127876.0,"netAmt":5811883.0,"loaNo":"LOA20-5105-0155","amtPaid":5811883.0,"paymentDate":"2021-04-16","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000008312","grYear":"2021","grPostingDate":"2021-05-17","accountingDocNo":"5100001251","accountingYear":"2021","grossAmt":17736217.71,"itBankCharges":300659.23,"penalty":0.0,"retention":3547244.26,"otherRecovery":300614.79,"netAmt":13587699.42,"loaNo":"LOA21-5105-0019","amtPaid":13587699.42,"paymentDate":"2021-06-15","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000008317","grYear":"2021","grPostingDate":"2021-05-17","accountingDocNo":"5100001251","accountingYear":"2021","grossAmt":1817147.99,"itBankCharges":30803.77,"penalty":0.0,"retention":363429.67,"otherRecovery":30799.21,"netAmt":1392115.34,"loaNo":"LOA21-5105-0019","amtPaid":1392115.34,"paymentDate":"2021-06-15","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000009060","grYear":"2021","grPostingDate":"2021-06-03","accountingDocNo":"5100002123","accountingYear":"2021","grossAmt":1212427.58,"itBankCharges":20595.69,"penalty":0.0,"retention":242485.07,"otherRecovery":20549.8,"netAmt":928797.02,"loaNo":"LOA21-5105-0041","amtPaid":928797.02,"paymentDate":"2021-07-20","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000009249","grYear":"2021","grPostingDate":"2021-06-07","accountingDocNo":"5100002123","accountingYear":"2021","grossAmt":120134.86,"itBankCharges":2040.75,"penalty":0.0,"retention":24026.93,"otherRecovery":2036.2,"netAmt":92030.98,"loaNo":"LOA21-5105-0041","amtPaid":92030.98,"paymentDate":"2021-07-20","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000010809","grYear":"2021","grPostingDate":"2021-07-06","accountingDocNo":"5100002969","accountingYear":"2021","grossAmt":174097.35,"itBankCharges":2956.74,"penalty":0.0,"retention":34819.55,"otherRecovery":2950.9,"netAmt":133370.16,"loaNo":"LOA21-5105-0061","amtPaid":133370.16,"paymentDate":"2021-08-06","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000010810","grYear":"2021","grPostingDate":"2021-07-06","accountingDocNo":"5100002969","accountingYear":"2021","grossAmt":119793.32,"itBankCharges":2034.48,"penalty":0.0,"retention":23958.72,"otherRecovery":2030.46,"netAmt":91769.66,"loaNo":"LOA21-5105-0061","amtPaid":91769.66,"paymentDate":"2021-08-06","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000010830","grYear":"2021","grPostingDate":"2021-07-06","accountingDocNo":"5100002969","accountingYear":"2021","grossAmt":1046597.56,"itBankCharges":17774.66,"penalty":0.0,"retention":209320.02,"otherRecovery":17739.5,"netAmt":801763.39,"loaNo":"LOA21-5105-0061","amtPaid":801763.39,"paymentDate":"2021-08-06","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000010831","grYear":"2021","grPostingDate":"2021-07-06","accountingDocNo":"5100002969","accountingYear":"2021","grossAmt":130808.21,"itBankCharges":2221.55,"penalty":0.0,"retention":26161.71,"otherRecovery":2217.16,"netAmt":100207.8,"loaNo":"LOA21-5105-0061","amtPaid":100207.8,"paymentDate":"2021-08-06","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000012024","grYear":"2021","grPostingDate":"2021-08-02","accountingDocNo":"5100003857","accountingYear":"2021","grossAmt":4957776.31,"itBankCharges":84080.32,"penalty":0.0,"retention":991556.0,"otherRecovery":84030.0,"netAmt":3798109.99,"loaNo":"LOA21-5105-0082","amtPaid":3798109.99,"paymentDate":"2021-09-23","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000012528","grYear":"2021","grPostingDate":"2021-08-07","accountingDocNo":"5100004167","accountingYear":"2021","grossAmt":283996.66,"itBankCharges":4819.53,"penalty":0.0,"retention":56799.23,"otherRecovery":4813.54,"netAmt":217564.36,"loaNo":"LOA21-5105-0085","amtPaid":217564.36,"paymentDate":"2021-09-23","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000013010","grYear":"2021","grPostingDate":"2021-08-17","accountingDocNo":"5100004167","accountingYear":"2021","grossAmt":2098997.68,"itBankCharges":35620.8,"penalty":0.0,"retention":419798.77,"otherRecovery":35576.47,"netAmt":1608001.64,"loaNo":"LOA21-5105-0085","amtPaid":1608001.64,"paymentDate":"2021-09-23","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000014183","grYear":"2021","grPostingDate":"2021-09-07","accountingDocNo":"5100006040","accountingYear":"2021","grossAmt":312077.39,"itBankCharges":5294.04,"penalty":1617.88,"retention":62415.51,"otherRecovery":5289.44,"netAmt":237460.53,"loaNo":"LOA21-5105-0116","amtPaid":237460.53,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000015069","grYear":"2021","grPostingDate":"2021-09-28","accountingDocNo":"5100006040","accountingYear":"2021","grossAmt":1432680.83,"itBankCharges":24303.79,"penalty":7427.32,"retention":286536.3,"otherRecovery":24282.7,"netAmt":1090130.72,"loaNo":"LOA21-5105-0116","amtPaid":1090130.72,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000015510","grYear":"2021","grPostingDate":"2021-10-05","accountingDocNo":"5100006040","accountingYear":"2021","grossAmt":1605296.17,"itBankCharges":27232.01,"penalty":8322.2,"retention":321059.39,"otherRecovery":27208.38,"netAmt":1221474.2,"loaNo":"LOA21-5105-0116","amtPaid":1221474.2,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000015511","grYear":"2021","grPostingDate":"2021-10-05","accountingDocNo":"5100006040","accountingYear":"2021","grossAmt":69943.97,"itBankCharges":1186.52,"penalty":362.6,"retention":13988.8,"otherRecovery":1185.49,"netAmt":53220.56,"loaNo":"LOA21-5105-0116","amtPaid":53220.56,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000018712","grYear":"2021","grPostingDate":"2021-12-08","accountingDocNo":"5100010365","accountingYear":"2021","grossAmt":2062338.93,"itBankCharges":34993.74,"penalty":0.0,"retention":412468.25,"otherRecovery":34954.2,"netAmt":1579922.74,"loaNo":"LOA21-5105-0177","amtPaid":1579922.74,"paymentDate":"2022-04-29","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000018713","grYear":"2021","grPostingDate":"2021-12-08","accountingDocNo":"5100010365","accountingYear":"2021","grossAmt":597788.0,"itBankCharges":10143.26,"penalty":0.0,"retention":119557.74,"otherRecovery":10131.8,"netAmt":457955.21,"loaNo":"LOA21-5105-0177","amtPaid":457955.21,"paymentDate":"2022-04-29","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000003229","grYear":"2022","grPostingDate":"2022-03-09","accountingDocNo":"5100010366","accountingYear":"2021","grossAmt":1540621.45,"itBankCharges":26119.11,"penalty":0.0,"retention":308124.17,"otherRecovery":26112.22,"netAmt":1180265.95,"loaNo":"LOA21-5105-0178","amtPaid":1180265.95,"paymentDate":"2022-04-29","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000003230","grYear":"2022","grPostingDate":"2022-03-09","accountingDocNo":"5100010366","accountingYear":"2021","grossAmt":1547741.87,"itBankCharges":26239.83,"penalty":0.0,"retention":309548.25,"otherRecovery":26232.91,"netAmt":1185720.88,"loaNo":"LOA21-5105-0178","amtPaid":1185720.88,"paymentDate":"2022-04-29","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000003231","grYear":"2022","grPostingDate":"2022-03-09","accountingDocNo":"5100010366","accountingYear":"2021","grossAmt":3481817.41,"itBankCharges":59029.4,"penalty":0.0,"retention":696363.21,"otherRecovery":59013.84,"netAmt":2667410.95,"loaNo":"LOA21-5105-0178","amtPaid":2667410.95,"paymentDate":"2022-04-29","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000003232","grYear":"2022","grPostingDate":"2022-03-09","accountingDocNo":"5100010366","accountingYear":"2021","grossAmt":1173644.73,"itBankCharges":19897.53,"penalty":0.0,"retention":234728.86,"otherRecovery":19892.28,"netAmt":899126.07,"loaNo":"LOA21-5105-0178","amtPaid":899126.07,"paymentDate":"2022-04-29","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000003233","grYear":"2022","grPostingDate":"2022-03-09","accountingDocNo":"5100010366","accountingYear":"2021","grossAmt":3520928.89,"itBankCharges":59692.49,"penalty":0.0,"retention":704185.51,"otherRecovery":59676.75,"netAmt":2697374.15,"loaNo":"LOA21-5105-0178","amtPaid":2697374.15,"paymentDate":"2022-04-29","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000011321","grYear":"2022","grPostingDate":"2022-08-10","accountingDocNo":"5100004670","accountingYear":"2022","grossAmt":443864.03,"itBankCharges":7549.67,"penalty":13440.16,"retention":88773.12,"otherRecovery":7522.95,"netAmt":326578.14,"loaNo":"LOA22-5105-0042","amtPaid":326578.14,"paymentDate":"2022-11-22","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000011322","grYear":"2022","grPostingDate":"2022-08-10","accountingDocNo":"5100004670","accountingYear":"2022","grossAmt":388173.06,"itBankCharges":6602.42,"penalty":11753.84,"retention":77634.88,"otherRecovery":6579.05,"netAmt":285602.86,"loaNo":"LOA22-5105-0042","amtPaid":285602.86,"paymentDate":"2022-11-22","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000000236","grYear":"2023","grPostingDate":"2023-01-05","accountingDocNo":"5100007330","accountingYear":"2022","grossAmt":42350.31,"itBankCharges":824.47,"penalty":7037.35,"retention":8470.05,"otherRecovery":717.81,"netAmt":25300.63,"loaNo":"LOA22-5105-0080","amtPaid":25300.63,"paymentDate":"2023-02-03","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000000238","grYear":"2023","grPostingDate":"2023-01-05","accountingDocNo":"5100007330","accountingYear":"2022","grossAmt":1288654.4,"itBankCharges":25087.37,"penalty":214135.6,"retention":257730.48,"otherRecovery":21841.99,"netAmt":769858.97,"loaNo":"LOA22-5105-0080","amtPaid":769858.97,"paymentDate":"2023-02-03","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000011368","grYear":"2024","grPostingDate":"2024-06-28","accountingDocNo":"5100003574","accountingYear":"2024","grossAmt":5430905.7,"itBankCharges":92097.99,"penalty":0.0,"retention":1086181.85,"otherRecovery":92049.89,"netAmt":4160575.97,"loaNo":"LOA24-5105-0057","amtPaid":4160575.97,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000011369","grYear":"2024","grPostingDate":"2024-06-28","accountingDocNo":"5100003574","accountingYear":"2024","grossAmt":248040.59,"itBankCharges":4206.3,"penalty":0.0,"retention":49608.15,"otherRecovery":4204.11,"netAmt":190022.03,"loaNo":"LOA24-5105-0057","amtPaid":190022.03,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001477","plant":"5105","grDocNo":"5000015700","grYear":"2024","grPostingDate":"2024-09-20","accountingDocNo":"5100005598","accountingYear":"2024","grossAmt":1022835.1,"itBankCharges":17387.1,"penalty":150868.0,"retention":204568.0,"otherRecovery":17336.0,"netAmt":632676.0,"loaNo":"LOA24-5105-0093","amtPaid":632676.0,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000002843","grYear":"2021","grPostingDate":"2021-02-19","accountingDocNo":"5100010469","accountingYear":"2020","grossAmt":483145.44,"itBankCharges":6144.4,"penalty":0.0,"retention":96629.13,"otherRecovery":8188.95,"netAmt":372182.96,"loaNo":"LOA20-5105-0140","amtPaid":372182.96,"paymentDate":"2021-03-26","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000002844","grYear":"2021","grPostingDate":"2021-02-19","accountingDocNo":"5100010469","accountingYear":"2020","grossAmt":8317010.41,"itBankCharges":105771.59,"penalty":0.0,"retention":1663402.84,"otherRecovery":140967.06,"netAmt":6406868.92,"loaNo":"LOA20-5105-0140","amtPaid":6406868.92,"paymentDate":"2021-03-26","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000000247","grYear":"2023","grPostingDate":"2023-01-05","accountingDocNo":"5100007330","accountingYear":"2022","grossAmt":1023411.99,"itBankCharges":19923.66,"penalty":170060.29,"retention":204682.08,"otherRecovery":17346.27,"netAmt":611399.69,"loaNo":"LOA22-5105-0080","amtPaid":611399.69,"paymentDate":"2023-02-03","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000000249","grYear":"2023","grPostingDate":"2023-01-05","accountingDocNo":"5100007330","accountingYear":"2022","grossAmt":39799.9,"itBankCharges":774.82,"penalty":6613.55,"retention":7959.97,"otherRecovery":674.59,"netAmt":23776.98,"loaNo":"LOA22-5105-0080","amtPaid":23776.98,"paymentDate":"2023-02-03","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000000250","grYear":"2023","grPostingDate":"2023-01-05","accountingDocNo":"5100007330","accountingYear":"2022","grossAmt":14002.93,"itBankCharges":272.61,"penalty":2326.87,"retention":2800.58,"otherRecovery":237.34,"netAmt":8365.53,"loaNo":"LOA22-5105-0080","amtPaid":8365.53,"paymentDate":"2023-02-03","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000000251","grYear":"2023","grPostingDate":"2023-01-05","accountingDocNo":"5100007330","accountingYear":"2022","grossAmt":190747.16,"itBankCharges":3713.44,"penalty":31696.44,"retention":38149.37,"otherRecovery":3233.06,"netAmt":113954.84,"loaNo":"LOA22-5105-0080","amtPaid":113954.84,"paymentDate":"2023-02-03","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000007751","grYear":"2023","grPostingDate":"2023-06-01","accountingDocNo":"5100001717","accountingYear":"2023","grossAmt":9539616.49,"itBankCharges":209436.4,"penalty":3208173.46,"retention":1907922.68,"otherRecovery":161689.03,"netAmt":4052394.92,"loaNo":"LOA23-5105-0018","amtPaid":4052394.92,"paymentDate":"2023-08-08","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000007752","grYear":"2023","grPostingDate":"2023-06-01","accountingDocNo":"5100001717","accountingYear":"2023","grossAmt":106846.66,"itBankCharges":2345.75,"penalty":35932.54,"retention":21369.32,"otherRecovery":1810.97,"netAmt":45388.08,"loaNo":"LOA23-5105-0018","amtPaid":45388.08,"paymentDate":"2023-08-08","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000000049","grYear":"2024","grPostingDate":"2024-01-02","accountingDocNo":"5100008177","accountingYear":"2023","grossAmt":371760.59,"itBankCharges":6351.99,"penalty":0.0,"retention":74351.92,"otherRecovery":6301.99,"netAmt":284754.69,"loaNo":"LOA23-5105-0117","amtPaid":284754.69,"paymentDate":"2024-02-13","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000011371","grYear":"2024","grPostingDate":"2024-06-28","accountingDocNo":"5100003586","accountingYear":"2024","grossAmt":9149474.6,"itBankCharges":155125.09,"penalty":0.0,"retention":1829895.24,"otherRecovery":155076.49,"netAmt":7009377.78,"loaNo":"LOA24-5105-0058","amtPaid":7009377.78,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000011373","grYear":"2024","grPostingDate":"2024-06-28","accountingDocNo":"5100003586","accountingYear":"2024","grossAmt":314541.06,"itBankCharges":5332.9,"penalty":0.0,"retention":62908.22,"otherRecovery":5331.23,"netAmt":240968.71,"loaNo":"LOA24-5105-0058","amtPaid":240968.71,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000012134","grYear":"2024","grPostingDate":"2024-07-10","accountingDocNo":"5100003586","accountingYear":"2024","grossAmt":12052.67,"itBankCharges":204.35,"penalty":0.0,"retention":2410.53,"otherRecovery":204.28,"netAmt":9233.5,"loaNo":"LOA24-5105-0058","amtPaid":9233.5,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001478","plant":"5105","grDocNo":"5000015701","grYear":"2024","grPostingDate":"2024-09-20","accountingDocNo":"5100005600","accountingYear":"2024","grossAmt":9033679.64,"itBankCharges":153163.99,"penalty":1332467.95,"retention":1806735.93,"otherRecovery":153113.99,"netAmt":5588197.78,"loaNo":"LOA24-5105-0094","amtPaid":5588197.78,"paymentDate":"2024-10-25","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001479","plant":"5105","grDocNo":"5000002846","grYear":"2021","grPostingDate":"2021-02-19","accountingDocNo":"5100010470","accountingYear":"2020","grossAmt":176423.5,"itBankCharges":2245.92,"penalty":0.0,"retention":35284.69,"otherRecovery":2990.17,"netAmt":135902.72,"loaNo":"LOA20-5105-0141","amtPaid":135902.72,"paymentDate":"2021-03-26","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001479","plant":"5105","grDocNo":"5000002847","grYear":"2021","grPostingDate":"2021-02-19","accountingDocNo":"5100010470","accountingYear":"2020","grossAmt":2531137.11,"itBankCharges":32222.08,"penalty":0.0,"retention":506227.24,"otherRecovery":42899.82,"netAmt":1949787.98,"loaNo":"LOA20-5105-0141","amtPaid":1949787.98,"paymentDate":"2021-03-26","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001479","plant":"5105","grDocNo":"5000009248","grYear":"2021","grPostingDate":"2021-06-07","accountingDocNo":"5100002122","accountingYear":"2021","grossAmt":77101.47,"itBankCharges":1357.47,"penalty":0.0,"retention":15420.0,"otherRecovery":1306.0,"netAmt":59018.0,"loaNo":"LOA21-5105-0040","amtPaid":59018.0,"paymentDate":"2021-07-20","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001479","plant":"5105","grDocNo":"5000012026","grYear":"2021","grPostingDate":"2021-08-02","accountingDocNo":"5100003860","accountingYear":"2021","grossAmt":218169.6,"itBankCharges":3747.99,"penalty":0.0,"retention":43633.92,"otherRecovery":3697.99,"netAmt":167089.69,"loaNo":"LOA21-5105-0083","amtPaid":167089.69,"paymentDate":"2021-09-23","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001480","plant":"5105","grDocNo":"5000014155","grYear":"2021","grPostingDate":"2021-09-07","accountingDocNo":"5100006023","accountingYear":"2021","grossAmt":686231.94,"itBankCharges":11632.92,"penalty":0.0,"retention":137246.39,"otherRecovery":11631.02,"netAmt":525721.61,"loaNo":"LOA21-5105-0115","amtPaid":525721.61,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001480","plant":"5105","grDocNo":"5000015531","grYear":"2021","grPostingDate":"2021-10-06","accountingDocNo":"5100006023","accountingYear":"2021","grossAmt":1185628.18,"itBankCharges":20098.62,"penalty":0.0,"retention":237125.63,"otherRecovery":20095.34,"netAmt":908308.58,"loaNo":"LOA21-5105-0115","amtPaid":908308.58,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001480","plant":"5105","grDocNo":"5000015532","grYear":"2021","grPostingDate":"2021-10-06","accountingDocNo":"5100006023","accountingYear":"2021","grossAmt":16648520.04,"itBankCharges":282223.62,"penalty":0.0,"retention":3329703.98,"otherRecovery":282177.63,"netAmt":12754414.81,"loaNo":"LOA21-5105-0115","amtPaid":12754414.81,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001480","plant":"5105","grDocNo":"5000000240","grYear":"2023","grPostingDate":"2023-01-05","accountingDocNo":"5100007330","accountingYear":"2022","grossAmt":149677.61,"itBankCharges":2913.91,"penalty":24871.92,"retention":29935.48,"otherRecovery":2536.95,"netAmt":89419.36,"loaNo":"LOA22-5105-0080","amtPaid":89419.36,"paymentDate":"2023-02-03","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001480","plant":"5105","grDocNo":"5000011374","grYear":"2024","grPostingDate":"2024-06-28","accountingDocNo":"5100003597","accountingYear":"2024","grossAmt":134583.71,"itBankCharges":2331.99,"penalty":0.0,"retention":26915.94,"otherRecovery":2282.0,"netAmt":103053.78,"loaNo":"LOA24-5105-0059","amtPaid":103053.78,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001481","plant":"5105","grDocNo":"5000012527","grYear":"2021","grPostingDate":"2021-08-07","accountingDocNo":"5100004173","accountingYear":"2021","grossAmt":53405.5,"itBankCharges":955.5,"penalty":0.0,"retention":10682.0,"otherRecovery":906.0,"netAmt":40862.0,"loaNo":"LOA21-5105-0086","amtPaid":40862.0,"paymentDate":"2021-09-23","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001481","plant":"5105","grDocNo":"5000015506","grYear":"2021","grPostingDate":"2021-10-05","accountingDocNo":"5100006033","accountingYear":"2021","grossAmt":53405.5,"itBankCharges":955.5,"penalty":0.0,"retention":10682.0,"otherRecovery":906.0,"netAmt":40862.0,"loaNo":"LOA21-5105-0117","amtPaid":40862.0,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001481","plant":"5105","grDocNo":"5000000386","grYear":"2024","grPostingDate":"2024-01-05","accountingDocNo":"5100008180","accountingYear":"2023","grossAmt":65292.53,"itBankCharges":1101.74,"penalty":0.0,"retention":12944.16,"otherRecovery":1668.62,"netAmt":49578.01,"loaNo":"LOA23-5105-0118","amtPaid":49578.01,"paymentDate":"2024-02-20","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001481","plant":"5105","grDocNo":"5000000826","grYear":"2024","grPostingDate":"2024-01-12","accountingDocNo":"5100008180","accountingYear":"2023","grossAmt":621743.36,"itBankCharges":10491.26,"penalty":0.0,"retention":123259.84,"otherRecovery":15889.27,"netAmt":472102.99,"loaNo":"LOA23-5105-0118","amtPaid":472102.99,"paymentDate":"2024-02-20","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001481","plant":"5105","grDocNo":"5000000991","grYear":"2024","grPostingDate":"2024-01-20","accountingDocNo":"5100008382","accountingYear":"2023","grossAmt":37910.36,"itBankCharges":693.36,"penalty":0.0,"retention":7582.0,"otherRecovery":642.0,"netAmt":28993.0,"loaNo":"LOA23-5105-0121","amtPaid":28993.0,"paymentDate":"2024-02-20","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001481","plant":"5105","grDocNo":"5000011370","grYear":"2024","grPostingDate":"2024-06-28","accountingDocNo":"5100003601","accountingYear":"2024","grossAmt":453474.49,"itBankCharges":7736.49,"penalty":0.0,"retention":90694.0,"otherRecovery":7686.0,"netAmt":347358.0,"loaNo":"LOA24-5105-0060","amtPaid":347358.0,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001481","plant":"5105","grDocNo":"5000015703","grYear":"2024","grPostingDate":"2024-09-20","accountingDocNo":"5100005601","accountingYear":"2024","grossAmt":170472.52,"itBankCharges":2939.99,"penalty":25144.93,"retention":34093.9,"otherRecovery":2889.99,"netAmt":105403.7,"loaNo":"LOA24-5105-0095","amtPaid":105403.7,"paymentDate":"2024-10-24","type":"Material"},{"vendorId":"101992","vendorName":"S & S ELECTRICALS","poNo":"3000001569","plant":"5105","grDocNo":"5000015849","grYear":"2021","grPostingDate":"2021-10-11","accountingDocNo":"5100006303","accountingYear":"2021","grossAmt":237299.18,"itBankCharges":2012.57,"penalty":0.0,"retention":47459.75,"otherRecovery":5209.01,"netAmt":182617.84,"loaNo":"LOA21-5105-0120","amtPaid":182617.84,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101992","vendorName":"S & S ELECTRICALS","poNo":"3000001569","plant":"5105","grDocNo":"5000015850","grYear":"2021","grPostingDate":"2021-10-11","accountingDocNo":"5100006303","accountingYear":"2021","grossAmt":7318403.83,"itBankCharges":62068.43,"penalty":0.0,"retention":1463678.25,"otherRecovery":160648.0,"netAmt":5632009.16,"loaNo":"LOA21-5105-0120","amtPaid":5632009.16,"paymentDate":"2022-01-04","type":"Material"},{"vendorId":"101992","vendorName":"S & S ELECTRICALS","poNo":"3000001569","plant":"5105","grDocNo":"5000002790","grYear":"2022","grPostingDate":"2022-03-03","accountingDocNo":"5100010343","accountingYear":"2021","grossAmt":214325.82,"itBankCharges":3074.82,"penalty":6322.0,"retention":42864.0,"otherRecovery":3632.0,"netAmt":158433.0,"loaNo":"LOA21-5105-0173","amtPaid":158433.0,"paymentDate":"2022-04-25","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000004766","grYear":"2025","grPostingDate":"2025-03-17","accountingDocNo":"5100011129","accountingYear":"2024","grossAmt":540010.9,"itBankCharges":9156.8,"penalty":0.0,"retention":108002.24,"otherRecovery":9152.83,"netAmt":413699.03,"loaNo":"LOA24-5105-0198","amtPaid":413699.03,"paymentDate":"2025-04-08","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000004767","grYear":"2025","grPostingDate":"2025-03-17","accountingDocNo":"5100011129","accountingYear":"2024","grossAmt":6032778.6,"itBankCharges":102295.95,"penalty":0.0,"retention":1206556.44,"otherRecovery":102251.61,"netAmt":4621674.6,"loaNo":"LOA24-5105-0198","amtPaid":4621674.6,"paymentDate":"2025-04-08","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000004768","grYear":"2025","grPostingDate":"2025-03-17","accountingDocNo":"5100011129","accountingYear":"2024","grossAmt":90716.37,"itBankCharges":1538.25,"penalty":0.0,"retention":18143.29,"otherRecovery":1537.58,"netAmt":69497.25,"loaNo":"LOA24-5105-0198","amtPaid":69497.25,"paymentDate":"2025-04-08","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000007982","grYear":"2025","grPostingDate":"2025-04-22","accountingDocNo":"5100001653","accountingYear":"2025","grossAmt":3486483.27,"itBankCharges":59143.27,"penalty":0.0,"retention":697296.0,"otherRecovery":59092.0,"netAmt":2670952.0,"loaNo":"LOA25-5105-0020","amtPaid":2670952.0,"paymentDate":"2025-06-10","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000009274","grYear":"2025","grPostingDate":"2025-05-08","accountingDocNo":"5100001652","accountingYear":"2025","grossAmt":2882085.76,"itBankCharges":48877.0,"penalty":0.0,"retention":576417.48,"otherRecovery":48849.43,"netAmt":2207941.86,"loaNo":"LOA25-5105-0019","amtPaid":2207941.86,"paymentDate":"2025-06-10","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000011474","grYear":"2025","grPostingDate":"2025-06-18","accountingDocNo":"5100002774","accountingYear":"2025","grossAmt":602094.58,"itBankCharges":10254.99,"penalty":0.0,"retention":120419.92,"otherRecovery":10205.99,"netAmt":461213.68,"loaNo":"LOA25-5105-0044","amtPaid":461213.68,"paymentDate":"2025-07-15","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000012569","grYear":"2025","grPostingDate":"2025-07-04","accountingDocNo":"5100004277","accountingYear":"2025","grossAmt":84187.84,"itBankCharges":1428.65,"penalty":0.0,"retention":16837.58,"otherRecovery":1426.94,"netAmt":64494.67,"loaNo":"LOA25-5105-0087","amtPaid":64494.67,"paymentDate":"2025-08-29","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002065","plant":"5105","grDocNo":"5000012570","grYear":"2025","grPostingDate":"2025-07-04","accountingDocNo":"5100004277","accountingYear":"2025","grossAmt":2383150.42,"itBankCharges":40441.61,"penalty":0.0,"retention":476630.42,"otherRecovery":40393.06,"netAmt":1825685.33,"loaNo":"LOA25-5105-0087","amtPaid":1825685.33,"paymentDate":"2025-08-29","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002066","plant":"5105","grDocNo":"5000004806","grYear":"2025","grPostingDate":"2025-03-17","accountingDocNo":"5100011132","accountingYear":"2024","grossAmt":2340938.33,"itBankCharges":39727.33,"penalty":0.0,"retention":468188.0,"otherRecovery":39676.0,"netAmt":1793347.0,"loaNo":"LOA24-5105-0199","amtPaid":1793347.0,"paymentDate":"2025-04-16","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002067","plant":"5105","grDocNo":"5000009276","grYear":"2025","grPostingDate":"2025-05-08","accountingDocNo":"5100001654","accountingYear":"2025","grossAmt":2345141.25,"itBankCharges":39799.25,"penalty":0.0,"retention":469028.0,"otherRecovery":39748.0,"netAmt":1796566.0,"loaNo":"LOA25-5105-0021","amtPaid":1796566.0,"paymentDate":"2025-06-10","type":"Material"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002067","plant":"5105","grDocNo":"5000011476","grYear":"2025","grPostingDate":"2025-06-18","accountingDocNo":"5100002775","accountingYear":"2025","grossAmt":316198.46,"itBankCharges":5410.46,"penalty":0.0,"retention":63240.0,"otherRecovery":5360.0,"netAmt":242188.0,"loaNo":"LOA25-5105-0045","amtPaid":242188.0,"paymentDate":"2025-07-15","type":"Material"}];
var VSVC_DATA = [{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"7419","seYear":"2021","sePostingDate":"2021-03-08","accountingDocNo":"5100011043","accountingYear":"2020","grossAmt":17159110.83,"itBankCharges":290883.0,"penalty":0.0,"retention":1715906.0,"otherRecovery":13323885.0,"netAmt":13323885.0,"loaNo":"LOA20-5105-0160","amtPaid":13323885.0,"paymentDate":"2021-04-16","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"7789","seYear":"2021","sePostingDate":"2021-03-17","accountingDocNo":"5100011063","accountingYear":"2020","grossAmt":2026380.49,"itBankCharges":34395.77,"penalty":0.0,"retention":202638.0,"otherRecovery":1667649.0,"netAmt":1667649.0,"loaNo":"LOA20-5105-0169","amtPaid":1667649.0,"paymentDate":"2021-04-16","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"8428","seYear":"2021","sePostingDate":"2021-06-25","accountingDocNo":"5100002800","accountingYear":"2021","grossAmt":11385334.52,"itBankCharges":193022.9,"penalty":0.0,"retention":1138532.0,"otherRecovery":9229118.0,"netAmt":9229118.0,"loaNo":"LOA21-5105-0054","amtPaid":9229118.0,"paymentDate":"2021-08-06","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"8891","seYear":"2021","sePostingDate":"2021-08-23","accountingDocNo":"5100004283","accountingYear":"2021","grossAmt":4866028.63,"itBankCharges":82529.38,"penalty":0.0,"retention":486603.0,"otherRecovery":4116185.0,"netAmt":4116185.0,"loaNo":"LOA21-5105-0092","amtPaid":4116185.0,"paymentDate":"2021-09-23","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"9279","seYear":"2021","sePostingDate":"2021-10-14","accountingDocNo":"5100005990","accountingYear":"2021","grossAmt":5305231.84,"itBankCharges":89969.0,"penalty":16074.0,"retention":530521.0,"otherRecovery":4403675.0,"netAmt":4403675.0,"loaNo":"LOA21-5105-0118","amtPaid":4403675.0,"paymentDate":"2022-01-04","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"10119","seYear":"2022","sePostingDate":"2022-03-09","accountingDocNo":"5100010341","accountingYear":"2021","grossAmt":6473205.03,"itBankCharges":108846.8,"penalty":0.0,"retention":641902.06,"otherRecovery":5426089.8,"netAmt":5426089.8,"loaNo":"LOA21-5105-0176","amtPaid":5426089.8,"paymentDate":"2022-05-30","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"10267","seYear":"2022","sePostingDate":"2022-03-22","accountingDocNo":"5100010723","accountingYear":"2021","grossAmt":8414595.33,"itBankCharges":141339.02,"penalty":0.0,"retention":833604.0,"otherRecovery":6215876.0,"netAmt":6215876.0,"loaNo":"LOA21-5105-0186","amtPaid":6215876.0,"paymentDate":"2022-05-30","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"10938","seYear":"2022","sePostingDate":"2022-08-12","accountingDocNo":"5100003534","accountingYear":"2022","grossAmt":3028809.61,"itBankCharges":51388.84,"penalty":51558.0,"retention":302881.0,"otherRecovery":1935942.0,"netAmt":1935942.0,"loaNo":"LOA22-5105-0033","amtPaid":1935942.0,"paymentDate":"2022-09-16","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"12080","seYear":"2023","sePostingDate":"2023-06-01","accountingDocNo":"5100001819","accountingYear":"2023","grossAmt":4412811.99,"itBankCharges":74843.45,"penalty":1017125.0,"retention":441281.0,"otherRecovery":2639827.0,"netAmt":2639827.0,"loaNo":"LOA23-5105-0019","amtPaid":2639827.0,"paymentDate":"2023-07-13","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001490","plant":"5105","seNo":"13275","seYear":"2024","sePostingDate":"2024-02-03","accountingDocNo":"5100009052","accountingYear":"2023","grossAmt":3542985.74,"itBankCharges":60101.67,"penalty":0.0,"retention":354299.0,"otherRecovery":2327372.0,"netAmt":2327372.0,"loaNo":"LOA23-5105-0134","amtPaid":2327372.0,"paymentDate":"2024-03-04","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001495","plant":"5105","seNo":"7400","seYear":"2021","sePostingDate":"2021-03-08","accountingDocNo":"5100011045","accountingYear":"2020","grossAmt":29794.77,"itBankCharges":554.76,"penalty":0.0,"retention":2980.0,"otherRecovery":25354.0,"netAmt":25354.0,"loaNo":"LOA20-5105-0162","amtPaid":25354.0,"paymentDate":"2021-04-16","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001495","plant":"5105","seNo":"10254","seYear":"2022","sePostingDate":"2022-03-22","accountingDocNo":"5100010724","accountingYear":"2021","grossAmt":1919520.6,"itBankCharges":32585.51,"penalty":0.0,"retention":191952.0,"otherRecovery":1612638.0,"netAmt":1612638.0,"loaNo":"LOA21-5105-0187","amtPaid":1612638.0,"paymentDate":"2022-05-30","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001495","plant":"5105","seNo":"12092","seYear":"2023","sePostingDate":"2023-06-01","accountingDocNo":"5100001816","accountingYear":"2023","grossAmt":5095779.78,"itBankCharges":86420.0,"penalty":651267.0,"retention":509583.0,"otherRecovery":3637992.0,"netAmt":3637992.0,"loaNo":"LOA23-5105-0021","amtPaid":3637992.0,"paymentDate":"2023-07-20","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001495","plant":"5105","seNo":"13280","seYear":"2024","sePostingDate":"2024-02-03","accountingDocNo":"5100009053","accountingYear":"2023","grossAmt":463784.9,"itBankCharges":7911.0,"penalty":0.0,"retention":46380.0,"otherRecovery":388908.0,"netAmt":388908.0,"loaNo":"LOA23-5105-0136","amtPaid":388908.0,"paymentDate":"2024-03-04","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001498","plant":"5105","seNo":"7401","seYear":"2021","sePostingDate":"2021-03-08","accountingDocNo":"5100011039","accountingYear":"2020","grossAmt":854934.07,"itBankCharges":14540.57,"penalty":0.0,"retention":85493.0,"otherRecovery":714699.0,"netAmt":714699.0,"loaNo":"LOA20-5105-0161","amtPaid":714699.0,"paymentDate":"2021-04-16","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001498","plant":"5105","seNo":"10296","seYear":"2022","sePostingDate":"2022-03-25","accountingDocNo":"5100010856","accountingYear":"2021","grossAmt":267420.11,"itBankCharges":4582.28,"penalty":0.0,"retention":26742.0,"otherRecovery":229320.0,"netAmt":229320.0,"loaNo":"LOA21-5105-0189","amtPaid":229320.0,"paymentDate":"2022-04-29","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001499","plant":"5105","seNo":"10285","seYear":"2022","sePostingDate":"2022-03-23","accountingDocNo":"5100010857","accountingYear":"2021","grossAmt":2276792.57,"itBankCharges":38638.74,"penalty":0.0,"retention":227680.0,"otherRecovery":1917308.0,"netAmt":1917308.0,"loaNo":"LOA21-5105-0188","amtPaid":1917308.0,"paymentDate":"2022-05-30","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001499","plant":"5105","seNo":"10942","seYear":"2022","sePostingDate":"2022-08-12","accountingDocNo":"5100003537","accountingYear":"2022","grossAmt":6099231.65,"itBankCharges":103379.0,"penalty":53896.0,"retention":609930.0,"otherRecovery":5029098.0,"netAmt":5029098.0,"loaNo":"LOA22-5105-0034","amtPaid":5029098.0,"paymentDate":"2022-09-16","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001499","plant":"5105","seNo":"11896","seYear":"2023","sePostingDate":"2023-06-01","accountingDocNo":"5100001817","accountingYear":"2023","grossAmt":416357.42,"itBankCharges":7108.0,"penalty":47101.0,"retention":41637.0,"otherRecovery":307887.0,"netAmt":307887.0,"loaNo":"LOA23-5105-0020","amtPaid":307887.0,"paymentDate":"2023-06-28","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001499","plant":"5105","seNo":"13339","seYear":"2024","sePostingDate":"2024-02-16","accountingDocNo":"5100009206","accountingYear":"2023","grossAmt":287254.33,"itBankCharges":4914.06,"penalty":0.0,"retention":28726.0,"otherRecovery":242010.0,"netAmt":242010.0,"loaNo":"LOA23-5105-0141","amtPaid":242010.0,"paymentDate":"2024-03-04","type":"Service"},{"vendorId":"101161","vendorName":"KMV PROJECTS LIMITED","poNo":"3000001500","plant":"5105","seNo":"13272","seYear":"2024","sePostingDate":"2024-02-03","accountingDocNo":"5100009055","accountingYear":"2023","grossAmt":644802.12,"itBankCharges":10978.79,"penalty":0.0,"retention":64480.0,"otherRecovery":543330.0,"netAmt":543330.0,"loaNo":"LOA23-5105-0135","amtPaid":543330.0,"paymentDate":"2024-03-04","type":"Service"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001527","plant":"5105","seNo":"7889","seYear":"2021","sePostingDate":"2021-03-20","accountingDocNo":"5100002290","accountingYear":"2021","grossAmt":2474602.81,"itBankCharges":21024.19,"penalty":0.0,"retention":247460.0,"otherRecovery":2098277.0,"netAmt":2098277.0,"loaNo":"LOA21-5105-0046","amtPaid":2098277.0,"paymentDate":"2021-08-06","type":"Service"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001527","plant":"5105","seNo":"8335","seYear":"2021","sePostingDate":"2021-06-14","accountingDocNo":"5100002853","accountingYear":"2021","grossAmt":1573365.01,"itBankCharges":13383.41,"penalty":0.0,"retention":157337.0,"otherRecovery":1341856.0,"netAmt":1341856.0,"loaNo":"LOA21-5105-0062","amtPaid":1341856.0,"paymentDate":"2021-08-25","type":"Service"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001527","plant":"5105","seNo":"8338","seYear":"2021","sePostingDate":"2021-06-14","accountingDocNo":"5100002850","accountingYear":"2021","grossAmt":816380.39,"itBankCharges":6969.39,"penalty":0.0,"retention":81638.0,"otherRecovery":707087.0,"netAmt":707087.0,"loaNo":"LOA21-5105-0063","amtPaid":707087.0,"paymentDate":"2022-01-03","type":"Service"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001527","plant":"5105","seNo":"9224","seYear":"2021","sePostingDate":"2021-10-08","accountingDocNo":"5100006644","accountingYear":"2021","grossAmt":1174338.13,"itBankCharges":19955.65,"penalty":0.0,"retention":117434.0,"otherRecovery":999517.0,"netAmt":999517.0,"loaNo":"LOA21-5105-0124","amtPaid":999517.0,"paymentDate":"2022-01-03","type":"Service"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001527","plant":"5105","seNo":"9228","seYear":"2021","sePostingDate":"2021-10-18","accountingDocNo":"5100006646","accountingYear":"2021","grossAmt":1685611.39,"itBankCharges":28620.98,"penalty":530.0,"retention":168561.0,"otherRecovery":1315551.0,"netAmt":1315551.0,"loaNo":"LOA21-5105-0125","amtPaid":1315551.0,"paymentDate":"2022-01-03","type":"Service"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001527","plant":"5105","seNo":"9495","seYear":"2021","sePostingDate":"2021-11-19","accountingDocNo":"5100008632","accountingYear":"2021","grossAmt":1128357.05,"itBankCharges":19174.33,"penalty":5922.0,"retention":112836.0,"otherRecovery":950005.0,"netAmt":950005.0,"loaNo":"LOA21-5105-0146","amtPaid":950005.0,"paymentDate":"2022-03-14","type":"Service"},{"vendorId":"100720","vendorName":"G.V.PRATAP REDDY","poNo":"3000001527","plant":"5105","seNo":"9887","seYear":"2022","sePostingDate":"2022-02-24","accountingDocNo":"5100010187","accountingYear":"2021","grossAmt":453968.69,"itBankCharges":7748.59,"penalty":14357.0,"retention":45397.0,"otherRecovery":4743.0,"netAmt":4743.0,"loaNo":"LOA21-5105-0170","amtPaid":4743.0,"paymentDate":"2022-04-25","type":"Service"},{"vendorId":"101992","vendorName":"S & S ELECTRICALS","poNo":"3000001570","plant":"5105","seNo":"9295","seYear":"2021","sePostingDate":"2021-10-19","accountingDocNo":"5100006509","accountingYear":"2021","grossAmt":916583.28,"itBankCharges":7818.0,"penalty":0.0,"retention":27497.0,"otherRecovery":839921.0,"netAmt":839921.0,"loaNo":"LOA21-5105-0121","amtPaid":839921.0,"paymentDate":"2022-01-04","type":"Service"},{"vendorId":"101992","vendorName":"S & S ELECTRICALS","poNo":"3000001570","plant":"5105","seNo":"9751","seYear":"2022","sePostingDate":"2022-01-05","accountingDocNo":"5100008276","accountingYear":"2021","grossAmt":1914947.36,"itBankCharges":16277.36,"penalty":0.0,"retention":57449.0,"otherRecovery":1788088.0,"netAmt":1788088.0,"loaNo":"LOA21-5105-0145","amtPaid":1788088.0,"paymentDate":"2022-03-14","type":"Service"},{"vendorId":"101992","vendorName":"S & S ELECTRICALS","poNo":"3000001570","plant":"5105","seNo":"10106","seYear":"2022","sePostingDate":"2022-03-07","accountingDocNo":"5100010247","accountingYear":"2021","grossAmt":344765.43,"itBankCharges":2975.43,"penalty":12987.0,"retention":10343.0,"otherRecovery":307999.0,"netAmt":307999.0,"loaNo":"LOA21-5105-0172","amtPaid":307999.0,"paymentDate":"2022-04-25","type":"Service"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002037","plant":"5105","seNo":"15512","seYear":"2025","sePostingDate":"2025-03-17","accountingDocNo":"5100011126","accountingYear":"2024","grossAmt":7406580.04,"itBankCharges":125586.0,"penalty":0.0,"retention":740658.0,"otherRecovery":6234784.0,"netAmt":6234784.0,"loaNo":"LOA24-5105-0200","amtPaid":6234784.0,"paymentDate":"2025-04-08","type":"Service"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002037","plant":"5105","seNo":"16089","seYear":"2025","sePostingDate":"2025-06-16","accountingDocNo":"5100002857","accountingYear":"2025","grossAmt":5774287.08,"itBankCharges":97920.08,"penalty":0.0,"retention":577429.0,"otherRecovery":4904346.0,"netAmt":4904346.0,"loaNo":"LOA25-5105-0050","amtPaid":4904346.0,"paymentDate":"2025-07-15","type":"Service"},{"vendorId":"102984","vendorName":"VERTEX ENGINEERS","poNo":"3000002063","plant":"5105","seNo":"15974","seYear":"2025","sePostingDate":"2025-06-09","accountingDocNo":"5100002855","accountingYear":"2025","grossAmt":3112367.6,"itBankCharges":52805.6,"penalty":0.0,"retention":311237.0,"otherRecovery":2631427.0,"netAmt":2631427.0,"loaNo":"LOA25-5105-0049","amtPaid":2631427.0,"paymentDate":"2025-07-15","type":"Service"}];
var FORM14    = [{"seNo": "7400", "scheme": "SI-19-11", "poNo": "3000001495", "presentBillNo": "CC1ST &PART (220KV LILO)", "prevBillNo": "", "billingAmt": 29800.56, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "7401", "scheme": "SI-19-11", "poNo": "3000001498", "presentBillNo": "CC1ST &PART (132KV LILO)", "prevBillNo": "", "billingAmt": 854946.82, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "7419", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 1ST & PART BILL(SS)", "prevBillNo": "", "billingAmt": 17159055.46, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "7789", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 2ND & PART BILL(SS)", "prevBillNo": "CC 1ST & PART BILL(SS)", "billingAmt": 2026379.7, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "7889", "scheme": "SI-19-12", "poNo": "3000001527", "presentBillNo": "CC 1ST & WORK BILL", "prevBillNo": "", "billingAmt": 2474599.79, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "100720", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "8335", "scheme": "SI-19-12", "poNo": "3000001527", "presentBillNo": "CC 2ND", "prevBillNo": "CC 1ST & WORK BILL", "billingAmt": 1573364.71, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 15324.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "100720", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "8338", "scheme": "SI-19-12", "poNo": "3000001527", "presentBillNo": "CC 3RD", "prevBillNo": "CC 2ND", "billingAmt": 816384.82, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "100720", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "8428", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 3RD & PART BILL(SS)", "prevBillNo": "CC 2ND & PART BILL(SS)", "billingAmt": 11385316.62, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "8891", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 4TH & PART BILL(SS)", "prevBillNo": "CC 3RD & PART BILL(SS)", "billingAmt": 4866024.31, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "9224", "scheme": "SI-19-12", "poNo": "3000001527", "presentBillNo": "CC 4TH", "prevBillNo": "CC 3RD", "billingAmt": 1174337.31, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "100720", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "9228", "scheme": "SI-19-12", "poNo": "3000001527", "presentBillNo": "CC 5TH", "prevBillNo": "CC 4TH", "billingAmt": 1685610.07, "retentionAmt": 0.0, "penaltyAmt": 529.44, "adhocRecoveries": 100000.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "100720", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "9279", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 5TH & PART BILL(SS)", "prevBillNo": "CC 4TH & PART BILL(SS)", "billingAmt": 5305213.16, "retentionAmt": 0.0, "penaltyAmt": 16073.42, "adhocRecoveries": 50000.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "9295", "scheme": "SI-19-12", "poNo": "3000001570", "presentBillNo": "CC 1ST & PART BILL", "prevBillNo": "", "billingAmt": 916575.69, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 20000.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101992", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "9495", "scheme": "SI-19-12", "poNo": "3000001527", "presentBillNo": "CC6TH & PART BILL", "prevBillNo": "CC 5TH", "billingAmt": 1128358.49, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "100720", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "9751", "scheme": "SI-19-12", "poNo": "3000001570", "presentBillNo": "CC-2N D& PART BILL", "prevBillNo": "CC 1ST & PART BILL", "billingAmt": 1914949.14, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 10000.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101992", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "9887", "scheme": "SI-19-12", "poNo": "3000001527", "presentBillNo": "CC-7TH & PART BILL", "prevBillNo": "CC6TH & PART BILL", "billingAmt": 453965.39, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "100720", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "10106", "scheme": "SI-19-12", "poNo": "3000001570", "presentBillNo": "CC-3RD & PART BILL", "prevBillNo": "CC-2N D& PART BILL", "billingAmt": 344762.78, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101992", "description": "132/33 kV SS at Ramanakkapeta in Krishna"}, {"seNo": "10119", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 6TH & PART BILL(SS)", "prevBillNo": "CC 5TH & PART BILL(SS)", "billingAmt": 6473189.48, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 18800.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "10254", "scheme": "SI-19-11", "poNo": "3000001495", "presentBillNo": "CC 2ND &PART(220KV LILO)", "prevBillNo": "CC1ST &PART (220KV LILO)", "billingAmt": 1919566.21, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "10267", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 7TH & PART BILL(SS)", "prevBillNo": "CC 6TH & PART BILL(SS)", "billingAmt": 8414588.23, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 755000.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "10285", "scheme": "SI-19-11", "poNo": "3000001499", "presentBillNo": "CC 1ST & PART BILL", "prevBillNo": "", "billingAmt": 2276814.65, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "10296", "scheme": "SI-19-11", "poNo": "3000001498", "presentBillNo": "CC2ND & PART(132KV LILO)", "prevBillNo": "CC1ST &PART (132KV LILO)", "billingAmt": 267420.11, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "10938", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 8TH & PART BILL(SS)", "prevBillNo": "CC 7TH & PART BILL(SS)", "billingAmt": 3028805.96, "retentionAmt": 0.0, "penaltyAmt": 51556.93, "adhocRecoveries": 416300.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "10942", "scheme": "SI-19-11", "poNo": "3000001499", "presentBillNo": "CC 2ND & PART BILL", "prevBillNo": "CC 1ST & PART BILL", "billingAmt": 6099296.7, "retentionAmt": 0.0, "penaltyAmt": 53895.56, "adhocRecoveries": 49500.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "11896", "scheme": "SI-19-11", "poNo": "3000001499", "presentBillNo": "CC 3RD & PART BILL", "prevBillNo": "CC 2ND & PART BILL", "billingAmt": 416365.6, "retentionAmt": 0.0, "penaltyAmt": 47101.28, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "12080", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 9TH & PART BILL(SS)", "prevBillNo": "CC 8TH & PART BILL(SS)", "billingAmt": 4412817.02, "retentionAmt": 0.0, "penaltyAmt": 1017125.13, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "12092", "scheme": "SI-19-11", "poNo": "3000001495", "presentBillNo": "CC3RD & PART (220KV LILO", "prevBillNo": "CC 2ND &PART(220KV LILO)", "billingAmt": 5095828.57, "retentionAmt": 0.0, "penaltyAmt": 651266.38, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "13272", "scheme": "SI-19-11", "poNo": "3000001500", "presentBillNo": "CC 1ST & PART BILL (BAY)", "prevBillNo": "", "billingAmt": 644802.95, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "13275", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 10TH & PART BILL (SS)", "prevBillNo": "CC 9TH & PART BILL(SS)", "billingAmt": 3542985.29, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 590000.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "13280", "scheme": "SI-19-11", "poNo": "3000001495", "presentBillNo": "CC 4TH & PARTBILL 220KVL", "prevBillNo": "CC3RD & PART (220KV LILO", "billingAmt": 463795.25, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "13339", "scheme": "SI-19-11", "poNo": "3000001499", "presentBillNo": "CC4TH & PART BILL", "prevBillNo": "CC 3RD & PART BILL", "billingAmt": 287259.46, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "15512", "scheme": "SI-23-31", "poNo": "3000002037", "presentBillNo": "CCC 1ST & PART BILL", "prevBillNo": "", "billingAmt": 7406601.97, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "102984", "description": "BALANCE WORKS@132KV BANTUMILLI SS& LINES"}, {"seNo": "15861", "scheme": "SI-19-11", "poNo": "3000001499", "presentBillNo": "CC 5TH & PART BILL", "prevBillNo": "CC4TH & PART BILL", "billingAmt": 16282.59, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "CREAT", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "15974", "scheme": "SI-23-31", "poNo": "3000002063", "presentBillNo": "CC 1ST &  PART BILL", "prevBillNo": "", "billingAmt": 3112363.5, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "102984", "description": "BALANCE WORKS@132KV BANTUMILLI SS& LINES"}, {"seNo": "16089", "scheme": "SI-23-31", "poNo": "3000002037", "presentBillNo": "CC 2ND & PART BILL", "prevBillNo": "CCC 1ST & PART BILL", "billingAmt": 5774286.94, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "102984", "description": "BALANCE WORKS@132KV BANTUMILLI SS& LINES"}, {"seNo": "17998", "scheme": "SI-19-11", "poNo": "3000001495", "presentBillNo": "CC 5TH & PART BILL", "prevBillNo": "CC 4TH & PARTBILL 220KVL", "billingAmt": 13609887.43, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "CREAT", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "18016", "scheme": "SI-19-11", "poNo": "3000001490", "presentBillNo": "CC 11TH & PART BILL (SS)", "prevBillNo": "CC 10TH & PART BILL (SS)", "billingAmt": 7161957.26, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "CREAT", "contractorNo": "101161", "description": "220/132/33 kV SS at Tiruvuru in krishna"}, {"seNo": "18032", "scheme": "SI-23-31", "poNo": "3000002037", "presentBillNo": "CC 3RD & PART BILL", "prevBillNo": "CC 2ND & PART BILL", "billingAmt": 10102850.37, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "102984", "description": "BALANCE WORKS@132KV BANTUMILLI SS& LINES"}, {"seNo": "18054", "scheme": "SI-23-31", "poNo": "3000002063", "presentBillNo": "CC 2ND & PART BILL", "prevBillNo": "CC 1ST &  PART BILL", "billingAmt": 6183696.88, "retentionAmt": 0.0, "penaltyAmt": 0.0, "adhocRecoveries": 0.0, "otherRecoveries": 0.0, "status": "SUBMI", "contractorNo": "102984", "description": "BALANCE WORKS@132KV BANTUMILLI SS& LINES"}];

var ALL_PAYMENTS = VMAT_DATA.map(function(r){ return Object.assign({},r,{type:'Material'}); })
  .concat(VSVC_DATA.map(function(r){ return Object.assign({},r,{type:'Service'}); }));

// Vendor map from PO_DATA
var VENDOR_MAP = {};
PO_DATA.forEach(function(p){ if(p.vendorCode && !VENDOR_MAP[p.vendorCode]) VENDOR_MAP[p.vendorCode] = p.vendorName; });

// PO mapping store
var poMappings = {};
var submittedBills = [];
var currentVendorId = null;
var currentUser = null;
var currentEmpId = null;
var invoiceSerial = {};
var selectedInvoiceType = 'Service';
var uploadedDocs = {};
var billTypeFilter = 'all';

// ===== DATA PERSISTENCE (localStorage) =====
var _storageAvailable = (function(){
  try{ localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return true; }
  catch(e){ return false; }
})();

function saveBillsToStorage(){
  if(!_storageAvailable) return;
  try{
    var toSave = submittedBills.map(function(b){
      var copy = Object.assign({}, b);
      if(copy.docs){
        var docsCopy = {};
        Object.keys(copy.docs).forEach(function(k){
          if(copy.docs[k]) docsCopy[k] = {name: copy.docs[k].name||'', size: copy.docs[k].size||0};
        });
        copy.docs = docsCopy;
      }
      return copy;
    });
    localStorage.setItem('vbts_bills', JSON.stringify(toSave));
    localStorage.setItem('vbts_mappings', JSON.stringify(poMappings));
    localStorage.setItem('vbts_serial', JSON.stringify(invoiceSerial));
  } catch(e){ console.warn('Storage save error:', e); }
}

function loadBillsFromStorage(){
  if(!_storageAvailable) return;
  try{
    var b = localStorage.getItem('vbts_bills');
    if(b) submittedBills = JSON.parse(b);
    var m = localStorage.getItem('vbts_mappings');
    if(m) poMappings = JSON.parse(m);
    var s = localStorage.getItem('vbts_serial');
    if(s) invoiceSerial = JSON.parse(s);
  } catch(e){ console.warn('Storage load error:', e); }
}

// Load on startup
try { loadBillsFromStorage(); } catch(e){ console.warn('Init load error:',e); }

// ===== FY Helper =====
function getCurrentFY(){
  var d = new Date(); var y = d.getFullYear(); var m = d.getMonth();
  return m >= 3 ? String(y).slice(2) : String(y-1).slice(2);
}

function generateBillId(poNo, type){
  var fy = getCurrentFY();
  var key = poNo + '_' + type;
  if(!invoiceSerial[key]) invoiceSerial[key] = 1;
  var serial = String(invoiceSerial[key]).padStart(3,'0');
  var poShort = String(poNo).padStart(10,'0');
  if(type === 'HR'){
    return poShort + '-HR-' + fy + '-' + serial;
  } else {
    return poShort + '-IN-' + fy + '-' + serial;
  }
}

function fmtAmt(v){ return v ? 'â‚¹' + Number(v).toLocaleString('en-IN',{maximumFractionDigits:2}) : 'â€”'; }

// ===== LOGIN =====
function loginAP(){
  var empId = document.getElementById('apEmpId').value.trim();
  var pass  = document.getElementById('apPass').value;
  if(!empId){ showToast('âš ï¸ Please enter your Employee ID.',true); return; }
  if(pass !== 'abc123'){ showToast('âš ï¸ Incorrect password.',true); return; }
  var emp = EMPLOYEES.find(function(e){ return String(e.id) === empId; });
  if(!emp){ showToast('âš ï¸ Employee ID not found in master data.',true); return; }
  currentEmpId = empId;
  currentUser = 'ap';
  document.getElementById('ap-username').textContent = emp.name;
  document.getElementById('ap-userid').textContent = 'ID: ' + emp.id;
  document.getElementById('ap-role-display').textContent = emp.subGroup;
  document.getElementById('ap-role-label').textContent = emp.subGroup + ' Module';
  var initials = (emp.firstName[0]||'') + (emp.lastName[0]||'');
  document.getElementById('ap-avatar').textContent = initials;
  document.getElementById('ap-topbar-name').textContent = emp.name;
  document.getElementById('loginPortal').style.display = 'none';
  document.getElementById('apApp').classList.add('active');
  initAPDashboard();
  showToast('Welcome, ' + emp.name + ' (' + emp.designation + ')!');
}

function loginVendor(){
  var vid  = (document.getElementById('vendorId').value || '').trim();
  var pass = (document.getElementById('vendorPass').value || '').trim();
  if(!vid){ showToast('Please enter your Vendor ID.',true); return; }
  if(!pass){ showToast('Please enter password.',true); return; }
  if(pass !== 'abc123'){ showToast('Incorrect password. Default is abc123',true); return; }
  // Try exact match first, then trimmed string match
  var vname = VENDOR_MAP[vid] || VENDOR_MAP[vid.replace(/^0+/,'')] || null;
  // Also try with leading zeros removed (e.g. 0000101161 -> 101161)
  if(!vname){
    var keys = Object.keys(VENDOR_MAP);
    for(var i=0;i<keys.length;i++){
      if(keys[i].replace(/^0+/,'') === vid.replace(/^0+/,'')){
        vname = VENDOR_MAP[keys[i]]; vid = keys[i]; break;
      }
    }
  }
  if(!vname){
    showToast('Vendor ID "'+vid+'" not found. Valid IDs: '+Object.keys(VENDOR_MAP).join(', '),true);
    return;
  }
  currentVendorId = vid;
  currentUser = 'vendor';
  document.getElementById('v-username').textContent = vname;
  document.getElementById('v-userid').textContent = 'ID: ' + vid;
  var initials = vname.replace(/[^A-Z]/g,'').slice(0,2) || 'VD';
  document.getElementById('v-avatar').textContent = initials;
  document.getElementById('v-topname').textContent = vname;
  document.getElementById('loginPortal').style.display = 'none';
  document.getElementById('vendorApp').classList.add('active');
  initVendorDashboard();
  initSubmitInvoicePage();
  showToast('Welcome, ' + vname + '!');
}

function logout(){
  document.getElementById('loginPortal').style.display = 'flex';
  document.getElementById('vendorApp').classList.remove('active');
  document.getElementById('apApp').classList.remove('active');
  document.getElementById('mgmtApp').classList.remove('active');
  currentUser = null; currentVendorId = null; currentEmpId = null;
  uploadedDocs = {};
}

// ===== VENDOR DASHBOARD =====
function initVendorDashboard(){
  var myPOs = PO_DATA.filter(function(p){ return String(p.vendorCode) === currentVendorId; });
  var myBills = submittedBills.filter(function(b){ return b.vendorId===currentVendorId; });
  var totalPOValue = myPOs.reduce(function(s,p){ return s+(p.poValue||0); },0);
  var paidBills = myBills.filter(function(b){ return b.status==='Paid'; });
  var pendingBills = myBills.filter(function(b){ return b.status!=='Paid'&&b.status!=='Rejected'&&b.status!=='Draft (Editing)'; });
  var totalBillsRaisedValue = myBills.reduce(function(s,b){ return s+(b.grossAmt||0); },0);
  var totalPaidValue = paidBills.reduce(function(s,b){
    var paid = 0;
    if(b.selectedGRs && b.selectedGRs.length){
      b.selectedGRs.forEach(function(gr){
        var rec = VMAT_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&r.grDocNo===gr.grDocNo; });
        if(rec) paid += rec.amtPaid||0;
      });
    } else if(b.selectedForm14 && b.selectedForm14.seNo){
      var srec = VSVC_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&String(r.seNo)===String(b.selectedForm14.seNo); });
      if(srec) paid = srec.amtPaid||0;
    }
    return s + (paid || b.amtPaid || 0);
  },0);
  var totalPendingValue = pendingBills.reduce(function(s,b){ return s+(b.grossAmt||0); },0);

  var statsHtml =
    '<div class="stat-card" style="cursor:pointer;" onclick="vShowPage(\'vMyPOs\',null)">'+
      '<div class="stat-label">Total POs Assigned</div>'+
      '<div class="stat-value">'+myPOs.length+' <span class="stat-icon">ðŸ“‹</span></div>'+
      '<div class="stat-sub" style="font-weight:600;color:var(--ap-blue-mid);">'+fmtAmt(totalPOValue)+'</div>'+
      '<div class="stat-sub">Total PO value</div>'+
    '</div>'+
    '<div class="stat-card" style="cursor:pointer;" onclick="vShowPage(\'vMyBills\',null);renderMyBillsTable()">'+
      '<div class="stat-label">Total Bills Raised</div>'+
      '<div class="stat-value">'+myBills.length+' <span class="stat-icon">ðŸ“¤</span></div>'+
      '<div class="stat-sub" style="font-weight:600;color:var(--ap-blue-mid);">'+fmtAmt(totalBillsRaisedValue)+'</div>'+
      '<div class="stat-sub">Gross invoice value</div>'+
    '</div>'+
    '<div class="stat-card" style="cursor:pointer;border-top:3px solid var(--ap-green);" onclick="vShowPage(\'vInbox\',null);renderInboxTab(\'inboxCompleted\')">'+
      '<div class="stat-label">Total Bills Paid</div>'+
      '<div class="stat-value" style="color:var(--ap-green);">'+paidBills.length+' <span class="stat-icon">âœ…</span></div>'+
      '<div class="stat-sub" style="font-weight:600;color:var(--ap-green);">'+fmtAmt(totalPaidValue)+'</div>'+
      '<div class="stat-sub">Net amount received</div>'+
    '</div>'+
    '<div class="stat-card" style="cursor:pointer;border-top:3px solid var(--ap-orange);" onclick="vShowPage(\'vInbox\',null);renderInboxTab(\'inboxPending\')">'+
      '<div class="stat-label">Total Bills Pending</div>'+
      '<div class="stat-value" style="color:var(--ap-orange);">'+pendingBills.length+' <span class="stat-icon">â³</span></div>'+
      '<div class="stat-sub" style="font-weight:600;color:var(--ap-orange);">'+fmtAmt(totalPendingValue)+'</div>'+
      '<div class="stat-sub">Not yet paid â€” click to view</div>'+
    '</div>';
  document.getElementById('vDashStats').innerHTML = statsHtml;

  // Remove old 3-tile summary (replaced by 4 tiles above)
  var summaryEl = document.getElementById('vBillStatusSummary');
  if(summaryEl){ summaryEl.innerHTML = ''; }

  // Recent submitted bills
  var statusBadge2 = {
    'Submitted':'badge-submitted','Pending with AEE':'badge-processing','Under Verification':'badge-processing',
    'Reviewed by Engineer':'badge-form13','Forwarded to EE':'badge-processing','Forwarded to Accounts':'badge-form13',
    'Form13 Updated':'badge-form13','Form14 Updated':'badge-form14','Invoice Posted':'badge-processing',
    'LOA Created':'badge-form14','LOA Approved':'badge-approved','With HQ Accounts':'badge-processing',
    'Approved':'badge-approved','Paid':'badge-paid','Rejected':'badge-rejected',
    'Sent Back by Accounts':'badge-rejected','Sent Back by HQ':'badge-rejected'
  };
  var rows = myBills.slice().reverse().slice(0,10).map(function(b){
    var st = b.status||'Submitted';
    return '<tr><td><span class="bill-id">'+b.billId+'</span></td><td style="font-size:11px;">'+(b.eInvNo||'â€”')+'</td>'+
      '<td>'+b.poNo+'</td><td class="amount">'+(b.grossAmt?fmtAmt(b.grossAmt):'â€”')+'</td>'+
      '<td><span class="badge '+(statusBadge2[st]||'badge-submitted')+'">'+st+'</span>'+(b.pendingWith?'<br><span style="font-size:10px;color:var(--ap-gray-400);">With: '+b.pendingWith+'</span>':'')+'</td>'+
      '<td>'+b.date+'</td></tr>';
  }).join('');
  document.getElementById('vDashRecentTbl').innerHTML = rows || '<tr><td colspan="6" style="text-align:center;color:var(--ap-gray-400);">No bills submitted yet.</td></tr>';
}

// ===== SUBMIT INVOICE PAGE =====
function initSubmitInvoicePage(){
  // Populate PO select - show External PO No. from PO details
  var myPOs = PO_DATA.filter(function(p){ return String(p.vendorCode) === currentVendorId; });
  var poSel = document.getElementById('poSelect');
  poSel.innerHTML = '<option value="">â€” Select PO â€”</option>';
  myPOs.forEach(function(p){
    var extPO = p.externalPONo || p.poNo; // use externalPONo if available
    poSel.innerHTML += '<option value="'+p.poNo+'">'+extPO+' | '+p.workName.substring(0,50)+'</option>';
  });
  // Initialize engineer dropdown (empty until wing selected)
  document.getElementById('aeeSelect').innerHTML = '<option value="">â€” Select Wing first â€”</option>';
  selectInvoiceType('Material');
}

function updateEngineersByWing(){
  var wing = document.getElementById('wingSelect').value;
  var aeeSel = document.getElementById('aeeSelect');
  if(!wing){ aeeSel.innerHTML='<option value="">â€” Select Wing first â€”</option>'; return; }

  var poNo = document.getElementById('poSelect').value;
  var po = PO_DATA.find(function(p){ return p.poNo===poNo; });
  var plantCode = po ? (po.plant||'5105') : '5105';

  // FIX #6: Check mapping for this vendor + plant combination
  var mappingKey = currentVendorId + '::' + plantCode;
  var mapping = poMappings[mappingKey];

  // Map wing selection to subArea
  var subAreaMap = {
    'Electrical': 'Engineering-Ele',
    'Civil': 'Engineering-Civ',
    'Telecom': 'Engineering-Ele'
  };
  var targetSubArea = subAreaMap[wing] || 'Engineering-Ele';
  var engSubGroups = ['EF','EE','ED','EC'];

  var engList = [];
  var isMapped = false;

  // FIX #6: If mapping exists, show ONLY assigned engineers for the selected wing (supports arrays)
  if(mapping){
    var rawIds = wing==='Electrical' ? mapping.elec : (wing==='Civil' ? mapping.civil : mapping.telecom);
    var assignedIds = rawIds ? (Array.isArray(rawIds) ? rawIds : [rawIds]) : [];
    assignedIds = assignedIds.filter(Boolean);
    if(assignedIds.length){
      engList = EMPLOYEES.filter(function(e){ return assignedIds.indexOf(String(e.id))>=0; });
      isMapped = true;
    }
  }

  // If no mapping or no assigned engineers found for this wing, show all engineers in that wing/subArea
  if(!engList.length){
    engList = EMPLOYEES.filter(function(e){
      return e.subArea === targetSubArea && engSubGroups.indexOf(e.subGroup) >= 0;
    });
  }

  // Fallback: if still empty, show all engineering staff
  if(!engList.length){
    engList = EMPLOYEES.filter(function(e){ return engSubGroups.indexOf(e.subGroup) >= 0; });
  }

  var subGroupLabel = {'EF':'SE','EE':'EE','ED':'DEE','EC':'AEE'};
  aeeSel.innerHTML = '<option value="">â€” Select Engineer â€”</option>';
  var rankOrder = {'EF':1,'EE':2,'ED':3,'EC':4};
  engList.sort(function(a,b){ return (rankOrder[a.subGroup]||5)-(rankOrder[b.subGroup]||5); });
  engList.forEach(function(e){
    var rank = subGroupLabel[e.subGroup]||e.subGroup;
    aeeSel.innerHTML += '<option value="'+e.id+'">['+rank+'] '+e.designation+' â€“ '+e.name+'</option>';
  });
}

function selectInvoiceType(type){
  selectedInvoiceType = type;
  // Sync dropdown if it exists
  var dd = document.getElementById('invoiceTypeDropdown');
  if(dd && dd.value !== type) dd.value = type;
  // Also sync old button elements if still present
  ['Service','Material','Retention','Penalty','Other','HR'].forEach(function(t){
    var el = document.getElementById('type'+t);
    if(el) el.classList.toggle('selected', t===type);
  });
  var isHR = type === 'HR';
  document.getElementById('hrFieldsSection').style.display = isHR ? '' : 'none';
  document.getElementById('retentionSummary').style.display = (type==='Retention'||isHR) ? '' : 'none';
  document.getElementById('checklistSection').style.display = '';
  document.getElementById('submitToSection').style.display = '';
  document.getElementById('submitBtn').style.display = '';
  // Show base amount section for Material and Service
  var amtSection = document.getElementById('invoiceAmtSection');
  if(amtSection) amtSection.style.display = (type==='Material'||type==='Service') ? '' : 'none';
  // Show labour cess only for Service
  var cessGrp = document.getElementById('labourCessGroup');
  if(cessGrp) cessGrp.style.display = type==='Service' ? '' : 'none';
  buildChecklist(type);
  updateGenId();
  if((type==='Retention'||isHR)) updateRetentionSummary();
}

function buildChecklist(type){
  var items = [];
  if(type === 'Service'){
    items = [
      {id:'svc1',label:'Service Tax Invoice',hasAmt:false},
    ];
  } else if(type === 'Material'){
    items = [
      {id:'mat1',label:'Material Tax Invoice',hasAmt:false},
      {id:'mat2',label:'Despatch Instructions',hasAmt:false},
      {id:'mat3',label:'Packing List',hasAmt:false},
      {id:'mat4',label:'Warranty / Guarantee',hasAmt:false},
      {id:'mat5',label:'Insurance',hasAmt:false},
      {id:'mat6',label:'Freight Receipt',hasAmt:false},
      {id:'mat7',label:'Test Certificates',hasAmt:false},
      {id:'mat8',label:'Lorry Receipt & Tax Invoice',hasAmt:false},
    ];
  } else if(type === 'HR'){
    items = [{id:'hr1',label:'Hand Receipt',hasAmt:false}];
  } else if(type === 'Retention'){
    items = [{id:'ret1',label:'Retention Release Document (PDF)',hasAmt:true}];
  } else if(type === 'Penalty'){
    items = [{id:'pen1',label:'Penalty Document (PDF)',hasAmt:true}];
  } else {
    items = [{id:'oth1',label:'Other Recovery Document (PDF)',hasAmt:true}];
  }
  var html = '';
  items.forEach(function(item){
    html += '<div class="checklist-item" id="ci-'+item.id+'">'+
      '<input type="checkbox" id="chk-'+item.id+'">'+
      '<label for="chk-'+item.id+'" style="flex:1">'+item.label+'</label>'+
      (item.hasAmt ? '<input type="number" class="checklist-amount" placeholder="Amount â‚¹" id="amt-'+item.id+'">' : '')+
      (item.hasAmt ? '<input type="text" class="checklist-text" placeholder="Remarks..." id="txt-'+item.id+'">' : '')+
      '<input type="file" id="file-'+item.id+'" accept=".pdf,application/pdf" style="display:none" onchange="handleFileUpload(this,\''+item.id+'\')">'+
      '<button class="btn btn-outline btn-xs" onclick="document.getElementById(\'file-'+item.id+'\').click()">â¬† Upload PDF</button>'+
      '<button class="btn btn-xs" style="background:var(--ap-red-light);color:var(--ap-red);border:none;" id="del-'+item.id+'" onclick="deleteUpload(\''+item.id+'\')" style="display:none">ðŸ—‘</button>'+
      '</div>';
  });
  document.getElementById('dynamicChecklist').innerHTML = html;
  uploadedDocs = {};
  refreshUploadedFilesList();
}

function updatePODetails(val){
  var banner = document.getElementById('poInfoBanner');
  if(!val){ banner.style.display='none'; updateGenId(); return; }
  var po = PO_DATA.find(function(p){ return p.poNo === val; });
  if(po){
    banner.style.display = 'block';
    banner.innerHTML = '<div class="alert alert-info">ðŸ“‹ <strong>'+po.poNo+'</strong> | '+po.workName+'<br>Scheme: '+po.schemeDesc+' | Type: '+po.purchDocType+'</div>';
  }
  updateGenId();
  if(selectedInvoiceType==='Retention'||selectedInvoiceType==='HR') updateRetentionSummary();
}

function updateRetentionSummary(){
  var poNo = document.getElementById('poSelect').value;
  var myMat = VMAT_DATA.filter(function(r){ return String(r.vendorId)===currentVendorId && r.poNo===poNo; });
  var mySvc = VSVC_DATA.filter(function(r){ return String(r.vendorId)===currentVendorId && r.poNo===poNo; });
  var totalRet = myMat.reduce(function(s,r){return s+r.retention;},0)+mySvc.reduce(function(s,r){return s+r.retention;},0);
  document.getElementById('retTotalRec').textContent = fmtAmt(totalRet);
  document.getElementById('retReleased').textContent = 'â‚¹0';
  document.getElementById('retBalance').textContent = fmtAmt(totalRet);
}

function updateGenId(){
  var poNo = document.getElementById('poSelect').value;
  var id = poNo ? generateBillId(poNo, selectedInvoiceType) : 'â€” Select PO & Type â€”';
  document.getElementById('genIdValue').textContent = id;
}

function calcGrossInvoice(){
  var base = parseFloat(document.getElementById('baseInvAmt').value)||0;
  var gstRate = parseFloat(document.getElementById('gstRateSelect').value)||0;
  var cessRate = 0;
  var cessEl = document.getElementById('labourCessSelect');
  if(cessEl && cessEl.style.display!=='none') cessRate = parseFloat(cessEl.value)||0;
  var breakdown = document.getElementById('taxBreakdown');
  if(!base || !gstRate){ if(breakdown) breakdown.style.display='none'; return; }
  var cessAmt = base * cessRate / 100;
  var gstBase = base + cessAmt; // GST applied on (base + labour cess) for service
  var gstAmt = gstBase * gstRate / 100;
  var gross = base + cessAmt + gstAmt;
  document.getElementById('tbBase').textContent = fmtAmt(base);
  document.getElementById('tbGSTLabel').textContent = 'GST ('+gstRate+'%):';
  document.getElementById('tbGST').textContent = fmtAmt(gstAmt);
  var tbGross = document.getElementById('tbGross');
  tbGross.textContent = fmtAmt(gross);
  tbGross.setAttribute('data-raw', gross.toFixed(2));
  var cessRow = document.getElementById('tbCessRow');
  var cessLbl = document.getElementById('tbCessLabel');
  if(cessRate && cessRow){
    cessRow.style.display='flex';
    if(cessLbl) cessLbl.textContent = 'Labour Cess ('+cessRate+'%):';
    document.getElementById('tbCess').textContent = fmtAmt(cessAmt);
  } else if(cessRow){
    cessRow.style.display='none';
  }
  if(breakdown) breakdown.style.display='block';
}



function handleFileUpload(input, itemId){
  var file = input.files[0];
  if(!file) return;
  if(file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')){
    showToast('âš ï¸ Only PDF files are accepted.',true); input.value=''; return;
  }
  if(file.size > 20*1024*1024){ showToast('âš ï¸ File size exceeds 20 MB.',true); input.value=''; return; }
  // Store blob URL so document can actually be viewed
  var blobUrl = URL.createObjectURL(file);
  uploadedDocs[itemId] = {name:file.name, size:file.size, blobUrl:blobUrl};
  var btn = document.querySelector('#ci-'+itemId+' .btn-outline');
  if(btn){ btn.textContent = 'âœ“ '+file.name.substring(0,12)+'â€¦'; btn.style.background='var(--ap-green-light)'; btn.style.color='var(--ap-green)'; btn.style.borderColor='var(--ap-green)'; }
  var ci = document.getElementById('ci-'+itemId);
  if(ci){ ci.style.borderColor='var(--ap-green)'; ci.style.background='#f0fcf6'; }
  var chk = document.getElementById('chk-'+itemId);
  if(chk) chk.checked = true;
  var delBtn = document.getElementById('del-'+itemId);
  if(delBtn) delBtn.style.display='';
  refreshUploadedFilesList();
  showToast('âœ… '+file.name+' uploaded!');
}

function deleteUpload(itemId){
  delete uploadedDocs[itemId];
  var btn = document.querySelector('#ci-'+itemId+' .btn-outline');
  if(btn){ btn.textContent='â¬† Upload PDF'; btn.style.background=''; btn.style.color=''; btn.style.borderColor=''; }
  var ci = document.getElementById('ci-'+itemId);
  if(ci){ ci.style.borderColor=''; ci.style.background=''; }
  var chk = document.getElementById('chk-'+itemId);
  if(chk) chk.checked=false;
  var delBtn = document.getElementById('del-'+itemId);
  if(delBtn) delBtn.style.display='none';
  var inp = document.getElementById('file-'+itemId);
  if(inp) inp.value='';
  refreshUploadedFilesList();
}

function refreshUploadedFilesList(){
  var container = document.getElementById('uploadedFilesList');
  var inner = document.getElementById('uploadedFilesInner');
  if(!container||!inner) return;
  var keys = Object.keys(uploadedDocs);
  if(!keys.length){ container.style.display='none'; return; }
  container.style.display='block';
  inner.innerHTML = keys.map(function(k){
    var doc = uploadedDocs[k];
    var kb = (doc.size/1024).toFixed(1);
    return '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:#f0fcf6;border:1px solid var(--ap-green);border-radius:6px;font-size:12px;">'+
      'ðŸ“„ <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">'+doc.name+'</span>'+
      '<span style="color:var(--ap-gray-400);">'+kb+' KB</span>'+
      '<span style="color:var(--ap-green);font-weight:700;">âœ“ PDF</span>'+
      (doc.blobUrl ? '<button onclick="viewDocByUrl(\''+doc.blobUrl+'\',\''+doc.name+'\')" style="background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);color:var(--ap-blue-mid);border-radius:4px;padding:2px 8px;cursor:pointer;font-size:11px;font-weight:600;">ðŸ‘ View</button>' : '')+
      '<button onclick="deleteUpload(\''+k+'\')" style="background:none;border:none;color:var(--ap-red);cursor:pointer;font-size:16px;line-height:1;margin-left:2px;">Ã—</button></div>';
  }).join('');
}

function viewDocByUrl(blobUrl, name){
  if(!blobUrl){ showToast('âš ï¸ Document not available for viewing.',true); return; }
  var w = window.open('', '_blank');
  w.document.write('<html><head><title>'+name+'</title></head><body style="margin:0;padding:0;background:#333;">'+
    '<div style="background:#444;color:#fff;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;">'+
    '<span style="font-size:14px;font-weight:600;">ðŸ“„ '+name+'</span>'+
    '<button onclick="window.close()" style="background:#666;border:none;color:#fff;padding:4px 12px;border-radius:4px;cursor:pointer;">âœ• Close</button></div>'+
    '<iframe src="'+blobUrl+'" style="width:100%;height:calc(100vh - 44px);border:none;"></iframe>'+
    '</body></html>');
  w.document.close();
}

function submitInvoice(){
  var poNo = document.getElementById('poSelect').value;
  if(!poNo){ showToast('âš ï¸ Please select a PO.',true); return; }
  var eInv = document.getElementById('eInvNo').value.trim();
  if(!eInv){ showToast('âš ï¸ Please enter an e-Invoice number.',true); return; }
  // FIX #4: Invoice amount is mandatory for Material and Service types
  if(selectedInvoiceType==='Material'||selectedInvoiceType==='Service'){
    var baseAmt = parseFloat((document.getElementById('baseInvAmt')||{}).value||'0')||0;
    if(!baseAmt){ showToast('âš ï¸ Invoice amount is mandatory. Please enter the Base Invoice Amount.',true); return; }
    var gstRate = (document.getElementById('gstRateSelect')||{}).value||'';
    if(!gstRate){ showToast('âš ï¸ Please select a GST rate.',true); return; }
  }
  var wing = document.getElementById('wingSelect') ? document.getElementById('wingSelect').value : '';
  if(!wing){ showToast('âš ï¸ Please select a wing.',true); return; }
  var aeeVal = document.getElementById('aeeSelect').value;
  if(!aeeVal){ showToast('âš ï¸ Please select an engineer.',true); return; }
  var aeeEmp = EMPLOYEES.find(function(e){ return String(e.id)===aeeVal; });
  var pendingWith = aeeEmp ? aeeEmp.name : aeeVal;
  var pendingDesig = aeeEmp ? aeeEmp.designation : '';
  var billId = generateBillId(poNo, selectedInvoiceType);
  var key = poNo+'_'+selectedInvoiceType;
  invoiceSerial[key] = (invoiceSerial[key]||1) + 1;
  var grossAmt = parseFloat(document.getElementById('tbGross')?document.getElementById('tbGross').getAttribute('data-raw')||0:0)||0;
  submittedBills.push({
    billId: billId, eInvNo: eInv, poNo: poNo, type: selectedInvoiceType,
    vendorId: currentVendorId, date: new Date().toLocaleDateString('en-IN'),
    status: 'Submitted', docs: Object.assign({},uploadedDocs),
    grossAmt: grossAmt, pendingWith: pendingWith, pendingDesig: pendingDesig,
    wing: wing,
    log: [
      {date: new Date().toLocaleDateString('en-IN'), action:'Bill Submitted by Vendor', by: VENDOR_MAP[currentVendorId]||currentVendorId, status:'Submitted'},
      {date: new Date().toLocaleDateString('en-IN'), action:'Forwarded to '+pendingDesig+' '+pendingWith+' ('+wing+' Wing)', by:'System', status:'Pending with AEE'}
    ]
  });
  showToast('âœ… Bill submitted! ID: '+billId);
  // Refresh dashboard to show newly submitted bill
  initVendorDashboard();
  updatePendingCounts();
  saveBillsToStorage();
  uploadedDocs = {};
  refreshUploadedFilesList();
  buildChecklist(selectedInvoiceType);
  document.getElementById('eInvNo').value = '';
  document.getElementById('poSelect').value = '';
  document.getElementById('poInfoBanner').style.display = 'none';
  if(document.getElementById('baseInvAmt')) document.getElementById('baseInvAmt').value = '';
  if(document.getElementById('taxBreakdown')) document.getElementById('taxBreakdown').style.display = 'none';
  // Update dashboard notification badge
  document.querySelector('#vendorApp .topbar .notif-btn') && (document.querySelector('#vendorApp .topbar .notif-btn').innerHTML='ðŸ””<div class="notif-badge">'+submittedBills.filter(function(b){return b.vendorId===currentVendorId;}).length+'</div>');
  updateGenId();
  // Navigate to My Bills after short delay
  setTimeout(function(){
    vShowPage('vMyBills', document.querySelector('#vendorApp .nav-item:nth-child(3)'));
    renderMyBillsTable();
  }, 1200);
}

function saveDraft(){
  var poNo = document.getElementById('poSelect').value;
  if(poNo) updateGenId();
  showToast('ðŸ’¾ Draft saved. System ID: ' + (document.getElementById('genIdValue').textContent));
}

// ===== MY BILLS =====
function filterMyBills(type, btn){
  billTypeFilter = type;
  document.querySelectorAll('#vMyBills .tab-btn').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  renderMyBillsTable();
}

function renderMyBillsTable(){
  // Only show bills that the vendor has submitted (not master data)
  var all = submittedBills.filter(function(b){ return b.vendorId===currentVendorId; });
  var srch = (document.getElementById('billSearchInput')||{}).value||'';
  var stFilter = (document.getElementById('billStatusFilter')||{}).value||'';
  if(billTypeFilter==='Invoice') all = all.filter(function(r){ return r.type!=='HR'; });
  if(billTypeFilter==='HR') all = all.filter(function(r){ return r.type==='HR'; });
  if(srch) all = all.filter(function(r){ return JSON.stringify(r).toLowerCase().includes(srch.toLowerCase()); });
  if(stFilter) all = all.filter(function(r){ return r.status===stFilter; });

  var statusBadge = {
    'Submitted':'badge-submitted','Pending with AEE':'badge-processing','Under Verification':'badge-processing',
    'Approved':'badge-approved','Form13 Updated':'badge-form13','Form14 Updated':'badge-form14',
    'Invoice Posted':'badge-processing','LOA Created':'badge-form14','LOA Approved':'badge-approved','With HQ Accounts':'badge-processing',
    'Paid':'badge-paid','Rejected':'badge-rejected','Sent Back by Accounts':'badge-rejected','Sent Back by HQ':'badge-rejected'
  };

  var rows = all.map(function(b){
    var st = b.status||'Submitted';
    var pendingInfo = '';
    if(b.pendingWith) pendingInfo = '<br><span style="font-size:10px;color:var(--ap-gray-400);">With: <b>'+b.pendingWith+'</b>'+(b.pendingDesig?' ('+b.pendingDesig+')':'')+'</span>';

    // GR / Form14 info column
    var grInfo = 'â€”';
    if(b.selectedGRs && b.selectedGRs.length){
      grInfo = b.selectedGRs.map(function(g){
        return '<span style="font-size:11px;color:var(--ap-blue-mid);">GR: '+g.grDocNo+(g.grYear?' ('+g.grYear+')':'')+'</span>';
      }).join('<br>');
    } else if(b.selectedForm14 && b.selectedForm14.seNo){
      grInfo = '<span style="font-size:11px;color:var(--ap-green);">SE No: '+b.selectedForm14.seNo+'</span>';
    }

    // Recoveries info
    var recInfo = 'â€”';
    if(b.engineerRecoveries){
      var rec = b.engineerRecoveries;
      var totalRec = (rec.retention||0)+(rec.priceVariation||0)+(rec.penalty||0)+(rec.seigniorage||0)+(rec.others||[]).reduce(function(s,o){return s+o.amount;},0);
      recInfo = '<span style="font-size:11px;color:var(--ap-red);">'+fmtAmt(totalRec)+'</span>';
    }

    // Accounting doc and LOA from master data
    var acctDocs = [], loaNos = [];
    if(b.selectedGRs && b.selectedGRs.length){
      b.selectedGRs.forEach(function(gr){
        var rec = VMAT_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&r.grDocNo===gr.grDocNo; });
        if(rec){
          if(rec.accountingDocNo&&acctDocs.indexOf(rec.accountingDocNo)<0) acctDocs.push(rec.accountingDocNo+(rec.accountingYear?' ('+rec.accountingYear+')':''));
          if(rec.loaNo&&loaNos.indexOf(rec.loaNo)<0) loaNos.push(rec.loaNo);
        }
      });
    } else if(b.selectedForm14){
      var srec = VSVC_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&String(r.seNo)===String(b.selectedForm14.seNo); });
      if(srec){ if(srec.accountingDocNo) acctDocs.push(srec.accountingDocNo+(srec.accountingYear?' ('+srec.accountingYear+')':'')); if(srec.loaNo) loaNos.push(srec.loaNo); }
    }
    if(b.accountingDocNo && acctDocs.indexOf(b.accountingDocNo)<0) acctDocs.unshift(b.accountingDocNo);
    if(b.loaNo && loaNos.indexOf(b.loaNo)<0) loaNos.unshift(b.loaNo);
    var acctDocStr = acctDocs.length ? acctDocs.join('<br>') : 'â€”';
    var loaStr     = loaNos.length   ? loaNos.join('<br>')   : 'â€”';

    var docCount = Object.keys(b.docs||{}).length;

    // Gross amt per accounting document, recoveries, net paid, payment date from master data
    var grossPosted = 0, totalRec = 0, netPaid = 0, payDateMaster = 'â€”';
    var recBreakup = {};
    if(b.selectedGRs && b.selectedGRs.length){
      b.selectedGRs.forEach(function(gr){
        var rec = VMAT_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&r.grDocNo===gr.grDocNo; });
        if(rec){
          grossPosted += rec.grossAmt||0;
          recBreakup['IT & Bank Charges'] = (recBreakup['IT & Bank Charges']||0)+(rec.itBankCharges||0);
          recBreakup['Penalty'] = (recBreakup['Penalty']||0)+(rec.penalty||0);
          recBreakup['Retention'] = (recBreakup['Retention']||0)+(rec.retention||0);
          recBreakup['Other Recovery'] = (recBreakup['Other Recovery']||0)+(rec.otherRecovery||0);
          totalRec += (rec.itBankCharges||0)+(rec.penalty||0)+(rec.retention||0)+(rec.otherRecovery||0);
          netPaid += rec.amtPaid||0;
          if(payDateMaster==='â€”' && rec.paymentDate) payDateMaster = rec.paymentDate;
        }
      });
    } else if(b.selectedForm14 && b.selectedForm14.seNo){
      var srec2 = VSVC_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&String(r.seNo)===String(b.selectedForm14.seNo); });
      if(srec2){
        grossPosted = srec2.grossAmt||0;
        recBreakup['IT & Bank Charges'] = srec2.itBankCharges||0;
        recBreakup['Penalty'] = srec2.penalty||0;
        recBreakup['Retention'] = srec2.retention||0;
        recBreakup['Other Recovery'] = srec2.otherRecovery||0;
        totalRec = (srec2.itBankCharges||0)+(srec2.penalty||0)+(srec2.retention||0)+(srec2.otherRecovery||0);
        netPaid = srec2.amtPaid||0;
        payDateMaster = srec2.paymentDate||'â€”';
      }
    }
    var recBreakupStr = Object.keys(recBreakup).filter(function(k){ return recBreakup[k]>0; })
      .map(function(k){ return k+': â‚¹'+fmtAmt(recBreakup[k]); }).join('\\n');
    var recCell = totalRec>0
      ? '<span style="font-size:11px;color:var(--ap-red);cursor:pointer;" title="'+recBreakupStr+'" onclick="showMyBillsRecBreakup(\''+b.billId+'\')">'+fmtAmt(totalRec)+' ðŸ”</span>'
      : (recInfo!=='â€”'?recInfo:'â€”');

    return '<tr>'+
      '<td style="font-size:11px;font-weight:600;">'+b.vendorId+'</td>'+
      '<td style="font-size:11px;">'+(VENDOR_MAP[b.vendorId]||b.vendorId)+'</td>'+
      '<td><span class="bill-id">'+b.billId+'</span></td>'+
      '<td style="font-size:11px;">'+(b.eInvNo||'â€”')+'</td>'+
      '<td>'+b.poNo+'</td>'+
      '<td class="amount">'+(b.grossAmt?fmtAmt(b.grossAmt):'â€”')+'</td>'+
      '<td><span class="badge '+(statusBadge[st]||'badge-submitted')+'">'+st+'</span>'+pendingInfo+'</td>'+
      '<td style="text-align:center;white-space:nowrap;">'+
        '<button class="btn btn-primary btn-xs" onclick="showBillDetails(\''+b.billId+'\')">ðŸ“‹ Details</button>'+
        (docCount>0?'<button class="btn btn-outline btn-xs" style="margin-left:4px;" onclick="viewBillDocs(\''+b.billId+'\')">ðŸ“Ž ('+docCount+')</button>':'')+
        (st==='Rejected'||st==='Sent Back by Accounts'||st==='Sent Back by HQ'?'<button class="btn btn-xs" style="margin-left:4px;background:var(--ap-orange-light);color:var(--ap-orange);border:1px solid var(--ap-orange);" onclick="editRejectedBill(\''+b.billId+'\')">âœ Edit & Re-submit</button>':'')+
      '</td>'+
      '</tr>';
  }).join('');

  document.getElementById('myBillsTbody').innerHTML =
    '<table class="data-table"><thead><tr>'+
    '<th>Vendor ID</th><th>Vendor Name</th><th>Invoice ID</th><th>e-Invoice No.</th><th>PO No.</th>'+
    '<th>Gross Invoice Amt (â‚¹)</th><th>Approval Status</th><th>Actions</th>'+
    '</tr></thead><tbody>'+
    (rows||'<tr><td colspan="8" style="text-align:center;color:var(--ap-gray-400);padding:2rem;">No submitted bills found.</td></tr>')+
    '</tbody></table>';
}

// FIX 2: Edit rejected bill - open a modal to fix amount/taxes/docs WITHOUT deleting existing data
function editRejectedBill(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill){ showToast('Bill not found.',true); return; }

  // Build or reuse edit modal
  var modal = document.getElementById('editRejectedModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'editRejectedModal';
    modal.innerHTML =
      '<div class="modal" style="max-width:680px;">'+
        '<div class="modal-header"><h3 id="editRejTitle">Edit Rejected Invoice</h3><button class="modal-close" onclick="closeModal(\'editRejectedModal\')">âœ•</button></div>'+
        '<div class="modal-body" id="editRejBody" style="padding:1.25rem 1.5rem;"></div>'+
        '<div class="modal-footer">'+
          '<button class="btn btn-outline" onclick="closeModal(\'editRejectedModal\')">Cancel</button>'+
          '<button class="btn btn-success" onclick="saveEditedRejectedBill()">âœ… Save &amp; Re-submit</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){ if(e.target===modal) modal.classList.remove('open'); });
  }

  document.getElementById('editRejTitle').textContent = 'Edit Invoice â€“ '+billId;

  // Build rejection reason banner
  var lastRejLog = (bill.log||[]).slice().reverse().find(function(l){ return l.status==='Rejected'||l.status==='Sent Back'||l.status==='Sent Back by Accounts'||l.status==='Sent Back by HQ'; });
  var rejBanner = lastRejLog
    ? '<div class="alert alert-danger" style="margin-bottom:1rem;">âŒ <b>Rejection Reason:</b> '+(lastRejLog.remarks||lastRejLog.action)+'<br><span style="font-size:11px;color:var(--ap-gray-600);">By: '+lastRejLog.by+' on '+lastRejLog.date+'</span></div>'
    : '';

  // Current docs list with delete + re-upload per doc
  var existingDocs = bill.docs || {};
  var docKeys = Object.keys(existingDocs);
  var docsHtml = '<div style="margin-bottom:1rem;">';
  docsHtml += '<div style="font-size:12px;font-weight:700;color:var(--ap-gray-600);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">ðŸ“Ž Uploaded Documents</div>';
  if(docKeys.length){
    docKeys.forEach(function(k){
      var doc = existingDocs[k];
      docsHtml += '<div id="docRow_'+k+'" style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--ap-gray-200);border-radius:6px;margin-bottom:6px;background:#fff;">'+
        '<span style="font-size:18px;">ðŸ“„</span>'+
        '<span style="flex:1;font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+doc.name+'</span>'+
        '<span style="font-size:11px;color:var(--ap-gray-400);">'+((doc.size/1024).toFixed(1))+' KB</span>'+
        (doc.blobUrl?'<button onclick="viewDocByUrl(\''+doc.blobUrl+'\',\''+doc.name+'\')" style="background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);color:var(--ap-blue-mid);border-radius:4px;padding:2px 8px;cursor:pointer;font-size:11px;">ðŸ‘ View</button>':'')+
        '<label style="background:var(--ap-gold-light);border:1px solid var(--ap-gold);color:#7a4f00;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:11px;">ðŸ”„ Replace<input type="file" accept=".pdf" style="display:none;" onchange="replaceDocInEdit(\''+k+'\',this,\''+billId+'\')"></label>'+
        '<button onclick="deleteDocInEdit(\''+k+'\',\''+billId+'\')" style="background:var(--ap-red-light);border:none;color:var(--ap-red);border-radius:4px;padding:2px 8px;cursor:pointer;font-size:11px;">ðŸ—‘ Delete</button>'+
      '</div>';
    });
  } else {
    docsHtml += '<div style="padding:10px 14px;border:1px dashed var(--ap-gray-200);border-radius:6px;font-size:12px;color:var(--ap-gray-400);">No documents uploaded yet.</div>';
  }
  docsHtml += '<div style="margin-top:8px;"><label style="background:var(--ap-green-light);border:1px solid var(--ap-green);color:var(--ap-green);border-radius:4px;padding:5px 14px;cursor:pointer;font-size:12px;font-weight:600;">âž• Add New Document<input type="file" accept=".pdf" multiple style="display:none;" onchange="addDocsInEdit(this,\''+billId+'\')"></label></div>';
  docsHtml += '</div>';

  // Amount & GST section
  var curBase = bill.baseAmt || '';
  var curGST  = bill.gstRate || '';
  var curGross = bill.grossAmt || 0;
  var amtHtml = '<div style="border:1px solid var(--ap-gray-200);border-radius:8px;padding:1rem;margin-bottom:1rem;">'+
    '<div style="font-size:12px;font-weight:700;color:var(--ap-blue);margin-bottom:0.75rem;">ðŸ’° Invoice Amount &amp; Tax</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">'+
      '<div class="form-group"><label>Base Invoice Amount (â‚¹)</label>'+
        '<input type="number" id="editBaseAmt" value="'+curBase+'" placeholder="0.00" oninput="recalcEditGross()" style="width:100%;padding:8px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:13px;"></div>'+
      '<div class="form-group"><label>GST Rate</label>'+
        '<select id="editGSTRate" onchange="recalcEditGross()" style="width:100%;padding:8px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:13px;">'+
          '<option value="">â€” Select â€”</option>'+
          ['5','12','18','28'].map(function(r){ return '<option value="'+r+'"'+(curGST==r?' selected':'')+'>'+r+'%</option>'; }).join('')+
        '</select></div>'+
      '<div class="form-group"><label>Labour Cess (Service only)</label>'+
        '<select id="editCessRate" onchange="recalcEditGross()" style="width:100%;padding:8px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:13px;">'+
          '<option value="">â€” None â€”</option><option value="1">1%</option><option value="2">2%</option>'+
        '</select></div>'+
    '</div>'+
    '<div id="editTaxBreakdown" style="margin-top:0.75rem;background:var(--ap-gray-50);border:1px solid var(--ap-gray-200);border-radius:6px;padding:10px 14px;font-size:13px;display:none;">'+
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:var(--ap-gray-600);">Base Amount:</span><span id="etBase" style="font-weight:600;">â‚¹0</span></div>'+
      '<div id="etCessRow" style="display:none;justify-content:space-between;margin-bottom:4px;"><span style="color:var(--ap-gray-600);">Labour Cess:</span><span id="etCess" style="font-weight:600;">â‚¹0</span></div>'+
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:var(--ap-gray-600);" id="etGSTLbl">GST:</span><span id="etGST" style="font-weight:600;">â‚¹0</span></div>'+
      '<div style="height:1px;background:var(--ap-gray-200);margin:5px 0;"></div>'+
      '<div style="display:flex;justify-content:space-between;"><span style="font-weight:700;color:var(--ap-blue);">Gross Invoice Value:</span><span id="etGross" style="font-weight:700;color:var(--ap-blue);font-size:15px;font-family:\'Rajdhani\',sans-serif;">â‚¹0</span></div>'+
    '</div>'+
  '</div>';

  // e-Invoice number edit
  var eInvHtml = '<div class="form-group" style="margin-bottom:1rem;">'+
    '<label>e-Invoice Number</label>'+
    '<input type="text" id="editEInvNo" value="'+(bill.eInvNo||'')+'" style="width:100%;padding:8px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:13px;">'+
  '</div>';

  document.getElementById('editRejBody').innerHTML =
    rejBanner +
    '<input type="hidden" id="editBillId" value="'+billId+'">' +
    eInvHtml +
    amtHtml +
    docsHtml;

  modal.classList.add('open');
  // Trigger recalc if values exist
  if(curBase && curGST) recalcEditGross();
}

function recalcEditGross(){
  var base = parseFloat(document.getElementById('editBaseAmt').value)||0;
  var gst  = parseFloat(document.getElementById('editGSTRate').value)||0;
  var cess = parseFloat(document.getElementById('editCessRate').value)||0;
  var bd = document.getElementById('editTaxBreakdown');
  if(!base||!gst){ if(bd) bd.style.display='none'; return; }
  var cessAmt = base*cess/100;
  var gstAmt  = (base+cessAmt)*gst/100;
  var gross   = base+cessAmt+gstAmt;
  document.getElementById('etBase').textContent  = fmtAmt(base);
  document.getElementById('etGSTLbl').textContent = 'GST ('+gst+'%):';
  document.getElementById('etGST').textContent   = fmtAmt(gstAmt);
  var grossEl = document.getElementById('etGross');
  grossEl.textContent = fmtAmt(gross);
  grossEl.setAttribute('data-raw', gross.toFixed(2));
  var cr = document.getElementById('etCessRow');
  if(cess){ cr.style.display='flex'; document.getElementById('etCess').textContent=fmtAmt(cessAmt); } else { cr.style.display='none'; }
  if(bd) bd.style.display='block';
}

function replaceDocInEdit(docKey, input, billId){
  var file = input.files[0];
  if(!file) return;
  if(!file.name.toLowerCase().endsWith('.pdf')){ showToast('âš ï¸ Only PDF accepted.',true); return; }
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(bill){ bill.docs[docKey] = {name:file.name, size:file.size, blobUrl:URL.createObjectURL(file)}; }
  showToast('âœ… Document replaced: '+file.name);
  editRejectedBill(billId); // refresh modal
}

function deleteDocInEdit(docKey, billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(bill && bill.docs){ delete bill.docs[docKey]; }
  var row = document.getElementById('docRow_'+docKey);
  if(row) row.remove();
  showToast('Document removed.');
}

function addDocsInEdit(input, billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var files = Array.from(input.files||[]);
  files.forEach(function(file){
    if(!file.name.toLowerCase().endsWith('.pdf')){ showToast('âš ï¸ Only PDF files accepted.',true); return; }
    var key = 'added_'+Date.now()+'_'+Math.random().toString(36).slice(2,6);
    bill.docs[key] = {name:file.name, size:file.size, blobUrl:URL.createObjectURL(file)};
  });
  showToast('âœ… '+files.length+' document(s) added.');
  editRejectedBill(billId); // refresh modal to show new docs
}

function saveEditedRejectedBill(){
  var billId = (document.getElementById('editBillId')||{}).value||'';
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill){ showToast('Bill not found.',true); return; }

  // Update e-Invoice number
  var eInv = (document.getElementById('editEInvNo')||{}).value||'';
  if(eInv) bill.eInvNo = eInv;

  // Update amount if changed
  var base = parseFloat((document.getElementById('editBaseAmt')||{}).value)||0;
  var gst  = parseFloat((document.getElementById('editGSTRate')||{}).value)||0;
  var cess = parseFloat((document.getElementById('editCessRate')||{}).value)||0;
  if(base && gst){
    var cessAmt = base*cess/100;
    var gstAmt  = (base+cessAmt)*gst/100;
    var gross   = base+cessAmt+gstAmt;
    bill.baseAmt  = base;
    bill.gstRate  = gst;
    bill.grossAmt = gross;
  }

  // Mark as re-submitted
  bill.status = 'Submitted';
  bill.pendingWith = bill.pendingWith||null;
  bill.log = bill.log||[];
  bill.log.push({date:new Date().toLocaleDateString('en-IN'),
    action:'Invoice edited and re-submitted by Vendor'+(base?' (Amount updated: '+fmtAmt(bill.grossAmt)+')':''),
    by: VENDOR_MAP[bill.vendorId]||bill.vendorId, status:'Submitted'});

  closeModal('editRejectedModal');
  saveBillsToStorage();
  updatePendingCounts();
  renderMyBillsTable();
  renderInboxTab('inboxPending');
  showToast('âœ… Invoice re-submitted: '+billId);
}

// FIX 4: Recovery breakup - clean modal with table instead of alert()
function buildRecoveryTableHtml(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return '<p style="color:var(--ap-gray-400);">No data.</p>';

  function recTable(docLabel, r){
    if(!r) return '';
    var totalRec = (r.itBankCharges||0)+(r.penalty||0)+(r.retention||0)+(r.otherRecovery||0);
    var net = (r.grossAmt||0) - totalRec;
    var rows = [
      {label:'Gross Invoice Amount', val: r.grossAmt||0, bold:false, color:'var(--ap-blue)'},
      {label:'IT & Bank Charges', val: r.itBankCharges||0, bold:false, color:'var(--ap-red)'},
      {label:'Penalty', val: r.penalty||0, bold:false, color:'var(--ap-red)'},
      {label:'Retention', val: r.retention||0, bold:false, color:'var(--ap-red)'},
      {label:'Other Recovery', val: r.otherRecovery||0, bold:false, color:'var(--ap-red)'},
      {label:'Total Recoveries', val: totalRec, bold:true, color:'var(--ap-red)', divider:true},
      {label:'Net Amount Paid', val: net, bold:true, color:'var(--ap-green)', highlight:true},
    ];
    var html = '<div style="margin-bottom:1.25rem;">';
    html += '<div style="font-size:12px;font-weight:700;color:var(--ap-blue);margin-bottom:6px;padding:5px 10px;background:var(--ap-blue-light);border-radius:4px;">ðŸ“‹ '+docLabel+'</div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
    rows.forEach(function(row){
      if(!row.val && !row.highlight && !row.bold) return; // skip zero rows
      html += '<tr style="'+(row.highlight?'background:var(--ap-green-light);':'')+(row.divider?'border-top:2px solid var(--ap-gray-200);':'')+'">';
      html += '<td style="padding:7px 12px;color:var(--ap-gray-700);font-weight:'+(row.bold?'700':'500')+';">'+row.label+'</td>';
      html += '<td style="padding:7px 12px;text-align:right;font-weight:'+(row.bold?'700':'500')+';color:'+row.color+';font-family:\'Rajdhani\',sans-serif;font-size:'+(row.bold?'15':'14')+'px;">'+fmtAmt(row.val)+'</td>';
      html += '</tr>';
    });
    html += '</table></div>';
    return html;
  }

  var html = '';
  if(bill.selectedGRs && bill.selectedGRs.length){
    bill.selectedGRs.forEach(function(gr){
      var rec = VMAT_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&r.grDocNo===gr.grDocNo; });
      if(rec) html += recTable('GR No: '+gr.grDocNo+(gr.grYear?' ('+gr.grYear+')':''), rec);
    });
  } else if(bill.selectedForm14 && bill.selectedForm14.seNo){
    var srec = VSVC_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&String(r.seNo)===String(bill.selectedForm14.seNo); });
    if(srec) html += recTable('SE No: '+bill.selectedForm14.seNo+(srec.seYear?' ('+srec.seYear+')':''), srec);
  }
  return html || '<p style="color:var(--ap-gray-400);padding:1rem 0;">No master data recoveries linked yet.</p>';
}

function showRecoveryModal(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var modal = document.getElementById('recoveryModal');
  if(!modal){
    modal = document.createElement('div');
    modal.className='modal-overlay'; modal.id='recoveryModal';
    modal.innerHTML='<div class="modal" style="max-width:580px;">'+
      '<div class="modal-header"><h3 id="recModalTitle">Recovery Statement</h3><button class="modal-close" onclick="closeModal(\'recoveryModal\')">âœ•</button></div>'+
      '<div class="modal-body" id="recModalBody" style="padding:1.25rem 1.5rem;"></div>'+
      '<div class="modal-footer"><button class="btn btn-outline" onclick="closeModal(\'recoveryModal\')">Close</button></div>'+
    '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click',function(e){if(e.target===modal)modal.classList.remove('open');});
  }
  document.getElementById('recModalTitle').textContent = 'Recovery Statement â€“ '+billId;
  document.getElementById('recModalBody').innerHTML = buildRecoveryTableHtml(billId);
  modal.classList.add('open');
}

function showMyBillsRecBreakup(billId){ showRecoveryModal(billId); }
function showAllBillsRecBreakup(billId){ showRecoveryModal(billId); }

function showBillDetails(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;

  // Get accounting docs and LOA from master data
  var acctDocs=[], loaNos=[], amtPaid=0, payDate='';
  if(bill.selectedGRs && bill.selectedGRs.length){
    bill.selectedGRs.forEach(function(gr){
      var rec = VMAT_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&r.grDocNo===gr.grDocNo; });
      if(rec){
        if(rec.accountingDocNo&&acctDocs.indexOf(rec.accountingDocNo)<0) acctDocs.push(rec.accountingDocNo);
        if(rec.loaNo&&loaNos.indexOf(rec.loaNo)<0) loaNos.push(rec.loaNo);
        amtPaid += rec.amtPaid||0; if(!payDate&&rec.paymentDate) payDate=rec.paymentDate;
      }
    });
  } else if(bill.selectedForm14){
    var srec = VSVC_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&String(r.seNo)===String(bill.selectedForm14.seNo); });
    if(srec){ if(srec.accountingDocNo) acctDocs.push(srec.accountingDocNo); if(srec.loaNo) loaNos.push(srec.loaNo); amtPaid=srec.amtPaid||0; payDate=srec.paymentDate||''; }
  }
  if(bill.accountingDocNo&&acctDocs.indexOf(bill.accountingDocNo)<0) acctDocs.unshift(bill.accountingDocNo);
  if(bill.loaNo&&loaNos.indexOf(bill.loaNo)<0) loaNos.unshift(bill.loaNo);

  var html = '';

  // â”€â”€ 1. Bill Summary â”€â”€
  html += '<div style="background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">';
  html += '<div><span style="color:var(--ap-gray-600);">Bill ID</span><br><b>'+bill.billId+'</b></div>';
  html += '<div><span style="color:var(--ap-gray-600);">e-Invoice No.</span><br><b>'+(bill.eInvNo||'â€”')+'</b></div>';
  html += '<div><span style="color:var(--ap-gray-600);">Date</span><br><b>'+bill.date+'</b></div>';
  html += '<div><span style="color:var(--ap-gray-600);">Vendor</span><br><b>'+(VENDOR_MAP[bill.vendorId]||bill.vendorId)+'</b></div>';
  html += '<div><span style="color:var(--ap-gray-600);">PO No.</span><br><b>'+bill.poNo+'</b></div>';
  html += '<div><span style="color:var(--ap-gray-600);">Type</span><br><b>'+bill.type+'</b></div>';
  html += '<div><span style="color:var(--ap-gray-600);">Gross Amount</span><br><b>'+fmtAmt(bill.grossAmt||0)+'</b></div>';
  if(bill.netAmt && bill.netAmt !== bill.grossAmt){
    html += '<div><span style="color:var(--ap-gray-600);">Net (after proposed rec.)</span><br><b style="color:var(--ap-orange);">'+fmtAmt(bill.netAmt||0)+'</b></div>';
  }
  if(bill.status==='Paid'&&(bill.amtPaid||amtPaid)){
    html += '<div><span style="color:var(--ap-gray-600);">Net Amount Paid</span><br><b style="color:var(--ap-green);font-size:14px;">'+fmtAmt(bill.amtPaid||amtPaid)+'</b></div>';
  }
  html += '<div><span style="color:var(--ap-gray-600);">Status</span><br><span class="badge badge-'+(bill.status==='Paid'?'paid':bill.status==='Rejected'?'rejected':'submitted')+'">'+bill.status+'</span></div>';
  html += '</div></div>';

  // â”€â”€ 2. GR / SE Document Details (stage-aware) â”€â”€
  var invoicePosted = ['Invoice Posted','LOA Created','LOA Approved','With HQ Accounts','Paid'].indexOf(bill.status)>=0;
  var loaGenerated  = ['LOA Created','LOA Approved','With HQ Accounts','Paid'].indexOf(bill.status)>=0;
  var isPaid        = bill.status==='Paid';

  if(bill.selectedGRs && bill.selectedGRs.length){
    html += '<div style="background:#fff;border:1px solid var(--ap-blue-mid);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
    html += '<div style="font-weight:700;font-size:13px;color:var(--ap-blue);margin-bottom:8px;">ðŸ“¦ Goods Receipt Documents (GR)</div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:var(--ap-gray-50);">';
    html += '<th style="padding:6px 10px;text-align:left;border-bottom:1px solid var(--ap-gray-200);">GR Doc No.</th>';
    html += '<th style="padding:6px 10px;text-align:left;border-bottom:1px solid var(--ap-gray-200);">Year</th>';
    if(invoicePosted){
      html += '<th style="padding:6px 10px;text-align:left;border-bottom:1px solid var(--ap-gray-200);">Acct Doc No.</th>';
      html += '<th style="padding:6px 10px;text-align:right;border-bottom:1px solid var(--ap-gray-200);">Gross Amt (per Posting)</th>';
      html += '<th style="padding:6px 10px;text-align:right;border-bottom:1px solid var(--ap-gray-200);">Recoveries</th>';
    } else {
      html += '<th style="padding:6px 10px;text-align:right;border-bottom:1px solid var(--ap-gray-200);">Proposed Recoveries (Form 13)</th>';
    }
    if(loaGenerated){
      html += '<th style="padding:6px 10px;text-align:left;border-bottom:1px solid var(--ap-gray-200);">LOA No.</th>';
    }
    if(isPaid){
      html += '<th style="padding:6px 10px;text-align:right;border-bottom:1px solid var(--ap-gray-200);">Net Amt Paid</th>';
      html += '<th style="padding:6px 10px;text-align:left;border-bottom:1px solid var(--ap-gray-200);">Payment Date</th>';
    }
    html += '</tr></thead><tbody>';
    bill.selectedGRs.forEach(function(gr){
      var rec = VMAT_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&r.grDocNo===gr.grDocNo; });
      html += '<tr><td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);"><b>'+gr.grDocNo+'</b></td>';
      html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);">'+(gr.grYear||'â€”')+'</td>';
      if(invoicePosted){
        var recTotal = rec ? ((rec.itBankCharges||0)+(rec.penalty||0)+(rec.retention||0)+(rec.otherRecovery||0)) : 0;
        html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);">'+(rec?rec.accountingDocNo+(rec.accountingYear?' ('+rec.accountingYear+')':''):'â€”')+'</td>';
        html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);text-align:right;">'+fmtAmt(rec?rec.grossAmt:0)+'</td>';
        html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);text-align:right;color:var(--ap-red);">'+fmtAmt(recTotal)+'</td>';
      } else {
        // Show proposed recoveries from Form13 stage (engineer recoveries)
        var propRec = 0;
        if(bill.engineerRecoveries){ var er=bill.engineerRecoveries; propRec=(er.retention||0)+(er.priceVariation||0)+(er.penalty||0)+(er.seigniorage||0)+(er.others||[]).reduce(function(s,o){return s+o.amount;},0); }
        html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);text-align:right;color:var(--ap-orange);">'+(propRec?fmtAmt(propRec):'Pending review')+'</td>';
      }
      if(loaGenerated){
        html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);">'+(rec&&rec.loaNo?rec.loaNo:(bill.loaNo||'â€”'))+'</td>';
      }
      if(isPaid){
        html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);text-align:right;color:var(--ap-green);font-weight:700;">'+fmtAmt(rec?rec.amtPaid:0)+'</td>';
        html += '<td style="padding:6px 10px;border-bottom:1px solid var(--ap-gray-100);">'+(rec&&rec.paymentDate?rec.paymentDate:'â€”')+'</td>';
      }
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  } else if(bill.selectedForm14 && bill.selectedForm14.seNo){
    html += '<div style="background:#fff;border:1px solid var(--ap-green);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
    html += '<div style="font-weight:700;font-size:13px;color:var(--ap-green);margin-bottom:8px;">ðŸ“‹ Form 14 â€“ Service Entry Sheet</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">';
    var f14=bill.selectedForm14;
    var srec = VSVC_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&String(r.seNo)===String(f14.seNo); });
    html += '<div><span style="color:var(--ap-gray-600);">SE No.</span><br><b>'+f14.seNo+'</b></div>';
    html += '<div><span style="color:var(--ap-gray-600);">Year</span><br><b>'+(f14.seYear||'â€”')+'</b></div>';
    html += '<div><span style="color:var(--ap-gray-600);">Gross Amount (Vendor)</span><br><b>'+fmtAmt(f14.billingAmt||f14.grossAmt||0)+'</b></div>';
    if(invoicePosted && srec){
      html += '<div><span style="color:var(--ap-gray-600);">Acct Doc No.</span><br><b>'+srec.accountingDocNo+(srec.accountingYear?' ('+srec.accountingYear+')':'')+'</b></div>';
      var svcRec=(srec.itBankCharges||0)+(srec.penalty||0)+(srec.retention||0)+(srec.otherRecovery||0);
      html += '<div><span style="color:var(--ap-gray-600);">Recoveries (per posting)</span><br><b style="color:var(--ap-red);">'+fmtAmt(svcRec)+'</b></div>';
    } else {
      var propRec2=0;
      if(bill.engineerRecoveries){ var er2=bill.engineerRecoveries; propRec2=(er2.retention||0)+(er2.priceVariation||0)+(er2.penalty||0)+(er2.seigniorage||0)+(er2.others||[]).reduce(function(s,o){return s+o.amount;},0); }
      html += '<div><span style="color:var(--ap-gray-600);">Proposed Recoveries (Form 14)</span><br><b style="color:var(--ap-orange);">'+(propRec2?fmtAmt(propRec2):'Pending review')+'</b></div>';
    }
    if(loaGenerated){
      html += '<div><span style="color:var(--ap-gray-600);">LOA No.</span><br><b>'+(f14.loaNo||(srec?srec.loaNo:'â€”'))+'</b></div>';
    }
    if(isPaid && srec){
      html += '<div><span style="color:var(--ap-gray-600);">Net Amt Paid</span><br><b style="color:var(--ap-green);">'+fmtAmt(srec.amtPaid||0)+'</b></div>';
      html += '<div><span style="color:var(--ap-gray-600);">Payment Date</span><br><b>'+(srec.paymentDate||'â€”')+'</b></div>';
    }
    html += '</div></div>';
  }

  // â”€â”€ 3. Recoveries Proposed â”€â”€
  if(bill.engineerRecoveries){
    var rec=bill.engineerRecoveries;
    var totalRec=(rec.retention||0)+(rec.priceVariation||0)+(rec.penalty||0)+(rec.seigniorage||0)+(rec.others||[]).reduce(function(s,o){return s+o.amount;},0);
    html += '<div style="background:var(--ap-gold-light);border:1px solid var(--ap-gold);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
    html += '<div style="font-weight:700;font-size:13px;color:#7a4f00;margin-bottom:8px;">ðŸ’° Recoveries Proposed</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:12px;">';
    if(rec.retention) html += '<div><span style="color:var(--ap-gray-600);">Retention</span><br><b>'+fmtAmt(rec.retention)+'</b></div>';
    if(rec.priceVariation) html += '<div><span style="color:var(--ap-gray-600);">Price Variation</span><br><b>'+fmtAmt(rec.priceVariation)+'</b></div>';
    if(rec.penalty) html += '<div><span style="color:var(--ap-gray-600);">Penalty</span><br><b>'+fmtAmt(rec.penalty)+'</b></div>';
    if(rec.seigniorage) html += '<div><span style="color:var(--ap-gray-600);">Seigniorage Charges</span><br><b>'+fmtAmt(rec.seigniorage)+'</b></div>';
    (rec.others||[]).forEach(function(o){ html += '<div><span style="color:var(--ap-gray-600);">Other</span><br><b>'+fmtAmt(o.amount)+'</b> '+o.remarks+'</div>'; });
    html += '<div><span style="color:var(--ap-gray-600);">Total Recovery</span><br><b style="color:var(--ap-red);">'+fmtAmt(totalRec)+'</b></div>';
    html += '<div><span style="color:var(--ap-gray-600);">Net Payable</span><br><b style="color:var(--ap-green);font-size:14px;">'+fmtAmt(bill.netAmt||0)+'</b></div>';
    html += '</div></div>';
  }

  // â”€â”€ 4. Payment Info â€” FIX 5: Only show after HQ final posting (status = Paid) â”€â”€
  if(bill.status === 'Paid'){
    html += '<div style="background:var(--ap-green-light);border:1px solid var(--ap-green);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
    html += '<div style="font-weight:700;font-size:13px;color:var(--ap-green);margin-bottom:8px;">âœ… Payment Information (Final â€“ Posted by HQ Accounts Wing)</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">';
    html += '<div><span style="color:var(--ap-gray-600);">Amount Paid</span><br><b style="color:var(--ap-green);font-size:15px;font-family:\'Rajdhani\',sans-serif;">'+fmtAmt(bill.amtPaid||amtPaid)+'</b></div>';
    html += '<div><span style="color:var(--ap-gray-600);">Payment Date</span><br><b>'+(bill.paymentDate||bill.loaPaidDate||payDate||'â€”')+'</b></div>';
    html += '<div><span style="color:var(--ap-gray-600);">LOA No.</span><br><b>'+(loaNos.join(', ')||'â€”')+'</b></div>';
    html += '</div></div>';
  } else {
    // Show current stage info instead of payment
    var stageMsg = {
      'Submitted': 'ðŸ“¤ Bill submitted by vendor. Awaiting engineer review.',
      'Pending with AEE': 'ðŸ” Pending review by assigned AEE/DEE.',
      'Reviewed by Engineer': 'âœ… Reviewed by engineer. Pending forwarding to EE.',
      'Forwarded to EE': 'ðŸ“‹ Forwarded to Executive Engineer for verification.',
      'Forwarded to Accounts': 'ðŸ¦ With Field Accounts Wing for invoice processing.',
      'Form13 Updated': 'ðŸ“‹ Form 13 updated. Awaiting further processing.',
      'Form14 Updated': 'ðŸ“‹ Form 14 updated. Awaiting further processing.',
      'Invoice Posted': 'ðŸ“„ Invoice posted by Accounts. Awaiting LOA.',
      'LOA Created': 'ðŸ”– LOA created. Awaiting HQ Accounts approval.',
      'LOA Approved': 'âœ… LOA approved. Awaiting final payment by HQ.',
      'With HQ Accounts': 'ðŸ¢ With HQ Accounts Wing for final payment processing.',
      'Rejected': 'âŒ Bill has been rejected. Please check remarks.',
      'Sent Back': 'â†© Bill sent back for corrections.',
      'Sent Back by Accounts': 'â†© Sent back by Field Accounts.',
      'Sent Back by HQ': 'â†© Sent back by HQ Accounts.',
    }[bill.status] || 'â³ Bill is being processed.';
    html += '<div style="background:var(--ap-gold-light);border:1px solid var(--ap-gold);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
    html += '<div style="font-weight:700;font-size:13px;color:#7a4f00;margin-bottom:4px;">ðŸ’³ Payment Status</div>';
    html += '<div style="font-size:13px;color:var(--ap-gray-700);">'+stageMsg+'</div>';
    html += '<div style="font-size:11px;color:var(--ap-gray-400);margin-top:6px;">Payment information will appear here once HQ Accounts Wing completes final posting.</div>';
    html += '</div>';
  }

  // â”€â”€ 4b. Invoice Posted + Actual Recoveries (from master data, after invoice posting) â”€â”€
  var invoicePostedNow = ['Invoice Posted','LOA Created','LOA Approved','With HQ Accounts','Paid'].indexOf(bill.status) >= 0;
  if(invoicePostedNow){
    var isSvcType = bill.type==='Service';
    var actRec = {it:0, penalty:0, retention:0, other:0};
    var invPostedRows = [];
    if(bill.selectedGRs && bill.selectedGRs.length){
      bill.selectedGRs.forEach(function(gr){
        var rec2 = VMAT_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&r.grDocNo===gr.grDocNo; });
        if(rec2){
          actRec.it += rec2.itBankCharges||0;
          actRec.penalty += rec2.penalty||0;
          actRec.retention += rec2.retention||0;
          actRec.other += rec2.otherRecovery||0;
          invPostedRows.push({acctDoc:rec2.accountingDocNo, acctYear:rec2.accountingYear, grossAmt:rec2.grossAmt});
        }
      });
    } else if(bill.selectedForm14 && bill.selectedForm14.seNo){
      var srec3 = VSVC_DATA.find(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId&&String(r.seNo)===String(bill.selectedForm14.seNo); });
      if(srec3){
        actRec.it = srec3.itBankCharges||0;
        actRec.penalty = srec3.penalty||0;
        actRec.retention = srec3.retention||0;
        actRec.other = srec3.otherRecovery||0;
        invPostedRows.push({acctDoc:srec3.accountingDocNo, acctYear:srec3.accountingYear, grossAmt:srec3.grossAmt});
      }
    }
    // Show Invoice Posted section with accounting doc, year, gross amount (col 16)
    if(invPostedRows.length){
      html += '<div style="background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
      html += '<div style="font-weight:700;font-size:13px;color:var(--ap-blue);margin-bottom:8px;">ðŸ“„ Invoice Posted Details</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;font-size:12px;">';
      var seenAcct = {};
      invPostedRows.forEach(function(r){
        var key = (r.acctDoc||'')+'_'+(r.acctYear||'');
        if(!seenAcct[key]){
          seenAcct[key] = true;
          html += '<div><span style="color:var(--ap-gray-600);">Accounting Document No.</span><br><b style="color:var(--ap-blue-mid);">'+(r.acctDoc||'â€”')+'</b></div>';
          html += '<div><span style="color:var(--ap-gray-600);">Fiscal Year</span><br><b>'+(r.acctYear||'â€”')+'</b></div>';
        }
      });
      var totalGross16 = invPostedRows.reduce(function(s,r){ return s+(r.grossAmt||0); }, 0);
      html += '<div><span style="color:var(--ap-gray-600);">Gross Invoice Amount (Col 16)</span><br><b style="color:var(--ap-blue);font-size:14px;">'+fmtAmt(totalGross16)+'</b></div>';
      html += '</div></div>';
    }
    var totalActRec = actRec.it + actRec.penalty + actRec.retention + actRec.other;
    if(totalActRec > 0){
      html += '<div style="background:var(--ap-red-light);border:1px solid var(--ap-red);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
      html += '<div style="font-weight:700;font-size:13px;color:var(--ap-red);margin-bottom:8px;">ðŸ“Š Actual Recoveries (As per Invoice Posting)</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;font-size:12px;">';
      if(actRec.it) html += '<div><span style="color:var(--ap-gray-600);">IT & Bank Charges</span><br><b>'+fmtAmt(actRec.it)+'</b></div>';
      if(actRec.penalty) html += '<div><span style="color:var(--ap-gray-600);">Penalty</span><br><b>'+fmtAmt(actRec.penalty)+'</b></div>';
      if(actRec.retention) html += '<div><span style="color:var(--ap-gray-600);">Retention</span><br><b>'+fmtAmt(actRec.retention)+'</b></div>';
      if(actRec.other) html += '<div><span style="color:var(--ap-gray-600);">Other Recovery</span><br><b>'+fmtAmt(actRec.other)+'</b></div>';
      html += '<div><span style="color:var(--ap-gray-600);">Total Recoveries</span><br><b style="color:var(--ap-red);font-size:14px;">'+fmtAmt(totalActRec)+'</b></div>';
      html += '</div></div>';
    }
  }

  // â”€â”€ 5. Approval Status (Sequential Milestones) â”€â”€
  var isSvcBill = bill.type === 'Service';
  var milestoneStatuses = [
    {key:'Submitted',         label:'SUBMITTED',        icon:'ðŸ“¤'},
    {key:'Form13 Updated',    label:isSvcBill?'Form 14 Posted':'Form 13 Posted', icon:'ðŸ“‹'},
    {key:'Invoice Posted',    label:'INVOICE POSTED',   icon:'ðŸ“„'},
    {key:'LOA Created',       label:'LOA GENERATED',    icon:'ðŸ”–'},
    {key:'LOA Approved',      label:'LOA APPROVED',     icon:'âœ…'},
    {key:'Paid',              label:'PAID',             icon:'ðŸ’³'}
  ];
  var statusOrder = ['Submitted','Pending with AEE','Reviewed by Engineer','Forwarded to EE','Forwarded to Accounts',
    'Form13 Updated','Form14 Updated','Invoice Posted','LOA Created','LOA Approved','With HQ Accounts','Paid'];
  var curStatusIdx = statusOrder.indexOf(bill.status);

  // Map current bill status to milestone
  var milestoneReached = function(key){
    var keyIdx = statusOrder.indexOf(key);
    if(key==='Form13 Updated') keyIdx = Math.max(statusOrder.indexOf('Form13 Updated'), statusOrder.indexOf('Form14 Updated'));
    return curStatusIdx >= keyIdx && keyIdx >= 0;
  };

  html += '<div style="background:#fff;border:1px solid var(--ap-gray-200);border-radius:8px;padding:12px 16px;margin-bottom:12px;">';
  html += '<div style="font-weight:700;font-size:13px;color:var(--ap-blue);margin-bottom:12px;">ðŸ Approval Status</div>';
  // Milestone steps
  html += '<div style="display:flex;gap:0;margin-bottom:12px;overflow-x:auto;">';
  milestoneStatuses.forEach(function(m, i){
    var done = milestoneReached(m.key);
    var active = bill.status===m.key || (m.key==='Form13 Updated'&&(bill.status==='Form13 Updated'||bill.status==='Form14 Updated')) || (m.key==='LOA Created'&&bill.status==='With HQ Accounts');
    if(!active && m.key==='Submitted') active = (bill.status==='Pending with AEE'||bill.status==='Submitted');
    var bg = done?'var(--ap-green)': active?'var(--ap-blue-mid)':'var(--ap-gray-200)';
    var tc = (done||active)?'#fff':'var(--ap-gray-400)';
    html += '<div style="flex:1;min-width:80px;text-align:center;padding:6px 2px;background:'+bg+';color:'+tc+';font-size:9px;font-weight:700;border-right:2px solid #fff;">'
      +(done?'âœ“ ':'')+m.icon+' '+m.label+'</div>';
  });
  html += '</div>';

  // Current pending person (only if not PAID)
  if(bill.status !== 'Paid'){
    if(bill.pendingWith){
      // Find when this person received the invoice from log
      var log = bill.log||[];
      var myLog = null;
      for(var li=log.length-1; li>=0; li--){
        if(log[li].by && log[li].by.indexOf(bill.pendingWith)>=0){ myLog=log[li]; break; }
      }
      var receivedDate = myLog ? myLog.date : '';
      var daysPending = '';
      if(receivedDate){
        var parts = receivedDate.split('/');
        if(parts.length===3){
          var d = new Date(parts[2],parts[1]-1,parts[0]);
          var diff = Math.floor((new Date()-d)/(1000*60*60*24));
          daysPending = diff > 0 ? diff+' day(s) pending' : 'Received today';
        }
      }
      html += '<div style="margin-top:8px;background:var(--ap-gold-light);border:1px solid var(--ap-gold);border-radius:6px;padding:10px 14px;font-size:12px;">';
      html += '<div style="font-weight:700;color:#7a4f00;margin-bottom:4px;">ðŸ“ Currently Pending With</div>';
      html += '<div style="font-size:13px;font-weight:700;color:var(--ap-blue);">'+bill.pendingWith+(bill.pendingDesig?' <span style="font-weight:400;color:var(--ap-gray-600);">('+bill.pendingDesig+')</span>':'')+'</div>';
      if(receivedDate) html += '<div style="font-size:11px;color:var(--ap-gray-600);margin-top:4px;">Received: '+receivedDate+(daysPending?' &nbsp;|&nbsp; <b style="color:var(--ap-orange);">'+daysPending+'</b>':'')+'</div>';
      html += '</div>';
    }
  }

  // Activity log (collapsible)
  var log = bill.log||[];
  html += '<div style="margin-top:10px;">';
  html += '<div style="font-weight:700;font-size:12px;color:var(--ap-blue);margin-bottom:6px;">ðŸ“œ Activity Log</div>';
  html += '<div class="timeline">';
  log.forEach(function(l, i){
    var isLast = i===log.length-1;
    html += '<div class="timeline-item">'+
      '<div class="timeline-dot '+(isLast?'active':'done')+'"></div>'+
      '<div class="timeline-body">'+
        '<div class="timeline-title" style="font-size:13px;">'+l.action+'</div>'+
        '<div class="timeline-meta">'+l.date+' &nbsp;Â·&nbsp; <b>'+l.by+'</b></div>'+
        (l.remarks?'<div class="timeline-remark">ðŸ’¬ '+l.remarks+'</div>':'')+
        '<span class="badge badge-submitted" style="margin-top:4px;font-size:10px;">'+l.status+'</span>'+
      '</div>'+
    '</div>';
  });
  if(!log.length) html += '<p style="color:var(--ap-gray-400);font-size:12px;">No activity recorded yet.</p>';
  html += '</div></div></div>';

  document.getElementById('billDetailTitle').textContent = 'Bill Details â€“ '+billId;
  document.getElementById('billDetailBody').innerHTML = html;
  document.getElementById('billDetailModal').classList.add('open');
}


// Helper: get human-readable document category label from doc key
function getDocCategoryLabel(k){
  var labels = {
    'mat1':'Material Tax Invoice', 'mat2':'Despatch Instructions', 'mat3':'Packing List',
    'mat4':'Warranty / Guarantee', 'mat5':'Insurance', 'mat6':'Freight Receipt',
    'mat7':'Test Certificates', 'mat8':'Lorry Receipt & Tax Invoice',
    'svc1':'Service Tax Invoice',
    'hr1':'Hand Receipt',
    'ret1':'Retention Release Document',
    'pen1':'Penalty Document',
    'oth1':'Other Recovery Document',
    'form13_0':'Form 13 (Page 1)', 'form13_1':'Form 13 (Page 2)', 'form13_2':'Form 13 (Page 3)',
    'form14_pdf':'Form 14 PDF',
    'pvReport':'Price Variation Report',
    'penaltyStmt':'Penalty Statement',
    'seigniorageDoc':'Seigniorage Charges Document'
  };
  if(labels[k]) return labels[k];
  if(k.startsWith('form13_')) return 'Form 13 Document';
  if(k.startsWith('mat')) return 'Material Document';
  if(k.startsWith('svc')) return 'Service Document';
  return 'Document';
}

function viewBillDocs(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var docs = bill.docs||{};
  var keys = Object.keys(docs);
  var grInfo = '';
  if(bill.selectedGRs && bill.selectedGRs.length){
    grInfo = '<div style="background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:12px;">'+
      '<div style="font-weight:700;color:var(--ap-blue);margin-bottom:4px;">ðŸ“‹ GR Documents Selected by Engineer:</div>'+
      bill.selectedGRs.map(function(gr){ return '<div>â€¢ GR Doc No: <b>'+gr.grDocNo+'</b> | LOA: '+gr.loaNo+' | Gross: '+fmtAmt(gr.grossAmt)+'</div>'; }).join('')+
    '</div>';
  }
  if(bill.selectedForm14 && bill.selectedForm14.seNo){
    grInfo = '<div style="background:var(--ap-green-light);border:1px solid var(--ap-green);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:12px;">'+
      '<div style="font-weight:700;color:var(--ap-green);margin-bottom:4px;">ðŸ“‹ Form 14 Selected by Engineer:</div>'+
      '<div>SE No: <b>'+bill.selectedForm14.seNo+'</b> | Bill No: '+bill.selectedForm14.presentBillNo+' | Amount: '+fmtAmt(bill.selectedForm14.billingAmt)+'</div>'+
    '</div>';
  }
  var recInfo = '';
  if(bill.engineerRecoveries){
    var rec = bill.engineerRecoveries;
    recInfo = '<div style="background:var(--ap-gold-light);border:1px solid var(--ap-gold);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:12px;">'+
      '<div style="font-weight:700;color:#7a4f00;margin-bottom:4px;">ðŸ’° Recoveries Proposed:</div>'+
      (rec.retention?'<div>Retention: <b>'+fmtAmt(rec.retention)+'</b></div>':'')+
      (rec.priceVariation?'<div>Price Variation: <b>'+fmtAmt(rec.priceVariation)+'</b></div>':'')+
      (rec.penalty?'<div>Penalty: <b>'+fmtAmt(rec.penalty)+'</b></div>':'')+
      (rec.seigniorage?'<div>Seigniorage Charges: <b>'+fmtAmt(rec.seigniorage)+'</b></div>':'')+
      (rec.others&&rec.others.length ? rec.others.map(function(o){ return '<div>Other Recovery: <b>'+fmtAmt(o.amount)+'</b> â€“ '+o.remarks+'</div>'; }).join('') : '')+
      '<div style="margin-top:6px;font-weight:700;">Net Amount After Recoveries: <span style="color:var(--ap-green);">'+fmtAmt(bill.netAmt||bill.grossAmt)+'</span></div>'+
    '</div>';
  }
  var html = grInfo + recInfo + (keys.length===0 ? '<p style="color:var(--ap-gray-400);">No documents uploaded.</p>' :
    keys.map(function(k){
      var doc = docs[k];
      var canEdit = bill.vendorId===currentVendorId; // only submitter can edit
      var catLabel = getDocCategoryLabel(k);
      return '<div style="border:1px solid var(--ap-gray-200);border-radius:6px;margin-bottom:8px;background:#fff;overflow:hidden;">'+
        '<div style="background:var(--ap-blue-light);padding:4px 14px;font-size:10px;font-weight:700;color:var(--ap-blue);text-transform:uppercase;letter-spacing:0.5px;">ðŸ“ '+catLabel+'</div>'+
        '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;">'+
        '<span style="font-size:20px;">ðŸ“„</span>'+
        '<span style="flex:1;font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+doc.name+'</span>'+
        '<span style="font-size:11px;color:var(--ap-gray-400);">'+((doc.size/1024).toFixed(1))+' KB</span>'+
        (doc.blobUrl ? '<button class="btn btn-outline btn-xs" onclick="viewDoc(\''+k+'\',\''+billId+'\')">ðŸ‘ View</button>' : '<span style="font-size:11px;color:var(--ap-gray-400);">No preview</span>')+
        (canEdit ? '<button class="btn btn-xs" style="background:var(--ap-orange-light);color:var(--ap-orange);border:none;" onclick="editBillDoc(\''+billId+'\',\''+k+'\')">âœ Replace</button>' : '')+
        '</div></div>';
    }).join(''));
  document.getElementById('docViewTitle').textContent = 'Documents â€“ ' + billId;
  document.getElementById('docViewBody').innerHTML = html;
  document.getElementById('currentEditBillId').value = billId;
  document.getElementById('docViewModal').classList.add('open');
}

function viewDoc(itemId, billId){
  var doc;
  if(billId){
    var bill = submittedBills.find(function(b){ return b.billId===billId; });
    doc = bill && bill.docs && bill.docs[itemId];
  } else {
    doc = uploadedDocs[itemId];
  }
  if(!doc || !doc.blobUrl){ showToast('âš ï¸ Document preview not available. File may have been uploaded before this session.',true); return; }
  viewDocByUrl(doc.blobUrl, doc.name);
}

function editBillDoc(billId, itemId){
  var inp = document.getElementById('replaceDocInput');
  inp.setAttribute('data-bill', billId);
  inp.setAttribute('data-item', itemId);
  inp.click();
}

function handleReplaceDoc(input){
  var billId = input.getAttribute('data-bill');
  var itemId = input.getAttribute('data-item');
  var file = input.files[0];
  if(!file) return;
  if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf')){ showToast('âš ï¸ Only PDF accepted.',true); input.value=''; return; }
  var blobUrl = URL.createObjectURL(file);
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(bill){ bill.docs[itemId]={name:file.name,size:file.size,blobUrl:blobUrl}; }
  input.value='';
  // Refresh the doc modal
  viewBillDocs(billId);
  showToast('âœ… Document replaced: '+file.name);
}

// ===== MY POs =====
function renderMyPOs(){
  var myPOs = PO_DATA.filter(function(p){ return String(p.vendorCode)===currentVendorId; });
  var rows = myPOs.map(function(p){
    return '<tr><td><b>'+p.poNo+'</b></td><td>'+p.workName+'</td><td>'+p.schemeDesc+'</td><td>'+p.purchDocType+'</td>'+
      '<td class="amount">'+fmtAmt(p.poValue)+'</td><td class="amount">'+fmtAmt(p.valueGR)+'</td><td class="amount">'+fmtAmt(p.balanceGR)+'</td>'+
      '<td class="amount">'+fmtAmt(p.valueInv)+'</td><td class="amount">'+fmtAmt(p.balanceInv)+'</td></tr>';
  }).join('');
  document.getElementById('myPOsTbody').innerHTML = rows || '<tr><td colspan="9" style="text-align:center;color:var(--ap-gray-400);">No POs found.</td></tr>';
}

// ===== AP PENDING BILLS =====
// ===== WORKFLOW HELPER: determine role of current employee =====
function getEmpRole(){
  var emp = EMPLOYEES.find(function(e){ return String(e.id)===currentEmpId; });
  if(!emp) return {emp:null,role:'unknown',isAEE:false,isEE:false,isFieldAcct:false,isHQAcct:false,isEngineer:false};
  var sg = emp.subGroup||'';
  var sa = emp.subArea||'';
  var ba = emp.busArea||'';
  var isHQAcct  = (sa==='Accounts-HQ' || ba==='9100' || ba.includes('9000'));
  var isFieldAcct = (sa==='Accounts' && !isHQAcct);
  var isEE      = (sg==='EE'||sg==='EF') && !isFieldAcct && !isHQAcct;
  var isAEE     = (sg==='EC'||sg==='ED') && !isFieldAcct && !isHQAcct;
  var isEngineer= isEE||isAEE;
  return {emp:emp, role:sg, sa:sa, ba:ba, isAEE:isAEE, isEE:isEE, isFieldAcct:isFieldAcct, isHQAcct:isHQAcct, isEngineer:isEngineer};
}

// ===== FORWARD SUBMISSION MODAL =====
function openForwardModal(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var r = getEmpRole();
  var st = bill.status||'Submitted';

  // Determine who can receive the bill at next stage based on current holder's role
  var nextLabel = '';
  var nextOptions = [];

  if(r.isAEE){
    // AEE/DEE â†’ must submit to EE
    nextLabel = 'Executive Engineer (EE)';
    nextOptions = EMPLOYEES.filter(function(e){ return e.subGroup==='EE'||e.subGroup==='EF'; });
  } else if(r.isEE){
    // EE â†’ submit to Field Accounts Wing (AAO/SAO, subArea=Accounts, not HQ)
    nextLabel = 'Field Accounts Wing (AAO / SAO)';
    nextOptions = EMPLOYEES.filter(function(e){ return (e.subArea==='Accounts') && !e.busArea.includes('9000'); });
  } else if(r.isFieldAcct){
    // Field Accounts â†’ submit to HQ Accounts Wing
    nextLabel = 'HQ Accounts Wing';
    nextOptions = EMPLOYEES.filter(function(e){ return e.subArea==='Accounts-HQ' || e.busArea==='9100' || e.busArea.includes('9000'); });
  } else if(r.isHQAcct){
    nextLabel = 'No further forwarding â€” HQ Accounts is the final approver';
    nextOptions = [];
  }

  if(!nextOptions.length && !r.isHQAcct){
    showToast('âš ï¸ No eligible recipients found for next stage.',true); return;
  }

  var opts = nextOptions.map(function(e){
    var sg = {'EF':'SE','EE':'EE','ED':'DEE','EC':'AEE','AF':'SAO','AD':'AAO','AH':'CAO'}[e.subGroup]||e.subGroup;
    return '<option value="'+e.id+'">['+sg+'] '+e.name+' â€“ '+e.designation+'</option>';
  }).join('');

  // Build modal content
  var body = document.getElementById('forwardModalBody');
  if(!body){
    // Create the modal if not exists
    var overlay = document.createElement('div');
    overlay.className='modal-overlay'; overlay.id='forwardModal';
    overlay.innerHTML='<div class="modal" style="max-width:520px;">'+
      '<div class="modal-header"><h3 id="forwardModalTitle">Forward Bill</h3><button class="modal-close" onclick="closeModal(\'forwardModal\')">âœ•</button></div>'+
      '<div class="modal-body" id="forwardModalBody"></div>'+
      '<div class="modal-footer">'+
        '<button class="btn btn-outline" onclick="closeModal(\'forwardModal\')">Cancel</button>'+
        '<button class="btn btn-primary" onclick="confirmForward()">âž¡ Forward</button>'+
      '</div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click',function(e){if(e.target===overlay)overlay.classList.remove('open');});
    body = document.getElementById('forwardModalBody');
  }

  document.getElementById('forwardModalTitle').textContent = 'Forward Bill â€“ '+billId;
  body.innerHTML =
    '<input type="hidden" id="fwdBillId" value="'+billId+'">'+
    '<div style="background:var(--ap-gray-50);border:1px solid var(--ap-gray-200);border-radius:6px;padding:10px 14px;margin-bottom:1rem;font-size:12px;">'+
      '<b>Bill:</b> '+billId+' | <b>Vendor:</b> '+(VENDOR_MAP[bill.vendorId]||bill.vendorId)+' | <b>Type:</b> '+bill.type+'<br>'+
      '<b>Gross Amt:</b> '+fmtAmt(bill.grossAmt||0)+(bill.netAmt?' | <b>Net (After Rec):</b> <span style="color:var(--ap-green);">'+fmtAmt(bill.netAmt)+'</span>':'')+
    '</div>'+
    (r.isHQAcct ?
      '<div class="alert alert-info">HQ Accounts is the final stage. Use "Payment Made" to close the bill.</div>' :
      '<div class="form-group">'+
        '<label style="font-size:12px;font-weight:700;color:var(--ap-gray-600);display:block;margin-bottom:6px;">Forward to â€“ '+nextLabel+':</label>'+
        '<select id="fwdRecipient" style="width:100%;padding:9px 12px;border:1px solid var(--ap-gray-200);border-radius:6px;font-size:13px;">'+
          '<option value="">â€” Select Recipient â€”</option>'+opts+
        '</select>'+
        '<div style="margin-top:0.75rem;">'+
          '<label style="font-size:12px;font-weight:700;color:var(--ap-gray-600);display:block;margin-bottom:4px;">Remarks (optional):</label>'+
          '<textarea id="fwdRemarks" style="width:100%;padding:8px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;min-height:60px;font-family:inherit;" placeholder="Add forwarding remarks..."></textarea>'+
        '</div>'+
      '</div>'
    );
  document.getElementById('forwardModal').classList.add('open');
}

function confirmForward(){
  var billId = (document.getElementById('fwdBillId')||{}).value;
  var recipId = (document.getElementById('fwdRecipient')||{}).value;
  var remarks = (document.getElementById('fwdRemarks')||{}).value||'';
  if(!billId) return;
  if(!recipId){ showToast('âš ï¸ Please select a recipient.',true); return; }
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  var recip = EMPLOYEES.find(function(e){ return String(e.id)===recipId; });
  if(!bill||!recip) return;
  var r = getEmpRole();
  var fwdBy = r.emp ? r.emp.name+' ('+r.emp.designation+')' : 'Employee';

  // Determine new status based on who is forwarding
  var newStatus;
  if(r.isAEE)        newStatus = 'Forwarded to EE';
  else if(r.isEE)    newStatus = 'Forwarded to Accounts';
  else if(r.isFieldAcct) newStatus = 'With HQ Accounts';
  else               newStatus = 'Forwarded';

  bill.status      = newStatus;
  bill.pendingWith = recip.name;
  bill.pendingDesig= recip.designation;
  bill.log = bill.log||[];
  bill.log.push({
    date: new Date().toLocaleDateString('en-IN'),
    action: 'Forwarded to '+recip.name+' ('+recip.designation+')',
    by: fwdBy,
    status: newStatus,
    remarks: remarks
  });

  closeModal('forwardModal');
  saveBillsToStorage();
  renderPendingBills();
  updatePendingCounts();
  showToast('âœ… Bill forwarded to '+recip.name+' ('+recip.designation+')');
}

// ===== RENDER PENDING BILLS (role-aware, stage-aware) =====
function renderPendingBills(){
  var r = getEmpRole();
  var myName0 = r.emp ? r.emp.name : '';
  if(!myName0){ 
    document.getElementById('apPendingBody').innerHTML='<div style="padding:2rem;text-align:center;color:var(--ap-gray-400);">Unable to determine your identity. Please re-login.</div>';
    return;
  }

  // STRICT FILTER: a bill appears in MY pending list ONLY when b.pendingWith === my exact name
  // HQ accounts exception: also catch generic "With HQ Accounts" status routing
  var bills = submittedBills.filter(function(b){
    if(b.status==='Paid'||b.status==='Rejected'||b.status==='Draft (Editing)') return false;
    if(b.status.includes('Sent Back')) return false;
    // Strict: pendingWith must exactly match logged-in employee name
    if(b.pendingWith === myName0) return true;
    // HQ Accounts Wing: catch bills routed with generic "With HQ Accounts" status
    if(r.isHQAcct && (b.status==='With HQ Accounts'||b.status==='LOA Approved')) return true;
    return false;
  });
  var body = document.getElementById('apPendingBody');
  if(!bills.length){ body.innerHTML='<div style="padding:2rem;text-align:center;color:var(--ap-gray-400);">No pending bills for you at this time.</div>'; return; }

  var statusBadge = {
    'Submitted':'badge-submitted',
    'Pending with AEE':'badge-processing','Forwarded to EE':'badge-processing',
    'Reviewed by Engineer':'badge-form13',
    'Forwarded to Accounts':'badge-form13',
    'Form13 Updated':'badge-form13','Form14 Updated':'badge-form14',
    'Invoice Posted':'badge-processing','LOA Created':'badge-form14',
    'With HQ Accounts':'badge-processing',
    'Paid':'badge-paid','Rejected':'badge-rejected',
    'Sent Back':'badge-rejected','Sent Back by Accounts':'badge-rejected','Sent Back by HQ':'badge-rejected'
  };

  var stOrder = ['Submitted','Pending with AEE','Reviewed by Engineer','Forwarded to EE','Forwarded to Accounts','Form13 Updated','Form14 Updated','Invoice Posted','LOA Created','With HQ Accounts','LOA Approved','Paid'];

  body.innerHTML = bills.map(function(b){
    var docCount = Object.keys(b.docs||{}).length;
    var st = b.status||'Submitted';
    var isMat = b.type==='Material';
    var pendingInfo = b.pendingWith ?
      '<span style="font-size:11px;color:var(--ap-gray-600);margin-left:8px;background:var(--ap-gray-100);padding:2px 8px;border-radius:10px;">ðŸ“ <b>'+b.pendingWith+'</b>'+(b.pendingDesig?' â€“ '+b.pendingDesig:'')+'</span>' : '';

    // Milestone bar
    var milestones = [
      {key:'Submitted',label:'Submitted'},
      {key:'Reviewed by Engineer',label:'AEE Review'},
      {key:'Forwarded to EE',label:'With EE'},
      {key:'Forwarded to Accounts',label:'Field Accts'},
      {key:'Invoice Posted',label:'Inv. Posted'},
      {key:'LOA Created',label:'LOA'},
      {key:'With HQ Accounts',label:'HQ Accts'},
      {key:'Paid',label:'Paid'}
    ];
    var mOrder = milestones.map(function(m){return m.key;});
    var curIdx = mOrder.indexOf(st); if(curIdx<0) curIdx=0;
    var mBar = '<div style="display:flex;gap:0;margin:8px 0 4px;overflow-x:auto;">'+
      milestones.map(function(m,i){
        var done=curIdx>i; var act=curIdx===i;
        var bg=done?'var(--ap-green)':act?'var(--ap-blue-mid)':'var(--ap-gray-200)';
        var tc=(done||act)?'#fff':'var(--ap-gray-400)';
        return '<div style="flex:1;min-width:70px;text-align:center;padding:4px 2px;background:'+bg+';color:'+tc+';font-size:9px;font-weight:700;border-right:2px solid #fff;">'+(done?'âœ“ ':act?'â–¶ ':'')+m.label+'</div>';
      }).join('')+'</div>';

    // Action buttons â€” STRICT: only show action buttons when this bill's pendingWith === my name exactly
    var actions = '<button class="btn btn-outline btn-sm" onclick="showBillDetails(\''+b.billId+'\')">ðŸ“‹ Details</button>'+
                  '<button class="btn btn-outline btn-sm" onclick="viewAPBillDocs(\''+b.billId+'\')">ðŸ“Ž Docs ('+docCount+')</button>'+
                  '<button class="btn btn-outline btn-sm" onclick="showFullLog(\''+b.billId+'\')">ðŸ“œ Log</button>';
    var myName = r.emp ? r.emp.name : '';
    // billIsWithMe is TRUE only if this bill is explicitly assigned to this employee
    var billIsWithMe = (b.pendingWith === myName);
    // Special case for HQ accounts: also match generic HQ routing statuses
    if(r.isHQAcct && !billIsWithMe){
      billIsWithMe = b.status==='With HQ Accounts' || b.status==='LOA Approved';
    }

    if(r.isAEE && billIsWithMe){
      actions += '<button class="btn btn-primary btn-sm" onclick="openEngineerReview(\''+b.billId+'\')">ðŸ” Review</button>';
      if(b.status==='Reviewed by Engineer')
        actions += '<button class="btn btn-success btn-sm" onclick="openForwardModal(\''+b.billId+'\')">âž¡ Forward to EE</button>';
      actions += '<button class="btn btn-danger btn-sm" onclick="openRejectBill(\''+b.billId+'\')">âœ— Reject</button>';

    } else if(r.isEE && billIsWithMe){
      actions += '<button class="btn btn-primary btn-sm" onclick="viewAPBillDocs(\''+b.billId+'\')">ðŸ” Verify</button>';
      actions += '<button class="btn btn-success btn-sm" onclick="openForwardModal(\''+b.billId+'\')">âž¡ Forward to Accounts</button>';
      actions += '<button class="btn btn-danger btn-sm" onclick="openRejectBill(\''+b.billId+'\')">âœ— Reject</button>';

    } else if(r.isFieldAcct && billIsWithMe){
      actions += '<button class="btn btn-warning btn-sm" onclick="openAcctAction(\''+b.billId+'\')">ðŸ¦ Acct Actions</button>';
      if(b.status==='LOA Created'||b.status==='Invoice Posted')
        actions += '<button class="btn btn-success btn-sm" onclick="openForwardModal(\''+b.billId+'\')">âž¡ Forward to HQ</button>';
      actions += '<button class="btn btn-danger btn-sm" onclick="openRejectBill(\''+b.billId+'\')">âœ— Reject</button>';

    } else if(r.isHQAcct && billIsWithMe){
      actions += '<button class="btn btn-warning btn-sm" onclick="openAcctAction(\''+b.billId+'\')">ðŸ’³ HQ Actions</button>';
      actions += '<button class="btn btn-danger btn-sm" onclick="openRejectBill(\''+b.billId+'\')">âœ— Reject</button>';

    } else {
      // Not assigned to me â€” read-only
      actions += '<span style="font-size:11px;color:var(--ap-gray-400);padding:5px 8px;background:var(--ap-gray-100);border-radius:4px;">ðŸ‘ View only</span>';
    }

    return '<div style="border-bottom:1px solid var(--ap-gray-100);padding:0.85rem 1.5rem;">'+
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">'+
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:1;min-width:260px;">'+
          '<span class="bill-id" style="font-size:13px;">'+b.billId+'</span>'+
          '<span class="badge '+(isMat?'badge-submitted':'badge-form14')+'" style="font-size:10px;">'+b.type+'</span>'+
          '<span style="font-size:12px;color:var(--ap-gray-600);">'+VENDOR_MAP[b.vendorId]+'</span>'+
          '<span style="font-size:11px;color:var(--ap-gray-400);">PO: '+b.poNo+'</span>'+
          (b.grossAmt?'<span style="font-size:12px;font-weight:700;color:var(--ap-blue-mid);">'+fmtAmt(b.grossAmt)+'</span>':'')+
          '<span class="badge '+(statusBadge[st]||'badge-submitted')+'" style="font-size:10px;">'+st+'</span>'+
          pendingInfo+
        '</div>'+
        '<div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">'+actions+'</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

function openRejectBill(billId){
  // FIX #3: Build send-back dropdown from ALL persons in submission path (including vendor)
  var bill = submittedBills.find(function(b){return b.billId===billId;});
  var prevPersons = [];
  if(bill && bill.log){
    bill.log.forEach(function(l){
      if(l.by && l.by!=='System' && !l.by.startsWith('System') && prevPersons.indexOf(l.by)<0)
        prevPersons.push(l.by);
    });
  }
  // Also add vendor name as an option
  if(bill && bill.vendorId && VENDOR_MAP[bill.vendorId]){
    var vName = VENDOR_MAP[bill.vendorId]+' (Vendor)';
    if(prevPersons.indexOf(vName)<0) prevPersons.unshift(vName);
  }

  // Completely rebuild the modal body each time to avoid stale DOM issues
  var rejectBody = document.querySelector('#rejectBillModal .modal-body');
  rejectBody.innerHTML =
    '<input type="hidden" id="rejectBillId" value="'+billId+'">'+
    '<div class="form-group" id="rejectSendBackGroup" style="margin-bottom:1rem;">'+
      '<label style="font-size:12px;font-weight:700;color:var(--ap-gray-600);display:block;margin-bottom:4px;">Send Back To (select person in path):</label>'+
      '<select id="rejectSendBack" style="width:100%;padding:8px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:13px;">'+
        '<option value="">â€” Reject only (no reassignment) â€”</option>'+
        prevPersons.map(function(p){return '<option value="'+p+'">'+p+'</option>';}).join('')+
      '</select>'+
      '<div style="font-size:11px;color:var(--ap-gray-400);margin-top:4px;">â„¹ï¸ All remaining employees in the path will be notified.</div>'+
    '</div>'+
    '<div class="form-group">'+
      '<label>Rejection Remarks <span style="color:var(--ap-red);">*</span></label>'+
      '<textarea id="rejectRemarks" placeholder="Enter reason for rejection..." style="min-height:100px;width:100%;padding:9px 12px;border:1px solid var(--ap-gray-200);border-radius:6px;font-family:inherit;font-size:13px;"></textarea>'+
    '</div>';

  document.getElementById('rejectBillModal').classList.add('open');
  // Focus the remarks field
  setTimeout(function(){ var el=document.getElementById('rejectRemarks'); if(el) el.focus(); }, 150);
}

function confirmReject(){
  var billId = document.getElementById('rejectBillId').value;
  var remarks = document.getElementById('rejectRemarks').value.trim();
  if(!remarks){ showToast('âš ï¸ Please enter rejection remarks.',true); return; }
  var sendBack = (document.getElementById('rejectSendBack')||{}).value||'';
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  var r = getEmpRole();
  var byName = r.emp ? r.emp.name+' ('+r.emp.designation+')' : 'APTRANSCO Officer';
  if(bill){
    bill.status = sendBack ? 'Sent Back' : 'Rejected';
    if(sendBack){ bill.pendingWith=sendBack; bill.pendingDesig=''; }
    else { bill.pendingWith=null; bill.pendingDesig=null; }
    bill.log=bill.log||[];
    // FIX #3: Log notification to all remaining employees in path
    var pathPersons = [];
    bill.log.forEach(function(l){ if(l.by&&l.by!=='System'&&pathPersons.indexOf(l.by)<0) pathPersons.push(l.by); });
    var remaining = pathPersons.filter(function(p){ return p!==byName&&p!==sendBack; });
    bill.log.push({date:new Date().toLocaleDateString('en-IN'),
      action: (sendBack ? 'Rejected & Sent Back to '+sendBack : 'Bill Rejected') +
        (remaining.length ? '. Intimation sent to: '+remaining.join(', ') : ''),
      by: byName, status:bill.status, remarks:remarks});
    // Add intimation entries for each remaining person
    remaining.forEach(function(p){
      bill.log.push({date:new Date().toLocaleDateString('en-IN'),
        action:'Intimation: Bill rejected by '+byName+'. Sent back to '+(sendBack||'N/A'),
        by:'System (Notification to '+p+')', status:'Notification', remarks:remarks});
    });
  }
  closeModal('rejectBillModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast((sendBack?'â†© Bill sent back to '+sendBack:'âŒ Bill '+billId+' rejected.'));
}

// Remove openFormUpdate / saveFormUpdate (replaced by engineer review workflow)
// Keep for compatibility if called
function openFormUpdate(billId, formNo){
  openEngineerReview(billId);
}
function saveFormUpdate(){ closeModal('formUpdateModal'); }

function viewAPBillDocs(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var docs = bill.docs||{};
  var keys = Object.keys(docs);
  var grInfo = '';
  if(bill.selectedGRs && bill.selectedGRs.length){
    grInfo = '<div style="background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:12px;">'+
      '<div style="font-weight:700;color:var(--ap-blue);margin-bottom:4px;">ðŸ“‹ GR Document Nos. (Form 13):</div>'+
      bill.selectedGRs.map(function(gr){ return '<div>â€¢ <b>'+gr.grDocNo+'</b> | LOA: '+gr.loaNo+' | Gross: '+fmtAmt(gr.grossAmt)+'</div>'; }).join('')+
    '</div>';
  }
  if(bill.selectedForm14 && bill.selectedForm14.seNo){
    grInfo = '<div style="background:var(--ap-green-light);border:1px solid var(--ap-green);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:12px;">'+
      '<div style="font-weight:700;color:var(--ap-green);margin-bottom:4px;">ðŸ“‹ Form 14 â€“ Service Entry Sheet:</div>'+
      '<div>SE No: <b>'+bill.selectedForm14.seNo+'</b> | '+bill.selectedForm14.presentBillNo+' | Billing: '+fmtAmt(bill.selectedForm14.billingAmt)+'</div>'+
    '</div>';
  }
  var recInfo = '';
  if(bill.engineerRecoveries){
    var rec = bill.engineerRecoveries;
    recInfo = '<div style="background:var(--ap-gold-light);border:1px solid var(--ap-gold);border-radius:6px;padding:10px 14px;margin-bottom:12px;font-size:12px;">'+
      '<div style="font-weight:700;color:#7a4f00;margin-bottom:4px;">ðŸ’° Recoveries Proposed:</div>'+
      (rec.retention?'<div>Retention: <b>'+fmtAmt(rec.retention)+'</b></div>':'')+
      (rec.priceVariation?'<div>Price Variation: <b>'+fmtAmt(rec.priceVariation)+'</b></div>':'')+
      (rec.penalty?'<div>Penalty: <b>'+fmtAmt(rec.penalty)+'</b></div>':'')+
      (rec.seigniorage?'<div>Seigniorage Charges: <b>'+fmtAmt(rec.seigniorage)+'</b></div>':'')+
      (rec.others&&rec.others.length ? rec.others.map(function(o){ return '<div>Other: <b>'+fmtAmt(o.amount)+'</b> â€“ '+o.remarks+'</div>'; }).join('') : '')+
      '<div style="margin-top:6px;font-weight:700;">Net Amount After Recoveries: <span style="color:var(--ap-green);">'+fmtAmt(bill.netAmt||bill.grossAmt)+'</span></div>'+
    '</div>';
  }
  var html = grInfo + recInfo + (keys.length===0 ? '<p style="color:var(--ap-gray-400);padding:1rem;">No documents uploaded.</p>' :
    keys.map(function(k){
      var doc = docs[k];
      var catLabel2 = getDocCategoryLabel(k);
      return '<div style="border:1px solid var(--ap-gray-200);border-radius:6px;margin-bottom:8px;background:#fff;overflow:hidden;">'+
        '<div style="background:var(--ap-blue-light);padding:4px 14px;font-size:10px;font-weight:700;color:var(--ap-blue);text-transform:uppercase;letter-spacing:0.5px;">ðŸ“ '+catLabel2+'</div>'+
        '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;">'+
        '<span style="font-size:20px;">ðŸ“„</span>'+
        '<span style="flex:1;font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+doc.name+'</span>'+
        '<span style="font-size:11px;color:var(--ap-gray-400);">'+((doc.size/1024).toFixed(1))+' KB</span>'+
        (doc.blobUrl ? '<button class="btn btn-outline btn-xs" onclick="viewDoc(\''+k+'\',\''+billId+'\')">ðŸ‘ View</button>' : '<span style="font-size:11px;color:var(--ap-orange);">No preview</span>')+
        '</div></div>';
    }).join(''));
  document.getElementById('docViewTitle').textContent = 'Documents â€“ ' + billId;
  document.getElementById('docViewBody').innerHTML = html;
  document.getElementById('currentEditBillId').value = '';
  document.getElementById('docViewModal').classList.add('open');
}

function showFullLog(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var log = bill.log||[];
  document.getElementById('billLogTitle').textContent = 'Activity Log â€“ ' + billId;
  document.getElementById('billLogBody').innerHTML = '<div class="timeline">'+
    log.map(function(l, i){
      var isLast = i===log.length-1;
      return '<div class="timeline-item">'+
        '<div class="timeline-dot '+(isLast?'active':'done')+'"></div>'+
        '<div class="timeline-body">'+
          '<div class="timeline-title">'+l.action+'</div>'+
          '<div class="timeline-meta">'+l.date+' &nbsp;Â·&nbsp; By: '+l.by+'</div>'+
          (l.remarks?'<div class="timeline-remark">ðŸ’¬ '+l.remarks+'</div>':'')+
          '<span class="badge badge-submitted" style="margin-top:4px;font-size:10px;">'+l.status+'</span>'+
        '</div>'+
      '</div>';
    }).join('')+
  '</div>';
  document.getElementById('billLogModal').classList.add('open');
}

// Duplicate openRejectBill/confirmReject removed - use the enhanced versions above

function openFormUpdate(billId, formNo){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  document.getElementById('formUpdateBillId').value = billId;
  var isMat = bill.type==='Material';
  document.getElementById('formUpdateTitle').textContent = 'Update Form '+formNo+' â€“ '+billId;
  document.getElementById('formDocLabel').textContent = 'Form '+formNo+' Document No.';
  // Populate from FORM14 for service, or VMAT for material
  var opts;
  if(isMat){
    var matRecs = VMAT_DATA.filter(function(r){ return r.poNo===bill.poNo&&String(r.vendorId)===bill.vendorId; });
    opts = matRecs.map(function(r){ return '<option value="'+r.loaNo+'">'+r.loaNo+' | â‚¹'+Number(r.grossAmt).toLocaleString('en-IN',{maximumFractionDigits:0})+'</option>'; });
  } else {
    var svcRecs = FORM14.filter(function(r){ return r.poNo===bill.poNo&&String(r.contractorNo)===bill.vendorId; });
    opts = svcRecs.map(function(r){ return '<option value="'+r.seNo+'">SE '+r.seNo+' | '+r.presentBillNo+' | â‚¹'+Number(r.billingAmt).toLocaleString('en-IN',{maximumFractionDigits:0})+'</option>'; });
  }
  // Exclude already-used form docs for same PO+vendor
  var usedDocs = submittedBills.filter(function(b){ return b.poNo===bill.poNo&&b.vendorId===bill.vendorId&&b.billId!==billId&&(b.formDocNo); }).map(function(b){ return b.formDocNo; });
  var filteredOpts = opts.filter(function(o){ return !usedDocs.some(function(u){ return o.includes('value="'+u+'"'); }); });
  document.getElementById('formDocSelect').innerHTML = filteredOpts.join('')||'<option value="">No available records</option>';
  document.getElementById('formUpdateModal').classList.add('open');
}

function saveFormUpdate(){
  var billId = document.getElementById('formUpdateBillId').value;
  var docNo  = document.getElementById('formDocSelect').value;
  if(!docNo){ showToast('âš ï¸ Please select a document.',true); return; }
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(bill){
    var newStatus = bill.type==='Material' ? 'Form13 Updated' : 'Form14 Updated';
    bill.status = newStatus;
    bill.formDocNo = docNo;
    bill.log = bill.log||[];
    bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:(bill.type==='Material'?'Form 13':'Form 14')+' Updated â€“ Doc: '+docNo,by:'APTRANSCO Officer',status:newStatus});
  }
  closeModal('formUpdateModal');
  renderPendingBills();
  showToast('âœ… Form updated for Bill '+billId+'. Status: '+(bill?bill.status:''));
}


function initAPDashboard(){
  document.getElementById('apStatPOs').innerHTML = PO_DATA.length + ' <span class="stat-icon">ðŸ“‹</span>';
  document.getElementById('apStatMat').innerHTML = VMAT_DATA.length + ' <span class="stat-icon">ðŸ“¦</span>';
  document.getElementById('apStatSvc').innerHTML = VSVC_DATA.length + ' <span class="stat-icon">ðŸ”§</span>';
  document.getElementById('apStatF14').innerHTML = FORM14.length + ' <span class="stat-icon">ðŸ“„</span>';
  updatePendingCounts();
  // Vendor summary
  var vsummary = {};
  PO_DATA.forEach(function(p){
    if(!vsummary[p.vendorCode]) vsummary[p.vendorCode]={name:p.vendorName,pos:0,mat:0,svc:0};
    vsummary[p.vendorCode].pos++;
  });
  VMAT_DATA.forEach(function(r){ if(vsummary[r.vendorId]) vsummary[r.vendorId].mat++; });
  VSVC_DATA.forEach(function(r){ if(vsummary[r.vendorId]) vsummary[r.vendorId].svc++; });
  var rows = Object.keys(vsummary).map(function(vc){
    var v = vsummary[vc];
    return '<tr><td>'+vc+'</td><td><b>'+v.name+'</b></td><td>'+v.pos+'</td><td>'+v.mat+'</td><td>'+v.svc+'</td></tr>';
  }).join('');
  document.getElementById('apVendorSummaryTbl').innerHTML = rows;
  // Populate filters
  var vOpts = Object.keys(VENDOR_MAP).map(function(vc){ return '<option value="'+vc+'">'+VENDOR_MAP[vc]+'</option>'; }).join('');
  ['apBillVendorFilter','payVendorFilter'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.innerHTML = '<option value="">All Vendors</option>' + vOpts;
  });
  renderAllBills();
}

// ===== ALL BILLS =====
function renderAllBills(){
  var srch = (document.getElementById('apBillSearch')||{}).value||'';
  var typeF = (document.getElementById('apBillTypeFilter')||{}).value||'';
  var vF = (document.getElementById('apBillVendorFilter')||{}).value||'';

  // Build a combined view: each submitted bill matched with master payment data
  var rows = '';
  var allRows = [];

  // From submittedBills â€” match each to master data for payment details
  submittedBills.forEach(function(b){
    if(typeF && b.type!==typeF) return;
    if(vF && String(b.vendorId)!==vF) return;
    if(srch && !JSON.stringify(b).toLowerCase().includes(srch.toLowerCase())) return;

    var masterRecs = [];
    var grFormDocStr = 'â€”';
    var acctDocStr = 'â€”';
    var grossPosted = 0;
    var totalRec = 0;
    var netPaid = 0;
    var paidDate = 'â€”';
    var loaStr = 'â€”';

    if(b.selectedGRs && b.selectedGRs.length){
      var docs = []; var accts = []; var loas = [];
      b.selectedGRs.forEach(function(gr){
        docs.push('GR: '+gr.grDocNo+(gr.grYear?' ('+gr.grYear+')':''));
        var rec = VMAT_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&r.grDocNo===gr.grDocNo; });
        if(rec){
          if(rec.accountingDocNo && accts.indexOf(rec.accountingDocNo)<0) accts.push(rec.accountingDocNo+(rec.accountingYear?' ('+rec.accountingYear+')':''));
          if(rec.loaNo && loas.indexOf(rec.loaNo)<0) loas.push(rec.loaNo);
          grossPosted += rec.grossAmt||0;
          totalRec += (rec.itBankCharges||0)+(rec.penalty||0)+(rec.retention||0)+(rec.otherRecovery||0);
          netPaid += rec.amtPaid||0;
          if(!paidDate||paidDate==='â€”') paidDate = rec.paymentDate||'â€”';
        }
      });
      grFormDocStr = docs.join('<br>')||'â€”';
      acctDocStr = accts.join('<br>')||'â€”';
      loaStr = loas.join('<br>')||'â€”';
    } else if(b.selectedForm14 && b.selectedForm14.seNo){
      grFormDocStr = 'SE: '+b.selectedForm14.seNo+(b.selectedForm14.seYear?' ('+b.selectedForm14.seYear+')':'');
      var srec = VSVC_DATA.find(function(r){ return r.poNo===b.poNo&&String(r.vendorId)===b.vendorId&&String(r.seNo)===String(b.selectedForm14.seNo); });
      if(srec){
        acctDocStr = (srec.accountingDocNo||(srec.accountingYear?srec.accountingDocNo+' ('+srec.accountingYear+')':''))||'â€”';
        loaStr = srec.loaNo||'â€”';
        grossPosted = srec.grossAmt||0;
        totalRec = (srec.itBankCharges||0)+(srec.penalty||0)+(srec.retention||0)+(srec.otherRecovery||0);
        netPaid = srec.amtPaid||0;
        paidDate = srec.paymentDate||'â€”';
      }
    }

    // Override with accounts-wing saved values
    if(b.accountingDocNo) acctDocStr = b.accountingDocNo;
    if(b.loaNo) loaStr = b.loaNo;

    var st = b.status||'Submitted';
    var statusBadge = {
      'Submitted':'badge-submitted','Pending with AEE':'badge-processing','Reviewed by Engineer':'badge-form13',
      'Forwarded to EE':'badge-processing','Forwarded to Accounts':'badge-form13','Form13 Updated':'badge-form13',
      'Form14 Updated':'badge-form14','Invoice Posted':'badge-processing','LOA Created':'badge-form14',
      'LOA Approved':'badge-approved','With HQ Accounts':'badge-processing','Paid':'badge-paid',
      'Rejected':'badge-rejected','Sent Back by Accounts':'badge-rejected','Sent Back by HQ':'badge-rejected'
    };

    var docCount = Object.keys(b.docs||{}).length;
    var recStr = totalRec>0 ? '<span style="color:var(--ap-red);cursor:pointer;" title="Click for breakup" onclick="showAllBillsRecBreakup(\''+b.billId+'\')">'+fmtAmt(totalRec)+' ðŸ”</span>' : 'â€”';

    var apStatusCellAB = '<span class="badge '+(statusBadge[st]||'badge-submitted')+'">'+st+'</span>';
    if(b.pendingWith && st!=='Paid') apStatusCellAB += '<br><span style="font-size:10px;color:var(--ap-gray-400);">With: '+b.pendingWith+(b.pendingDesig?' ('+b.pendingDesig+')':'')+'</span>';
    allRows.push(
      '<tr>'+
      '<td style="font-size:11px;font-weight:600;">'+b.vendorId+'</td>'+
      '<td style="font-size:11px;">'+(VENDOR_MAP[b.vendorId]||b.vendorId)+'</td>'+
      '<td><span class="bill-id">'+b.billId+'</span></td>'+
      '<td style="font-size:11px;">'+(b.eInvNo||'â€”')+'</td>'+
      '<td>'+b.poNo+'</td>'+
      '<td><span class="badge '+(b.type==='Material'?'badge-submitted':'badge-form14')+'">'+b.type+'</span></td>'+
      '<td class="amount">'+(b.grossAmt?fmtAmt(b.grossAmt):'â€”')+'</td>'+
      '<td style="font-size:11px;">'+loaStr+'</td>'+
      '<td class="amount">'+(netPaid?fmtAmt(netPaid):'â€”')+'</td>'+
      '<td style="font-size:11px;">'+paidDate+'</td>'+
      '<td>'+apStatusCellAB+'</td>'+
      '<td><button class="btn btn-outline btn-xs" onclick="showBillDetails(\''+b.billId+'\')">ðŸ“‹ Details</button></td>'+
      '<td style="text-align:center;">'+(docCount>0?'<button class="btn btn-outline btn-xs" onclick="viewBillDocs(\''+b.billId+'\')">ðŸ“Ž ('+docCount+')</button>':'â€”')+'</td>'+
      '</tr>'
    );
  });

  rows = allRows.join('');
  document.getElementById('apAllBillsTbl').innerHTML = rows||'<tr><td colspan="13" style="text-align:center;color:var(--ap-gray-400);">No bills found. Bills appear here after vendors submit them.</td></tr>';
}

// ===== PAYMENT RECORDS =====
function renderPaymentsPage(){
  var vF = (document.getElementById('payVendorFilter')||{}).value||'';
  var tF = (document.getElementById('payTypeFilter')||{}).value||'';
  var data = ALL_PAYMENTS.filter(function(r){
    if(vF && String(r.vendorId)!==vF) return false;
    if(tF && r.type!==tF) return false;
    return true;
  });
  var mat_extra_cols = function(r){
    return '<td class="amount">'+fmtAmt(r.itCharges||0)+'</td>';
  };
  var rows = data.map(function(r){
    var itChg = r.type==='Material'?(VMAT_DATA.find(function(m){return m.loaNo===r.loaNo&&m.poNo===r.poNo;})||{})['IT and Bank Charges Recovery']||0:0;
    return '<tr><td>'+r.vendorName+'</td><td>'+r.poNo+'</td>'+
      '<td><span class="badge '+(r.type==='Material'?'badge-submitted':'badge-form14')+'">'+r.type+'</span></td>'+
      '<td class="amount">'+fmtAmt(r.grossAmt)+'</td>'+
      '<td class="amount">'+fmtAmt(itChg)+'</td>'+
      '<td class="amount">'+fmtAmt(r.penalty)+'</td>'+
      '<td class="amount">'+fmtAmt(r.retention)+'</td>'+
      '<td class="amount">'+fmtAmt(r.otherRecovery)+'</td>'+
      '<td class="amount">'+fmtAmt(r.netAmt)+'</td>'+
      '<td>'+r.loaNo+'</td>'+
      '<td class="amount">'+fmtAmt(r.amtPaid)+'</td>'+
      '<td>'+r.paymentDate+'</td></tr>';
  }).join('');
  document.getElementById('paymentsTbl').innerHTML = rows||'<tr><td colspan="12" style="text-align:center;color:var(--ap-gray-400);">No records.</td></tr>';
}

// ===== FORM 14 =====
function renderForm14Page(){
  var srch = (document.getElementById('f14Search')||{}).value||'';
  var data = FORM14.filter(function(r){
    if(srch && !JSON.stringify(r).toLowerCase().includes(srch.toLowerCase())) return false;
    return true;
  });
  var rows = data.map(function(r){
    return '<tr><td>'+r.seNo+'</td><td>'+r.scheme+'</td><td>'+r.poNo+'</td><td>'+(r.presentBillNo||'â€”')+'</td>'+
      '<td class="amount">'+fmtAmt(r.billingAmt)+'</td><td class="amount">'+fmtAmt(r.retentionAmt)+'</td>'+
      '<td class="amount">'+fmtAmt(r.penaltyAmt)+'</td><td class="amount">'+fmtAmt(r.adhocRecoveries)+'</td>'+
      '<td class="amount">'+fmtAmt(r.otherRecoveries)+'</td><td><span class="badge badge-submitted">'+r.status+'</span></td>'+
      '<td>'+r.description+'</td></tr>';
  }).join('');
  document.getElementById('form14Tbl').innerHTML = rows||'<tr><td colspan="11" style="text-align:center;color:var(--ap-gray-400);">No records.</td></tr>';
}

// ===== EMPLOYEE DIRECTORY =====
var sgFilter = '';
function renderEmployeesPage(){
  var srch = (document.getElementById('empSearch')||{}).value||'';
  var data = EMPLOYEES.filter(function(e){
    if(sgFilter && e.subGroup!==sgFilter) return false;
    if(srch && !JSON.stringify(e).toLowerCase().includes(srch.toLowerCase())) return false;
    return true;
  });
  var rows = data.map(function(e){
    return '<tr><td><b>'+e.id+'</b></td><td>'+e.name+'</td><td>'+e.designation+'</td><td><span class="badge badge-submitted">'+e.subGroup+'</span></td>'+
      '<td>'+e.busArea+'</td><td>'+e.orgUnit+'</td><td>'+e.email+'</td><td>'+e.tel+'</td></tr>';
  }).join('');
  document.getElementById('empDirTbl').innerHTML = rows||'<tr><td colspan="8" style="text-align:center;color:var(--ap-gray-400);">No employees found.</td></tr>';
  // Build SG filter buttons
  var sgs = [...new Set(EMPLOYEES.map(function(e){return e.subGroup;}))];
  var btns = '<div class="sg-btn '+(sgFilter===''?'active':'')+'" onclick="setSGFilter(\'\',this)">All</div>';
  sgs.forEach(function(sg){
    btns += '<div class="sg-btn '+(sgFilter===sg?'active':'')+'" onclick="setSGFilter(\''+sg+'\',this)">'+sg+'</div>';
  });
  var sgEl = document.getElementById('sgFilterBtns');
  if(sgEl) sgEl.innerHTML = btns;
}

function setSGFilter(sg, el){
  sgFilter = sg;
  document.querySelectorAll('.sg-btn').forEach(function(b){b.classList.remove('active');});
  if(el) el.classList.add('active');
  renderEmployeesPage();
}

// ===== PO ENGINEER MAPPING (Vendor + Business Area) =====
function buildEngChkList(containerId, hiddenSelId, emps, currentVals){
  var container = document.getElementById(containerId);
  var hiddenSel = document.getElementById(hiddenSelId);
  if(!container) return;
  var vals = currentVals || [];
  container.innerHTML = emps.map(function(e){
    var chked = vals.indexOf(String(e.id))>=0 ? 'checked' : '';
    return '<label style="display:flex;align-items:flex-start;gap:6px;padding:5px 6px;border-bottom:1px solid var(--ap-gray-100);cursor:pointer;font-size:11px;">'+
      '<input type="checkbox" value="'+e.id+'" '+chked+' onchange="syncEngChk(\'' + hiddenSelId + '\',\'' + containerId + '\')" style="width:14px;height:14px;accent-color:var(--ap-blue-mid);flex-shrink:0;margin-top:2px;">'+
      '<span><b>'+e.designation+'</b><br><span style="color:var(--ap-gray-400);">'+e.name+'</span></span>'+
    '</label>';
  }).join('') || '<div style="padding:8px;color:var(--ap-gray-400);font-size:11px;">No engineers found</div>';
  // Also sync hidden select
  hiddenSel.innerHTML = emps.map(function(e){
    return '<option value="'+e.id+'" '+(vals.indexOf(String(e.id))>=0?'selected':'')+'>'+e.name+'</option>';
  }).join('');
}

function syncEngChk(hiddenSelId, containerId){
  var sel = document.getElementById(hiddenSelId);
  var container = document.getElementById(containerId);
  if(!sel||!container) return;
  var checked = Array.from(container.querySelectorAll('input[type=checkbox]:checked')).map(function(c){return c.value;});
  Array.from(sel.options).forEach(function(o){ o.selected = checked.indexOf(o.value)>=0; });
}

function getChkVals(containerId){
  var container = document.getElementById(containerId);
  if(!container) return [];
  return Array.from(container.querySelectorAll('input[type=checkbox]:checked')).map(function(c){return c.value;});
}

function renderPOAssignPage(){
  var vendorSel = document.getElementById('mapVendorSelect');
  if(vendorSel){
    vendorSel.innerHTML = Object.keys(VENDOR_MAP).map(function(vc){
      return '<option value="'+vc+'">'+vc+' â€“ '+VENDOR_MAP[vc]+'</option>';
    }).join('');
    populateBusAreas();
  }
  var elecEmps = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Ele' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
  var civilEmps = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Civ' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
  var teleEmps  = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Ele' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
  buildEngChkList('mapElecChkList','mapElecEng', elecEmps, []);
  buildEngChkList('mapCivilChkList','mapCivilEng', civilEmps.length ? civilEmps : elecEmps, []);
  buildEngChkList('mapTelecomChkList','mapTelecomEng', teleEmps, []);
  renderPOMappingTable();
}

function populateBusAreas(){
  var vc = document.getElementById('mapVendorSelect') ? document.getElementById('mapVendorSelect').value : '';
  // Use plant code from PO data (plant column = baDesc area code extracted, or use baDesc)
  var busAreas = [...new Set(PO_DATA.filter(function(p){ return String(p.vendorCode)===vc; }).map(function(p){
    // Extract plant code from PO data - use the numeric plant code (5105, etc.)
    return p.plant || p.baCode || (p.baDesc ? p.baDesc : 'General');
  }).filter(Boolean))];
  var baSel = document.getElementById('mapBusAreaSelect');
  if(baSel) baSel.innerHTML = busAreas.map(function(b){ return '<option value="'+b+'">'+b+'</option>'; }).join('');
}

function renderPOMappingTable(){
  // FIX #5: Show all assigned engineers (arrays) in the table
  function namesFor(ids){
    if(!ids||!ids.length) return 'â€”';
    var arr = Array.isArray(ids) ? ids : [ids];
    return arr.filter(Boolean).map(function(id){
      return (EMPLOYEES.find(function(e){return String(e.id)===String(id);})||{name:id}).name;
    }).join(', ') || 'â€”';
  }
  var rows = Object.keys(poMappings).map(function(key){
    var m = poMappings[key];
    var parts = key.split('::');
    var vc = parts[0]; var ba = parts[1]||'';
    return '<tr><td><b>'+vc+'</b></td><td>'+VENDOR_MAP[vc]+'</td><td>'+ba+'</td>'+
      '<td style="font-size:12px;">'+namesFor(m.elec)+'</td><td style="font-size:12px;">'+namesFor(m.civil)+'</td><td style="font-size:12px;">'+namesFor(m.telecom)+'</td>'+
      '<td><button class="btn btn-outline btn-xs" onclick="editMapping(\''+key+'\')">Edit</button> '+
      '<button class="btn btn-xs" style="background:var(--ap-red-light);color:var(--ap-red);border:none;" onclick="deleteMapping(\''+key+'\')">ðŸ—‘</button></td></tr>';
  }).join('');
  document.getElementById('poMappingTbl').innerHTML = rows || '<tr><td colspan="7" style="text-align:center;color:var(--ap-gray-400);padding:1.5rem;">No mappings yet. Click + Add Mapping to begin.</td></tr>';
}

function deleteMapping(key){
  if(!confirm('Delete mapping for '+key+'?')) return;
  delete poMappings[key];
  saveBillsToStorage();
  renderPOMappingTable();
  showToast('Mapping deleted.');
}

function addPOMapping(){
  // Clear checkbox selections before opening
  var elecEmps = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Ele' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
  var civilEmps = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Civ' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
  var teleEmps  = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Ele' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
  buildEngChkList('mapElecChkList','mapElecEng', elecEmps, []);
  buildEngChkList('mapCivilChkList','mapCivilEng', civilEmps.length ? civilEmps : elecEmps, []);
  buildEngChkList('mapTelecomChkList','mapTelecomEng', teleEmps, []);
  document.getElementById('poMappingModal').classList.add('open');
}

function editMapping(key){
  var m = poMappings[key]||{};
  var parts = key.split('::');
  if(document.getElementById('mapVendorSelect')) document.getElementById('mapVendorSelect').value = parts[0];
  populateBusAreas();
  setTimeout(function(){
    if(document.getElementById('mapBusAreaSelect')) document.getElementById('mapBusAreaSelect').value = parts[1]||'';
    var elecEmps = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Ele' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
    var civilEmps = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Civ' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
    var teleEmps  = EMPLOYEES.filter(function(e){ return e.subArea==='Engineering-Ele' && ['EF','EE','ED','EC'].indexOf(e.subGroup)>=0; });
    var toArr = function(v){ return v ? (Array.isArray(v)?v:[v]).filter(Boolean) : []; };
    buildEngChkList('mapElecChkList','mapElecEng', elecEmps, toArr(m.elec));
    buildEngChkList('mapCivilChkList','mapCivilEng', civilEmps.length?civilEmps:elecEmps, toArr(m.civil));
    buildEngChkList('mapTelecomChkList','mapTelecomEng', teleEmps, toArr(m.telecom));
  },80);
  document.getElementById('poMappingModal').classList.add('open');
}

function savePOMapping(){
  var vc = document.getElementById('mapVendorSelect').value;
  var ba = document.getElementById('mapBusAreaSelect').value||'General';
  var key = vc+'::'+ba;
  // FIX #5: Collect multiple selections from multi-select dropdowns
  function getMultiVals(id){
    var sel = document.getElementById(id);
    if(!sel) return [];
    return Array.from(sel.selectedOptions).map(function(o){return o.value;}).filter(function(v){return v;});
  }
  // FIX #5: Prevent duplicate entry â€” check if same vendor+BA already mapped by another key (shouldn't happen since key is vc::ba)
  // Key is unique per vendor+BA so saving always updates that slot
  poMappings[key] = {
    elec: getChkVals('mapElecChkList'),
    civil: getChkVals('mapCivilChkList'),
    telecom: getChkVals('mapTelecomChkList')
  };
  closeModal('poMappingModal');
  saveBillsToStorage();
  renderPOMappingTable();
  showToast('âœ… Mapping saved for Vendor '+vc+' / '+ba);
}

// ===== ENGINEER INVOICE REVIEW =====
var currentReviewBillId = null;
function selectAllGRs(){
  var modalBody = document.getElementById('engReviewBody');
  if(!modalBody) return;
  var checkboxes = modalBody.querySelectorAll('input[type="checkbox"][data-grno]:not(:disabled)');
  var allChecked = Array.from(checkboxes).every(function(c){ return c.checked; });
  checkboxes.forEach(function(c){ c.checked = !allChecked; });
}

function openEngineerReview(billId){
  currentReviewBillId = billId;
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill){ showToast('Bill not found.',true); return; }

  var matRecs = VMAT_DATA.filter(function(r){ return r.poNo===bill.poNo && String(r.vendorId)===bill.vendorId; });
  var svcRecs = VSVC_DATA.filter(function(r){ return r.poNo===bill.poNo && String(r.vendorId)===bill.vendorId; });
  var hasMat  = matRecs.length > 0;
  var hasSvc  = svcRecs.length > 0;

  var showMat = (bill.type==='Material') ? (hasMat || !hasSvc) : (!hasSvc && hasMat);
  var showSvc = !showMat;
  if(bill.type==='Material' && !hasMat && hasSvc){ showSvc=true; showMat=false; }
  if(bill.type==='Service'  && !hasSvc && hasMat){ showMat=true; showSvc=false; }

  document.getElementById('engReviewTitle').textContent = 'Review Invoice - ' + billId + ' (' + bill.type + ')';
  var html = '';

  if(bill.type==='Material' && !hasMat && hasSvc){
    html += '<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:10px 14px;margin-bottom:10px;font-size:12px;color:#856404;"><b>Note:</b> Submitted as Material but master data has Service Entry Sheet records. Showing Form 14 below.</div>';
  }
  if(bill.type==='Service' && !hasSvc && hasMat){
    html += '<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:10px 14px;margin-bottom:10px;font-size:12px;color:#856404;"><b>Note:</b> Submitted as Service but master data has GR Document records. Showing GR list below.</div>';
  }

  if(showMat){
    var usedGRNos = [];
    submittedBills.filter(function(b){ return b.poNo===bill.poNo && b.vendorId===bill.vendorId && b.billId!==billId && b.selectedGRs; })
      .forEach(function(b){ b.selectedGRs.forEach(function(g){ usedGRNos.push(String(g.grDocNo)); }); });

    var grList = []; var seenGR = {};
    matRecs.forEach(function(r){
      var gNo = String(r.grDocNo||'').trim();
      if(!gNo) return;
      if(!seenGR[gNo]){
        seenGR[gNo]={grDocNo:gNo,grYear:String(r.grYear||''),grossAmt:Number(r.grossAmt)||0,netAmt:Number(r.netAmt)||0,loaNo:String(r.loaNo||''),already:usedGRNos.indexOf(gNo)>=0};
        grList.push(seenGR[gNo]);
      } else {
        seenGR[gNo].grossAmt += Number(r.grossAmt)||0;
        seenGR[gNo].netAmt   += Number(r.netAmt)||0;
      }
    });

    html += '<div style="margin-bottom:1rem;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">'
      +'<div style="font-size:13px;font-weight:700;color:var(--ap-blue);">1. Select Goods Receipt Document No(s). <span style="font-weight:400;color:var(--ap-red);font-size:11px;">* Required</span></div>'
      +(grList.length?'<button type="button" onclick="selectAllGRs()" style="font-size:11px;padding:3px 10px;background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);color:var(--ap-blue-mid);border-radius:4px;cursor:pointer;">Select All</button>':'')
      +'</div>';

    if(grList.length){
      html += '<div id="grListContainer" style="border:2px solid var(--ap-blue-mid);border-radius:6px;overflow:hidden;background:#fff;max-height:300px;overflow-y:auto;">';
      grList.forEach(function(gr,i){
        html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--ap-gray-100);background:'+(gr.already?'#f5f5f5':'#fff')+';'+(gr.already?'opacity:0.65;':'')+'">'
          +'<input type="checkbox" id="grchk_'+i+'" data-grno="'+gr.grDocNo+'" data-gryear="'+gr.grYear+'" data-loa="'+gr.loaNo+'" data-gross="'+gr.grossAmt+'" data-net="'+gr.netAmt+'"'
          +(gr.already?' disabled title="Already used"':'')
          +' style="width:18px;height:18px;accent-color:var(--ap-blue-mid);cursor:pointer;flex-shrink:0;">'
          +'<label for="grchk_'+i+'" style="flex:1;font-size:12px;cursor:'+(gr.already?'default':'pointer')+';">'
          +'<span style="font-weight:700;color:var(--ap-blue);">GR No: '+gr.grDocNo+'</span>'
          +(gr.grYear?' | Year: <b>'+gr.grYear+'</b>':'')
          +' | Gross: <b>'+fmtAmt(gr.grossAmt)+'</b>'
          +(gr.already?' <span style="color:var(--ap-orange);font-size:10px;font-weight:700;">[Already used]</span>':'')
          +'</label></div>';
      });
      html += '</div>';
    } else {
      html += '<div style="padding:12px;color:var(--ap-red);font-size:13px;border:2px solid var(--ap-red);border-radius:6px;background:#fff0f0;">No GR records found in master data for this PO + Vendor.</div>';
    }
    html += '<div style="margin-top:10px;background:var(--ap-gray-50);border:1px solid var(--ap-gray-200);border-radius:6px;padding:10px 14px;">'
      +'<label style="font-size:12px;font-weight:700;color:var(--ap-gray-600);display:block;margin-bottom:6px;">Upload Form 13 PDF(s) - multiple files allowed:</label>'
      +'<input type="file" id="form13Upload" accept=".pdf" multiple style="font-size:13px;padding:4px;width:100%;">'
      +'</div></div>';
  }

  if(showSvc){
    var form14Recs = FORM14.filter(function(r){ return r.poNo===bill.poNo && String(r.contractorNo)===bill.vendorId; });
    var allSERows=[]; var seenSE={};
    svcRecs.forEach(function(r){
      var sNo=String(r.seNo||'').trim();
      if(!sNo) return;
      if(!seenSE[sNo]){ seenSE[sNo]=true; allSERows.push({seNo:sNo,seYear:String(r.seYear||''),billNo:'',billingAmt:Number(r.grossAmt)||0,netAmt:Number(r.netAmt)||0,loaNo:String(r.loaNo||''),src:'vsvc'}); }
    });
    form14Recs.forEach(function(r){
      var sNo=String(r.seNo||'').trim();
      if(!sNo||seenSE[sNo]) return;
      seenSE[sNo]=true; allSERows.push({seNo:sNo,seYear:'',billNo:r.presentBillNo||'',billingAmt:Number(r.billingAmt)||0,netAmt:0,loaNo:'',src:'form14'});
    });
    var usedSEs=[];
    submittedBills.filter(function(b){ return b.poNo===bill.poNo&&b.vendorId===bill.vendorId&&b.billId!==billId&&b.selectedForm14; })
      .forEach(function(b){ usedSEs.push(String(b.selectedForm14.seNo)); });

    html += '<div style="margin-bottom:1rem;">';
    html += '<div style="font-size:13px;font-weight:700;color:var(--ap-blue);margin-bottom:6px;">1. Select Form 14 - Service Entry Sheet No. <span style="font-weight:400;color:var(--ap-red);font-size:11px;">* Required</span></div>';
    if(allSERows.length){
      html += '<div style="border:2px solid var(--ap-green);border-radius:6px;overflow:hidden;background:#fff;max-height:300px;overflow-y:auto;">';
      allSERows.forEach(function(r,i){
        var already=usedSEs.indexOf(r.seNo)>=0;
        html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--ap-gray-100);background:'+(already?'#f5f5f5':'#fff')+';'+(already?'opacity:0.65;':'')+'">'
          +'<input type="radio" name="form14sel" id="f14_'+i+'" value="'+i+'"'
          +(already?' disabled':'')
          +' style="width:16px;height:16px;accent-color:var(--ap-green);cursor:pointer;flex-shrink:0;">'
          +'<label for="f14_'+i+'" style="flex:1;font-size:12px;cursor:'+(already?'default':'pointer')+';">'
          +'<span style="font-weight:700;color:var(--ap-green);">SE No: '+r.seNo+'</span>'
          +(r.seYear?' | Year: <b>'+r.seYear+'</b>':'')
          +(r.billNo?' | '+r.billNo:'')
          +' | Gross: <b>'+fmtAmt(r.billingAmt)+'</b>'
          +(already?' <span style="color:var(--ap-orange);font-size:10px;font-weight:700;">[Already used]</span>':'')
          +'</label></div>';
      });
      html += '</div>';
    } else {
      html += '<div style="padding:12px;color:var(--ap-red);font-size:13px;border:2px solid var(--ap-red);border-radius:6px;background:#fff0f0;">No Service Entry Sheet records found in master data for this PO + Vendor.</div>';
    }
    html += '<div style="margin-top:10px;background:var(--ap-gray-50);border:1px solid var(--ap-gray-200);border-radius:6px;padding:10px 14px;">'
      +'<label style="font-size:12px;font-weight:700;color:var(--ap-gray-600);display:block;margin-bottom:6px;">Upload Form 14 PDF:</label>'
      +'<input type="file" id="form14Upload" accept=".pdf" style="font-size:13px;padding:4px;width:100%;">'
      +'</div></div>';
    window._allSERows = allSERows;
  }

  html += '<div style="border:1px solid var(--ap-gray-200);border-radius:8px;padding:1rem;margin-bottom:1rem;">'
    +'<div style="font-size:13px;font-weight:700;color:var(--ap-blue);margin-bottom:0.75rem;">2. Recoveries (select as applicable)</div>'
    +'<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--ap-gray-100);">'
      +'<input type="checkbox" id="recRetCheck" style="width:16px;height:16px;accent-color:var(--ap-blue-mid);" onchange="toggleRecField(&quot;recRetAmt&quot;,this.checked)">'
      +'<label for="recRetCheck" style="min-width:180px;font-size:13px;font-weight:600;">Retention Amount</label>'
      +'<input type="number" id="recRetAmt" placeholder="Amount" style="display:none;padding:6px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;width:150px;" oninput="updateNetDisplay()">'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--ap-gray-100);">'
      +'<input type="checkbox" id="recPVCheck" style="width:16px;height:16px;accent-color:var(--ap-blue-mid);" onchange="toggleRecField(&quot;recPVAmt&quot;,this.checked)">'
      +'<label for="recPVCheck" style="min-width:180px;font-size:13px;font-weight:600;">Price Variation Recovery</label>'
      +'<input type="number" id="recPVAmt" placeholder="Amount" style="display:none;padding:6px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;width:150px;" oninput="updateNetDisplay()">'
      +'<span id="recPVFileBtn" style="display:none;"><label style="font-size:11px;color:var(--ap-gray-600);margin-left:8px;">PV Report:</label><input type="file" id="recPVFile" accept=".pdf" style="font-size:11px;margin-left:4px;"></span>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--ap-gray-100);">'
      +'<input type="checkbox" id="recPenCheck" style="width:16px;height:16px;accent-color:var(--ap-blue-mid);" onchange="toggleRecField(&quot;recPenAmt&quot;,this.checked)">'
      +'<label for="recPenCheck" style="min-width:180px;font-size:13px;font-weight:600;">Penalty Amount</label>'
      +'<input type="number" id="recPenAmt" placeholder="Amount" style="display:none;padding:6px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;width:150px;" oninput="updateNetDisplay()">'
      +'<span id="recPenFileBtn" style="display:none;"><label style="font-size:11px;color:var(--ap-gray-600);margin-left:8px;">Penalty Stmt:</label><input type="file" id="recPenFile" accept=".pdf" style="font-size:11px;margin-left:4px;"></span>'
    +'</div>'
    +(showSvc ? '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--ap-gray-100);flex-wrap:wrap;"><input type="checkbox" id="recSeigniorageCheck" style="width:16px;height:16px;accent-color:var(--ap-blue-mid);" onchange="toggleRecField(&quot;recSeigniorageAmt&quot;,this.checked);toggleRecField(&quot;recSeigniorageFileBtn&quot;,this.checked)"><label for="recSeigniorageCheck" style="min-width:180px;font-size:13px;font-weight:600;">Seigniorage Charges</label><input type="number" id="recSeigniorageAmt" placeholder="Amount" style="display:none;padding:6px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;width:150px;" oninput="updateNetDisplay()"><span id="recSeigniorageFileBtn" style="display:none;"><label style="font-size:11px;color:var(--ap-gray-600);margin-left:8px;">Seigniorage Doc:</label><input type="file" id="recSeigniorageFile" accept=".pdf" style="font-size:11px;margin-left:4px;"></span></div>' : '')
    +'<div id="otherRecoveriesSection">'
      +'<div style="font-size:12px;font-weight:600;color:var(--ap-gray-600);padding:8px 0 4px;">Other Recoveries:</div>'
      +'<div id="otherRecItems"></div>'
      +'<button onclick="addOtherRecovery()" style="background:var(--ap-blue-light);border:1px solid var(--ap-blue-mid);color:var(--ap-blue-mid);border-radius:4px;padding:4px 12px;font-size:12px;cursor:pointer;margin-top:4px;">+ Add Other Recovery</button>'
    +'</div>'
  +'</div>'
  +'<div style="background:var(--ap-gray-50);border:1px solid var(--ap-gray-200);border-radius:6px;padding:10px 14px;font-size:13px;">'
    +'<b>Vendor Gross Amount:</b> '+fmtAmt(bill.grossAmt||0)
    +'<div id="netAmtDisplay" style="margin-top:4px;font-weight:700;color:var(--ap-green);font-size:15px;">Net Amount (after recoveries): <span id="netAmtVal">'+fmtAmt(bill.grossAmt||0)+'</span></div>'
  +'</div>';

  document.getElementById('engReviewBody').innerHTML = html;
  window._form14Recs = FORM14.filter(function(r){ return r.poNo===bill.poNo && String(r.contractorNo)===bill.vendorId; });
  window._matRecs = matRecs;
  window._showMat = showMat;
  window._showSvc = showSvc;
  ['recRetAmt','recPVAmt','recPenAmt'].forEach(function(id){
    var el=document.getElementById(id);
    if(el) el.addEventListener('input',updateNetDisplay);
  });
  otherRecCount = 0;
  document.getElementById('engReviewModal').classList.add('open');
}

function toggleRecField(fieldId, show){
  var el = document.getElementById(fieldId);
  if(el) el.style.display = show ? '' : 'none';
  // Show/hide file upload spans for PV and Penalty
  if(fieldId==='recPVAmt'){
    var s=document.getElementById('recPVFileBtn'); if(s) s.style.display=show?'':'none';
  }
  if(fieldId==='recPenAmt'){
    var s2=document.getElementById('recPenFileBtn'); if(s2) s2.style.display=show?'':'none';
  }
  updateNetDisplay();
}

var otherRecCount = 0;
function addOtherRecovery(){
  otherRecCount++;
  var idx = otherRecCount;
  var div = document.createElement('div');
  div.id = 'otherRec_'+idx;
  div.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
  div.innerHTML = '<input type="number" id="otherAmt_'+idx+'" placeholder="Amount â‚¹" oninput="updateNetDisplay()" style="padding:6px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;width:130px;">'+
    '<input type="text" id="otherRem_'+idx+'" placeholder="Remarks..." style="flex:1;padding:6px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;">'+
    '<button onclick="document.getElementById(\'otherRec_'+idx+'\').remove();updateNetDisplay();" style="background:var(--ap-red-light);border:none;color:var(--ap-red);border-radius:4px;padding:4px 8px;cursor:pointer;font-size:14px;">Ã—</button>';
  document.getElementById('otherRecItems').appendChild(div);
}

function updateNetDisplay(){
  var bill = submittedBills.find(function(b){ return b.billId===currentReviewBillId; });
  var gross = bill ? (bill.grossAmt||0) : 0;
  var ret = (document.getElementById('recRetCheck')&&document.getElementById('recRetCheck').checked) ? (parseFloat(document.getElementById('recRetAmt').value)||0) : 0;
  var pv = (document.getElementById('recPVCheck')&&document.getElementById('recPVCheck').checked) ? (parseFloat(document.getElementById('recPVAmt').value)||0) : 0;
  var pen = (document.getElementById('recPenCheck')&&document.getElementById('recPenCheck').checked) ? (parseFloat(document.getElementById('recPenAmt').value)||0) : 0;
  var seig = (document.getElementById('recSeigniorageCheck')&&document.getElementById('recSeigniorageCheck').checked) ? (parseFloat(document.getElementById('recSeigniorageAmt').value)||0) : 0;
  var others = 0;
  document.querySelectorAll('[id^="otherAmt_"]').forEach(function(el){ others += parseFloat(el.value)||0; });
  var net = gross - ret - pv - pen - seig - others;
  var el = document.getElementById('netAmtVal');
  if(el) el.textContent = fmtAmt(net);
}

function saveEngineerReview(){
  var bill = submittedBills.find(function(b){ return b.billId===currentReviewBillId; });
  if(!bill){ showToast('Bill not found.',true); return; }
  // Use the actual section shown (auto-detected in openEngineerReview)
  var isMat = window._showMat !== undefined ? window._showMat : (bill.type==='Material');

  if(isMat){
    // Collect selected GR checkboxes â€” query scoped inside modal body
    var modalBody = document.getElementById('engReviewBody');
    var selectedGRs = [];
    if(modalBody){
      modalBody.querySelectorAll('input[type="checkbox"][data-grno]').forEach(function(chk){
        if(chk.checked){
          selectedGRs.push({
            grDocNo: chk.getAttribute('data-grno') || '',
            grYear:  chk.getAttribute('data-gryear') || '',
            loaNo:   chk.getAttribute('data-loa') || '',
            grossAmt: parseFloat(chk.getAttribute('data-gross')) || 0,
            netAmt:   parseFloat(chk.getAttribute('data-net')) || 0
          });
        }
      });
    }
    if(!selectedGRs.length){
      showToast('âš ï¸ Please tick at least one Goods Receipt Document No. from the list.',true);
      return;
    }
    bill.selectedGRs = selectedGRs;

    // Form 13 PDF uploads (multiple)
    var f13Input = document.getElementById('form13Upload');
    if(f13Input && f13Input.files && f13Input.files.length){
      for(var i=0; i<f13Input.files.length; i++){
        var f = f13Input.files[i];
        bill.docs['form13_'+i] = {name:f.name, size:f.size, blobUrl:URL.createObjectURL(f)};
      }
    }

  } else {
    // SERVICE: collect Form 14 radio selection
    var f14Radio = document.querySelector('[name="form14sel"]:checked');
    if(!f14Radio){
      showToast('âš ï¸ Please select a Service Entry Sheet No. from the list.',true);
      return;
    }
    var seIdx = parseInt(f14Radio.value);
    bill.selectedForm14 = (window._allSERows || window._form14Recs || [])[seIdx] || null;

    // Form 14 PDF upload
    var f14Input = document.getElementById('form14Upload');
    if(f14Input && f14Input.files && f14Input.files[0]){
      var f14 = f14Input.files[0];
      bill.docs['form14_pdf'] = {name:f14.name, size:f14.size, blobUrl:URL.createObjectURL(f14)};
    }
  }

  // Collect recoveries
  var rec = {};
  if(document.getElementById('recRetCheck') && document.getElementById('recRetCheck').checked)
    rec.retention = parseFloat(document.getElementById('recRetAmt').value) || 0;
  if(document.getElementById('recPVCheck') && document.getElementById('recPVCheck').checked){
    rec.priceVariation = parseFloat(document.getElementById('recPVAmt').value) || 0;
    var pvFile = document.getElementById('recPVFile');
    if(pvFile && pvFile.files && pvFile.files[0]){ var pf=pvFile.files[0]; bill.docs['pvReport']={name:pf.name,size:pf.size,blobUrl:URL.createObjectURL(pf)}; }
  }
  if(document.getElementById('recPenCheck') && document.getElementById('recPenCheck').checked){
    rec.penalty = parseFloat(document.getElementById('recPenAmt').value) || 0;
    var penFile = document.getElementById('recPenFile');
    if(penFile && penFile.files && penFile.files[0]){ var pef=penFile.files[0]; bill.docs['penaltyStmt']={name:pef.name,size:pef.size,blobUrl:URL.createObjectURL(pef)}; }
  }
  if(document.getElementById('recSeigniorageCheck') && document.getElementById('recSeigniorageCheck').checked){
    rec.seigniorage = parseFloat(document.getElementById('recSeigniorageAmt').value) || 0;
    var seigFile = document.getElementById('recSeigniorageFile');
    if(seigFile && seigFile.files && seigFile.files[0]){ var sf=seigFile.files[0]; bill.docs['seigniorageDoc']={name:sf.name,size:sf.size,blobUrl:URL.createObjectURL(sf)}; }
  }
  rec.others = [];
  document.querySelectorAll('[id^="otherRec_"]').forEach(function(div){
    var idx2 = div.id.split('_')[1];
    var amt = parseFloat((document.getElementById('otherAmt_'+idx2)||{}).value) || 0;
    var rem = (document.getElementById('otherRem_'+idx2)||{}).value || '';
    if(amt) rec.others.push({amount:amt, remarks:rem});
  });
  bill.engineerRecoveries = rec;

  // Calculate net amount
  var gross = bill.grossAmt || 0;
  var totalRec = (rec.retention||0) + (rec.priceVariation||0) + (rec.penalty||0) + (rec.seigniorage||0) + (rec.others||[]).reduce(function(s,o){ return s+o.amount; }, 0);
  bill.netAmt = gross - totalRec;

  // Update status
  var empObj = currentEmpId ? EMPLOYEES.find(function(e){ return String(e.id)===currentEmpId; }) : null;
  var empName = empObj ? empObj.name : 'Engineer';
  var empDesig = empObj ? empObj.designation : '';
  bill.status = 'Reviewed by Engineer';
  bill.pendingWith = empName;
  bill.pendingDesig = empDesig;
  bill.log = bill.log || [];
  bill.log.push({
    date: new Date().toLocaleDateString('en-IN'),
    action: (isMat ? 'GR/Form13 reviewed' : 'Form14/SE reviewed') + ' by Engineer. Net after recoveries: ' + fmtAmt(bill.netAmt),
    by: empName + (empDesig ? ' ('+empDesig+')' : ''),
    status: 'Reviewed by Engineer',
    remarks: 'Total Recoveries: ' + fmtAmt(totalRec) + '. Use "Forward to EE" to submit.'
  });

  closeModal('engReviewModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âœ… Review saved. Net Amount: '+fmtAmt(bill.netAmt)+'. Now use "âž¡ Forward to EE" to submit.');
}


// ===== ACCOUNTS WING =====
function openAcctAction(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var r = getEmpRole();
  var isHQ = r.isHQAcct;
  var isField = r.isFieldAcct;
  document.getElementById('acctActionTitle').textContent = (isHQ?'HQ':'Field')+' Accounts Wing â€“ '+billId;
  var isMat = bill.type==='Material';

  // Detect actual type from master data (same as engineer review)
  var hasMatData = VMAT_DATA.some(function(r){ return r.poNo===bill.poNo && String(r.vendorId)===bill.vendorId; });
  var hasSvcData = VSVC_DATA.some(function(r){ return r.poNo===bill.poNo && String(r.vendorId)===bill.vendorId; });
  if(isMat && !hasMatData && hasSvcData) isMat = false;
  if(!isMat && !hasSvcData && hasMatData) isMat = true;

  // Get ALL accounting documents and LOA numbers for selected GRs/SEs
  var acctDocNos = [];
  var loaNos = [];
  var amtPaid = 0;
  var payDate = '';

  if(isMat && bill.selectedGRs && bill.selectedGRs.length){
    bill.selectedGRs.forEach(function(gr){
      var rec = VMAT_DATA.find(function(r){ return r.poNo===bill.poNo && String(r.vendorId)===bill.vendorId && r.grDocNo===gr.grDocNo; });
      if(rec){
        if(rec.accountingDocNo && acctDocNos.indexOf(rec.accountingDocNo)<0) acctDocNos.push(rec.accountingDocNo);
        if(rec.loaNo && loaNos.indexOf(rec.loaNo)<0) loaNos.push(rec.loaNo);
        amtPaid += rec.amtPaid||0;
        if(!payDate && rec.paymentDate) payDate = rec.paymentDate;
      }
    });
  } else if(!isMat && bill.selectedForm14){
    var svcRec = VSVC_DATA.find(function(r){ return r.poNo===bill.poNo && String(r.vendorId)===bill.vendorId && String(r.seNo)===String(bill.selectedForm14.seNo); });
    if(!svcRec) svcRec = VSVC_DATA.find(function(r){ return r.poNo===bill.poNo && String(r.vendorId)===bill.vendorId; });
    if(svcRec){
      if(svcRec.accountingDocNo) acctDocNos.push(svcRec.accountingDocNo);
      if(svcRec.loaNo) loaNos.push(svcRec.loaNo);
      amtPaid = svcRec.amtPaid||0;
      payDate = svcRec.paymentDate||'';
    }
  }

  // Fallback if no records found
  if(!acctDocNos.length) acctDocNos = [bill.accountingDocNo||'â€”'];
  if(!loaNos.length) loaNos = [bill.loaNo||'â€”'];
  if(!amtPaid) amtPaid = bill.netAmt||0;

  var acctDocNo  = acctDocNos.join(', ');
  var loaNo      = loaNos.join(', ');
  var loaNoHQ    = bill.loaNo || loaNo;

  var html = '<div style="background:var(--ap-gray-50);border:1px solid var(--ap-gray-200);border-radius:6px;padding:10px 14px;margin-bottom:1rem;font-size:13px;">'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">'+
    '<div><span style="color:var(--ap-gray-400);">Bill ID:</span> <b>'+bill.billId+'</b></div>'+
    '<div><span style="color:var(--ap-gray-400);">Type:</span> '+bill.type+'</div>'+
    '<div><span style="color:var(--ap-gray-400);">Vendor:</span> <b>'+VENDOR_MAP[bill.vendorId]+'</b></div>'+
    '<div><span style="color:var(--ap-gray-400);">PO:</span> '+bill.poNo+'</div>'+
    '<div><span style="color:var(--ap-gray-400);">Gross Amount:</span> <b>'+fmtAmt(bill.grossAmt||0)+'</b></div>'+
    '<div><span style="color:var(--ap-gray-400);">Net Amount:</span> <b style="color:var(--ap-green);">'+fmtAmt(bill.netAmt||bill.grossAmt||0)+'</b></div>'+
    '<div><span style="color:var(--ap-gray-400);">Accounting Doc No:</span> <b>'+acctDocNo+'</b></div>'+
    '<div><span style="color:var(--ap-gray-400);">LOA No:</span> <b>'+loaNo+'</b></div>'+
    '</div></div>';

  if(bill.engineerRecoveries){
    var rec=bill.engineerRecoveries;
    html += '<div style="font-size:12px;background:var(--ap-gold-light);border:1px solid var(--ap-gold);border-radius:6px;padding:8px 12px;margin-bottom:1rem;">'+
      '<b>Recoveries:</b> '+
      (rec.retention?'Retention: '+fmtAmt(rec.retention)+' ':'')+(rec.priceVariation?'| PV: '+fmtAmt(rec.priceVariation)+' ':'')+
      (rec.penalty?'| Penalty: '+fmtAmt(rec.penalty)+' ':'')+
      (rec.others&&rec.others.length?'| Others: '+rec.others.map(function(o){return fmtAmt(o.amount);}).join(', '):'')+'</div>';
  }

  // Field accounts actions
  html += '<div style="display:flex;flex-direction:column;gap:10px;">';
  if(isField){
    // Invoice Post
    html += '<div style="border:1px solid var(--ap-gray-200);border-radius:6px;padding:12px;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--ap-blue);margin-bottom:6px;">ðŸ“‹ Invoice Post (Generate Accounting Document)</div>'+
      '<div style="font-size:12px;color:var(--ap-gray-600);margin-bottom:8px;">Accounting Doc No. from master: <b>'+acctDocNo+'</b></div>'+
      '<button class="btn btn-primary btn-sm" onclick="doInvoicePost(\''+billId+'\',\''+acctDocNo+'\')">ðŸ“¤ Invoice Post</button>'+
    '</div>';
    // LOA Created
    html += '<div style="border:1px solid var(--ap-gray-200);border-radius:6px;padding:12px;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--ap-blue);margin-bottom:6px;">ðŸ“Ž LOA Created</div>'+
      '<div style="font-size:12px;color:var(--ap-gray-600);margin-bottom:8px;">LOA No. from master: <b>'+loaNo+'</b></div>'+
      '<button class="btn btn-warning btn-sm" onclick="doLOACreated(\''+billId+'\',\''+loaNo+'\')">âœ… LOA Created</button>'+
    '</div>';
    // Reject / Send Back
    html += '<div style="border:1px solid var(--ap-red-light);border-radius:6px;padding:12px;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--ap-red);margin-bottom:6px;">âœ— Reject / Send Back</div>'+
      '<select id="acctSendBackTo" style="width:100%;padding:7px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;margin-bottom:8px;">'+
        (bill.log||[]).filter(function(l){return l.by&&l.by!=='System';}).map(function(l){ return '<option value="'+l.by+'">'+l.by+' ('+l.status+')</option>'; }).join('')+
      '</select>'+
      '<textarea id="acctRejectRem" placeholder="Rejection remarks..." style="width:100%;padding:7px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;min-height:60px;font-family:inherit;"></textarea>'+
      '<button class="btn btn-danger btn-sm" style="margin-top:8px;" onclick="doAcctReject(\''+billId+'\')">Reject &amp; Send Back</button>'+
    '</div>';
    // Submit to HQ
    html += '<div style="border:1px solid var(--ap-green-light);border-radius:6px;padding:12px;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--ap-green);margin-bottom:6px;">âž¡ Submit to HQ Accounts Wing</div>'+
      '<button class="btn btn-success btn-sm" onclick="doSubmitToHQ(\''+billId+'\')">Submit to HQ â†’</button>'+
    '</div>';
  } else {
    // HQ Actions: LOA Approved, LOA Paid, Reject
    // LOA Approved button
    html += '<div style="border:1px solid #b3d9ff;border-radius:6px;padding:12px;background:#e8f4ff;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--ap-blue);margin-bottom:6px;">âœ… LOA Approved</div>'+
      '<div style="font-size:12px;color:var(--ap-gray-600);margin-bottom:8px;">LOA No: <b>'+loaNoHQ+'</b> &nbsp;|&nbsp; Acct Doc: <b>'+acctDocNo+'</b></div>'+
      '<button class="btn btn-primary btn-sm" onclick="doLOAApproved(\''+billId+'\')">âœ… Mark LOA Approved</button>'+
    '</div>';
    // LOA Paid button
    var payDateVal = payDate ? payDate.substring(0,10) : new Date().toISOString().substring(0,10);
    html += '<div style="border:1px solid var(--ap-green-light);border-radius:6px;padding:12px;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--ap-green);margin-bottom:6px;">ðŸ’³ LOA Paid to Vendor</div>'+
      '<div style="background:var(--ap-green-light);border:1px solid var(--ap-green);border-radius:4px;padding:8px 12px;margin-bottom:8px;font-size:12px;">'+
        '<div style="font-weight:600;color:var(--ap-green);">Net Amount Paid: <span style="font-size:15px;font-family:Rajdhani,sans-serif;">â‚¹'+fmtAmt(amtPaid)+'</span></div>'+
        '<div style="font-size:11px;color:var(--ap-gray-600);margin-top:2px;">Amount is auto-fetched from accounting records. To change, update master data.</div>'+
        '<input type="hidden" id="hqPayAmt" value="'+amtPaid+'">'+
      '</div>'+
      '<div style="margin-bottom:8px;"><label style="font-size:11px;font-weight:600;color:var(--ap-gray-600);display:block;margin-bottom:3px;">Payment Date</label>'+
        '<input type="date" id="hqPayDate" value="'+payDateVal+'" style="width:100%;padding:6px 10px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:13px;"></div>'+
      '<button class="btn btn-success btn-sm" onclick="doLOAPaid(\''+billId+'\')">ðŸ’³ Mark LOA Paid</button>'+
    '</div>';
    html += '<div style="border:1px solid var(--ap-red-light);border-radius:6px;padding:12px;">'+
      '<div style="font-weight:700;font-size:13px;color:var(--ap-red);margin-bottom:6px;">âœ— HQ Reject / Send Back</div>'+
      '<select id="hqSendBackTo" style="width:100%;padding:7px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;margin-bottom:8px;">'+
        (bill.log||[]).filter(function(l){return l.by&&l.by!=='System';}).map(function(l){ return '<option value="'+l.by+'">'+l.by+' ('+l.status+')</option>'; }).join('')+
      '</select>'+
      '<textarea id="hqRejectRem" placeholder="Rejection remarks..." style="width:100%;padding:7px;border:1px solid var(--ap-gray-200);border-radius:4px;font-size:12px;min-height:60px;font-family:inherit;"></textarea>'+
      '<button class="btn btn-danger btn-sm" style="margin-top:8px;" onclick="doHQReject(\''+billId+'\')">Reject &amp; Send Back</button>'+
    '</div>';
  }
  html += '</div>';
  document.getElementById('acctActionBody').innerHTML = html;
  document.getElementById('acctActionModal').classList.add('open');
}

function doInvoicePost(billId, acctDocNo){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  bill.accountingDocNo = acctDocNo;
  bill.status = 'Invoice Posted';
  bill.log = bill.log||[];
  bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'Invoice Posted â€“ Acct Doc: '+acctDocNo,by:'Field Accounts Wing',status:'Invoice Posted'});
  closeModal('acctActionModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âœ… Invoice Posted. Accounting Doc: '+acctDocNo);
}

function doLOACreated(billId, loaNo){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  bill.loaNo = loaNo;
  bill.status = 'LOA Created';
  bill.log = bill.log||[];
  bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'LOA Created â€“ LOA No: '+loaNo,by:'Field Accounts Wing',status:'LOA Created'});
  closeModal('acctActionModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âœ… LOA Created: '+loaNo+'. Ready to submit to HQ.');
}

function doSubmitToHQ(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  bill.status = 'With HQ Accounts';
  bill.pendingWith = 'HQ Accounts Wing';
  bill.pendingDesig = 'SAO/HQ';
  bill.log = bill.log||[];
  bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'Submitted to HQ Accounts Wing',by:'Field Accounts Wing',status:'With HQ Accounts'});
  closeModal('acctActionModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âœ… Bill sent to HQ Accounts Wing.');
}

function doAcctReject(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  var sendTo = (document.getElementById('acctSendBackTo')||{}).value||'Engineer';
  var remarks = (document.getElementById('acctRejectRem')||{}).value||'';
  if(!remarks){ showToast('âš ï¸ Please enter rejection remarks.',true); return; }
  if(bill){
    bill.status = 'Sent Back by Accounts';
    bill.pendingWith = sendTo;
    bill.log = bill.log||[];
    bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'Rejected by Field Accounts â€“ Sent back to '+sendTo,by:'Field Accounts Wing',status:'Sent Back',remarks:remarks});
  }
  closeModal('acctActionModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âŒ Bill sent back to '+sendTo+'.');
}

function doHQReject(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  var sendTo = (document.getElementById('hqSendBackTo')||{}).value||'Field Accounts';
  var remarks = (document.getElementById('hqRejectRem')||{}).value||'';
  if(!remarks){ showToast('âš ï¸ Please enter rejection remarks.',true); return; }
  if(bill){
    bill.status = 'Sent Back by HQ';
    bill.pendingWith = sendTo;
    bill.log = bill.log||[];
    bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'Rejected by HQ Accounts â€“ Sent back to '+sendTo,by:'HQ Accounts Wing',status:'Sent Back',remarks:remarks});
  }
  closeModal('acctActionModal');
  renderPendingBills();
  showToast('âŒ Bill sent back to '+sendTo+'.');
}

function doPaymentMade(billId, amtPaid, payDate){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(bill){
    bill.status = 'Paid';
    bill.amtPaid = amtPaid;
    bill.paymentDate = payDate;
    bill.pendingWith = null; bill.pendingDesig = null;
    bill.log = bill.log||[];
    bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'Payment Made to Vendor â€“ '+fmtAmt(amtPaid),by:'HQ Accounts Wing',status:'Paid'});
  }
  closeModal('acctActionModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âœ… Payment recorded: '+fmtAmt(amtPaid)+' to '+VENDOR_MAP[bill.vendorId]);
}

function doLOAApproved(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  bill.status = 'LOA Approved';
  bill.log = bill.log||[];
  bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'LOA Approved by HQ Accounts Wing',by:'HQ Accounts Wing',status:'LOA Approved'});
  closeModal('acctActionModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âœ… LOA Approved for Bill: '+billId);
}

function doLOAPaid(billId){
  var bill = submittedBills.find(function(b){ return b.billId===billId; });
  if(!bill) return;
  var amt = parseFloat((document.getElementById('hqPayAmt')||{}).value)||0;
  var dt  = (document.getElementById('hqPayDate')||{}).value||new Date().toLocaleDateString('en-IN');
  if(!amt){ showToast('âš ï¸ Please enter payment amount.',true); return; }
  // Update LOA paid amount from master data columns 23/24 (material) or 25/26 (service)
  bill.status = 'Paid';
  bill.amtPaid = amt;
  bill.paymentDate = dt;
  bill.loaPaidDate = dt;
  bill.pendingWith = null; bill.pendingDesig = null;
  bill.log = bill.log||[];
  bill.log.push({date:new Date().toLocaleDateString('en-IN'),action:'LOA Paid â€“ Net Amount: â‚¹'+fmtAmt(amt)+' | Date: '+dt,by:'HQ Accounts Wing',status:'Paid'});
  closeModal('acctActionModal');
  saveBillsToStorage();
  renderPendingBills();
  showToast('âœ… LOA Paid: â‚¹'+fmtAmt(amt)+' to '+VENDOR_MAP[bill.vendorId]);
}


// ===== MANAGEMENT DASHBOARD =====
var _mgmtCharts = {};

function destroyChart(id){
  if(_mgmtCharts[id]){ _mgmtCharts[id].destroy(); delete _mgmtCharts[id]; }
}

function crToCr(v){ return (v/1e7).toFixed(2); }

function getFYFromDate(dateStr){
  if(!dateStr||dateStr==='â€”') return null;
  var d = new Date(dateStr);
  if(isNaN(d)) return null;
  var y = d.getFullYear(); var m = d.getMonth();
  return m>=3 ? String(y).slice(2) : String(y-1).slice(2);
}

function getDaysPending(dateStr){
  if(!dateStr) return 0;
  var parts = dateStr.split('/');
  var d;
  if(parts.length===3) d = new Date(parts[2], parts[1]-1, parts[0]);
  else d = new Date(dateStr);
  if(isNaN(d)) return 0;
  return Math.max(0, Math.floor((new Date()-d)/86400000));
}

function kpiCard(label, value, icon, color, sub){
  return '<div class="stat-card" style="border-top:3px solid '+color+';">'+
    '<div class="stat-label">'+label+'</div>'+
    '<div class="stat-value" style="color:'+color+';font-size:22px;">'+value+' <span class="stat-icon">'+icon+'</span></div>'+
    (sub?'<div class="stat-sub">'+sub+'</div>':'')+
  '</div>';
}

function renderMgmtDashboard(){
  var fyF   = (document.getElementById('mgmtFYFilter')||{}).value||'all';
  var typeF = (document.getElementById('mgmtTypeFilter')||{}).value||'all';

  var data = ALL_PAYMENTS.filter(function(r){
    if(typeF!=='all' && r.type!==typeF) return false;
    if(fyF!=='all'){
      var fy = getFYFromDate(r.paymentDate);
      if(fy!==fyF) return false;
    }
    return true;
  });

  var totalGross = data.reduce(function(s,r){return s+r.grossAmt;},0);
  var totalPaid  = data.reduce(function(s,r){return s+r.amtPaid;},0);
  var totalPen   = data.reduce(function(s,r){return s+r.penalty;},0);
  var totalRet   = data.reduce(function(s,r){return s+r.retention;},0);
  var totalOth   = data.reduce(function(s,r){return s+r.otherRecovery;},0);
  var pendingCnt = submittedBills.filter(function(b){return b.status!=='Paid'&&b.status!=='Rejected';}).length;

  document.getElementById('mgmtKPIs').innerHTML =
    kpiCard('Total Gross Billed','â‚¹'+crToCr(totalGross)+' Cr','ðŸ“„','var(--ap-blue)',data.length+' records')+
    kpiCard('Total Net Paid','â‚¹'+crToCr(totalPaid)+' Cr','âœ…','var(--ap-green)','After all recoveries')+
    kpiCard('Total Penalty','â‚¹'+crToCr(totalPen)+' Cr','âš ï¸','var(--ap-red)','')+
    kpiCard('Total Retention','â‚¹'+crToCr(totalRet)+' Cr','ðŸ”’','var(--ap-orange)','')+
    kpiCard('Other Recoveries','â‚¹'+crToCr(totalOth)+' Cr','ðŸ’°','#8E44AD','')+
    kpiCard('Pending Bills',''+pendingCnt,'â³','var(--ap-red)','Awaiting processing');

  var fyOrder=['20','21','22','23','24','25'];
  var fyLabels=['FY 20-21','FY 21-22','FY 22-23','FY 23-24','FY 24-25','FY 25-26'];

  // FY-wise bar
  var fyGross={}; var fyNet={}; fyOrder.forEach(function(k){fyGross[k]=0;fyNet[k]=0;});
  ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    var fy=getFYFromDate(r.paymentDate); if(!fy||!fyGross.hasOwnProperty(fy)) return;
    fyGross[fy]+=r.grossAmt; fyNet[fy]+=r.amtPaid;
  });
  destroyChart('fy');
  _mgmtCharts['fy']=new Chart(document.getElementById('fyBarChart'),{type:'bar',
    data:{labels:fyLabels,datasets:[
      {label:'Gross Billed (â‚¹ Cr)',data:fyOrder.map(function(k){return+crToCr(fyGross[k]);}),backgroundColor:'rgba(0,95,173,0.8)',borderRadius:5},
      {label:'Net Paid (â‚¹ Cr)',data:fyOrder.map(function(k){return+crToCr(fyNet[k]);}),backgroundColor:'rgba(26,122,74,0.8)',borderRadius:5}
    ]},
    options:{responsive:true,plugins:{legend:{position:'top',labels:{font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{y:{ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},x:{grid:{display:false}}}}
  });

  // Status pie
  var stCounts={}; submittedBills.forEach(function(b){stCounts[b.status]=(stCounts[b.status]||0)+1;});
  if(!Object.keys(stCounts).length) stCounts['No Submissions']=1;
  var pieC=['#005FAD','#1A7A4A','#F5A623','#C0392B','#E67E22','#8E44AD','#17A589','#2C3E50'];
  destroyChart('spie');
  _mgmtCharts['spie']=new Chart(document.getElementById('statusPieChart'),{type:'doughnut',
    data:{labels:Object.keys(stCounts),datasets:[{data:Object.values(stCounts),backgroundColor:pieC,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,cutout:'62%',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.label+': '+c.raw;}}}}}
  });
  document.getElementById('statusPieLegend').innerHTML=Object.keys(stCounts).map(function(k,i){
    return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;"><span style="width:10px;height:10px;border-radius:50%;background:'+pieC[i%pieC.length]+';display:inline-block;flex-shrink:0;"></span><span>'+k+': <b>'+stCounts[k]+'</b></span></div>';
  }).join('');

  // Project-wise bar
  var projMap={};
  ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    if(fyF!=='all'&&getFYFromDate(r.paymentDate)!==fyF) return;
    var po=PO_DATA.find(function(p){return p.poNo===r.poNo;});
    var proj=po?(po.schemeDesc||r.poNo):r.poNo;
    if(proj.length>32) proj=proj.substring(0,30)+'â€¦';
    if(!projMap[proj]) projMap[proj]={g:0,n:0};
    projMap[proj].g+=r.grossAmt; projMap[proj].n+=r.amtPaid;
  });
  var pKeys=Object.keys(projMap).sort(function(a,b){return projMap[b].g-projMap[a].g;}).slice(0,7);
  destroyChart('proj');
  _mgmtCharts['proj']=new Chart(document.getElementById('projectBarChart'),{type:'bar',
    data:{labels:pKeys,datasets:[
      {label:'Gross (â‚¹ Cr)',data:pKeys.map(function(k){return+crToCr(projMap[k].g);}),backgroundColor:'rgba(0,58,112,0.8)',borderRadius:4},
      {label:'Paid (â‚¹ Cr)',data:pKeys.map(function(k){return+crToCr(projMap[k].n);}),backgroundColor:'rgba(26,122,74,0.7)',borderRadius:4}
    ]},
    options:{indexAxis:'y',responsive:true,plugins:{legend:{position:'top',labels:{font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{x:{ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},y:{ticks:{font:{size:10}},grid:{display:false}}}}
  });

  // Vendor pie
  var vPaid={};
  ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    if(fyF!=='all'&&getFYFromDate(r.paymentDate)!==fyF) return;
    vPaid[r.vendorName]=(vPaid[r.vendorName]||0)+r.amtPaid;
  });
  var vKeys=Object.keys(vPaid).sort(function(a,b){return vPaid[b]-vPaid[a];});
  var vC=['#003A70','#005FAD','#1A7A4A','#F5A623','#E67E22','#C0392B','#8E44AD','#17A589'];
  destroyChart('vpie');
  _mgmtCharts['vpie']=new Chart(document.getElementById('vendorPieChart'),{type:'pie',
    data:{labels:vKeys,datasets:[{data:vKeys.map(function(k){return+crToCr(vPaid[k]);}),backgroundColor:vC,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.label+': â‚¹'+c.raw+' Cr';}}}}}
  });
  document.getElementById('vendorPieLegend').innerHTML=vKeys.map(function(k,i){
    return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;"><span style="width:10px;height:10px;border-radius:2px;background:'+vC[i%vC.length]+';display:inline-block;flex-shrink:0;"></span><span style="font-size:11px;">'+k+': <b>â‚¹'+crToCr(vPaid[k])+' Cr</b></span></div>';
  }).join('');

  // Pending aging bar
  var pending=submittedBills.filter(function(b){return b.status!=='Paid'&&b.status!=='Rejected';});
  var ageB={'0â€“7 days':0,'8â€“15 days':0,'16â€“30 days':0,'31â€“60 days':0,'60+ days':0};
  pending.forEach(function(b){
    var d=getDaysPending(b.date);
    if(d<=7)ageB['0â€“7 days']++;
    else if(d<=15)ageB['8â€“15 days']++;
    else if(d<=30)ageB['16â€“30 days']++;
    else if(d<=60)ageB['31â€“60 days']++;
    else ageB['60+ days']++;
  });
  destroyChart('age');
  _mgmtCharts['age']=new Chart(document.getElementById('agingBarChart'),{type:'bar',
    data:{labels:Object.keys(ageB),datasets:[{label:'Bills',data:Object.values(ageB),backgroundColor:['#1A7A4A','#005FAD','#F5A623','#E67E22','#C0392B'],borderRadius:5}]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.raw+' bill(s)';}}}},scales:{y:{ticks:{stepSize:1},grid:{color:'rgba(0,0,0,0.06)'}},x:{grid:{display:false}}}}
  });

  // Pending with whom doughnut
  var wMap={}; pending.forEach(function(b){var w=b.pendingWith||'Unassigned';wMap[w]=(wMap[w]||0)+1;});
  var wKeys=Object.keys(wMap); var wC=['#005FAD','#1A7A4A','#F5A623','#E67E22','#C0392B','#8E44AD','#17A589','#2C3E50'];
  destroyChart('whom');
  _mgmtCharts['whom']=new Chart(document.getElementById('pendingWhomChart'),{type:'doughnut',
    data:{labels:wKeys,datasets:[{data:wKeys.map(function(k){return wMap[k];}),backgroundColor:wC,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,cutout:'58%',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.label+': '+c.raw+' bill(s)';}}}}}
  });
  document.getElementById('pendingWhomLegend').innerHTML=wKeys.length?wKeys.map(function(k,i){
    return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;"><span style="width:10px;height:10px;border-radius:50%;background:'+wC[i%wC.length]+';display:inline-block;flex-shrink:0;"></span><span style="font-size:11px;">'+k+': <b>'+wMap[k]+'</b></span></div>';
  }).join(''):'<div style="font-size:12px;color:var(--ap-gray-400);padding:0.5rem;">No pending bills</div>';

  // Mat vs Svc trend line
  var mFY={}; var sFY={}; fyOrder.forEach(function(k){mFY[k]=0;sFY[k]=0;});
  VMAT_DATA.forEach(function(r){var fy=getFYFromDate(r.paymentDate);if(fy&&mFY.hasOwnProperty(fy))mFY[fy]+=r.grossAmt;});
  VSVC_DATA.forEach(function(r){var fy=getFYFromDate(r.paymentDate);if(fy&&sFY.hasOwnProperty(fy))sFY[fy]+=r.grossAmt;});
  destroyChart('trend');
  _mgmtCharts['trend']=new Chart(document.getElementById('trendLineChart'),{type:'line',
    data:{labels:fyLabels,datasets:[
      {label:'Material (â‚¹ Cr)',data:fyOrder.map(function(k){return+crToCr(mFY[k]);}),borderColor:'#005FAD',backgroundColor:'rgba(0,95,173,0.1)',tension:0.4,fill:true,pointRadius:5,pointBackgroundColor:'#005FAD'},
      {label:'Service (â‚¹ Cr)',data:fyOrder.map(function(k){return+crToCr(sFY[k]);}),borderColor:'#1A7A4A',backgroundColor:'rgba(26,122,74,0.1)',tension:0.4,fill:true,pointRadius:5,pointBackgroundColor:'#1A7A4A'}
    ]},
    options:{responsive:true,plugins:{legend:{position:'top',labels:{font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{y:{ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},x:{grid:{display:false}}}}
  });

  // Recoveries stacked bar
  var rPen={}; var rRet={}; var rOth={}; fyOrder.forEach(function(k){rPen[k]=0;rRet[k]=0;rOth[k]=0;});
  ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    var fy=getFYFromDate(r.paymentDate); if(!fy||!rPen.hasOwnProperty(fy)) return;
    rPen[fy]+=r.penalty; rRet[fy]+=r.retention; rOth[fy]+=r.otherRecovery;
  });
  destroyChart('rec');
  _mgmtCharts['rec']=new Chart(document.getElementById('recoveriesChart'),{type:'bar',
    data:{labels:fyLabels,datasets:[
      {label:'Penalty',data:fyOrder.map(function(k){return+crToCr(rPen[k]);}),backgroundColor:'#C0392B',stack:'r',borderRadius:2},
      {label:'Retention',data:fyOrder.map(function(k){return+crToCr(rRet[k]);}),backgroundColor:'#F5A623',stack:'r',borderRadius:2},
      {label:'Other',data:fyOrder.map(function(k){return+crToCr(rOth[k]);}),backgroundColor:'#8E44AD',stack:'r',borderRadius:2}
    ]},
    options:{responsive:true,plugins:{legend:{position:'top',labels:{font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{y:{stacked:true,ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},x:{stacked:true,grid:{display:false}}}}
  });

  // Aging detail table
  var stB={'Submitted':'badge-submitted','Reviewed by Engineer':'badge-form13','Form13 Updated':'badge-form13','Form14 Updated':'badge-form14','Invoice Posted':'badge-processing','LOA Created':'badge-form14','LOA Approved':'badge-approved','With HQ Accounts':'badge-processing','Sent Back by Accounts':'badge-rejected','Sent Back by HQ':'badge-rejected'};
  var agRows=pending.slice().sort(function(a,b){return getDaysPending(b.date)-getDaysPending(a.date);}).map(function(b){
    var days=getDaysPending(b.date);
    var col=days>60?'var(--ap-red)':days>30?'var(--ap-orange)':days>15?'#a06b00':'var(--ap-green)';
    var st=b.status||'Submitted';
    return '<tr>'+
      '<td><span class="bill-id">'+b.billId+'</span></td>'+
      '<td style="font-size:11px;font-weight:600;">'+b.vendorId+'</td>'+
      '<td style="font-size:12px;">'+VENDOR_MAP[b.vendorId]+'</td>'+
      '<td style="font-size:11px;">'+(b.eInvNo||'â€”')+'</td>'+
      '<td>'+b.poNo+'</td>'+
      '<td><span class="badge '+(b.type==='Material'?'badge-submitted':'badge-form14')+'">'+b.type+'</span></td>'+
      '<td class="amount">'+(b.grossAmt?fmtAmt(b.grossAmt):'â€”')+'</td>'+
      '<td>'+b.date+'</td>'+
      '<td><b style="color:'+col+';">'+days+' days</b></td>'+
      '<td><span class="badge '+(stB[st]||'badge-submitted')+'">'+st+'</span></td>'+
      '<td style="font-size:12px;">'+(b.pendingWith||'<span style="color:var(--ap-gray-400);">Unassigned</span>')+(b.pendingDesig?' <span style="font-size:10px;color:var(--ap-gray-400);">('+b.pendingDesig+')</span>':'')+'</td>'+
    '</tr>';
  }).join('');
  document.getElementById('mgmtAgingTbl').innerHTML=agRows||'<tr><td colspan="11" style="text-align:center;color:var(--ap-gray-400);padding:2rem;">No pending bills â€“ all clear! âœ…</td></tr>';
}

// ===== MANAGEMENT LOGIN & NAV =====
function loginMgmt(){
  var u = (document.getElementById('mgmtUser')||{}).value||'';
  var p = (document.getElementById('mgmtPass')||{}).value||'';
  if(!u){ showToast('âš ï¸ Please enter username.',true); return; }
  if(p !== 'mgmt123'){ showToast('âš ï¸ Incorrect management password.',true); return; }
  var validUsers = ['director','cmd','se','chief','admin','manager'];
  if(!validUsers.includes(u.toLowerCase().trim())){ showToast('âš ï¸ Username not recognised.',true); return; }
  document.getElementById('mgmt-username').textContent = u.toUpperCase();
  document.getElementById('loginPortal').style.display = 'none';
  document.getElementById('mgmtApp').classList.add('active');
  renderMgmtMainDash();
  showToast('Welcome, ' + u.toUpperCase() + ' â€“ Management Dashboard');
}

function mgmtShowPage(pageId, navEl){
  document.querySelectorAll('#mgmtApp .page').forEach(function(p){p.classList.remove('active');});
  document.getElementById(pageId).classList.add('active');
  if(navEl){ document.querySelectorAll('#mgmtApp .nav-item').forEach(function(n){n.classList.remove('active');}); navEl.classList.add('active'); }
  var titles={mgmtMainDash:'Management Dashboard',mgmtFYReport:'FY-wise Report',mgmtProjReport:'Project-wise Report',mgmtPendingReport:'Pending Bills Report',mgmtVendorReport:'Vendor-wise Report'};
  document.getElementById('mgmt-pageTitle').textContent = titles[pageId]||pageId;
}

// Shared chart store for mgmt app
var _mCharts = {};
function mDestroy(id){ if(_mCharts[id]){_mCharts[id].destroy();delete _mCharts[id];} }

var CHART_COLORS = ['#003A70','#005FAD','#1A7A4A','#F5A623','#E67E22','#C0392B','#8E44AD','#17A589','#2C3E50','#1ABC9C'];
var FY_ORDER = ['20','21','22','23','24','25'];
var FY_LABELS = ['FY 20-21','FY 21-22','FY 22-23','FY 23-24','FY 24-25','FY 25-26'];

function getFilteredData(fyF, typeF){
  return ALL_PAYMENTS.filter(function(r){
    if(typeF && typeF!=='all' && r.type!==typeF) return false;
    if(fyF && fyF!=='all' && getFYFromDate(r.paymentDate)!==fyF) return false;
    return true;
  });
}

function makeLegend(keys, colors, values){
  return keys.map(function(k,i){
    return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">'+
      '<span style="width:10px;height:10px;border-radius:2px;background:'+(colors[i%colors.length])+';display:inline-block;flex-shrink:0;"></span>'+
      '<span>'+k+(values?' <b>'+values[i]+'</b>':'')+'</span></div>';
  }).join('');
}

function renderMgmtMainDash(){
  var fyF  = (document.getElementById('mFYF')||{}).value||'all';
  var typeF= (document.getElementById('mTF')||{}).value||'all';
  var data = getFilteredData(fyF, typeF);

  var tGross=data.reduce(function(s,r){return s+r.grossAmt;},0);
  var tPaid =data.reduce(function(s,r){return s+r.amtPaid;},0);
  var tPen  =data.reduce(function(s,r){return s+r.penalty;},0);
  var tRet  =data.reduce(function(s,r){return s+r.retention;},0);
  var tOth  =data.reduce(function(s,r){return s+r.otherRecovery;},0);
  var pend  =submittedBills.filter(function(b){return b.status!=='Paid'&&b.status!=='Rejected';});

  document.getElementById('mKPIs').innerHTML =
    kpiCard('Total Gross Billed','â‚¹'+crToCr(tGross)+' Cr','ðŸ“„','var(--ap-blue)',data.length+' transactions')+
    kpiCard('Total Net Paid','â‚¹'+crToCr(tPaid)+' Cr','âœ…','var(--ap-green)','Amount disbursed')+
    kpiCard('Penalty Levied','â‚¹'+crToCr(tPen)+' Cr','âš ï¸','var(--ap-red)','')+
    kpiCard('Retention Held','â‚¹'+crToCr(tRet)+' Cr','ðŸ”’','var(--ap-orange)','')+
    kpiCard('Other Recoveries','â‚¹'+crToCr(tOth)+' Cr','ðŸ’°','#8E44AD','')+
    kpiCard('Pending Bills',''+pend.length,'â³','#C0392B','Awaiting action');

  // FY bar
  var fyG={}; var fyN={}; FY_ORDER.forEach(function(k){fyG[k]=0;fyN[k]=0;});
  ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    var fy=getFYFromDate(r.paymentDate); if(fy&&fyG.hasOwnProperty(fy)){fyG[fy]+=r.grossAmt;fyN[fy]+=r.amtPaid;}
  });
  mDestroy('fybar');
  _mCharts['fybar']=new Chart(document.getElementById('mFYBar'),{type:'bar',
    data:{labels:FY_LABELS,datasets:[
      {label:'Gross Billed',data:FY_ORDER.map(function(k){return+crToCr(fyG[k]);}),backgroundColor:'rgba(0,95,173,0.82)',borderRadius:5},
      {label:'Net Paid',data:FY_ORDER.map(function(k){return+crToCr(fyN[k]);}),backgroundColor:'rgba(26,122,74,0.82)',borderRadius:5}
    ]},
    options:chartOpts('â‚¹ Cr')
  });

  // Status pie
  var stC={}; submittedBills.forEach(function(b){stC[b.status]=(stC[b.status]||0)+1;});
  if(!Object.keys(stC).length) stC['No Submissions']=1;
  var stKeys=Object.keys(stC);
  mDestroy('spie');
  _mCharts['spie']=new Chart(document.getElementById('mStatusPie'),{type:'doughnut',
    data:{labels:stKeys,datasets:[{data:stKeys.map(function(k){return stC[k];}),backgroundColor:CHART_COLORS,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,cutout:'60%',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.label+': '+c.raw;}}}}}
  });
  document.getElementById('mStatusLeg').innerHTML=makeLegend(stKeys,CHART_COLORS,stKeys.map(function(k){return stC[k];}));

  // Project bar
  var pM={}; ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    if(fyF!=='all'&&getFYFromDate(r.paymentDate)!==fyF) return;
    var po=PO_DATA.find(function(p){return p.poNo===r.poNo;});
    var proj=po?(po.schemeDesc||r.poNo):r.poNo; if(proj.length>30) proj=proj.substring(0,28)+'â€¦';
    if(!pM[proj]) pM[proj]={g:0,n:0}; pM[proj].g+=r.grossAmt; pM[proj].n+=r.amtPaid;
  });
  var pKeys=Object.keys(pM).sort(function(a,b){return pM[b].g-pM[a].g;}).slice(0,8);
  mDestroy('pbar');
  _mCharts['pbar']=new Chart(document.getElementById('mProjBar'),{type:'bar',
    data:{labels:pKeys,datasets:[
      {label:'Gross (â‚¹ Cr)',data:pKeys.map(function(k){return+crToCr(pM[k].g);}),backgroundColor:'rgba(0,58,112,0.82)',borderRadius:4},
      {label:'Paid (â‚¹ Cr)',data:pKeys.map(function(k){return+crToCr(pM[k].n);}),backgroundColor:'rgba(26,122,74,0.72)',borderRadius:4}
    ]},
    options:{indexAxis:'y',responsive:true,plugins:{legend:{position:'top',labels:{font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{x:{ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},y:{ticks:{font:{size:10}},grid:{display:false}}}}
  });

  // Vendor pie
  var vP={}; ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    if(fyF!=='all'&&getFYFromDate(r.paymentDate)!==fyF) return;
    vP[r.vendorName]=(vP[r.vendorName]||0)+r.amtPaid;
  });
  var vKeys=Object.keys(vP).sort(function(a,b){return vP[b]-vP[a];});
  mDestroy('vpie');
  _mCharts['vpie']=new Chart(document.getElementById('mVendorPie'),{type:'pie',
    data:{labels:vKeys,datasets:[{data:vKeys.map(function(k){return+crToCr(vP[k]);}),backgroundColor:CHART_COLORS,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.label+': â‚¹'+c.raw+' Cr';}}}}}
  });
  document.getElementById('mVendorLeg').innerHTML=makeLegend(vKeys,CHART_COLORS,vKeys.map(function(k){return'â‚¹'+crToCr(vP[k])+' Cr';}));

  // Trend line
  var mFY={}; var sFY={}; FY_ORDER.forEach(function(k){mFY[k]=0;sFY[k]=0;});
  VMAT_DATA.forEach(function(r){var fy=getFYFromDate(r.paymentDate);if(fy&&mFY.hasOwnProperty(fy))mFY[fy]+=r.grossAmt;});
  VSVC_DATA.forEach(function(r){var fy=getFYFromDate(r.paymentDate);if(fy&&sFY.hasOwnProperty(fy))sFY[fy]+=r.grossAmt;});
  mDestroy('trend');
  _mCharts['trend']=new Chart(document.getElementById('mTrendLine'),{type:'line',
    data:{labels:FY_LABELS,datasets:[
      {label:'Material',data:FY_ORDER.map(function(k){return+crToCr(mFY[k]);}),borderColor:'#005FAD',backgroundColor:'rgba(0,95,173,0.1)',tension:0.4,fill:true,pointRadius:5,pointBackgroundColor:'#005FAD'},
      {label:'Service',data:FY_ORDER.map(function(k){return+crToCr(sFY[k]);}),borderColor:'#1A7A4A',backgroundColor:'rgba(26,122,74,0.1)',tension:0.4,fill:true,pointRadius:5,pointBackgroundColor:'#1A7A4A'}
    ]},
    options:chartOpts('â‚¹ Cr',true)
  });

  // Recoveries stacked
  var rP={}; var rR={}; var rO={}; FY_ORDER.forEach(function(k){rP[k]=0;rR[k]=0;rO[k]=0;});
  ALL_PAYMENTS.forEach(function(r){
    if(typeF!=='all'&&r.type!==typeF) return;
    var fy=getFYFromDate(r.paymentDate); if(!fy||!rP.hasOwnProperty(fy)) return;
    rP[fy]+=r.penalty; rR[fy]+=r.retention; rO[fy]+=r.otherRecovery;
  });
  mDestroy('rec');
  _mCharts['rec']=new Chart(document.getElementById('mRecBar'),{type:'bar',
    data:{labels:FY_LABELS,datasets:[
      {label:'Penalty',data:FY_ORDER.map(function(k){return+crToCr(rP[k]);}),backgroundColor:'#C0392B',stack:'r',borderRadius:2},
      {label:'Retention',data:FY_ORDER.map(function(k){return+crToCr(rR[k]);}),backgroundColor:'#F5A623',stack:'r',borderRadius:2},
      {label:'Other',data:FY_ORDER.map(function(k){return+crToCr(rO[k]);}),backgroundColor:'#8E44AD',stack:'r',borderRadius:2}
    ]},
    options:{responsive:true,plugins:{legend:{position:'top',labels:{font:{size:10}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{y:{stacked:true,ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},x:{stacked:true,grid:{display:false}}}}
  });

  // Aging bar
  var aB={'0â€“7d':0,'8â€“15d':0,'16â€“30d':0,'31â€“60d':0,'60+d':0};
  pend.forEach(function(b){var d=getDaysPending(b.date);if(d<=7)aB['0â€“7d']++;else if(d<=15)aB['8â€“15d']++;else if(d<=30)aB['16â€“30d']++;else if(d<=60)aB['31â€“60d']++;else aB['60+d']++;});
  mDestroy('age');
  _mCharts['age']=new Chart(document.getElementById('mAgeBar'),{type:'bar',
    data:{labels:Object.keys(aB),datasets:[{label:'Bills',data:Object.values(aB),backgroundColor:['#1A7A4A','#005FAD','#F5A623','#E67E22','#C0392B'],borderRadius:5}]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.raw+' bill(s)';}}},title:{display:true,text:'Pending Bills by Days Pending',font:{size:11}}},scales:{y:{ticks:{stepSize:1},grid:{color:'rgba(0,0,0,0.06)'}},x:{grid:{display:false}}}}
  });

  // Pending with whom
  var wM={}; pend.forEach(function(b){var w=b.pendingWith||'Unassigned';wM[w]=(wM[w]||0)+1;});
  var wKeys=Object.keys(wM);
  mDestroy('whom');
  _mCharts['whom']=new Chart(document.getElementById('mWhomPie'),{type:'doughnut',
    data:{labels:wKeys,datasets:[{data:wKeys.map(function(k){return wM[k];}),backgroundColor:CHART_COLORS,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,cutout:'56%',plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.label+': '+c.raw+' bill(s)';}}}}}
  });
  document.getElementById('mWhomLeg').innerHTML=wKeys.length?makeLegend(wKeys,CHART_COLORS,wKeys.map(function(k){return wM[k];})):'<span style="color:var(--ap-gray-400);font-size:12px;">No pending bills âœ…</span>';

  // FY Summary Table
  var fySumRows = FY_ORDER.map(function(fy){
    var mat=VMAT_DATA.filter(function(r){return getFYFromDate(r.paymentDate)===fy;});
    var svc=VSVC_DATA.filter(function(r){return getFYFromDate(r.paymentDate)===fy;});
    var gr=(typeF==='Service'?0:mat.reduce(function(s,r){return s+r.grossAmt;},0))+(typeF==='Material'?0:svc.reduce(function(s,r){return s+r.grossAmt;},0));
    var pen=(typeF==='Service'?0:mat.reduce(function(s,r){return s+r.penalty;},0))+(typeF==='Material'?0:svc.reduce(function(s,r){return s+r.penalty;},0));
    var ret=(typeF==='Service'?0:mat.reduce(function(s,r){return s+r.retention;},0))+(typeF==='Material'?0:svc.reduce(function(s,r){return s+r.retention;},0));
    var oth=(typeF==='Service'?0:mat.reduce(function(s,r){return s+r.otherRecovery;},0))+(typeF==='Material'?0:svc.reduce(function(s,r){return s+r.otherRecovery;},0));
    var net=(typeF==='Service'?0:mat.reduce(function(s,r){return s+r.amtPaid;},0))+(typeF==='Material'?0:svc.reduce(function(s,r){return s+r.amtPaid;},0));
    if(!gr&&!net) return '';
    return '<tr>'+
      '<td><b>FY 20'+fy+'-'+(parseInt(fy)+1).toString().padStart(2,'0')+'</b></td>'+
      '<td style="text-align:center;">'+(typeF==='Service'?'â€”':mat.length)+'</td>'+
      '<td style="text-align:center;">'+(typeF==='Material'?'â€”':svc.length)+'</td>'+
      '<td class="amount">â‚¹'+crToCr(gr)+' Cr</td>'+
      '<td class="amount" style="color:var(--ap-red);">â‚¹'+crToCr(pen)+' Cr</td>'+
      '<td class="amount" style="color:var(--ap-orange);">â‚¹'+crToCr(ret)+' Cr</td>'+
      '<td class="amount" style="color:#8E44AD;">â‚¹'+crToCr(oth)+' Cr</td>'+
      '<td class="amount" style="color:var(--ap-green);font-weight:700;">â‚¹'+crToCr(net)+' Cr</td>'+
    '</tr>';
  }).join('');
  document.getElementById('mFYSummaryBody').innerHTML=fySumRows||'<tr><td colspan="8" style="text-align:center;color:var(--ap-gray-400);">No data</td></tr>';
}

function chartOpts(yLabel, isLine){
  return {responsive:true,plugins:{legend:{position:'top',labels:{font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{y:{ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},x:{grid:{display:!isLine}}}};
}

function renderMgmtFYReport(){
  var fyF  = (document.getElementById('fyRepFY')||{}).value||'all';
  var typeF= (document.getElementById('fyRepType')||{}).value||'all';
  var data = getFilteredData(fyF, typeF);
  var tG=data.reduce(function(s,r){return s+r.grossAmt;},0);
  var tP=data.reduce(function(s,r){return s+r.amtPaid;},0);
  var tPen=data.reduce(function(s,r){return s+r.penalty;},0);
  var tRet=data.reduce(function(s,r){return s+r.retention;},0);
  document.getElementById('fyRepKPIs').innerHTML=
    kpiCard('Gross Billed','â‚¹'+crToCr(tG)+' Cr','ðŸ“„','var(--ap-blue)',data.length+' records')+
    kpiCard('Net Paid','â‚¹'+crToCr(tP)+' Cr','âœ…','var(--ap-green)','')+
    kpiCard('Penalty','â‚¹'+crToCr(tPen)+' Cr','âš ï¸','var(--ap-red)','')+
    kpiCard('Retention','â‚¹'+crToCr(tRet)+' Cr','ðŸ”’','var(--ap-orange)','');

  var fyG={}; var fyN={}; FY_ORDER.forEach(function(k){fyG[k]=0;fyN[k]=0;});
  data.forEach(function(r){var fy=getFYFromDate(r.paymentDate);if(fy&&fyG.hasOwnProperty(fy)){fyG[fy]+=r.grossAmt;fyN[fy]+=r.amtPaid;}});
  mDestroy('fyrepbar');
  _mCharts['fyrepbar']=new Chart(document.getElementById('fyRepBar'),{type:'bar',
    data:{labels:FY_LABELS,datasets:[
      {label:'Gross',data:FY_ORDER.map(function(k){return+crToCr(fyG[k]);}),backgroundColor:'rgba(0,95,173,0.82)',borderRadius:5},
      {label:'Net Paid',data:FY_ORDER.map(function(k){return+crToCr(fyN[k]);}),backgroundColor:'rgba(26,122,74,0.82)',borderRadius:5}
    ]},options:chartOpts('â‚¹ Cr')});

  var rP={}; var rR={}; var rO={}; FY_ORDER.forEach(function(k){rP[k]=0;rR[k]=0;rO[k]=0;});
  data.forEach(function(r){var fy=getFYFromDate(r.paymentDate);if(fy&&rP.hasOwnProperty(fy)){rP[fy]+=r.penalty;rR[fy]+=r.retention;rO[fy]+=r.otherRecovery;}});
  mDestroy('fyreprec');
  _mCharts['fyreprec']=new Chart(document.getElementById('fyRepRec'),{type:'bar',
    data:{labels:FY_LABELS,datasets:[
      {label:'Penalty',data:FY_ORDER.map(function(k){return+crToCr(rP[k]);}),backgroundColor:'#C0392B',stack:'r',borderRadius:2},
      {label:'Retention',data:FY_ORDER.map(function(k){return+crToCr(rR[k]);}),backgroundColor:'#F5A623',stack:'r',borderRadius:2},
      {label:'Other',data:FY_ORDER.map(function(k){return+crToCr(rO[k]);}),backgroundColor:'#8E44AD',stack:'r',borderRadius:2}
    ]},options:{responsive:true,plugins:{legend:{position:'top',labels:{font:{size:10}}}},scales:{y:{stacked:true,ticks:{callback:function(v){return'â‚¹'+v+' Cr';}}},x:{stacked:true,grid:{display:false}}}}});

  var rows=data.slice().sort(function(a,b){return new Date(b.paymentDate)-new Date(a.paymentDate);}).map(function(r){
    return '<tr><td>'+r.vendorName+'</td><td>'+r.poNo+'</td>'+
      '<td><span class="badge '+(r.type==='Material'?'badge-submitted':'badge-form14')+'">'+r.type+'</span></td>'+
      '<td class="amount">'+fmtAmt(r.grossAmt)+'</td><td class="amount">'+fmtAmt(r.penalty)+'</td>'+
      '<td class="amount">'+fmtAmt(r.retention)+'</td><td class="amount">'+fmtAmt(r.otherRecovery)+'</td>'+
      '<td class="amount" style="color:var(--ap-green);font-weight:700;">'+fmtAmt(r.amtPaid)+'</td>'+
      '<td>'+r.loaNo+'</td><td>'+r.paymentDate+'</td></tr>';
  }).join('');
  document.getElementById('fyRepTbl').innerHTML=rows||'<tr><td colspan="10" style="text-align:center;color:var(--ap-gray-400);">No records for selected filter.</td></tr>';
}

function renderMgmtProjReport(){
  var projData={};
  PO_DATA.forEach(function(p){
    var s=p.schemeDesc||p.projDesc||p.poNo;
    if(!projData[s]) projData[s]={poCount:0,poValue:0,mat:0,svc:0,paid:0};
    projData[s].poCount++; projData[s].poValue+=(p.poValue||0);
  });
  ALL_PAYMENTS.forEach(function(r){
    var po=PO_DATA.find(function(p){return p.poNo===r.poNo;});
    if(!po) return;
    var s=po.schemeDesc||po.projDesc||r.poNo;
    if(!projData[s]) projData[s]={poCount:0,poValue:0,mat:0,svc:0,paid:0};
    if(r.type==='Material') projData[s].mat+=r.grossAmt; else projData[s].svc+=r.grossAmt;
    projData[s].paid+=r.amtPaid;
  });
  var pKeys=Object.keys(projData).sort(function(a,b){return (projData[b].mat+projData[b].svc)-(projData[a].mat+projData[a].svc);});
  var totalPOV=pKeys.reduce(function(s,k){return s+projData[k].poValue;},0);
  var totalPaid=pKeys.reduce(function(s,k){return s+projData[k].paid;},0);
  document.getElementById('projRepKPIs').innerHTML=
    kpiCard('Total Schemes',''+pKeys.length,'ðŸ—ï¸','var(--ap-blue)','')+
    kpiCard('Total PO Value','â‚¹'+crToCr(totalPOV)+' Cr','ðŸ’¼','var(--ap-orange)','')+
    kpiCard('Total Net Paid','â‚¹'+crToCr(totalPaid)+' Cr','âœ…','var(--ap-green)','');

  mDestroy('projbar');
  var topK=pKeys.slice(0,8);
  _mCharts['projbar']=new Chart(document.getElementById('projRepBar'),{type:'bar',
    data:{labels:topK.map(function(k){return k.length>28?k.substring(0,26)+'â€¦':k;}),datasets:[
      {label:'Gross Billed',data:topK.map(function(k){return+crToCr(projData[k].mat+projData[k].svc);}),backgroundColor:'rgba(0,58,112,0.82)',borderRadius:4},
      {label:'Net Paid',data:topK.map(function(k){return+crToCr(projData[k].paid);}),backgroundColor:'rgba(26,122,74,0.72)',borderRadius:4}
    ]},options:{indexAxis:'y',responsive:true,plugins:{legend:{position:'top',labels:{font:{size:11}}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': â‚¹'+c.raw+' Cr';}}}},scales:{x:{ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},y:{ticks:{font:{size:10}},grid:{display:false}}}}});

  mDestroy('projdonut');
  _mCharts['projdonut']=new Chart(document.getElementById('projRepDonut'),{type:'doughnut',
    data:{labels:topK.map(function(k){return k.length>20?k.substring(0,18)+'â€¦':k;}),datasets:[{data:topK.map(function(k){return+crToCr(projData[k].mat+projData[k].svc);}),backgroundColor:CHART_COLORS,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,cutout:'55%',plugins:{legend:{position:'bottom',labels:{font:{size:10},boxWidth:10}}}}});

  var tblRows=pKeys.map(function(k){
    var g=projData[k].mat+projData[k].svc; var pct=projData[k].poValue>0?((projData[k].paid/projData[k].poValue)*100).toFixed(1):0;
    var pctColor=pct>80?'var(--ap-green)':pct>50?'var(--ap-orange)':'var(--ap-red)';
    return '<tr><td style="font-size:12px;"><b>'+k+'</b></td><td style="text-align:center;">'+projData[k].poCount+'</td>'+
      '<td class="amount">â‚¹'+crToCr(projData[k].poValue)+' Cr</td>'+
      '<td class="amount">â‚¹'+crToCr(g)+' Cr</td>'+
      '<td class="amount" style="color:var(--ap-green);">â‚¹'+crToCr(projData[k].paid)+' Cr</td>'+
      '<td style="text-align:center;"><b style="color:'+pctColor+';">'+pct+'%</b></td></tr>';
  }).join('');
  document.getElementById('projRepTbl').innerHTML=tblRows||'<tr><td colspan="6" style="text-align:center;color:var(--ap-gray-400);">No data</td></tr>';
}

function renderMgmtPendingReport(){
  var pend=submittedBills.filter(function(b){return b.status!=='Paid'&&b.status!=='Rejected';});
  var tot0_7=0,tot8_15=0,tot16_30=0,tot31_60=0,tot60p=0;
  pend.forEach(function(b){var d=getDaysPending(b.date);if(d<=7)tot0_7++;else if(d<=15)tot8_15++;else if(d<=30)tot16_30++;else if(d<=60)tot31_60++;else tot60p++;});
  var totalGross=pend.reduce(function(s,b){return s+(b.grossAmt||0);},0);
  var maxDays=pend.reduce(function(mx,b){return Math.max(mx,getDaysPending(b.date));},0);
  var avgDays=pend.length?Math.round(pend.reduce(function(s,b){return s+getDaysPending(b.date);},0)/pend.length):0;

  document.getElementById('pendRepKPIs').innerHTML=
    kpiCard('Total Pending',''+pend.length,'â³','var(--ap-red)','')+
    kpiCard('Total Value Pending','â‚¹'+crToCr(totalGross)+' Cr','ðŸ’°','var(--ap-orange)','')+
    kpiCard('Avg Days Pending',''+avgDays+' days','ðŸ“…','var(--ap-blue-mid)','')+
    kpiCard('Max Days Pending',''+maxDays+' days','ðŸš¨',maxDays>30?'var(--ap-red)':'var(--ap-green)','Oldest bill');

  mDestroy('pendage');
  _mCharts['pendage']=new Chart(document.getElementById('pendRepAge'),{type:'bar',
    data:{labels:['0â€“7 days','8â€“15 days','16â€“30 days','31â€“60 days','60+ days'],
      datasets:[{label:'Bills',data:[tot0_7,tot8_15,tot16_30,tot31_60,tot60p],backgroundColor:['#1A7A4A','#005FAD','#F5A623','#E67E22','#C0392B'],borderRadius:6}]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.raw+' bill(s)';}}},title:{display:true,text:'Number of Bills per Aging Bucket',font:{size:11}}},scales:{y:{ticks:{stepSize:1},grid:{color:'rgba(0,0,0,0.06)'}},x:{grid:{display:false}}}}});

  var wM={}; pend.forEach(function(b){var w=b.pendingWith||'Unassigned';wM[w]=(wM[w]||0)+1;});
  var wKeys=Object.keys(wM);
  mDestroy('pendwhom');
  _mCharts['pendwhom']=new Chart(document.getElementById('pendRepWhom'),{type:'doughnut',
    data:{labels:wKeys,datasets:[{data:wKeys.map(function(k){return wM[k];}),backgroundColor:CHART_COLORS,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,cutout:'54%',plugins:{legend:{display:false}}}});
  document.getElementById('pendRepWhomLeg').innerHTML=wKeys.length?makeLegend(wKeys,CHART_COLORS,wKeys.map(function(k){return wM[k]+' bill(s)';})):'<span style="color:var(--ap-green);">No pending bills âœ…</span>';

  var stBadge={'Submitted':'badge-submitted','Reviewed by Engineer':'badge-form13','Form13 Updated':'badge-form13','Form14 Updated':'badge-form14','Invoice Posted':'badge-processing','LOA Created':'badge-form14','LOA Approved':'badge-approved','With HQ Accounts':'badge-processing','Sent Back by Accounts':'badge-rejected','Sent Back by HQ':'badge-rejected'};
  var rows=pend.slice().sort(function(a,b){return getDaysPending(b.date)-getDaysPending(a.date);}).map(function(b){
    var d=getDaysPending(b.date); var col=d>60?'var(--ap-red)':d>30?'var(--ap-orange)':d>15?'#a06b00':'var(--ap-green)';
    var st=b.status||'Submitted';
    return '<tr>'+
      '<td><span class="bill-id">'+b.billId+'</span></td>'+
      '<td style="font-size:11px;font-weight:600;">'+b.vendorId+'</td>'+
      '<td style="font-size:11px;">'+VENDOR_MAP[b.vendorId]+'</td>'+
      '<td style="font-size:11px;">'+(b.eInvNo||'â€”')+'</td>'+
      '<td>'+b.poNo+'</td>'+
      '<td><span class="badge '+(b.type==='Material'?'badge-submitted':'badge-form14')+'">'+b.type+'</span></td>'+
      '<td class="amount">'+(b.grossAmt?fmtAmt(b.grossAmt):'â€”')+'</td>'+
      '<td class="amount">'+(b.netAmt?fmtAmt(b.netAmt):'â€”')+'</td>'+
      '<td>'+b.date+'</td>'+
      '<td><b style="color:'+col+';">'+d+' days</b></td>'+
      '<td><span class="badge '+(stBadge[st]||'badge-submitted')+'">'+st+'</span></td>'+
      '<td style="font-size:11px;">'+(b.pendingWith||'<span style="color:var(--ap-gray-400);">Unassigned</span>')+'</td>'+
      '<td style="font-size:11px;">'+(b.pendingDesig||'â€”')+'</td>'+
    '</tr>';
  }).join('');
  document.getElementById('pendRepTbl').innerHTML=rows||'<tr><td colspan="13" style="text-align:center;color:var(--ap-green);padding:2rem;">âœ… No pending bills â€“ all processed!</td></tr>';
}

function renderMgmtVendorReport(){
  var vSummary={};
  PO_DATA.forEach(function(p){if(!vSummary[p.vendorCode])vSummary[p.vendorCode]={name:p.vendorName,pos:0,mat:0,svc:0,gross:0,paid:0,pending:0};vSummary[p.vendorCode].pos++;});
  VMAT_DATA.forEach(function(r){if(vSummary[r.vendorId]){vSummary[r.vendorId].mat++;vSummary[r.vendorId].gross+=r.grossAmt;vSummary[r.vendorId].paid+=r.amtPaid;}});
  VSVC_DATA.forEach(function(r){if(vSummary[r.vendorId]){vSummary[r.vendorId].svc++;vSummary[r.vendorId].gross+=r.grossAmt;vSummary[r.vendorId].paid+=r.amtPaid;}});
  submittedBills.filter(function(b){return b.status!=='Paid'&&b.status!=='Rejected';}).forEach(function(b){if(vSummary[b.vendorId])vSummary[b.vendorId].pending++;});
  var vKeys=Object.keys(vSummary).sort(function(a,b){return vSummary[b].paid-vSummary[a].paid;});
  var tG=vKeys.reduce(function(s,k){return s+vSummary[k].gross;},0);
  var tP=vKeys.reduce(function(s,k){return s+vSummary[k].paid;},0);
  document.getElementById('vendRepKPIs').innerHTML=
    kpiCard('Total Vendors',''+vKeys.length,'ðŸ­','var(--ap-blue)','')+
    kpiCard('Total Gross','â‚¹'+crToCr(tG)+' Cr','ðŸ“„','var(--ap-orange)','')+
    kpiCard('Total Paid','â‚¹'+crToCr(tP)+' Cr','âœ…','var(--ap-green)','');

  mDestroy('vendbar');
  _mCharts['vendbar']=new Chart(document.getElementById('vendRepBar'),{type:'bar',
    data:{labels:vKeys.map(function(k){return vSummary[k].name.substring(0,18);})
    ,datasets:[{label:'Net Paid (â‚¹ Cr)',data:vKeys.map(function(k){return+crToCr(vSummary[k].paid);}),backgroundColor:CHART_COLORS,borderRadius:5}]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return'Net Paid: â‚¹'+c.raw+' Cr';}}}},scales:{y:{ticks:{callback:function(v){return'â‚¹'+v+' Cr';}},grid:{color:'rgba(0,0,0,0.06)'}},x:{ticks:{font:{size:10}},grid:{display:false}}}}});

  mDestroy('vendpie');
  _mCharts['vendpie']=new Chart(document.getElementById('vendRepPie'),{type:'pie',
    data:{labels:vKeys.map(function(k){return vSummary[k].name;}),datasets:[{data:vKeys.map(function(k){return+crToCr(vSummary[k].gross);}),backgroundColor:CHART_COLORS,borderWidth:2,borderColor:'#fff'}]},
    options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return c.label+': â‚¹'+c.raw+' Cr';}}}}}}); 
  document.getElementById('vendRepPieLeg').innerHTML=makeLegend(vKeys.map(function(k){return vSummary[k].name;}),CHART_COLORS,vKeys.map(function(k){return'â‚¹'+crToCr(vSummary[k].gross)+' Cr';}));

  var rows=vKeys.map(function(k){
    var v=vSummary[k];
    return '<tr><td><b>'+k+'</b></td><td>'+v.name+'</td>'+
      '<td style="text-align:center;">'+v.pos+'</td>'+
      '<td style="text-align:center;">'+v.mat+'</td>'+
      '<td style="text-align:center;">'+v.svc+'</td>'+
      '<td class="amount">â‚¹'+crToCr(v.gross)+' Cr</td>'+
      '<td class="amount" style="color:var(--ap-green);font-weight:700;">â‚¹'+crToCr(v.paid)+' Cr</td>'+
      '<td style="text-align:center;"><span class="badge '+(v.pending>0?'badge-processing':'badge-paid')+'">'+v.pending+'</span></td>'+
    '</tr>';
  }).join('');
  document.getElementById('vendRepTbl').innerHTML=rows||'<tr><td colspan="8" style="text-align:center;color:var(--ap-gray-400);">No vendor data</td></tr>';
}

// FIX #7: Inbox tab rendering
function showInboxTab(tabId, btn){
  ['inboxPending','inboxOther','inboxCompleted'].forEach(function(id){
    document.getElementById(id).classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
  document.querySelectorAll('#vInbox .tab-btn').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  renderInboxTab(tabId);
}

function renderInboxTab(tabId){
  var myBills = submittedBills.filter(function(b){ return b.vendorId===currentVendorId; });
  var statusBadge = {
    'Submitted':'badge-submitted','Pending with AEE':'badge-processing','Reviewed by Engineer':'badge-form13',
    'Forwarded to EE':'badge-processing','Forwarded to Accounts':'badge-form13',
    'Form13 Updated':'badge-form13','Form14 Updated':'badge-form14',
    'Invoice Posted':'badge-processing','LOA Created':'badge-form14',
    'LOA Approved':'badge-approved','With HQ Accounts':'badge-processing',
    'Paid':'badge-paid','Rejected':'badge-rejected',
    'Sent Back by Accounts':'badge-rejected','Sent Back by HQ':'badge-rejected',
    'Sent Back':'badge-rejected','Draft (Editing)':'badge-pending'
  };

  function billCard(b){
    var st = b.status||'Submitted';
    var lastLog = b.log && b.log.length ? b.log[b.log.length-1] : null;
    return '<div class="notif-card'+(st==='Rejected'||st.includes('Sent Back')?' unread':'')+'" style="margin-bottom:10px;">'+
      '<div style="font-size:20px;">'+(st==='Paid'?'âœ…':st==='Rejected'||st.includes('Sent Back')?'âŒ':'ðŸ“‹')+'</div>'+
      '<div style="flex:1;">'+
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">'+
          '<span class="bill-id">'+b.billId+'</span>'+
          '<span class="badge '+(statusBadge[st]||'badge-submitted')+'">'+st+'</span>'+
          '<span class="badge '+(b.type==='Material'?'badge-submitted':'badge-form14')+'">'+b.type+'</span>'+
        '</div>'+
        '<div style="font-size:12px;color:var(--ap-gray-600);">PO: <b>'+b.poNo+'</b> | e-Invoice: '+(b.eInvNo||'â€”')+(b.grossAmt?' | Gross: <b>'+fmtAmt(b.grossAmt)+'</b>':'')+'</div>'+
        (b.pendingWith?'<div style="font-size:11px;color:var(--ap-gray-400);margin-top:2px;">ðŸ“ Currently with: <b>'+b.pendingWith+'</b>'+(b.pendingDesig?' ('+b.pendingDesig+')':'')+'</div>':'')+
        (lastLog?'<div style="font-size:11px;color:var(--ap-gray-600);margin-top:4px;background:var(--ap-gray-50);padding:5px 8px;border-radius:4px;">'+lastLog.date+' â€” '+lastLog.action+'</div>':'')+
        ((st==='Rejected'||st.includes('Sent Back'))?'<button class="btn btn-xs" style="margin-top:8px;background:var(--ap-orange-light);color:var(--ap-orange);border:1px solid var(--ap-orange);" onclick="editRejectedBill(\''+b.billId+'\')">âœ Edit & Re-submit</button>':'')+
      '</div>'+
    '</div>';
  }

  if(tabId==='inboxPending'){
    // Action required: rejected / sent back
    var actionBills = myBills.filter(function(b){ return b.status==='Rejected'||b.status==='Sent Back by Accounts'||b.status==='Sent Back by HQ'||b.status==='Sent Back'; });
    var html = actionBills.length ? actionBills.map(billCard).join('') :
      '<div class="notif-card"><div style="font-size:20px;">âœ…</div><div><div style="font-size:13px;font-weight:600;">No action needed</div><div style="font-size:12px;color:var(--ap-gray-600);">No bills require your attention right now.</div></div></div>';
    // Always show welcome message
    html = '<div class="notif-card unread"><div style="font-size:20px;">ðŸ“‹</div><div><div style="font-size:13px;font-weight:600;">Welcome to APTRANSCO VBTS</div><div style="font-size:12px;color:var(--ap-gray-600);">Your vendor account is active. Submit invoices and track payment status here.</div></div></div>' + html;
    document.getElementById('inboxPendingBody').innerHTML = html;

  } else if(tabId==='inboxOther'){
    // FIX #7: In-progress bills (submitted but not yet paid/posted by HQ)
    var inProgressBills = myBills.filter(function(b){ return b.status!=='Paid'&&b.status!=='Rejected'&&!b.status.includes('Sent Back')&&b.status!=='Draft (Editing)'; });
    document.getElementById('inboxOtherBody').innerHTML = inProgressBills.length ?
      inProgressBills.map(billCard).join('') :
      '<p style="color:var(--ap-gray-400);font-size:13px;">No bills currently in progress.</p>';

  } else if(tabId==='inboxCompleted'){
    // FIX #7: Paid / posted by HQ
    var completedBills = myBills.filter(function(b){ return b.status==='Paid'||b.status==='LOA Approved'||b.status==='Invoice Posted'; });
    document.getElementById('inboxCompletedBody').innerHTML = completedBills.length ?
      completedBills.map(billCard).join('') :
      '<p style="color:var(--ap-gray-400);font-size:13px;">No completed bills yet. Bills posted by HQ will appear here.</p>';
  }
}

function vShowPage(pageId, navEl){
  document.querySelectorAll('#vendorApp .page').forEach(function(p){p.classList.remove('active');});
  document.getElementById(pageId).classList.add('active');
  if(navEl){ document.querySelectorAll('#vendorApp .nav-item').forEach(function(n){n.classList.remove('active');}); navEl.classList.add('active'); }
  var titles={vDashboard:'Dashboard',vSubmitInvoice:'Submit Invoice / HR',vMyBills:'My Bills',vMyPOs:'My Purchase Orders',vInbox:'Inbox'};
  document.getElementById('v-pageTitle').textContent = titles[pageId]||pageId;
}

function updatePendingCounts(){
  // Employee pending badge â€” same strict logic as renderPendingBills
  var r0 = getEmpRole();
  var myName0 = r0.emp ? r0.emp.name : '';
  var pending = submittedBills.filter(function(b){
    if(b.status==='Paid'||b.status==='Rejected'||b.status==='Draft (Editing)') return false;
    if(b.status.includes('Sent Back')) return false;
    if(!myName0) return false;
    // Strict: only my name
    if(b.pendingWith === myName0) return true;
    // HQ exception
    if(r0.isHQAcct && (b.status==='With HQ Accounts'||b.status==='LOA Approved')) return true;
    return false;
  });
  var pendingEl = document.getElementById('apPendingCount');
  if(pendingEl){ pendingEl.textContent = pending.length; pendingEl.style.display = pending.length?'inline':'none'; }
  var notifEl = document.getElementById('ap-notifBadge');
  if(notifEl) notifEl.textContent = pending.length;

  // Vendor badges
  var vAllInProgress = submittedBills.filter(function(b){
    return b.vendorId===currentVendorId && b.status!=='Paid' && b.status!=='Draft (Editing)';
  });
  var vActionBills = vAllInProgress.filter(function(b){
    return b.status==='Sent Back by Accounts'||b.status==='Sent Back by HQ'||b.status==='Sent Back'||b.status==='Rejected';
  });
  var vInboxEl = document.getElementById('vInboxCount');
  if(vInboxEl){
    var total = vAllInProgress.length;
    vInboxEl.textContent = total;
    vInboxEl.style.display = total ? 'inline' : 'none';
    vInboxEl.style.background = vActionBills.length ? 'var(--ap-red)' : 'var(--ap-blue-mid)';
  }
  var vTopBadge = document.getElementById('vTopBadge');
  if(vTopBadge){
    vTopBadge.textContent = vActionBills.length;
    vTopBadge.style.display = vActionBills.length ? 'flex' : 'none';
  }
}

function apShowPage(pageId, navEl){
  document.querySelectorAll('#apApp .page').forEach(function(p){p.classList.remove('active');});
  document.getElementById(pageId).classList.add('active');
  if(navEl){ document.querySelectorAll('#apApp .nav-item').forEach(function(n){n.classList.remove('active');}); navEl.classList.add('active'); }
  var titles={apDashboard:'Dashboard',mgmtDashboard:'Management Dashboard',apPendingBills:'Pending Bills',apAllBills:'All Bills',apPayments:'Payment Records',apForm14:'Form 14 Records',apEmployees:'Employee Directory',apPOAssign:'Engineer Mapping'};
  document.getElementById('ap-pageTitle').textContent = titles[pageId]||pageId;
  if(pageId==='apPendingBills'){ renderPendingBills(); }
  if(pageId==='apAllBills'){ renderAllBills(); }
  updatePendingCounts();
}

function closeModal(id){ document.getElementById(id).classList.remove('open'); }

function showToast(msg, isWarn){
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = isWarn ? 'var(--ap-red)' : 'var(--ap-blue)';
  t.style.display = 'block';
  setTimeout(function(){ t.style.display='none'; }, 3500);
}

document.querySelectorAll('.modal-overlay').forEach(function(o){
  o.addEventListener('click', function(e){ if(e.target===o) o.classList.remove('open'); });
});

// Set today's date for invoice date
document.getElementById('invDate').value = new Date().toISOString().split('T')[0];

