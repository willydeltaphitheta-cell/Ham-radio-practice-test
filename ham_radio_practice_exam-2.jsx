import { useState, useEffect, useCallback, useRef } from "react";

// ─── FULL 411-QUESTION POOL ────────────────────────────────────────────────
// Format: [id, question, [[letter, text], ...], correctLetter, explanation]
const FULL_POOL = [
["T1A01","Which of the following is part of the Basis and Purpose of the Amateur Radio Service?",[["A","Providing personal radio communications for every citizen"],["B","Advancing skills in the technical and communication phases of the radio art"],["C","Setting aside a range of frequency to be used for emergencies"],["D","Providing communications for local governments"]],"B","The Basis and Purpose (FCC Part 97.1) lists advancing skills in both the technical and communication phases of the radio art as one of amateur radio's five core purposes."],
["T1A02","Which agency regulates and enforces the rules for the Amateur Radio Service in the United States?",[["A","FEMA"],["B","The ITU"],["C","The FCC"],["D","Homeland Security"]],"C","The FCC (Federal Communications Commission) is the U.S. government agency that regulates and enforces Part 97 rules covering Amateur Radio."],
["T1A03","What do the FCC rules state regarding the use of a phonetic alphabet for station identification in the Amateur Radio Service?",[["A","It is required when using phone"],["B","It is prohibited"],["C","It is required when in emergency communications"],["D","It is encouraged"]],"D","FCC rules encourage (but do not require) use of a phonetic alphabet such as the ITU/NATO alphabet to ensure accurate station identification."],
["T1A04","How many operator/primary station license grants may be held by any one person?",[["A","One"],["B","No more than two"],["C","One for each band class"],["D","One for each license class"]],"A","The FCC allows only one operator/primary station license grant per person. You can hold only one amateur radio license at a time."],
["T1A05","What proves that the FCC has issued an operator/primary license grant?",[["A","A printed copy of the license"],["B","A Certificate of Successful Completion of Examination"],["C","The license appears in the FCC ULS database"],["D","The possession of a license printed by the VEC"]],"C","Your official license is the entry in the FCC Universal Licensing System (ULS) database. The database record is the authoritative proof."],
["T1A06","What is the FCC Part 97 definition of a beacon?",[["A","A government transmitter marking the amateur frequencies"],["B","A manually transmitted signal that indicates the location of a local repeater"],["C","An amateur station transmitting communications for the purposes of observing propagation or related experimental activities"],["D","An automated signal used to mark dangerous overwater flight paths"]],"C","A beacon is an amateur station transmitting signals to observe propagation or for related experimental activities. It does not require a response from other stations."],
["T1A07","What is the FCC Part 97 definition of a space station?",[["A","An amateur station located in a satellite"],["B","An amateur station on the ISS"],["C","An amateur station located more than 50 km above Earth's surface"],["D","An amateur station that communicates with satellites"]],"C","Part 97 defines a space station as any amateur station located more than 50 km above Earth's surface — the approximate boundary of space."],
["T1A08","Which of the following entities recommends transmit/receive channels and other parameters for auxiliary and repeater stations?",[["A","The FCC"],["B","The ITU"],["C","A frequency coordinator recognized by local amateurs"],["D","The local emergency management office"]],"C","Volunteer Frequency Coordinators, recognized by local amateur operators, recommend channels and parameters for repeaters and auxiliary stations."],
["T1A09","Who selects a Frequency Coordinator?",[["A","The FCC"],["B","The local emergency manager"],["C","Amateurs in the local area whose stations are eligible to be repeater or auxiliary stations"],["D","The ITU"]],"C","Frequency coordinators are chosen by the amateur operators in a local or regional area whose stations are eligible to be repeater or auxiliary stations."],
["T1A10","What is the Radio Amateur Civil Emergency Service (RACES)?",[["A","A radio service using amateur frequencies for emergency management or civil defense communications"],["B","A radio service using amateur stations for emergency management or civil defense communications"],["C","An emergency service using amateur operators certified by a civil defense organization as being enrolled in that organization"],["D","All these choices are correct"]],"D","All three descriptions together fully define RACES — it uses amateur frequencies, amateur stations, AND certified operators enrolled in a civil defense organization."],
["T1A11","When is willful interference to other amateur radio stations permitted?",[["A","Only if the station is operating illegally"],["B","At no time"],["C","Only during a declared communications emergency"],["D","Whenever station licenses have expired"]],"B","Willful interference to any amateur station is NEVER permitted under FCC rules. Part 97.101(d) explicitly prohibits it."],
["T1B01","Which of the following frequency ranges are available for phone operation by Technician licensees?",[["A","28.050 MHz to 28.150 MHz"],["B","28.100 MHz to 28.300 MHz"],["C","28.300 MHz to 28.500 MHz"],["D","28.500 MHz to 29.700 MHz"]],"C","Technician licensees have phone privileges on HF only in the 10-meter band segment 28.300–28.500 MHz."],
["T1B02","Which amateurs may contact the International Space Station (ISS) on VHF bands?",[["A","Only those with Extra class licenses"],["B","Only those who have paid the ISS contact fee"],["C","Any amateur holding a Technician class or higher license"],["D","Any licensed amateur"]],"C","Any Technician or higher license holder can contact the ISS on VHF. Technicians have full VHF/UHF privileges."],
["T1B03","Which frequency is in the 6 meter amateur band?",[["A","49.00 MHz"],["B","52.525 MHz"],["C","28.400 MHz"],["D","144.200 MHz"]],"B","The 6-meter band spans 50–54 MHz. 52.525 MHz falls within this band. 28.4 MHz is 10 meters; 144.2 MHz is 2 meters."],
["T1B04","Which amateur band includes 146.52 MHz?",[["A","6 meters"],["B","2 meters"],["C","70 centimeters"],["D","23 centimeters"]],"B","The 2-meter band spans 144–148 MHz. 146.52 MHz (the national FM simplex calling frequency) is in the 2-meter band."],
["T1B05","How may amateurs use the 219 to 220 MHz segment of 1.25 meter band?",[["A","Spread spectrum only"],["B","Emergency communications only"],["C","Fixed digital message forwarding systems only"],["D","No privileges on that segment"]],"C","The 219–220 MHz segment is limited to fixed digital message forwarding systems only. General operation is not permitted there."],
["T1B06","On which HF bands does a Technician class operator have phone privileges?",[["A","None"],["B","80, 40, and 15 meter bands"],["C","30 and 17 meter bands"],["D","10 meter band only"]],"D","Technician licensees have phone (SSB) privileges only on the 10-meter band (28.300–28.500 MHz) among HF bands."],
["T1B07","Which of the following VHF/UHF band segments are limited to CW only?",[["A","50.0 MHz to 50.1 MHz and 144.0 MHz to 144.1 MHz"],["B","219 MHz to 220 MHz"],["C","902.0 MHz to 902.1 MHz"],["D","All these choices are correct"]],"A","By FCC rules and band plans, 50.0–50.1 MHz and 144.0–144.1 MHz are CW-only segments."],
["T1B08","How are US amateurs restricted in segments of bands where the Amateur Radio Service is secondary?",[["A","U.S. amateurs may not transmit during daylight hours"],["B","U.S. amateurs may find non-amateur stations in those segments, and must avoid interfering with them"],["C","U.S. amateurs must have written permission from the primary service before operating"],["D","U.S. amateurs are not restricted in secondary service frequency bands"]],"B","When amateur radio is secondary, amateurs must not cause interference to and must accept interference from the primary service."],
["T1B09","Why should you not set your transmit frequency to be exactly at the edge of an amateur band or sub-band?",[["A","To allow for calibration error in the transmitter frequency display"],["B","So that modulation sidebands do not extend beyond the band edge"],["C","To allow for transmitter frequency drift"],["D","All these choices are correct"]],"D","All three are valid reasons: display calibration error, sidebands extending beyond the edge, and transmitter drift."],
["T1B10","Where may SSB phone be used in amateur bands above 50 MHz?",[["A","Only in the 50.0 to 50.1 MHz segment"],["B","Only on frequencies within 3 kHz of the lower band edge"],["C","Only in the weakest signal sub-band of each band"],["D","In at least some segment of all these bands"]],"D","SSB phone is permitted in at least some segment of every amateur band above 50 MHz."],
["T1B11","What is the maximum peak envelope power output for Technician class operators in their HF band segments?",[["A","200 watts"],["B","100 watts"],["C","50 watts"],["D","25 watts"]],"A","Technician operators may run up to 200 watts PEP in their HF privileges (10-meter phone segment)."],
["T1B12","Except for some specific restrictions, what is the maximum peak envelope power output for Technician class operators using frequencies above 30 MHz?",[["A","50 watts"],["B","200 watts"],["C","500 watts"],["D","1500 watts"]],"D","Technicians may use up to 1500 watts PEP on bands above 30 MHz, the same as General and Extra class operators."],
["T1C01","For which license classes are new licenses currently available from the FCC?",[["A","Novice, Technician, General, Amateur Extra"],["B","Technician, Technician Plus, General, Amateur Extra"],["C","Novice, Technician, General, Advanced, Amateur Extra"],["D","Technician, General, Amateur Extra"]],"D","The FCC currently issues only three license classes: Technician, General, and Amateur Extra."],
["T1C02","Who may select a desired call sign under the vanity call sign rules?",[["A","Only licensed amateurs with Extra class licenses"],["B","Only licensed amateurs with General class and above"],["C","Only licensed amateurs who have been licensed for more than 5 years"],["D","Any licensed amateur"]],"D","Any licensed amateur may apply for a vanity call sign, regardless of license class."],
["T1C03","What types of international communications are an FCC-licensed amateur radio station permitted to make?",[["A","Communications incidental to the purposes of the Amateur Radio Service and remarks of a personal character"],["B","Communications directly related to the recipient country's official business"],["C","Any communications with amateurs in a country with a mutual aid agreement"],["D","All these choices are correct"]],"A","International amateur communications are limited to those incidental to the purposes of amateur radio and remarks of a personal character."],
["T1C04","What may happen if the FCC is unable to reach you by email?",[["A","Nothing; the FCC cannot revoke a license due to email issues"],["B","Revocation of the station license or suspension of the operator license"],["C","A fine of up to $10,000"],["D","Conversion of your license to a lower class"]],"B","Maintaining a valid email with the FCC is mandatory. Failure to do so can result in license revocation or operator suspension."],
["T1C05","Which of the following is a valid Technician class call sign format?",[["A","KA1X"],["B","W3XYZ"],["C","KF1XXX"],["D","N1XX"]],"C","New Technician class licensees in most districts receive a 1×3 format call sign like KF1XXX."],
["T1C06","From which of the following locations may an FCC-licensed amateur station transmit?",[["A","From within any country that belongs to the ITU"],["B","From within any country that has a reciprocal operating agreement with the U.S."],["C","From any vessel or craft located in international waters and documented or registered in the United States"],["D","From anywhere outside the jurisdiction of any government"]],"C","FCC-licensed amateurs may transmit from U.S.-registered vessels in international waters, in addition to U.S. territory."],
["T1C07","Which of the following can result in revocation of the station license or suspension of the operator license?",[["A","Failure to attend a VE testing session after registration"],["B","Failure to provide and maintain a correct email address with the FCC"],["C","Failure to obtain a new license before the old one expires"],["D","Failure to maintain a mailing address within 50 miles of the registered station"]],"B","Part 97.23 requires maintaining a correct email address with the FCC."],
["T1C08","What is the normal term for an FCC-issued amateur radio license?",[["A","Five years"],["B","Seven years"],["C","Ten years"],["D","Life of the licensee"]],"C","Amateur radio licenses are issued for a 10-year term."],
["T1C09","What is the grace period for renewal if an amateur license expires?",[["A","Six months"],["B","Two years"],["C","Five years"],["D","There is no grace period"]],"B","There is a two-year grace period after expiration, but you may NOT transmit during this period."],
["T1C10","How soon after passing the examination for your first amateur radio license may you transmit on the amateur radio bands?",[["A","Immediately upon receiving your Certificate of Successful Completion of Examination"],["B","As soon as your operator/station license grant appears in the FCC's license database"],["C","24 hours after the VE session"],["D","As soon as you receive your printed license"]],"B","You may transmit as soon as your license appears in the FCC ULS database."],
["T1C11","If your license has expired and is still within the allowable grace period, may you continue to transmit on the amateur radio bands?",[["A","Yes, for up to 90 days"],["B","Yes, as long as you have applied for renewal"],["C","Yes, as long as you identify using your previous call sign followed by the word expired"],["D","No, you must wait until the license has been renewed"]],"D","Even within the 2-year grace period, you may NOT transmit until the license is renewed and active."],
["T1D01","With which countries are FCC-licensed amateur radio stations prohibited from exchanging communications?",[["A","Any country whose administration has notified the ITU that it objects to such communications"],["B","Any country that is not a member of the ITU"],["C","Any country with which the U.S. does not have a third-party agreement"],["D","Any country that is not a NATO member"]],"A","Communications are prohibited only with countries whose administrations have officially notified the ITU of an objection."],
["T1D02","Under which of the following circumstances are one-way transmissions by an amateur station prohibited?",[["A","In all circumstances"],["B","Broadcasting"],["C","When using a simplex frequency"],["D","When operating outside of a contest"]],"B","Broadcasting — transmitting to the general public — is prohibited. One-way transmissions for beacons, code practice, and telemetry are permitted."],
["T1D03","When is it permissible to transmit messages encoded to obscure their meaning?",[["A","Only when operating phone"],["B","Only when operating CW"],["C","Only when transmitting control commands to space stations or radio control craft"],["D","Never"]],"C","Coded/encrypted messages are only permitted for transmitting control commands to space stations or radio-controlled craft."],
["T1D04","Under what conditions is an amateur station authorized to transmit music using a phone emission?",[["A","When specifically requested by the other station"],["B","When it does not contain lyrics, or the lyrics are in a language other than English"],["C","When transmitting international Morse code"],["D","When incidental to an authorized retransmission of manned spacecraft communications"]],"D","Music is only permitted when incidental to the authorized retransmission of manned spacecraft communications."],
["T1D05","When may amateur radio operators use their stations to notify other amateurs of the availability of equipment for sale or trade?",[["A","When the equipment is used and not the subject of a commercial transaction"],["B","When selling amateur radio equipment and not on a regular basis"],["C","When the asking price is less than its appraised value"],["D","All these choices are correct"]],"B","Amateurs may announce ham radio equipment for sale, but not on a regular basis."],
["T1D06","What, if any, are the restrictions concerning transmission of language that may be considered indecent or obscene?",[["A","The FCC has no rules about indecent language"],["B","Indecent language is allowed only on amateur frequencies above 50 MHz"],["C","Indecent language is only prohibited when children may be listening"],["D","Any such language is prohibited"]],"D","Part 97.113 explicitly prohibits transmission of obscene or indecent language on any amateur frequency."],
["T1D07","What types of amateur stations can automatically retransmit the signals of other amateur stations?",[["A","Auxiliary, repeater, or club stations"],["B","Repeater, auxiliary, or space stations"],["C","Beacon, repeater, or emergency stations"],["D","Club, auxiliary, or space stations"]],"B","Only repeater, auxiliary, and space stations are authorized to automatically retransmit signals from other amateur stations."],
["T1D08","In which of the following circumstances may the control operator of an amateur station receive compensation for operating that station?",[["A","When operating a station in a commercial business"],["B","When the communication is incidental to classroom instruction at an educational institution"],["C","When engaged in a contest"],["D","When operating a club station"]],"B","A control operator may be compensated only when communications are incidental to classroom instruction at an educational institution."],
["T1D09","When may amateur stations transmit information in support of broadcasting, program production, or news gathering, assuming no other means is available?",[["A","Never"],["B","Only when licensed by the FCC for such activities"],["C","When such communications are directly related to the immediate safety of human life or protection of property"],["D","Only when coordinated with the nearest broadcast station"]],"C","Broadcasting support is permitted only in emergencies directly involving the immediate safety of human life or protection of property."],
["T1D10","How does the FCC define broadcasting for the Amateur Radio Service?",[["A","Transmissions intended for one-way communications"],["B","Transmissions intended for reception by the general public"],["C","Transmissions intended for two or more stations at the same time"],["D","Transmissions via satellite"]],"B","The FCC defines broadcasting as transmissions intended for reception by the general public — this is prohibited in amateur radio."],
["T1D11","When may an amateur station transmit without identifying on the air?",[["A","When the transmission is less than 30 seconds in duration"],["B","When operating simplex in a frequency coordinate location"],["C","When transmitting signals to control model craft"],["D","When operating a mobile radio in a vehicle"]],"C","An amateur station may transmit unidentified only when transmitting signals to control model craft (RC vehicles, planes, boats, etc.)."],
["T1E01","When may an amateur station transmit without a control operator?",[["A","When the station is remote controlled"],["B","When the station is operating autonomously"],["C","When the station is transmitting a beacon signal"],["D","Never"]],"D","An amateur station may never transmit without a designated control operator."],
["T1E02","Who may be the control operator of a station communicating through an amateur satellite or space station?",[["A","Only an Amateur Extra class operator"],["B","Any amateur allowed to transmit on the satellite uplink frequency"],["C","Any licensed amateur"],["D","Only the station licensee"]],"B","Any licensed amateur who is authorized to transmit on the satellite's uplink frequency may serve as control operator."],
["T1E03","Who must designate the station control operator?",[["A","The FCC"],["B","Any licensed amateur in the area"],["C","The station licensee"],["D","The control operator themselves"]],"C","The station licensee bears responsibility for designating the control operator."],
["T1E04","What determines the transmitting frequency privileges of an amateur station?",[["A","The station's power output"],["B","The class of operator license held by the control operator"],["C","The station's geographic location"],["D","The type of antenna in use"]],"B","Frequency privileges are determined by the license class of the control operator at the time of transmission."],
["T1E05","What is an amateur station's control point?",[["A","The location of the transmitter"],["B","The location of the antenna"],["C","The location at which the control operator function is performed"],["D","The location of the station's primary power supply"]],"C","The control point is defined as the location where the control operator performs their function."],
["T1E06","When, under normal circumstances, may a Technician class licensee be the control operator of a station operating in an Amateur Extra Class band segment?",[["A","When the station licensee is an Amateur Extra"],["B","At no time"],["C","When using RTTY or data modes"],["D","When the Technician has passed elements 3 and 4"]],"B","A Technician licensee may never be the control operator for operation in Extra-only segments."],
["T1E07","When the control operator is not the station licensee, who is responsible for the proper operation of the station?",[["A","Only the control operator"],["B","Only the station licensee"],["C","The control operator and the station licensee"],["D","The frequency coordinator"]],"C","Both the control operator and the station licensee share responsibility."],
["T1E08","Which of the following is an example of automatic control?",[["A","A station transmitting with a voice synthesizer controlled by a computer"],["B","A station run by a licensed operator from a remote location"],["C","Repeater operation"],["D","All these choices are correct"]],"C","Automatic control means a station operates without a control operator present — repeaters are the classic example."],
["T1E09","Which of the following are required for remote control operation?",[["A","The control operator must be at the control point"],["B","A control operator is required at all times"],["C","The control operator must indirectly manipulate the controls"],["D","All these choices are correct"]],"D","All three statements are true of remote control operation."],
["T1E10","Which of the following is an example of remote control as defined in Part 97?",[["A","A station that operates with a computer-controlled transmitter without a licensed operator present"],["B","Operating the station over the internet"],["C","A station controlled by a licensed operator on a different continent"],["D","All these choices are correct"]],"B","Operating an amateur station over the internet is the modern example of remote control."],
["T1E11","Who does the FCC presume to be the control operator of an amateur station, unless documentation to the contrary is in the station records?",[["A","The person who built the station"],["B","The person operating the transmitter"],["C","The station licensee"],["D","The nearest FCC inspector"]],"C","The FCC presumes the station licensee is the control operator unless station records show otherwise."],
["T1F01","When must the station and its records be available for FCC inspection?",[["A","Only during FCC-declared amateur radio inspection periods"],["B","At any time upon request by an FCC representative"],["C","At any time ten days after notification by the FCC"],["D","At any time after receipt of an official notice of violation"]],"B","An amateur station and its records must be made available to the FCC at ANY time upon request."],
["T1F02","How often must you identify with your FCC-assigned call sign when using tactical call signs such as Race Headquarters?",[["A","Never, if you are using a tactical call sign"],["B","Once during every hour"],["C","At the end of each communication and every ten minutes during a communication"],["D","At the end of each communication only"]],"C","You must identify with your FCC call sign at the end of each communication and every 10 minutes during a communication."],
["T1F03","When are you required to transmit your assigned call sign?",[["A","At the beginning of each contact and every 10 minutes during contacts"],["B","At least every 10 minutes during and at the end of a communication"],["C","At the end of a contact only"],["D","At the beginning of a contact only"]],"B","Part 97.119 requires identification at least every 10 minutes during and at the end of a communication."],
["T1F04","What language may you use for identification when operating in a phone sub-band?",[["A","Any language recognized by the United Nations"],["B","Any language used in a country with a reciprocal license agreement"],["C","The language being used for the contact"],["D","English"]],"D","Station identification must be in English when operating in a phone sub-band."],
["T1F05","What method of call sign identification is required for a station transmitting phone signals?",[["A","CW only"],["B","CW or phone emission"],["C","Phone only"],["D","No identification is required for phone transmissions"]],"B","Phone stations may identify by sending their call sign using either CW or phone emission."],
["T1F06","Which of the following self-assigned indicators are acceptable when using a phone transmission?",[["A","KL7CC stroke W3"],["B","KL7CC slant W3"],["C","KL7CC slash W3"],["D","All these choices are correct"]],"D","Stroke, slant, and slash are all acceptable equivalents when appending a self-assigned indicator."],
["T1F07","Which of the following restrictions apply when a non-licensed person is allowed to speak to a foreign station using a station under the control of a licensed amateur operator?",[["A","No restrictions apply; anyone can use an amateur station"],["B","The foreign station must be in a country with which the U.S. has a third party agreement"],["C","The non-licensed person must be accompanied by a licensed operator"],["D","The non-licensed person must have written permission from the FCC"]],"B","Third-party communications with foreign stations are only allowed if the foreign country has a third-party agreement with the U.S."],
["T1F08","What is the definition of third party communications?",[["A","A message from a control operator to another amateur station control operator on behalf of another person"],["B","Emergency traffic handled by three stations"],["C","A communication on behalf of three parties"],["D","An encrypted message between two control operators"]],"A","Third-party communications are messages from one control operator to another on behalf of a non-licensed third party."],
["T1F09","What type of amateur station simultaneously retransmits the signal of another amateur station on a different channel or channels?",[["A","An auxiliary station"],["B","A beacon station"],["C","A repeater station"],["D","An earth station"]],"C","A repeater station receives on one frequency and simultaneously retransmits on a different (offset) frequency."],
["T1F10","Who is accountable if a repeater inadvertently retransmits communications that violate the FCC rules?",[["A","The trustee of the repeater"],["B","The control operator of the originating station"],["C","Both the originating station and the repeater trustee"],["D","The FCC itself"]],"B","The control operator of the originating station is responsible for the content of their transmissions."],
["T1F11","Which of the following is a requirement for the issuance of a club station license grant?",[["A","The club must be registered with the ARRL"],["B","The club must have at least four members"],["C","The club must have a designated control operator"],["D","The club must have a constitution and bylaws"]],"B","To obtain a club station license, the club must have at least four members."],
["T2A01","What is a common repeater frequency offset in the 2 meter band?",[["A","Plus or minus 600 kHz"],["B","Plus or minus 500 kHz"],["C","Plus or minus 1 MHz"],["D","Plus or minus 5 MHz"]],"A","In the 2-meter band, the standard repeater offset is ±600 kHz."],
["T2A02","What is the national calling frequency for FM simplex operations in the 2 meter band?",[["A","146.420 MHz"],["B","146.520 MHz"],["C","147.420 MHz"],["D","147.520 MHz"]],"B","146.520 MHz is the national FM simplex calling frequency on 2 meters."],
["T2A03","What is a common repeater frequency offset in the 70 cm band?",[["A","Plus or minus 600 kHz"],["B","Plus or minus 1 MHz"],["C","Plus or minus 5 MHz"],["D","Plus or minus 3 MHz"]],"C","In the 70-centimeter band, the standard repeater offset is ±5 MHz."],
["T2A04","What is an appropriate way to call another station on a repeater if you know the other station's call sign?",[["A","Say Breaker Breaker then the station's call sign"],["B","Say the station's call sign, then identify with your call sign"],["C","Say CQ three times, then the station's call sign"],["D","Wait for the station to call CQ"]],"B","On a repeater, say the other station's call sign first, then your own. For example: W1ABC, this is W2XYZ."],
["T2A05","How should you respond to a station calling CQ?",[["A","Transmit CQ followed by the other station's call sign"],["B","Transmit the other station's call sign followed by your call sign"],["C","Transmit your call sign followed by the other station's call sign"],["D","Transmit both call signs at the same time"]],"B","To answer a CQ, transmit the calling station's call sign first, then your own."],
["T2A06","Which of the following is required when making on-the-air test transmissions?",[["A","Indicate that the transmission is a test"],["B","Identify the transmitting station"],["C","Obtain prior permission from the FCC"],["D","All these choices are correct"]],"B","You must identify your station during test transmissions, just as during any other transmission."],
["T2A07","What is meant by repeater offset?",[["A","The distance between a repeater and its farthest user"],["B","The delay between an incoming signal and the repeated output"],["C","The difference between a repeater's transmit and receive frequencies"],["D","The power difference between a repeater's input and output signals"]],"C","The repeater offset is the frequency difference between the repeater's transmit and receive frequencies."],
["T2A08","What is the meaning of the procedural signal CQ?",[["A","Only two stations may answer"],["B","Calling any station"],["C","All stations stop transmitting"],["D","The frequency is in use"]],"B","CQ is a general call meaning I am calling any station."],
["T2A09","Which of the following indicates that a station is listening on a repeater and looking for a contact?",[["A","The station's call sign followed by the word standing by"],["B","The word CQ transmitted repeatedly"],["C","The station's call sign followed by the word monitoring"],["D","The word listening transmitted slowly"]],"C","Saying your call sign followed by monitoring indicates you are on frequency and available for a contact."],
["T2A10","What is a band plan, beyond the privileges established by the FCC?",[["A","A required document describing planned frequencies for emergency use"],["B","A list of frequency pairs for repeaters in a local area"],["C","A document that records frequencies currently in use on a band"],["D","A voluntary guideline for using different modes or activities within an amateur band"]],"D","A band plan is a voluntary community agreement that divides a band by mode or activity."],
["T2A11","What term describes an amateur station that is transmitting and receiving on the same frequency?",[["A","Full duplex"],["B","Diplex"],["C","Simplex"],["D","Offset"]],"C","Simplex operation means transmitting and receiving on the same frequency."],
["T2A12","What should you do before calling CQ?",[["A","Listen first to be sure that no one else is using the frequency"],["B","Ask if the frequency is in use"],["C","Make sure you are authorized to use that frequency"],["D","All these choices are correct"]],"D","Good practice before calling CQ includes listening first, asking if in use, and confirming you have privileges."],
["T2B01","How is a VHF/UHF transceiver's reverse function used?",[["A","To listen on a different input frequency"],["B","To listen on a repeater's input frequency"],["C","To reverse the transmit and receive frequencies when using a simplex channel"],["D","To switch the radio's offset to the opposite direction"]],"B","The reverse function lets you listen on the repeater's input frequency."],
["T2B02","What term describes the use of a sub-audible tone transmitted along with normal voice audio to open the squelch of a receiver?",[["A","DTMF"],["B","CTCSS"],["C","CDCSS"],["D","Carrier squelch"]],"B","CTCSS (Continuous Tone-Coded Squelch System) uses a sub-audible tone transmitted continuously with your voice."],
["T2B03","Which of the following describes a linked repeater network?",[["A","A repeater that connects to the public switched telephone network"],["B","A network of repeaters in which signals received by one repeater are transmitted by all the repeaters in the network"],["C","A system in which all repeaters share the same frequency pair"],["D","Multiple repeaters linked to a single voting receiver"]],"B","A linked repeater network connects multiple repeaters so a signal received by any one is retransmitted by all."],
["T2B04","Which of the following could be the reason you are unable to access a repeater whose output you can hear?",[["A","Improper transceiver offset"],["B","You are using the wrong CTCSS tone"],["C","You are using the wrong DCS code"],["D","All these choices are correct"]],"D","All three are possible reasons: wrong offset, wrong CTCSS tone, or wrong DCS code."],
["T2B05","What would cause your FM transmission audio to be distorted on voice peaks?",[["A","Your transmitter is slightly off frequency"],["B","You are talking too loudly"],["C","Your antenna SWR is too high"],["D","You are transmitting too close to the repeater"]],"B","Talking too loudly causes over-deviation on FM, resulting in distorted audio at the receiver."],
["T2B06","What type of signaling uses pairs of audio tones?",[["A","CTCSS"],["B","DTMF"],["C","CDCSS"],["D","FSK"]],"B","DTMF (Dual-Tone Multi-Frequency) uses pairs of audio tones — the same system used on telephone keypads."],
["T2B07","How can you join a digital repeater's talkgroup?",[["A","Register on the repeater's web site and wait for approval"],["B","Program your radio with the group's ID or code"],["C","Transmit the group's CTCSS tone"],["D","Send the group's DTMF code"]],"B","To join a DMR talkgroup, program the talkgroup ID into your radio's code plug."],
["T2B08","Which of the following applies when two stations transmitting on the same frequency interfere with each other?",[["A","Both stations should immediately cease operations"],["B","The station with the lower power level must cease operations"],["C","The station that has been on the frequency the longest has priority"],["D","The stations should negotiate continued use of the frequency"]],"D","Amateur courtesy requires stations to negotiate when interference occurs."],
["T2B09","Why are simplex channels designated in the VHF/UHF band plans?",[["A","So stations can call CQ without the risk of establishing a contact"],["B","For contest operations only"],["C","So stations within range of each other can communicate without tying up a repeater"],["D","Because simplex signals have less interference"]],"C","Simplex channels allow nearby stations to communicate directly without using a repeater."],
["T2B10","Which Q signal indicates that you are receiving interference from other stations?",[["A","QSB"],["B","QRN"],["C","QRM"],["D","QTH"]],"C","QRM means interference from other man-made stations. QRN is natural noise. QSB is fading. QTH is location."],
["T2B11","Which Q signal indicates that you are changing frequency?",[["A","QRZ"],["B","QSY"],["C","QSL"],["D","QRT"]],"B","QSY means change frequency. QRZ means who is calling? QSL means I acknowledge receipt. QRT means stop transmitting."],
["T2B12","What is the purpose of the color code used on DMR repeater systems?",[["A","To identify different DMR manufacturers"],["B","To indicate the signal strength of the repeater"],["C","To encode audio quality information"],["D","Must match the repeater color code for access"]],"D","In DMR, the color code (0–15) must match the repeater's color code to gain access, similar to CTCSS tones."],
["T2B13","What is the purpose of a squelch function?",[["A","To increase the receiver sensitivity"],["B","To reduce transmitter power when not needed"],["C","To filter out background noise on receive"],["D","Mute the receiver audio when a signal is not present"]],"D","The squelch circuit mutes the receiver's audio when no sufficiently strong signal is present."],
["T2C01","When do FCC rules NOT apply to the operation of an amateur station?",[["A","When operating under RACES rules"],["B","When ARES is activated"],["C","FCC rules always apply"],["D","When operating under a declared emergency"]],"C","FCC rules always apply to amateur radio operation — there are no exceptions."],
["T2C02","Which of the following are typical duties of a Net Control Station?",[["A","Listen for out-of-band transmissions on other amateur bands and report them to the net manager"],["B","Call the net to order and direct communications between stations checking in"],["C","Transcribe all net traffic into the net log"],["D","All these choices are correct"]],"B","The Net Control Station (NCS) opens the net, invites check-ins, and directs traffic flow."],
["T2C03","What technique is used to ensure that voice messages containing unusual words are received correctly?",[["A","Send the words using a phonetic alphabet over the air before sending the regular message"],["B","Spell the words using a standard phonetic alphabet"],["C","Use Q signals to indicate that the next word is unusual"],["D","Double the transmission power when transmitting unusual words"]],"B","Spelling unusual words using a phonetic alphabet (Alpha, Bravo, Charlie...) ensures they are received correctly."],
["T2C04","What is RACES?",[["A","An FCC Part 97 amateur radio service for civil defense communications during national emergencies"],["B","A FEMA service for emergency communications"],["C","A training program for amateur radio operators"],["D","An ITU-sponsored emergency communications service"]],"A","RACES is defined in FCC Part 97 as an amateur radio service providing communications for civil defense purposes during emergencies."],
["T2C05","What does the term traffic refer to in net operation?",[["A","Problems with interference on the net frequency"],["B","Messages exchanged by net stations"],["C","The total number of stations checking into a net"],["D","A measure of net activity"]],"B","In amateur radio net operation, traffic refers to formal messages being passed through the net."],
["T2C06","What is the Amateur Radio Emergency Service (ARES)?",[["A","A government agency that coordinates amateur radio during emergencies"],["B","An FCC-mandated emergency service using amateur operators"],["C","A group of licensed amateurs who have voluntarily registered their qualifications and equipment for communications duty in the public service"],["D","An emergency communications service limited to Extra class licensees"]],"C","ARES is an ARRL-sponsored volunteer organization where licensed amateurs register to provide emergency communications."],
["T2C07","Which of the following is standard practice when you participate in a net?",[["A","Transmit on a higher power level to ensure your message gets through"],["B","Identify your station by transmitting your call sign at regular intervals"],["C","Unless you are reporting an emergency, transmit only when directed by the net control station"],["D","Monitor the net frequency at all times and only transmit when you hear your call sign"]],"C","In a directed net, only transmit when directed by the Net Control Station, except in a genuine emergency."],
["T2C08","Which of the following is a characteristic of good traffic handling?",[["A","Passing messages exactly as received"],["B","Correcting any apparent errors in messages"],["C","Shortening long messages for efficiency"],["D","Translating messages into plain language"]],"A","Good traffic handling requires passing messages exactly as received, without alteration."],
["T2C09","Are amateur station control operators ever permitted to operate outside the frequency privileges of their license class?",[["A","Yes, but only in situations involving the immediate safety of human life or protection of property"],["B","Yes, on any frequency if they are RACES or ARES members"],["C","No, never"],["D","Yes, if the FCC has issued a special waiver"]],"A","Part 97.405 allows operation outside normal privileges in genuine emergencies involving immediate safety of human life or property."],
["T2C10","What information is contained in the preamble of a formal traffic message?",[["A","The originator's name and address"],["B","Information needed to track the message"],["C","The text of the message"],["D","Routing instructions for message delivery"]],"B","The preamble contains the message number, precedence, handling instructions, originating station, check, place of origin, time filed, and date."],
["T2C11","What is meant by check in a radiogram header?",[["A","The originator's call sign"],["B","The number of words or word equivalents in the text portion of the message"],["C","A code indicating message priority"],["D","The sum of all letters in the message"]],"B","The check in a radiogram preamble is the word count of the text portion, used to verify complete reception."],
["T3A01","Why do VHF signal strengths sometimes vary greatly when the antenna is moved only a few feet?",[["A","The signal path encounters different concentrations of water vapor"],["B","VHF ionospheric absorption is very intense"],["C","Multipath propagation cancels or reinforces signals"],["D","The horizon blocks radio waves at short distances"]],"C","Moving a few feet changes the phase relationships between direct and reflected signals (multipath), causing cancellation or reinforcement."],
["T3A02","What is the effect of vegetation on UHF and microwave signals?",[["A","Diffraction"],["B","Refraction"],["C","Absorption"],["D","Reflection"]],"C","Leaves and vegetation contain water, which absorbs microwave and UHF energy, significantly attenuating signals."],
["T3A03","What antenna polarization is normally used for long-distance CW and SSB contacts on the VHF and UHF bands?",[["A","Right-hand circular"],["B","Left-hand circular"],["C","Vertical"],["D","Horizontal"]],"D","Horizontal polarization is the convention for weak-signal (CW and SSB) work on VHF and UHF."],
["T3A04","What happens when antennas at opposite ends of a VHF or UHF line of sight radio link are not using the same polarization?",[["A","Increased SWR"],["B","Reduced signal strength"],["C","Signals are not intelligible"],["D","Polarization loss occurs only with vertical antennas"]],"B","Mismatched polarization can cause 20 dB or more of signal loss."],
["T3A05","When using a directional antenna, how might your station be able to communicate with a distant repeater if buildings or obstructions are blocking the direct line of sight path?",[["A","Change the antenna polarization"],["B","Try to find a path that reflects signals to the repeater"],["C","Increase transmitter power"],["D","Switch to a higher frequency"]],"B","Point a directional antenna at a reflective surface (building or hillside) to bounce signals to the repeater."],
["T3A06","What is the meaning of the term picket fencing?",[["A","A type of antenna construction technique"],["B","Alternating high and low SWR readings"],["C","A filtering technique for noise reduction"],["D","Rapid flutter on mobile signals due to multipath propagation"]],"D","Picket fencing is the rapid signal strength variation heard when a mobile station moves through areas of rapidly changing multipath interference."],
["T3A07","What weather condition might decrease range at microwave frequencies?",[["A","High barometric pressure"],["B","Low humidity"],["C","Precipitation"],["D","Sunshine"]],"C","Precipitation (rain, snow, sleet) scatters and absorbs microwave signals significantly."],
["T3A08","What is a likely cause of irregular fading of signals propagated by the ionosphere?",[["A","Tidal effects of the moon on the ionosphere"],["B","Occasional failures of the F region"],["C","Magnetic storms in the solar wind"],["D","Random combining of signals arriving via different paths"]],"D","Ionospheric signals often travel via multiple paths of different lengths, combining with random phases to cause irregular fading (QSB)."],
["T3A09","Which of the following results from the fact that signals propagated by the ionosphere are elliptically polarized?",[["A","Digital modes are not possible via the ionosphere"],["B","Either vertically or horizontally polarized antennas may be used for transmission or reception"],["C","Circular polarization is required for reliable ionospheric communication"],["D","Signals bounced off the ionosphere can only be received within 100 miles"]],"B","Because ionospheric propagation rotates polarization, either vertical or horizontal antennas work for HF ionospheric communication."],
["T3A10","What effect does multi-path propagation have on data transmissions?",[["A","Error rates are likely to increase"],["B","Error rates are likely to decrease"],["C","Transmission speed is increased"],["D","Frequency instability is increased"]],"A","Multipath causes intersymbol interference, corrupting data bits and increasing error rates."],
["T3A11","Which region of the atmosphere can refract or bend HF and VHF radio waves?",[["A","The stratosphere"],["B","The mesosphere"],["C","The troposphere"],["D","The ionosphere"]],"D","The ionosphere (60–1000 km altitude) is ionized by solar radiation and bends HF radio waves back to Earth."],
["T3A12","What is the effect of fog and rain on signals in the 10 meter and 6 meter bands?",[["A","S-unit fading occurs"],["B","Signals are temporarily echoed"],["C","There is little effect"],["D","Signals are significantly attenuated"]],"C","10 and 6 meter signals are not significantly affected by fog or rain; precipitation effects matter mainly at microwave frequencies."],
["T3B01","What is the relationship between the electric and magnetic fields of an electromagnetic wave?",[["A","They travel at different speeds"],["B","They are in parallel"],["C","They revolve in opposite directions"],["D","They are at right angles"]],"D","In an electromagnetic wave, the electric and magnetic fields are always perpendicular (at right angles) to each other and to the direction of travel."],
["T3B02","What property of a radio wave defines its polarization?",[["A","The orientation of the electric field"],["B","The orientation of the magnetic field"],["C","The ratio of the energy in the magnetic field to the energy in the electric field"],["D","The ratio of the velocity to the wavelength"]],"A","Polarization is defined by the orientation of the electric field."],
["T3B03","What are the two components of a radio wave?",[["A","Impedance and reactance"],["B","Voltage and current"],["C","Electric and magnetic fields"],["D","Ionizing and non-ionizing radiation"]],"C","Radio waves consist of oscillating electric and magnetic fields traveling through space at the speed of light."],
["T3B04","What is the velocity of a radio wave traveling through free space?",[["A","Speed of light"],["B","Speed of sound"],["C","Speed inversely proportional to its wavelength"],["D","Speed that increases as the frequency increases"]],"A","All electromagnetic waves travel through free space at the speed of light, approximately 300,000,000 m/s."],
["T3B05","What is the relationship between wavelength and frequency?",[["A","Wavelength gets longer as frequency increases"],["B","Wavelength gets shorter as frequency increases"],["C","Wavelength and frequency are unrelated"],["D","Wavelength and frequency increase as path length increases"]],"B","Wavelength and frequency are inversely proportional. Formula: wavelength (m) = 300 / frequency (MHz)."],
["T3B06","What is the formula for converting frequency to approximate wavelength in meters?",[["A","Wavelength in meters equals frequency in hertz multiplied by 300"],["B","Wavelength in meters equals frequency in hertz divided by 300"],["C","Wavelength in meters equals frequency in megahertz divided by 300"],["D","Wavelength in meters equals 300 divided by frequency in megahertz"]],"D","The formula is: wavelength (m) = 300 / frequency (MHz). Example: 146 MHz gives 300/146 ≈ 2.05 meters."],
["T3B07","In addition to frequency, which of the following is used to identify amateur radio bands?",[["A","The approximate wavelength in meters"],["B","Traditional letter/number designators"],["C","Channel numbers"],["D","All these choices are correct"]],"A","Amateur bands are commonly referred to by their approximate wavelength: 2 meters, 70 centimeters, 10 meters, etc."],
["T3B08","What frequency range is referred to as VHF?",[["A","30 kHz to 300 kHz"],["B","30 MHz to 300 MHz"],["C","300 kHz to 3000 kHz"],["D","300 MHz to 3000 MHz"]],"B","VHF (Very High Frequency) spans 30 MHz to 300 MHz. The popular 2-meter band (144–148 MHz) is in this range."],
["T3B09","What frequency range is referred to as UHF?",[["A","30 to 300 kHz"],["B","30 to 300 MHz"],["C","300 to 3000 kHz"],["D","300 to 3000 MHz"]],"D","UHF (Ultra High Frequency) spans 300 MHz to 3000 MHz. The 70-centimeter band (420–450 MHz) is the most popular UHF amateur band."],
["T3B10","What frequency range is referred to as HF?",[["A","300 to 3000 MHz"],["B","30 to 300 MHz"],["C","3 to 30 MHz"],["D","300 to 3000 kHz"]],"C","HF (High Frequency) spans 3 to 30 MHz. HF enables long-distance ionospheric propagation."],
["T3B11","What is the approximate velocity of a radio wave in free space?",[["A","150,000 meters per second"],["B","300,000,000 meters per second"],["C","300,000,000 miles per hour"],["D","150,000 miles per hour"]],"B","Radio waves travel at the speed of light: approximately 300,000,000 meters per second (3 × 10⁸ m/s)."],
["T3C01","Why are simplex UHF signals rarely heard beyond their radio horizon?",[["A","They are too weak to go very far"],["B","FCC regulations prohibit them from going more than 50 miles"],["C","UHF signals are usually not propagated by the ionosphere"],["D","UHF signals are absorbed by the ionospheric D region"]],"C","UHF wavelengths pass through the ionosphere rather than being refracted back to Earth, limiting them to line-of-sight distances."],
["T3C02","What is a characteristic of HF communication compared with communications on VHF and higher frequencies?",[["A","HF antennas are generally smaller"],["B","HF accommodates wider bandwidth signals"],["C","Long-distance ionospheric propagation is far more common on HF"],["D","There is less atmospheric interference on HF"]],"C","HF signals (3–30 MHz) are efficiently refracted by the ionosphere, enabling contacts over thousands of miles."],
["T3C03","What is a characteristic of VHF signals received via auroral backscatter?",[["A","They are often received from 10,000 miles or more"],["B","They are distorted and signal strength varies considerably"],["C","They occur only during winter nighttime hours"],["D","They are generally strongest when your antenna is aimed west"]],"B","Auroral backscatter causes significant signal distortion and rapid amplitude variations."],
["T3C04","Which of the following types of propagation is most commonly associated with occasional strong signals on the 10, 6, and 2 meter bands from beyond the radio horizon?",[["A","Backscatter"],["B","Sporadic E"],["C","D region absorption"],["D","Gray-line propagation"]],"B","Sporadic E (Es) occurs when dense ionized clouds form in the E layer, occasionally reflecting signals over 500–1500 miles."],
["T3C05","Which of the following effects may allow radio signals to travel beyond obstructions between the transmitting and receiving stations?",[["A","Knife-edge diffraction"],["B","Faraday rotation"],["C","Quantum tunneling"],["D","Doppler shift"]],"A","Knife-edge diffraction occurs when a radio wave bends around a sharp obstacle like a mountain ridge."],
["T3C06","What type of propagation is responsible for allowing over-the-horizon VHF and UHF communications to ranges of approximately 300 miles on a regular basis?",[["A","Tropospheric ducting"],["B","D region refraction"],["C","F2 region refraction"],["D","Faraday rotation"]],"A","Tropospheric ducting occurs when a temperature inversion traps radio waves near Earth's surface, allowing them to travel hundreds of miles beyond the normal horizon."],
["T3C07","What band is best suited for communicating via meteor scatter?",[["A","33 centimeters"],["B","6 meters"],["C","2 meters"],["D","70 centimeters"]],"B","The 6-meter band (50–54 MHz) is ideal for meteor scatter because it reflects efficiently off ionized meteor trails."],
["T3C08","What causes tropospheric ducting?",[["A","Discharges of lightning during electrical storms"],["B","Sunspots and solar flares"],["C","Updrafts from hurricanes and tornadoes"],["D","Temperature inversions in the atmosphere"]],"D","Tropospheric ducting is caused by temperature inversions — layers where warm air sits above cooler air, creating a refractive duct."],
["T3C09","What is generally the best time for long-distance 10 meter band propagation via the F region?",[["A","From dawn to shortly after sunset during periods of high sunspot activity"],["B","From shortly after sunset to dawn during periods of high sunspot activity"],["C","From dawn to shortly after sunset during periods of low sunspot activity"],["D","From shortly after sunset to dawn during periods of low sunspot activity"]],"A","10-meter propagation via the F2 layer is best during daylight hours and during solar activity maxima (high sunspot numbers)."],
["T3C10","Which of the following bands may provide long-distance communications via the ionosphere's F region during the peak of the sunspot cycle?",[["A","6 and 10 meters"],["B","23 centimeters"],["C","70 centimeters and 1.25 meters"],["D","All these choices are correct"]],"A","During sunspot maximum, the F layer is ionized enough to refract 10-meter and sometimes 6-meter signals back to Earth."],
["T3C11","Why is the radio horizon for VHF and UHF signals more distant than the visual horizon?",[["A","Radio signals move somewhat faster than the speed of light"],["B","Radio waves are not blocked by dust particles"],["C","The atmosphere refracts radio waves slightly"],["D","Radio waves are blocked by dust particles"]],"C","The atmosphere refracts radio waves slightly more than light, causing them to follow Earth's curvature a bit, extending the radio horizon about 15% beyond the optical horizon."],
["T4A01","Which of the following is an appropriate power supply rating for a typical 50 watt output mobile FM transceiver?",[["A","24.0 volts at 4 amperes"],["B","13.8 volts at 4 amperes"],["C","24.0 volts at 12 amperes"],["D","13.8 volts at 12 amperes"]],"D","13.8V is the standard mobile power voltage. At ~30% efficiency a 50W radio needs ~143W DC input; 13.8V × 12A = 165.6W provides adequate headroom."],
["T4A02","Which of the following should be considered when selecting an accessory SWR meter?",[["A","The frequency and power level at which the measurements will be made"],["B","The distance that the meter will be located from the antenna"],["C","The types of modulation being used at the station"],["D","All these choices are correct"]],"A","SWR meters are rated for specific frequency ranges and maximum power levels. Choose a meter rated for your frequency and power output."],
["T4A03","Why are short, heavy-gauge wires used for a transceiver's DC power connection?",[["A","To minimize voltage drop when transmitting"],["B","To provide a good counterpoise for the antenna"],["C","To avoid RF interference"],["D","All these choices are correct"]],"A","Short, heavy wire minimizes resistance and ensures adequate voltage reaches the radio during high-current transmit periods."],
["T4A04","How are the transceiver audio input and output connected in a station configured to operate using FT8?",[["A","To a computer running a terminal program and connected to a terminal node controller unit"],["B","To the audio input and output of a computer running WSJT-X software"],["C","To an FT8 conversion unit, a keyboard, and a computer monitor"],["D","To a computer connected to the FT8converter.com website"]],"B","FT8 encodes/decodes through the computer's sound card using WSJT-X software. Radio speaker output goes to computer audio input, and computer audio output goes to the radio mic input."],
["T4A05","Where should an RF power meter be installed?",[["A","In the feed line, between the transmitter and antenna"],["B","At the power supply output"],["C","In parallel with the push-to-talk line and the antenna"],["D","In the power supply cable, as close as possible to the radio"]],"A","An RF power/SWR meter must be in series in the antenna feed line between the transmitter and antenna."],
["T4A06","What signals are used in a computer-radio interface for digital mode operation?",[["A","Receive and transmit mode, status, and location"],["B","Antenna and RF power"],["C","Receive audio, transmit audio, and transmitter keying"],["D","NMEA GPS location and DC power"]],"C","The three signals needed are: receive audio (radio to computer for decoding), transmit audio (computer to radio), and a PTT/keying line."],
["T4A07","Which of the following connections is made between a computer and a transceiver to use computer software when operating digital modes?",[["A","Computer line out to transceiver push-to-talk"],["B","Computer line in to transceiver push-to-talk"],["C","Computer line in to transceiver speaker connector"],["D","Computer line out to transceiver speaker connector"]],"C","To receive/decode signals, the computer's line input connects to the radio's speaker (audio output). Line-in listens."],
["T4A08","Which of the following conductors is preferred for bonding at RF?",[["A","Copper braid removed from coaxial cable"],["B","Steel wire"],["C","Twisted-pair cable"],["D","Flat copper strap"]],"D","RF current flows on the surface of conductors (skin effect). Flat copper strap has a large surface area, making it ideal for low-impedance RF bonding."],
["T4A09","How can you determine the length of time that equipment can be powered from a battery?",[["A","Divide the watt-hour rating of the battery by the peak power consumption of the equipment"],["B","Divide the battery ampere-hour rating by the average current draw of the equipment"],["C","Multiply the watts per hour consumed by the equipment by the battery power rating"],["D","Multiply the square of the current rating of the battery by the input resistance of the equipment"]],"B","Battery life (hours) = Amp-hour rating ÷ average current draw (amperes)."],
["T4A10","What function is performed with a transceiver and a digital mode hot spot?",[["A","Communication using digital voice or data systems via the internet"],["B","FT8 digital communications via AFSK"],["C","RTTY encoding and decoding without a computer"],["D","High-speed digital communications for meteor scatter"]],"A","A digital mode hot spot is a personal mini-gateway that connects your local digital radio to the internet for worldwide digital voice and data communication."],
["T4A11","Where should the negative power return of a mobile transceiver be connected in a vehicle?",[["A","At the 12 volt battery chassis ground"],["B","At the antenna mount"],["C","To any metal part of the vehicle"],["D","Through the transceiver's mounting bracket"]],"A","Connect the negative return directly to the battery's chassis ground point to ensure a low-resistance, high-current path."],
["T4A12","What is an electronic keyer?",[["A","A device for switching antennas from transmit to receive"],["B","A device for voice activated switching from receive to transmit"],["C","A device that assists in manual sending of Morse code"],["D","An interlock to prevent unauthorized use of a radio"]],"C","An electronic keyer helps operators send Morse code by automatically generating properly timed dots and dashes when a paddle or key is pressed."],
["T4B01","What is the effect of excessive microphone gain on SSB transmissions?",[["A","Frequency instability"],["B","Distorted transmitted audio"],["C","Increased SWR"],["D","All these choices are correct"]],"B","Too much mic gain causes audio clipping, resulting in a distorted, harsh-sounding signal that spreads across more bandwidth than normal SSB."],
["T4B02","Which of the following can be used to enter a transceiver's operating frequency?",[["A","The keypad or VFO knob"],["B","The CTCSS or DTMF encoder"],["C","The Automatic Frequency Control"],["D","All these choices are correct"]],"A","Most modern transceivers allow direct frequency entry via a numeric keypad or tuning via the VFO knob."],
["T4B03","How is squelch adjusted so that a weak FM signal can be heard?",[["A","Set the squelch threshold so that receiver output audio is on all the time"],["B","Turn up the audio level until it overcomes the squelch threshold"],["C","Turn on the anti-squelch function"],["D","Enable squelch enhancement"]],"A","To hear weak signals, open the squelch completely so the receiver outputs audio continuously, then raise it slowly until background noise just disappears."],
["T4B04","What is a way to enable quick access to a favorite frequency or channel on your transceiver?",[["A","Enable the frequency offset"],["B","Store it in a memory channel"],["C","Enable the VOX"],["D","Use the scan mode to select the desired frequency"]],"B","Memory channels let you store complete frequency settings (offset, CTCSS tone, mode) for instant recall."],
["T4B05","What does the scanning function of an FM transceiver do?",[["A","Checks incoming signal deviation"],["B","Prevents interference to nearby repeaters"],["C","Tunes through a range of frequencies to check for activity"],["D","Checks for messages left on a digital bulletin board"]],"C","The scan function automatically steps through stored channels or a frequency range, pausing when it detects a signal."],
["T4B06","Which of the following controls could be used if the voice pitch of a single-sideband signal returning to your CQ call seems too high or low?",[["A","The AGC or limiter"],["B","The bandwidth selection"],["C","The tone squelch"],["D","The RIT or Clarifier"]],"D","RIT (Receiver Incremental Tuning) or Clarifier shifts the receive frequency slightly without changing transmit frequency, correcting the pitch of an SSB signal."],
["T4B07","What does a DMR code plug contain?",[["A","Your call sign in CW for automatic identification"],["B","Access information for repeaters and talkgroups"],["C","The codec for digitizing audio"],["D","The DMR software version"]],"B","A DMR code plug is the programming file containing channel frequencies, color codes, talkgroup IDs, and other access information."],
["T4B08","What is the advantage of having multiple receive bandwidth choices on a multimode transceiver?",[["A","Permits monitoring several modes at once by selecting a separate filter for each mode"],["B","Permits noise or interference reduction by selecting a bandwidth matching the mode"],["C","Increases the number of frequencies that can be stored in memory"],["D","Increases the amount of offset between receive and transmit frequencies"]],"B","Selecting a receive filter that matches the mode (CW ~150 Hz, SSB ~2.4 kHz, FM ~15 kHz) rejects out-of-band noise and improves signal quality."],
["T4B09","How is a specific group of stations selected on a digital voice transceiver?",[["A","By retrieving the frequencies from transceiver memory"],["B","By enabling the group's CTCSS tone"],["C","By entering the group's identification code"],["D","By activating automatic identification"]],"C","Digital voice systems (DMR, D-STAR, System Fusion) use group identification codes (talkgroup IDs, room numbers) to select specific groups."],
["T4B10","Which of the following receiver filter bandwidths provides the best signal-to-noise ratio for SSB reception?",[["A","500 Hz"],["B","1000 Hz"],["C","2400 Hz"],["D","5000 Hz"]],"C","SSB voice occupies roughly 300–3000 Hz (2.7 kHz). A 2400 Hz filter captures most voice bandwidth while rejecting noise outside that range."],
["T4B11","Which of the following must be programmed into a D-STAR digital transceiver before transmitting?",[["A","Your call sign"],["B","Your output power"],["C","The codec type being used"],["D","All these choices are correct"]],"A","D-STAR encodes your call sign into every digital transmission for identification. Without a programmed call sign you cannot legally transmit."],
["T4B12","What is the result of tuning an FM receiver above or below a signal's frequency?",[["A","Change in audio pitch"],["B","Sideband inversion"],["C","Generation of a heterodyne tone"],["D","Distortion of the signal's audio"]],"D","Unlike SSB, FM tuned away from the exact carrier frequency results in audio distortion, not a pitch shift."],
["T5A01","Electrical current is measured in which of the following units?",[["A","Volts"],["B","Watts"],["C","Ohms"],["D","Amperes"]],"D","Amperes (amps) measure electrical current — the rate of flow of electric charge. Volts measure voltage, Ohms measure resistance, Watts measure power."],
["T5A02","Electrical power is measured in which of the following units?",[["A","Volts"],["B","Watts"],["C","Watt-hours"],["D","Amperes"]],"B","Watts measure electrical power — the rate at which energy is used or produced. Watt-hours measure energy (power × time)."],
["T5A03","What is the name for the flow of electrons in an electric circuit?",[["A","Voltage"],["B","Resistance"],["C","Capacitance"],["D","Current"]],"D","Current is the flow of electrons (electric charge) through a conductor. Think of current like the flow rate of water in a pipe."],
["T5A04","What are the units of electrical resistance?",[["A","Siemens"],["B","Mhos"],["C","Ohms"],["D","Coulombs"]],"C","Ohms are the units of electrical resistance, named after Georg Simon Ohm. Siemens measure conductance, Coulombs measure charge."],
["T5A05","What is the electrical term for the force that causes electron flow?",[["A","Voltage"],["B","Ampere-hours"],["C","Capacitance"],["D","Inductance"]],"A","Voltage (electromotive force or EMF) is the electrical pressure that drives electrons through a conductor."],
["T5A06","What is the unit of frequency?",[["A","Hertz"],["B","Henry"],["C","Farad"],["D","Tesla"]],"A","Hertz (Hz) is the unit of frequency — cycles per second. Henry is inductance, Farad is capacitance, Tesla is magnetic flux density."],
["T5A07","Why are metals generally good conductors of electricity?",[["A","They have relatively high density"],["B","They have many free electrons"],["C","They have many free protons"],["D","All these choices are correct"]],"B","Metals have a sea of loosely bound electrons that are free to move between atoms, making current flow easy."],
["T5A08","Which of the following is a good electrical insulator?",[["A","Copper"],["B","Glass"],["C","Aluminum"],["D","Mercury"]],"B","Glass is an excellent insulator — electrons cannot move freely through it. Copper, aluminum, and mercury are all conductors."],
["T5A09","Which of the following describes alternating current?",[["A","Current that alternates between a positive direction and zero"],["B","Current that alternates between a negative direction and zero"],["C","Current that alternates between positive and negative directions"],["D","All these answers are correct"]],"C","AC (Alternating Current) flows first in one direction then reverses, alternating between positive and negative directions."],
["T5A10","Which term describes the rate at which electrical energy is used?",[["A","Resistance"],["B","Current"],["C","Power"],["D","Voltage"]],"C","Power (measured in watts) is the rate of energy use or production. P = E × I."],
["T5A11","What type of current flow is opposed by resistance?",[["A","Direct current"],["B","Alternating current"],["C","RF current"],["D","All these choices are correct"]],"D","Resistance opposes ALL types of current flow — DC, AC, and RF."],
["T5A12","What describes the number of times per second that an alternating current makes a complete cycle?",[["A","Pulse rate"],["B","Speed"],["C","Wavelength"],["D","Frequency"]],"D","Frequency is the number of complete cycles per second, measured in Hertz (Hz)."],
["T5B01","How many milliamperes is 1.5 amperes?",[["A","15 milliamperes"],["B","150 milliamperes"],["C","1500 milliamperes"],["D","15,000 milliamperes"]],"C","Milli means one-thousandth. To convert amperes to milliamperes, multiply by 1000: 1.5 A × 1000 = 1500 mA."],
["T5B02","Which is equal to 1,500,000 hertz?",[["A","1500 kHz"],["B","1500 MHz"],["C","15 GHz"],["D","150 kHz"]],"A","1 kHz = 1000 Hz, so 1,500,000 Hz ÷ 1000 = 1500 kHz. (Not 1500 MHz, which would be 1.5 billion Hz.)"],
["T5B03","Which is equal to one kilovolt?",[["A","One one-thousandth of a volt"],["B","One hundred volts"],["C","One thousand volts"],["D","One million volts"]],"C","Kilo means 1000. One kilovolt = 1000 volts."],
["T5B04","Which is equal to one microvolt?",[["A","One one-millionth of a volt"],["B","One million volts"],["C","One thousand kilovolts"],["D","One one-thousandth of a volt"]],"A","Micro means one-millionth (10⁻⁶). One microvolt = 0.000001 volts."],
["T5B05","Which is equal to 500 milliwatts?",[["A","0.02 watts"],["B","0.5 watts"],["C","5 watts"],["D","50 watts"]],"B","1000 milliwatts = 1 watt, so 500 milliwatts = 500/1000 = 0.5 watts."],
["T5B06","Which is equal to 3000 milliamperes?",[["A","0.003 amperes"],["B","0.3 amperes"],["C","3,000,000 amperes"],["D","3 amperes"]],"D","1000 mA = 1 A, so 3000 mA = 3000/1000 = 3 amperes."],
["T5B07","Which is equal to 3.525 MHz?",[["A","0.003525 kHz"],["B","35.25 kHz"],["C","3525 kHz"],["D","3,525,000 kHz"]],"C","1 MHz = 1000 kHz, so 3.525 MHz × 1000 = 3525 kHz."],
["T5B08","Which is equal to 1,000,000 picofarads?",[["A","0.001 microfarads"],["B","1 microfarad"],["C","1000 microfarads"],["D","1,000,000,000 microfarads"]],"B","1,000,000 pF = 1,000 nF = 1 microfarad. Each metric step is ×1000."],
["T5B09","Which decibel value most closely represents a power increase from 5 watts to 10 watts?",[["A","2 dB"],["B","3 dB"],["C","5 dB"],["D","10 dB"]],"B","Every 3 dB represents a doubling of power. 5W to 10W is exactly doubling = 3 dB."],
["T5B10","Which decibel value most closely represents a power decrease from 12 watts to 3 watts?",[["A","-1 dB"],["B","-3 dB"],["C","-6 dB"],["D","-9 dB"]],"C","12W → 6W = −3 dB (halved). 6W → 3W = another −3 dB. Total = −6 dB (factor of 1/4 = two halvings)."],
["T5B11","Which decibel value represents a power increase from 20 watts to 200 watts?",[["A","10 dB"],["B","12 dB"],["C","18 dB"],["D","28 dB"]],"A","200W ÷ 20W = 10× power increase = +10 dB. (10 × log₁₀(10) = 10 × 1 = 10 dB.)"],
["T5B12","Which is equal to 28400 kHz?",[["A","28.400 kHz"],["B","2.800 MHz"],["C","284.00 MHz"],["D","28.400 MHz"]],"D","To convert kHz to MHz, divide by 1000: 28400 kHz ÷ 1000 = 28.400 MHz. This is in the 10-meter band."],
["T5B13","Which is equal to 2425 MHz?",[["A","0.002425 GHz"],["B","24.25 GHz"],["C","2.425 GHz"],["D","2425 GHz"]],"C","To convert MHz to GHz, divide by 1000: 2425 MHz ÷ 1000 = 2.425 GHz."],
["T5C01","What describes the ability to store energy in an electric field?",[["A","Inductance"],["B","Resistance"],["C","Tolerance"],["D","Capacitance"]],"D","Capacitance describes the ability to store energy in an electric field. Memory aid: MICE — Capacitance=Electric, Inductance=Magnetic."],
["T5C02","What is the unit of capacitance?",[["A","The farad"],["B","The ohm"],["C","The volt"],["D","The henry"]],"A","The farad (F) is the unit of capacitance, named after Michael Faraday. The henry is inductance, ohm is resistance."],
["T5C03","What describes the ability to store energy in a magnetic field?",[["A","Admittance"],["B","Capacitance"],["C","Resistance"],["D","Inductance"]],"D","Inductance describes the ability to store energy in a magnetic field. Memory aid: MICE — Magnetic=Inductance."],
["T5C04","What is the unit of inductance?",[["A","The coulomb"],["B","The farad"],["C","The henry"],["D","The ohm"]],"C","The henry (H) is the unit of inductance, named after Joseph Henry."],
["T5C05","What is the unit of impedance?",[["A","The volt"],["B","The ampere"],["C","The coulomb"],["D","The ohm"]],"D","Impedance is measured in ohms, the same unit as resistance. Impedance is the total opposition to AC current flow (symbol Z)."],
["T5C06","What does the abbreviation RF mean?",[["A","Radio frequency signals of all types"],["B","The resonant frequency of a tuned circuit"],["C","The real frequency transmitted as opposed to the apparent frequency"],["D","Reflective force in antenna transmission lines"]],"A","RF stands for Radio Frequency — electromagnetic signals used for wireless communication."],
["T5C07","What is the abbreviation for megahertz?",[["A","MH"],["B","mh"],["C","Mhz"],["D","MHz"]],"D","MHz is the correct abbreviation. M (capital) is the SI prefix for Mega (10⁶), and Hz is Hertz."],
["T5C08","What is the formula used to calculate electrical power (P) in a DC circuit?",[["A","P = I × E"],["B","P = E / I"],["C","P = E - I"],["D","P = I + E"]],"A","Power = Current × Voltage, or P = I × E. Memory aid: PIE — P equals I times E."],
["T5C09","How much power is delivered by a voltage of 13.8 volts DC and a current of 10 amperes?",[["A","138 watts"],["B","0.7 watts"],["C","23.8 watts"],["D","3.8 watts"]],"A","P = I × E = 10 A × 13.8 V = 138 watts."],
["T5C10","How much power is delivered by a voltage of 12 volts DC and a current of 2.5 amperes?",[["A","4.8 watts"],["B","30 watts"],["C","14.5 watts"],["D","0.208 watts"]],"B","P = I × E = 2.5 A × 12 V = 30 watts."],
["T5C11","How much current is required to deliver 120 watts at a voltage of 12 volts DC?",[["A","0.1 amperes"],["B","10 amperes"],["C","12 amperes"],["D","132 amperes"]],"B","Rearranging P = I × E: I = P/E = 120 W ÷ 12 V = 10 amperes."],
["T5C12","What is impedance?",[["A","The opposition to AC current flow"],["B","The inverse of resistance"],["C","The Q or Quality Factor of a component"],["D","The power handling capability of a component"]],"A","Impedance is the total opposition to AC current flow, including both resistance (real) and reactance (imaginary). Symbol: Z, unit: ohms."],
["T5C13","What is the abbreviation for kilohertz?",[["A","KHZ"],["B","khz"],["C","khZ"],["D","kHz"]],"D","kHz is correct. k (lowercase) is the SI prefix for kilo (10³). Prefixes below Mega are lowercase."],
["T5D01","What formula is used to calculate current in a circuit?",[["A","I = E × R"],["B","I = E / R"],["C","I = E + R"],["D","I = E - R"]],"B","Ohm's Law: I = E / R. Current equals Voltage divided by Resistance."],
["T5D02","What formula is used to calculate voltage in a circuit?",[["A","E = I × R"],["B","E = I / R"],["C","E = I + R"],["D","E = I - R"]],"A","Ohm's Law: E = I × R. Voltage equals Current times Resistance."],
["T5D03","What formula is used to calculate resistance in a circuit?",[["A","R = E × I"],["B","R = E / I"],["C","R = E + I"],["D","R = E - I"]],"B","Ohm's Law: R = E / I. Resistance equals Voltage divided by Current."],
["T5D04","What is the resistance of a circuit in which a current of 3 amperes flows when connected to 90 volts?",[["A","3 ohms"],["B","30 ohms"],["C","93 ohms"],["D","270 ohms"]],"B","R = E / I = 90 V ÷ 3 A = 30 ohms."],
["T5D05","What is the resistance of a circuit for which the applied voltage is 12 volts and the current flow is 1.5 amperes?",[["A","18 ohms"],["B","0.125 ohms"],["C","8 ohms"],["D","13.5 ohms"]],"C","R = E / I = 12 V ÷ 1.5 A = 8 ohms."],
["T5D06","What is the resistance of a circuit that draws 4 amperes from a 12-volt source?",[["A","3 ohms"],["B","16 ohms"],["C","48 ohms"],["D","8 ohms"]],"A","R = E / I = 12 V ÷ 4 A = 3 ohms."],
["T5D07","What is the current in a circuit with an applied voltage of 120 volts and a resistance of 80 ohms?",[["A","9600 amperes"],["B","200 amperes"],["C","0.667 amperes"],["D","1.5 amperes"]],"D","I = E / R = 120 V ÷ 80 Ω = 1.5 amperes."],
["T5D08","What is the current through a 100-ohm resistor connected across 200 volts?",[["A","20,000 amperes"],["B","0.5 amperes"],["C","2 amperes"],["D","100 amperes"]],"C","I = E / R = 200 V ÷ 100 Ω = 2 amperes."],
["T5D09","What is the current through a 24-ohm resistor connected across 240 volts?",[["A","24,000 amperes"],["B","0.1 amperes"],["C","10 amperes"],["D","216 amperes"]],"C","I = E / R = 240 V ÷ 24 Ω = 10 amperes."],
["T5D10","What is the voltage across a 2-ohm resistor if a current of 0.5 amperes flows through it?",[["A","1 volt"],["B","0.25 volts"],["C","2.5 volts"],["D","1.5 volts"]],"A","E = I × R = 0.5 A × 2 Ω = 1 volt."],
["T5D11","What is the voltage across a 10-ohm resistor if a current of 1 ampere flows through it?",[["A","1 volt"],["B","10 volts"],["C","11 volts"],["D","9 volts"]],"B","E = I × R = 1 A × 10 Ω = 10 volts."],
["T5D12","What is the voltage across a 10-ohm resistor if a current of 2 amperes flows through it?",[["A","8 volts"],["B","0.2 volts"],["C","12 volts"],["D","20 volts"]],"D","E = I × R = 2 A × 10 Ω = 20 volts."],
["T5D13","In which type of circuit is DC current the same through all components?",[["A","Series"],["B","Parallel"],["C","Resonant"],["D","Branch"]],"A","In a series circuit, current has only one path, so the same current flows through every component. Memory: Series = Same current."],
["T5D14","In which type of circuit is voltage the same across all components?",[["A","Series"],["B","Parallel"],["C","Resonant"],["D","Branch"]],"B","In a parallel circuit, all components share the same two nodes, so the same voltage appears across each one. Memory: Parallel = same voltage."],
["T6A01","What electrical component opposes the flow of current in a DC circuit?",[["A","Inductor"],["B","Resistor"],["C","Inverter"],["D","Transformer"]],"B","A resistor opposes (resists) current flow in DC circuits."],
["T6A02","What type of component is often used as an adjustable volume control?",[["A","Fixed resistor"],["B","Power resistor"],["C","Potentiometer"],["D","Transformer"]],"C","A potentiometer is a variable resistor with three terminals. Moving the wiper varies the resistance and signal level."],
["T6A03","What electrical parameter is controlled by a potentiometer?",[["A","Inductance"],["B","Resistance"],["C","Capacitance"],["D","Field strength"]],"B","A potentiometer controls resistance, allowing you to adjust voltage division, volume, or other circuit parameters."],
["T6A04","What electrical component stores energy in an electric field?",[["A","Varistor"],["B","Capacitor"],["C","Inductor"],["D","Diode"]],"B","A capacitor stores energy in the electric field between its two conductive plates."],
["T6A05","What type of electrical component consists of conductive surfaces separated by an insulator?",[["A","Resistor"],["B","Potentiometer"],["C","Oscillator"],["D","Capacitor"]],"D","A capacitor is made of two or more conductive plates separated by a dielectric (insulator)."],
["T6A06","What type of electrical component stores energy in a magnetic field?",[["A","Varistor"],["B","Capacitor"],["C","Inductor"],["D","Diode"]],"C","An inductor (coil of wire) stores energy in the magnetic field created by current flowing through it."],
["T6A07","What electrical component is typically constructed as a coil of wire?",[["A","Switch"],["B","Capacitor"],["C","Diode"],["D","Inductor"]],"D","An inductor is typically made by winding wire into a coil, often around a core material."],
["T6A08","What is the function of an SPDT switch?",[["A","A single circuit is opened or closed"],["B","Two circuits are opened or closed"],["C","A single circuit is switched between one of two other circuits"],["D","Two circuits are each switched between one of two other circuits"]],"C","SPDT = Single Pole, Double Throw. One input connects to one of two outputs."],
["T6A09","What electrical component is used to protect other circuit components from current overloads?",[["A","Fuse"],["B","Thyratron"],["C","Varactor"],["D","All these choices are correct"]],"A","A fuse melts (opens the circuit) when current exceeds its rated value, protecting downstream components."],
["T6A10","Which of the following battery chemistries is rechargeable?",[["A","Nickel-metal hydride"],["B","Lithium-ion"],["C","Lead-acid"],["D","All these choices are correct"]],"D","NiMH, Li-ion, and lead-acid are all rechargeable battery chemistries."],
["T6A11","Which of the following battery chemistries is not rechargeable?",[["A","Nickel-cadmium"],["B","Carbon-zinc"],["C","Lead-acid"],["D","Lithium-ion"]],"B","Carbon-zinc (and standard alkaline) batteries are non-rechargeable primary cells."],
["T6A12","What type of switch is represented by component 3 in figure T-2?",[["A","Single-pole single-throw"],["B","Single-pole double-throw"],["C","Double-pole single-throw"],["D","Double-pole double-throw"]],"A","An SPST switch connects or disconnects a single circuit — one input, one output, either open or closed."],
["T6B01","Which is true about forward voltage drop in a diode?",[["A","It is lower in some diode types than in others"],["B","It is proportional to peak inverse voltage"],["C","It indicates that the diode is defective"],["D","It has no impact on the voltage delivered to the load"]],"A","Forward voltage drop varies by diode type: germanium ~0.3V, silicon ~0.7V, LEDs ~1.4–3.5V. This is normal, not a fault."],
["T6B02","What electronic component allows current to flow in only one direction?",[["A","Resistor"],["B","Fuse"],["C","Diode"],["D","Driven element"]],"C","A diode is a one-way valve for current. When forward biased, current flows; when reverse biased, current is blocked."],
["T6B03","Which of these components can be used as an electronic switch?",[["A","Varistor"],["B","Potentiometer"],["C","Transistor"],["D","Thermistor"]],"C","A transistor can be used as an electronic switch. A small base current controls a much larger collector-emitter current."],
["T6B04","Which of the following components can consist of three regions of semiconductor material?",[["A","Alternator"],["B","Transistor"],["C","Triode"],["D","Pentagrid converter"]],"B","A bipolar junction transistor (BJT) consists of three semiconductor regions: NPN or PNP, corresponding to emitter, base, and collector."],
["T6B05","What type of transistor has a gate, drain, and source?",[["A","Varistor"],["B","Field-effect"],["C","Tesla-effect"],["D","Bipolar junction"]],"B","A Field Effect Transistor (FET) has three terminals: gate, drain, and source. Memory: Fields have gates."],
["T6B06","How is the cathode lead of a semiconductor diode often marked on the package?",[["A","With the word cathode"],["B","With a stripe"],["C","With the letter C"],["D","With the letter K"]],"B","The cathode is typically marked with a stripe (band) on the diode body."],
["T6B07","What causes a light-emitting diode (LED) to emit light?",[["A","Forward current"],["B","Reverse current"],["C","Capacitively-coupled RF signal"],["D","Inductively-coupled RF signal"]],"A","An LED emits light when forward current flows through the junction. Electrons recombine with holes, releasing energy as photons."],
["T6B08","What does the abbreviation FET stand for?",[["A","Frequency Emission Transmitter"],["B","Fast Electron Transistor"],["C","Free Electron Transmitter"],["D","Field Effect Transistor"]],"D","FET = Field Effect Transistor. FETs are commonly used in RF amplifiers due to high input impedance and low noise."],
["T6B09","What are the names for the electrodes of a diode?",[["A","Plus and minus"],["B","Source and drain"],["C","Anode and cathode"],["D","Gate and base"]],"C","A diode has two electrodes: anode (positive, current enters) and cathode (negative, current exits)."],
["T6B10","Which of the following can provide power gain?",[["A","Transformer"],["B","Transistor"],["C","Reactor"],["D","Resistor"]],"B","A transistor amplifies signals — a small input controls a larger output, providing power gain."],
["T6B11","What is the term that describes a device's ability to amplify a signal?",[["A","Gain"],["B","Forward resistance"],["C","Forward voltage drop"],["D","On resistance"]],"A","Gain describes how much a device amplifies a signal. It is the ratio of output to input power, expressed as a number or in decibels."],
["T6B12","What are the names of the electrodes of a bipolar junction transistor?",[["A","Signal, bias, power"],["B","Emitter, base, collector"],["C","Input, output, supply"],["D","Pole one, pole two, output"]],"B","A BJT has three terminals: emitter (E), base (B), and collector (C). Small base current controls large collector-emitter current."],
["T6C01","What is the name of an electrical wiring diagram that uses standard component symbols?",[["A","Bill of materials"],["B","Connector pinout"],["C","Schematic"],["D","Flow chart"]],"C","A schematic uses standardized symbols to represent electronic components and show how they are connected."],
["T6C02","What is component 1 in figure T-1?",[["A","Resistor"],["B","Transistor"],["C","Battery"],["D","Connector"]],"A","Component 1 in figure T-1 is a resistor — represented by a zigzag line symbol."],
["T6C03","What is component 2 in figure T-1?",[["A","Resistor"],["B","Transistor"],["C","Indicator lamp"],["D","Connector"]],"B","Component 2 in figure T-1 is an NPN transistor (arrow on emitter points outward)."],
["T6C04","What is component 3 in figure T-1?",[["A","Resistor"],["B","Transistor"],["C","Lamp"],["D","Ground symbol"]],"C","Component 3 in figure T-1 is a lamp — symbol shows a circle with a looping filament inside."],
["T6C05","What is component 4 in figure T-1?",[["A","Resistor"],["B","Transistor"],["C","Ground symbol"],["D","Battery"]],"D","Component 4 in figure T-1 is a battery — alternating long (positive) and short (negative) lines."],
["T6C06","What is component 6 in figure T-2?",[["A","Resistor"],["B","Capacitor"],["C","Regulator IC"],["D","Transistor"]],"B","Component 6 in figure T-2 is a capacitor — two parallel lines separated by a gap."],
["T6C07","What is component 8 in figure T-2?",[["A","Resistor"],["B","Inductor"],["C","Regulator IC"],["D","Light emitting diode"]],"D","Component 8 is an LED — looks like a diode symbol with small arrows representing emitted light."],
["T6C08","What is component 9 in figure T-2?",[["A","Variable capacitor"],["B","Variable inductor"],["C","Variable resistor"],["D","Variable transformer"]],"C","Component 9 is a variable resistor — standard resistor symbol with an arrow indicating the adjustable wiper."],
["T6C09","What is component 4 in figure T-2?",[["A","Variable inductor"],["B","Double-pole switch"],["C","Potentiometer"],["D","Transformer"]],"D","Component 4 in figure T-2 is a transformer — two coils facing each other representing inductively coupled windings."],
["T6C10","What is component 3 in figure T-3?",[["A","Connector"],["B","Meter"],["C","Variable capacitor"],["D","Variable inductor"]],"D","Component 3 in figure T-3 is a variable inductor — an inductor symbol with an arrow indicating the adjustable portion."],
["T6C11","What is component 4 in figure T-3?",[["A","Antenna"],["B","Transmitter"],["C","Dummy load"],["D","Ground"]],"A","Component 4 in figure T-3 is an antenna — typically a vertical line with diagonal lines branching off."],
["T6C12","Which of the following is accurately represented in electrical schematics?",[["A","Wire lengths"],["B","Physical appearance of components"],["C","Component connections"],["D","All these choices are correct"]],"C","Schematics accurately show how components are connected, but NOT wire lengths, physical shapes, or physical layout."],
["T6D01","Which of the following devices or circuits changes an alternating current into a varying direct current signal?",[["A","Transformer"],["B","Rectifier"],["C","Amplifier"],["D","Reflector"]],"B","A rectifier uses diodes to convert AC to pulsating DC. Full-wave rectifiers are used in power supplies."],
["T6D02","What is a relay?",[["A","An electrically-controlled switch"],["B","A current controlled amplifier"],["C","An inverting amplifier"],["D","A pass transistor"]],"A","A relay is an electromechanical switch. A small electrical signal energizes an electromagnet that physically moves contacts to switch a separate higher-power circuit."],
["T6D03","Which of the following is a reason to use shielded wire?",[["A","To decrease the resistance of DC power connections"],["B","To increase the current carrying capability of the wire"],["C","To prevent coupling of unwanted signals to or from the wire"],["D","To couple the wire to other signals"]],"C","Shielded cable surrounds inner conductors with a conductive shield acting as a Faraday cage, preventing RF interference from entering or leaving."],
["T6D04","Which of the following displays an electrical quantity as a numeric value?",[["A","Potentiometer"],["B","Transistor"],["C","Meter"],["D","Relay"]],"C","A meter measures and displays an electrical quantity (voltage, current, resistance, SWR) as a numeric or analog value."],
["T6D05","What type of circuit controls the amount of voltage from a power supply?",[["A","Regulator"],["B","Oscillator"],["C","Filter"],["D","Phase inverter"]],"A","A voltage regulator maintains a stable output voltage regardless of changes in input voltage or load current."],
["T6D06","What component changes 120 V AC power to a lower AC voltage for other uses?",[["A","Variable capacitor"],["B","Transformer"],["C","Transistor"],["D","Diode"]],"B","A transformer uses electromagnetic induction between two coils to convert AC voltage. Voltage ratio equals turns ratio."],
["T6D07","Which of the following is commonly used as a visual indicator?",[["A","LED"],["B","FET"],["C","Zener diode"],["D","Bipolar transistor"]],"A","LEDs (Light Emitting Diodes) are the standard visual indicator in modern electronics — efficient, long-lasting, and many colors."],
["T6D08","Which of the following is combined with an inductor to make a resonant circuit?",[["A","Resistor"],["B","Zener diode"],["C","Potentiometer"],["D","Capacitor"]],"D","An LC (inductor-capacitor) circuit is the resonant circuit used in radio tuning."],
["T6D09","What is the name of a device that combines several semiconductors and other components into one package?",[["A","Transducer"],["B","Multi-pole relay"],["C","Integrated circuit"],["D","Transformer"]],"C","An integrated circuit (IC) contains many transistors, resistors, and other components fabricated on a single semiconductor chip."],
["T6D10","What is the function of component 2 in figure T-1?",[["A","Give off light when current flows through it"],["B","Supply electrical energy"],["C","Control the flow of current"],["D","Convert electrical energy into radio waves"]],"C","Component 2 is an NPN transistor. Its function is to control current flow — a small base signal controls a much larger collector-emitter current."],
["T6D11","Which of the following is a resonant or tuned circuit?",[["A","An inductor and a capacitor in series or parallel"],["B","A linear voltage regulator"],["C","A resistor circuit used for reducing standing wave ratio"],["D","A circuit designed to provide high-fidelity audio"]],"A","A resonant (tuned) LC circuit consists of an inductor and capacitor connected in series or parallel, producing a sharp frequency response."],
["T7A01","Which term describes the ability of a receiver to detect the presence of a signal?",[["A","Linearity"],["B","Sensitivity"],["C","Selectivity"],["D","Total Harmonic Distortion"]],"B","Sensitivity describes how well a receiver can detect weak signals — the minimum signal level producing a usable output."],
["T7A02","What is a transceiver?",[["A","A device that combines a receiver and transmitter"],["B","A device for matching feed line impedance to 50 ohms"],["C","A device for automatically sending and decoding Morse code"],["D","A device for converting receiver and transmitter frequencies to another band"]],"A","A transceiver combines a transmitter and receiver in one unit, sharing components like the antenna and oscillator."],
["T7A03","Which of the following is used to convert a signal from one frequency to another?",[["A","Phase splitter"],["B","Mixer"],["C","Inverter"],["D","Amplifier"]],"B","A mixer combines two signals to produce sum and difference frequencies. In a superheterodyne receiver, the mixer produces an intermediate frequency (IF)."],
["T7A04","Which term describes the ability of a receiver to discriminate between multiple signals?",[["A","Discrimination ratio"],["B","Sensitivity"],["C","Selectivity"],["D","Harmonic distortion"]],"C","Selectivity describes how well a receiver can reject signals on adjacent frequencies while receiving the desired signal."],
["T7A05","What is the name of a circuit that generates a signal at a specific frequency?",[["A","Reactance modulator"],["B","Phase modulator"],["C","Low-pass filter"],["D","Oscillator"]],"D","An oscillator generates a continuous electrical signal at a specific frequency. Crystal oscillators are stable; VFOs are tunable."],
["T7A06","What device converts the RF input and output of a transceiver to another band?",[["A","High-pass filter"],["B","Low-pass filter"],["C","Transverter"],["D","Phase converter"]],"C","A transverter shifts the frequency of a transceiver's output (and input) to a different amateur band."],
["T7A07","What is the function of a transceiver's PTT input?",[["A","Input for a key used to send CW"],["B","Switches transceiver from receive to transmit when grounded"],["C","Provides a transmit tuning tone when grounded"],["D","Input for a preamplifier tuning tone"]],"B","PTT = Push To Talk. When the PTT line is grounded, the transceiver switches from receive mode to transmit mode."],
["T7A08","Which of the following describes combining speech with an RF carrier signal?",[["A","Impedance matching"],["B","Oscillation"],["C","Modulation"],["D","Low-pass filtering"]],"C","Modulation is the process of combining an information signal (voice, data) with an RF carrier signal."],
["T7A09","What is the function of the SSB/CW-FM switch on a VHF power amplifier?",[["A","Change the mode of the transmitted signal"],["B","Set the amplifier for proper operation in the selected mode"],["C","Change the frequency range of the amplifier to operate in the proper segment of the band"],["D","Reduce the received signal noise"]],"B","FM amplifiers run in saturation (Class C) while SSB/CW amplifiers must be linear (Class AB). The switch configures the amplifier's bias for the selected mode."],
["T7A10","What device increases the transmitted output power from a transceiver?",[["A","A voltage divider"],["B","An RF power amplifier"],["C","An impedance network"],["D","All these choices are correct"]],"B","An RF power amplifier (linear) takes the transceiver's lower-power output and amplifies it to a higher power level."],
["T7A11","Where is an RF preamplifier installed?",[["A","Between the antenna and receiver"],["B","At the output of the transmitter power amplifier"],["C","Between the transmitter and the antenna tuner"],["D","At the output of the receiver audio amplifier"]],"A","A preamplifier boosts weak received signals before feedline losses and receiver noise degrade them. Install as close to the antenna as possible."],
["T7B01","What can you do if you are told your FM handheld or mobile transceiver is over-deviating?",[["A","Talk louder into the microphone"],["B","Let the transceiver cool off"],["C","Change to a higher power level"],["D","Talk farther away from the microphone"]],"D","Over-deviation means the audio is causing too much FM frequency deviation. Hold the mic farther away to reduce audio input and deviation."],
["T7B02","What would cause a broadcast AM or FM radio to receive an amateur radio transmission unintentionally?",[["A","The transmitter is incorrectly tuned"],["B","The receiver is unable to reject strong signals outside the AM or FM band"],["C","The microphone gain of the transmitter is too high"],["D","The deviation of the amateur FM transmitter is set too low"]],"B","Fundamental overload occurs when a nearby transmitter overwhelms the receiver's front end, causing it to demodulate the signal even though it's not on the tuned frequency."],
["T7B03","Which of the following can cause radio frequency interference?",[["A","Fundamental overload"],["B","Harmonics"],["C","Spurious emissions"],["D","All these choices are correct"]],"D","All three cause interference: fundamental overload, harmonics (multiples of transmit frequency), and spurious emissions (unintended signals)."],
["T7B04","Which of the following could you use to cure distorted audio caused by RF current on the shield of a microphone cable?",[["A","A bypass capacitor on the microphone"],["B","A ferrite choke"],["C","A low-pass filter"],["D","A decade counter"]],"B","A ferrite choke (clip-on bead or toroid on the mic cable) provides high impedance to RF while passing audio, stopping RF from entering audio circuitry."],
["T7B05","How can fundamental overload of a non-amateur radio or TV receiver by an amateur signal be reduced or eliminated?",[["A","Block the amateur signal with a filter at the antenna input of the affected receiver"],["B","Reduce the transmitter power to zero during your on-air periods"],["C","Request a different frequency assignment from your local band coordinator"],["D","Install a low-pass filter at the transmitter output"]],"A","Since fundamental overload is a receiver problem, install a high-pass or band-reject filter at the affected receiver's antenna input."],
["T7B06","Which of the following actions should you take if a neighbor tells you that your station's transmissions are interfering with their radio or TV reception?",[["A","Make sure that your station is functioning properly and that it does not cause interference to your own radio or television when it is tuned to the same channel"],["B","Immediately turn off your transmitter and contact the nearest FCC office"],["C","Install a harmonic doubler and tune it until the interference is eliminated"],["D","Agree to never transmit whenever the neighbor is watching TV"]],"A","First, verify your own station is working properly and check if it interferes with your own equipment to determine whether the problem is your transmitter or the neighbor's receiver."],
["T7B07","Which of the following can reduce overload of a VHF transceiver by a nearby commercial FM station?",[["A","A low-pass filter"],["B","A band-reject filter"],["C","A stage of RF amplification"],["D","A notch filter on the FM band"]],"B","A band-reject (notch) filter tuned to the commercial FM broadcast band (88–108 MHz) attenuates those strong signals before they reach the transceiver's front end."],
["T7B08","What should you do if something in a neighbor's home is causing harmful interference to your amateur station?",[["A","Work with your neighbor to identify the offending device"],["B","Politely inform your neighbor that FCC rules prohibit the use of devices that cause interference"],["C","Make sure your station meets the standards of good amateur practice"],["D","All these choices are correct"]],"D","The best approach involves all three: work cooperatively, inform the neighbor of the rules, and verify your own station isn't contributing."],
["T7B09","What should be the first step to resolve non-fiber optic cable TV interference caused by your amateur radio transmission?",[["A","Be sure all TV feed line coaxial connectors are installed properly"],["B","Reduce your transmitter output power"],["C","Notify the local cable company of the interference"],["D","Install a low-pass filter at the transmitter output"]],"A","Loose or corroded coaxial connectors allow RF ingress. Check and tighten all connectors first — this is the most common cause."],
["T7B10","What might be a problem if you receive a report that your audio signal through an FM repeater is distorted or unintelligible?",[["A","Your transmitter is slightly off frequency"],["B","Your batteries are running low"],["C","You are in a bad location"],["D","All these choices are correct"]],"D","All three can cause distorted audio through a repeater: being off frequency, low battery (causing frequency instability), or a poor location (multipath, marginal signal)."],
["T7B11","What is a symptom of RF feedback in a transmitter or transceiver?",[["A","Excessive SWR on the antenna"],["B","Reports of garbled, distorted, or unintelligible voice transmissions"],["C","The transmitter power output varies by more than 10 percent"],["D","All these choices are correct"]],"B","RF feedback occurs when transmitted RF re-enters the transmitter via the microphone cable, causing garbled or distorted transmissions."],
["T7C01","What is the primary purpose of a dummy load?",[["A","To prevent transmitting signals over the air when making tests"],["B","To prevent over-modulation of a transmitter"],["C","To improve the efficiency of an antenna"],["D","To maximize power output of the transmitter"]],"A","A dummy load is a non-radiating resistive load that absorbs transmitter power as heat, allowing testing without transmitting on the air."],
["T7C02","Which of the following is used to determine if an antenna is resonant at the desired operating frequency?",[["A","An SWR meter"],["B","A signal generator"],["C","An antenna analyzer"],["D","A field strength meter"]],"C","An antenna analyzer (or VNA) can measure the antenna's impedance and resonant frequency directly."],
["T7C03","What does a dummy load consist of?",[["A","A high-SWR resistive element"],["B","A non-inductive resistor mounted on a heat sink"],["C","A switch to disconnect an antenna during adjustments"],["D","A series impedance to limit current to the antenna"]],"B","A dummy load is a non-inductive 50-ohm resistor mounted on a heat sink to dissipate transmitter power as heat."],
["T7C04","What reading on an SWR meter indicates a perfect impedance match between the antenna and the feed line?",[["A","2:1"],["B","1:1"],["C","1:3"],["D","10:1"]],"B","SWR of 1:1 means perfect impedance match — all power is delivered to the antenna with none reflected back."],
["T7C05","Why do most solid-state transmitters reduce output power as SWR increases beyond a certain level?",[["A","To keep the antenna from overheating"],["B","To protect the output amplifier transistors"],["C","To maintain a constant output power level"],["D","Because SWR meters have a maximum rating"]],"B","High SWR causes large voltage or current swings that can damage transistors. Automatic protection circuits fold back power when SWR is too high."],
["T7C06","What does an SWR reading of 4:1 indicate?",[["A","An antenna gain of 4"],["B","A very good impedance match"],["C","Antenna resonance"],["D","Impedance mismatch"]],"D","SWR of 4:1 indicates a significant impedance mismatch, resulting in power loss in the feed line."],
["T7C07","What happens to power lost in a feed line?",[["A","It is converted into heat"],["B","It is radiated by the feed line as RF"],["C","It is stored in the feed line for future use"],["D","It is returned to the transmitter"]],"A","Feed line losses are resistive — the resistance of the conductors and dielectric convert RF power to heat."],
["T7C08","Which instrument can be used to determine SWR?",[["A","Voltmeter"],["B","Ammeter"],["C","Directional wattmeter"],["D","Field strength meter"]],"C","A directional wattmeter (SWR meter) measures both forward and reflected power separately, from which it calculates and displays SWR."],
["T7C09","Which of the following causes failure of coaxial cables?",[["A","Moisture contamination"],["B","Low temperatures"],["C","Multiple connectors in the line"],["D","Excessive inner conductor current"]],"A","Moisture entering coaxial cable through damaged jackets or poor connectors causes oxidation and dramatically increases line losses."],
["T7C10","Why should the outer jacket of coaxial cable be resistant to ultraviolet light?",[["A","UV light can cause the dielectric to become conductive"],["B","UV light can damage the jacket and allow water to enter the cable"],["C","UV light causes the inner conductor to oxidize"],["D","UV light increases the cable impedance"]],"B","UV radiation degrades jacket materials, causing them to crack. Once the jacket cracks, moisture enters and causes the cable to fail."],
["T7C11","What is a disadvantage of air core coaxial cable when compared to foam or solid dielectric types?",[["A","It has more signal loss"],["B","It requires special techniques to prevent moisture in the cable"],["C","It cannot be used at VHF frequencies"],["D","It is more expensive per foot"]],"B","Air-core coaxial cable has very low dielectric loss, but requires pressurization with dry gas to prevent moisture from condensing inside."],
["T7D01","Which instrument would you use to measure electric potential?",[["A","An ammeter"],["B","A voltmeter"],["C","A wavemeter"],["D","An ohmmeter"]],"B","A voltmeter measures electric potential (voltage) in a circuit."],
["T7D02","How is a voltmeter connected to a component to measure applied voltage?",[["A","In series"],["B","In parallel"],["C","In quadrature"],["D","In phase"]],"B","A voltmeter is connected in PARALLEL across the component being measured."],
["T7D03","When configured to measure current, how is a multimeter connected to a component?",[["A","In series"],["B","In parallel"],["C","In quadrature"],["D","In phase"]],"A","An ammeter or multimeter in current mode is connected IN SERIES — current must flow through the meter to be measured."],
["T7D04","Which instrument is used to measure electric current?",[["A","An ohmmeter"],["B","A voltmeter"],["C","A wavemeter"],["D","An ammeter"]],"D","An ammeter measures electric current (in amperes). It must be connected in series with the circuit."],
["T7D06","Which of the following can damage a multimeter?",[["A","Attempting to measure resistance in a power-off circuit"],["B","Measuring voltage without probing both test points simultaneously"],["C","Attempting to measure voltage when using the resistance setting"],["D","Measuring current in a high-impedance circuit"]],"C","Measuring voltage while the meter is in resistance mode connects the meter's internal battery to a live circuit, which can damage the meter."],
["T7D07","Which of the following measurements are made using a multimeter?",[["A","SWR and impedance"],["B","Signal strength and noise"],["C","Resistance, voltage, and current"],["D","Voltage and resistance"]],"D","A basic multimeter measures voltage (V), resistance (Ω), and current (A)."],
["T7D08","Which of the following types of solder should not be used for radio and electronic applications?",[["A","Rosin-core solder"],["B","Lead and tin solder"],["C","Acid-core solder"],["D","Lead-free solder"]],"C","Acid-core solder (plumber's solder) is too corrosive for electronics — it will corrode circuit board traces and component leads over time."],
["T7D09","What is the characteristic appearance of a cold tin-lead solder joint?",[["A","Bright and shiny"],["B","Smooth and spherical"],["C","Dark and rough"],["D","A rough or lumpy surface"]],"D","A cold solder joint has a dull, rough, or lumpy appearance. Good solder joints are shiny and smooth."],
["T7D10","What reading indicates that an ohmmeter is connected across a large, discharged capacitor?",[["A","Increasing resistance with time"],["B","Decreasing resistance with time"],["C","Constant low resistance"],["D","Constant high resistance"]],"A","When an ohmmeter is connected to a discharged capacitor, it initially charges it. Resistance starts low then increases as the capacitor charges."],
["T7D11","Which of the following precautions should be taken when measuring in-circuit resistance with an ohmmeter?",[["A","Ensure that the circuit is not powered"],["B","Disconnect all power sources and discharge all capacitors"],["C","All these choices are correct"],["D","Ensure that the circuit is not powered"]],"A","Always de-energize a circuit before measuring resistance. An ohmmeter uses its own internal voltage — measuring in a powered circuit gives false readings and may damage the meter."],
["T8A01","Which of the following is a form of amplitude modulation?",[["A","Spread spectrum"],["B","Packet radio"],["C","Phase modulation"],["D","Single sideband"]],"D","SSB (Single Sideband) is a type of amplitude modulation (AM). The carrier and one sideband are suppressed, transmitting only one sideband."],
["T8A02","What type of modulation is commonly used for VHF packet radio transmissions?",[["A","SSB"],["B","FM or PM"],["C","AM"],["D","DSB"]],"B","VHF packet radio uses FM (or PM — Phase Modulation) to transmit digital data as audio tones."],
["T8A03","Which type of voice mode is often used for long-distance (weak signal) contacts on the VHF and UHF bands?",[["A","FM"],["B","AM"],["C","SSB"],["D","CW"]],"C","SSB uses less bandwidth and puts all power into one sideband, providing significantly better performance than FM for weak-signal VHF/UHF work."],
["T8A04","Which type of modulation is commonly used for VHF and UHF voice repeaters?",[["A","AM"],["B","SSB"],["C","PSK"],["D","FM or PM"]],"D","FM is the standard modulation for VHF/UHF repeater voice communications. FM's capture effect rejects weaker interfering signals."],
["T8A05","Which of the following types of signal has the narrowest bandwidth?",[["A","FM voice"],["B","SSB voice"],["C","Fast-scan TV"],["D","CW"]],"D","CW (Morse code) needs only about 150 Hz of bandwidth — the narrowest of any emission type."],
["T8A06","Which sideband is normally used for 10 meter HF, VHF, and UHF single-sideband communications?",[["A","Lower sideband"],["B","Upper sideband"],["C","Suppressed sideband"],["D","Inverted sideband"]],"B","Upper Sideband (USB) is the convention for HF above 14 MHz (including 10 meters) and for all VHF/UHF SSB."],
["T8A07","What is a characteristic of single sideband (SSB) compared to FM?",[["A","SSB signals are easier to tune in correctly"],["B","SSB signals are less susceptible to interference"],["C","SSB signals have narrower bandwidth"],["D","All these choices are correct"]],"C","SSB occupies about 3 kHz vs FM's 10–15 kHz, allowing more stations in the same band space."],
["T8A08","What is the approximate bandwidth of a typical single sideband (SSB) voice signal?",[["A","1 kHz"],["B","3 kHz"],["C","6 kHz"],["D","15 kHz"]],"B","SSB voice bandwidth is approximately 3 kHz, covering the useful human voice range (300–3000 Hz)."],
["T8A09","What is the approximate bandwidth of a VHF repeater FM voice signal?",[["A","Less than 500 Hz"],["B","About 150 kHz"],["C","Between 10 and 15 kHz"],["D","Between 50 and 125 kHz"]],"C","A VHF FM repeater uses between 10 and 15 kHz of bandwidth (using ±5 kHz deviation)."],
["T8A10","What is the approximate bandwidth of AM fast-scan TV transmissions?",[["A","about 6 MHz"],["B","About 3 MHz"],["C","About 1 MHz"],["D","About 500 kHz"]],"A","Fast-scan TV (ATV) requires approximately 6 MHz of bandwidth, same as commercial broadcast TV."],
["T8A11","What is the approximate bandwidth required to transmit a CW signal?",[["A","2.4 kHz"],["B","150 Hz"],["C","1 kHz"],["D","15 kHz"]],"B","CW requires only about 150 Hz of bandwidth — the narrowest of any practical amateur emission."],
["T8A12","Which of the following is a disadvantage of FM compared with single sideband?",[["A","Voice quality is poorer with FM"],["B","FM is more susceptible to interference"],["C","Only one signal can be received at a time"],["D","FM requires greater transmitter power"]],"C","FM's capture effect locks onto the strongest signal — you cannot copy two stations simultaneously."],
["T8B01","What telemetry information is typically transmitted by satellite beacons?",[["A","The health and status of the satellite"],["B","The location of the ground control station"],["C","Weather conditions in space"],["D","The positions of all amateur satellites"]],"A","Amateur satellite beacons transmit health and status: battery voltage, solar panel output, temperatures, mode, and transponder status."],
["T8B02","What is the impact of using excessive effective radiated power on a satellite uplink?",[["A","Blocking access by other users"],["B","Causing the satellite to change its orbit"],["C","Damaging the satellite's onboard receiver"],["D","Reducing the satellite's battery life"]],"A","Too much uplink power captures the satellite's transponder, blocking other users' weaker signals."],
["T8B03","Which of the following are provided by satellite tracking programs?",[["A","Maps showing the real-time position of the satellite track over Earth"],["B","The time, azimuth, and elevation of the start, maximum altitude, and end of a pass"],["C","The apparent frequency of the satellite transmission, including effects of Doppler shift"],["D","All these choices are correct"]],"D","Satellite tracking programs provide real-time position maps, pass schedules with azimuth/elevation, and Doppler-corrected frequency predictions."],
["T8B04","What mode of transmission is commonly used by amateur radio satellites?",[["A","SSB"],["B","FM"],["C","CW/data"],["D","All these choices are correct"]],"D","Amateur satellites use FM transponders for voice, SSB/CW linear transponders, and digital/data modes depending on design."],
["T8B05","What is a satellite beacon?",[["A","An antenna on the satellite that emits a continuous RF signal"],["B","A transmission from a satellite that contains status information"],["C","A transponder that translates one satellite frequency to another"],["D","The primary receiver for satellite control signals"]],"B","A satellite beacon is a continuous or periodic transmission from the satellite containing telemetry (health and status data)."],
["T8B06","Which of the following are inputs to a satellite tracking program?",[["A","The Keplerian elements"],["B","The satellite's name"],["C","The ground station coordinates"],["D","All these choices are correct"]],"A","Keplerian elements (TLE — Two-Line Elements) are the orbital parameters defining a satellite's orbit. Tracking programs use these to predict passes."],
["T8B07","What is Doppler shift in reference to satellite communications?",[["A","A change in the satellite's rotational speed"],["B","The difference in signal strength between uplink and downlink"],["C","An observed change in signal frequency caused by relative motion between the satellite and Earth station"],["D","A difference in signal delay between uplink and downlink"]],"C","As a satellite approaches, signals appear higher in frequency; as it recedes, they appear lower. Doppler shift can be ±3–10 kHz on VHF/UHF."],
["T8B08","What is meant by the statement that a satellite is operating in U/V mode?",[["A","The satellite uplink is in the 21 cm band and the downlink is in the 70 cm band"],["B","The satellite uplink is in the 70 centimeter band and the downlink is in the 2 meter band"],["C","The satellite operates using ultra-violet signals"],["D","The satellite uplink is 144 MHz and the downlink is 435 MHz"]],"B","U/V mode means UHF uplink (70cm, ~435 MHz) and VHF downlink (2m, ~145 MHz). U=UHF, V=VHF."],
["T8B09","What causes spin fading of satellite signals?",[["A","Rotation of the satellite and its antennas"],["B","The Doppler effect as the satellite changes speed"],["C","The satellite passing behind the Earth"],["D","Interference from solar radiation"]],"A","As a satellite tumbles or spins, its antennas periodically point toward and away from Earth, causing regular fading cycles."],
["T8B10","What is a LEO satellite?",[["A","A satellite in low earth orbit"],["B","A satellite that is stationary over the equator"],["C","A satellite that orbits the moon"],["D","A satellite using light-emitting optics"]],"A","LEO = Low Earth Orbit, typically 160–2000 km altitude. Most amateur satellites are in LEO with orbital periods of 90–120 minutes."],
["T8B11","Who may receive telemetry from a space station?",[["A","Only licensed amateur operators"],["B","Only the amateur operators who have registered for the satellite's use"],["C","Anyone"],["D","Only Extra class operators"]],"C","Anyone may receive (listen to) amateur satellite telemetry — no license is needed to receive, only to transmit."],
["T8B12","Which of the following is a way to determine whether your satellite uplink power is neither too low nor too high?",[["A","Your downlink signal strength should be about the same as the beacon"],["B","Your uplink signal should appear on the satellite's telemetry channel"],["C","Your downlink signal strength should be about half the beacon"],["D","Adjust uplink power until the satellite indicates a full quieting signal"]],"A","The proper power level is when your downlink signal is approximately equal in strength to the satellite's beacon."],
["T8C01","Which of the following methods is used to locate sources of noise interference or jamming?",[["A","Triangulation using multiple receivers and directional antennas"],["B","Radio direction finding"],["C","Monitoring the frequencies of your nearest cell tower"],["D","Sending a signal to the interfering station and waiting for a response"]],"B","Radio Direction Finding (RDF, fox hunting) uses directional antennas and signal strength measurements to locate interference sources."],
["T8C02","Which of these items would be useful for a hidden transmitter hunt?",[["A","A directional antenna"],["B","A calibrated SWR meter"],["C","A receiver with automatic gain control disabled"],["D","A portable amplifier"]],"A","A directional antenna allows you to determine which direction a signal is coming from, essential for tracking hidden transmitters."],
["T8C03","What operating activity involves contacting as many stations as possible during a specified period?",[["A","Sprinting"],["B","Contesting"],["C","Foxhunting"],["D","Grid chasing"]],"B","Contesting (radiosport) involves making as many contacts as possible within a specific time period."],
["T8C04","Which of the following is good procedure when contacting another station in a contest?",[["A","Sign your call sign repeatedly so that it is clearly understood"],["B","Send only the minimum information needed for proper identification and the contest exchange"],["C","Repeat everything at least twice"],["D","All these choices are correct"]],"B","Contest efficiency requires keeping contacts brief — send only your call sign, signal report, and required exchange."],
["T8C05","What is a grid locator?",[["A","A GPS coordinate system used for emergency communications"],["B","A letter-number designator assigned to a geographic location"],["C","A NOAA weather system used for reporting local conditions"],["D","A system for predicting radio propagation"]],"B","A grid locator (Maidenhead grid square) is a 4- or 6-character code (like EM72) identifying a geographic location, widely used in VHF/UHF contesting."],
["T8C06","How is over the air access to IRLP nodes accomplished?",[["A","By using CTCSS tones"],["B","By using DTMF signals"],["C","By entering the IRLP code via CW"],["D","By sending an email to the IRLP node operator"]],"B","IRLP nodes are accessed by sending DTMF (touch-tone) codes over the air to connect to a specified remote node over the internet."],
["T8C07","What is Voice Over Internet Protocol (VoIP)?",[["A","A method of sending CW signals over the internet"],["B","A type of wireless mesh network"],["C","A method of delivering voice communications over the internet using digital techniques"],["D","A system for linking amateur radio repeaters"]],"C","VoIP converts analog voice into digital data packets transmitted over the internet. EchoLink and IRLP use VoIP technology."],
["T8C08","What is the Internet Radio Linking Project (IRLP)?",[["A","A method for using internet audio streams on amateur radio"],["B","A technique to connect amateur radio systems, such as repeaters, via the internet using Voice Over Internet Protocol (VoIP)"],["C","A method of remotely controlling amateur transceivers"],["D","A broadband internet service for amateur radio operators"]],"B","IRLP uses VoIP technology to link amateur repeaters and simplex nodes worldwide via the internet."],
["T8C09","Which of the following protocols enables an amateur station to transmit through a repeater without using a radio to initiate the transmission?",[["A","IRLP"],["B","D-STAR"],["C","EchoLink"],["D","All these choices are correct"]],"C","EchoLink allows licensed amateurs to connect to repeaters and nodes using a computer or smartphone app, without a radio."],
["T8C10","What is required before using the EchoLink system?",[["A","Purchase of a membership in the EchoLink network"],["B","Register your call sign and provide proof of license"],["C","Obtaining special FCC authorization"],["D","Ownership of an approved transceiver"]],"B","EchoLink requires registration with your call sign and verified proof of license. Registration is free."],
["T8C11","What is an amateur radio station that connects other amateur stations to the internet?",[["A","A gateway"],["B","A repeater"],["C","A digipeater"],["D","An internet link station"]],"A","A gateway bridges the amateur radio network to the internet. EchoLink nodes, IRLP nodes, and APRS iGates are all examples."],
["T8D01","Which of the following is a digital communications mode?",[["A","Packet radio"],["B","IEEE 802.11"],["C","FT8"],["D","All these choices are correct"]],"D","All three are digital modes: packet radio (AX.25 protocol), IEEE 802.11 (Wi-Fi in amateur mesh networks), and FT8 (weak-signal digital mode)."],
["T8D02","What is a talkgroup on a DMR repeater?",[["A","A way for groups of users to share a channel at different times without hearing other users on the channel"],["B","A method of error correction on digital voice repeaters"],["C","A setting that controls how far a signal is repeated"],["D","An access code required to use a DMR repeater"]],"A","DMR talkgroups are virtual groups that share the same timeslot. Users with the same talkgroup ID hear each other; other talkgroups are not heard."],
["T8D03","What kind of data can be transmitted by APRS?",[["A","GPS position data"],["B","Text messages"],["C","Weather data"],["D","All these choices are correct"]],"D","APRS can transmit GPS positions, text messages, weather station data, object reports, and more."],
["T8D04","What type of transmission is indicated by the term NTSC?",[["A","A digital slow-scan TV signal"],["B","An analog fast-scan color TV signal"],["C","A digital data transmission"],["D","A high-definition TV signal"]],"B","NTSC is the analog color TV standard used in North America. Amateur fast-scan TV (ATV) using NTSC is popular on UHF and microwave bands."],
["T8D05","Which of the following is an application of APRS?",[["A","Providing real-time tactical digital communications in conjunction with a map showing the locations of stations"],["B","Enabling DX contacts on the HF bands"],["C","Automatic logging of amateur radio contacts"],["D","Remote control of an amateur station"]],"A","APRS overlays position and status on digital maps, allowing emergency coordinators and event managers to track stations in real time."],
["T8D06","What does the abbreviation PSK mean?",[["A","Pulse Shift Keying"],["B","Phase Shift Keying"],["C","Packet Signal Keying"],["D","Polarized Signal Keying"]],"B","PSK = Phase Shift Keying. The carrier phase is shifted to represent digital data. PSK31 is a popular narrow-bandwidth HF digital mode."],
["T8D07","Which of the following describes DMR?",[["A","A technique for time-multiplexing two digital voice signals on a single 12.5 kHz repeater channel"],["B","A broadband mesh network protocol for amateur radio"],["C","A digital video transmission system"],["D","A satellite communications protocol"]],"A","DMR uses TDMA to put two voice channels on a single 12.5 kHz channel by alternating between two timeslots, doubling repeater capacity."],
["T8D08","Which of the following is included in packet radio transmissions?",[["A","A check sum that permits error detection"],["B","A header that contains the call sign of the station to which the information is being sent"],["C","Automatic repeat request in case of error"],["D","All these choices are correct"]],"D","AX.25 packet frames include header with source/destination call signs, payload data, a CRC checksum, and ARQ for reliable delivery."],
["T8D09","What is CW?",[["A","Abbreviation for a type of wireless telegraphy used in the United States"],["B","A digital mode used primarily on UHF"],["C","Another name for a Morse code transmission"],["D","Abbreviation for a method of continuous-wave radar"]],"C","CW stands for Continuous Wave — the carrier is switched on and off to create the dots and dashes of Morse code."],
["T8D10","Which of the following operating activities is supported by digital mode software in the WSJT-X software suite?",[["A","Earth-Moon-Earth"],["B","Weak signal propagation beacons"],["C","Meteor scatter"],["D","All these choices are correct"]],"D","WSJT-X supports EME (moonbounce), WSPR propagation beacons, meteor scatter (MSK144), FT8, and FT4."],
["T8D11","What is an ARQ transmission system?",[["A","A type of digital forward error correction"],["B","A method of linking repeaters across the internet"],["C","A digital mode using audio tones in the HF bands"],["D","An error correction method in which the receiving station detects errors and sends a request for retransmission"]],"D","ARQ (Automatic Repeat Request): the receiver checks each packet for errors and requests retransmission of corrupted packets."],
["T8D12","Which of the following best describes an amateur radio mesh network?",[["A","An amateur-radio based data network using commercial Wi-Fi equipment with modified firmware"],["B","A series of repeaters linked via telephone lines"],["C","A high-speed digital network using microwave frequencies"],["D","An internet-connected network of amateur radio stations"]],"A","Amateur mesh networks (like AREDN) use commercial 802.11 Wi-Fi hardware with custom firmware to create IP-based digital networks on amateur frequencies."],
["T8D13","What is FT8?",[["A","A phase-modulated voice communication mode"],["B","A digital mode capable of low signal-to-noise operation"],["C","A high-speed data mode for local networks"],["D","A satellite control protocol"]],"B","FT8 (Franke-Taylor design, 8-FSK modulation) is a weak-signal digital mode that can make contacts at signal levels 15+ dB below what SSB requires."],
["T9A01","What is a beam antenna?",[["A","An antenna that receives signals from two directions"],["B","An antenna calibrated for digital transmissions"],["C","A dipole antenna used for low-angle radiation"],["D","An antenna that concentrates signals in one direction"]],"D","A beam antenna (directional antenna) focuses transmitted energy in one direction, increasing effective radiated power in that direction."],
["T9A02","Which of the following describes a type of antenna loading?",[["A","Inserting an inductor in the radiating element to electrically lengthen it"],["B","Attaching a heavy weight to the base of a vertical antenna"],["C","Using two or more coils to wind the antenna"],["D","Using a short antenna with a capacitive hat"]],"A","Antenna loading electrically lengthens a physically short antenna by inserting an inductor (coil) in the radiating element."],
["T9A03","Which of the following describes a simple dipole oriented parallel to Earth's surface?",[["A","A ground-plane antenna"],["B","A horizontally polarized antenna"],["C","A rhombic antenna"],["D","A vertically polarized antenna"]],"B","A dipole oriented horizontal (parallel to Earth) is horizontally polarized."],
["T9A04","What is a disadvantage of the short, flexible antenna supplied with most handheld radio transceivers, compared to a full-sized quarter-wave antenna?",[["A","It transmits and receives only vertically polarized signals"],["B","It is more susceptible to damage"],["C","It has low efficiency"],["D","All these choices are correct"]],"C","Short rubber duck antennas are electrically short and lossy — they can be 50–90% less efficient than a proper quarter-wave antenna."],
["T9A05","Which of the following increases the resonant frequency of a dipole antenna?",[["A","Lengthening it"],["B","Inserting coils"],["C","Shortening it"],["D","Lowering it close to the ground"]],"C","Shortening a dipole increases its resonant frequency. Formula: f = 468/L(ft) shows the inverse relationship."],
["T9A06","Which of the following types of antenna offers the greatest gain?",[["A","5/8-wave vertical"],["B","Yagi"],["C","J pole"],["D","Quarter-wave vertical"]],"B","A multi-element Yagi provides the most gain of the listed types. A typical 3-element Yagi has about 8 dBd gain."],
["T9A07","What is a disadvantage of using a handheld VHF transceiver with a flexible antenna inside a vehicle?",[["A","Signals are randomly refracted"],["B","The antenna will be grounded by the vehicle body"],["C","Signal strength is reduced due to the shielding effect of the vehicle"],["D","Standing waves are generated inside the vehicle"]],"C","A vehicle's metal body acts as a Faraday shield, blocking VHF/UHF signals and reducing effective range by 80–90%."],
["T9A08","What is the approximate length, in inches, of a quarter-wavelength vertical antenna for 146 MHz?",[["A","112"],["B","50"],["C","19"],["D","12"]],"C","Quarter wave length = 234/f(MHz) feet = 234/146 ≈ 1.6 feet ≈ 19 inches."],
["T9A09","What is the approximate length, in inches, of a half-wavelength 6 meter dipole antenna?",[["A","6"],["B","50"],["C","112"],["D","236"]],"C","Half-wave dipole length = 468/f(MHz) feet = 468/50 = 9.36 feet = 112 inches."],
["T9A10","In which direction does a half-wave dipole antenna radiate the strongest signal?",[["A","Toward the ends of the antenna"],["B","In a single direction"],["C","Broadside to the antenna"],["D","In all directions"]],"C","A half-wave dipole radiates maximum signal broadside (perpendicular to the wire), forming a figure-8 pattern."],
["T9A11","What is antenna gain?",[["A","The power increase from an external amplifier"],["B","The additional power supplied to an antenna by the transmitter"],["C","The increase in signal strength in a specified direction compared to a reference antenna"],["D","The efficiency rating of an antenna"]],"C","Antenna gain is the ratio of radiated power in a specific direction compared to a reference antenna. Gain is achieved by focusing energy, not adding power."],
["T9A12","What is an advantage of a 5/8 wavelength whip antenna for VHF or UHF mobile service?",[["A","It has less wind resistance than a 1/4-wavelength antenna"],["B","It has more gain than a 1/4-wavelength antenna"],["C","It is easier to match to the feed line than a 1/4-wavelength antenna"],["D","It requires no matching network"]],"B","A 5/8-wave vertical has about 3 dB more gain than a quarter-wave vertical by pushing the radiation pattern lower toward the horizon."],
["T9B01","What is a benefit of low SWR?",[["A","Reduced signal loss"],["B","Higher transmitter output power"],["C","Greater antenna bandwidth"],["D","All these choices are correct"]],"A","Low SWR means good impedance matching, minimizing reflected power and reducing feed line losses."],
["T9B02","What is the most common impedance of coaxial cables used in amateur radio?",[["A","25 ohms"],["B","50 ohms"],["C","75 ohms"],["D","100 ohms"]],"B","50-ohm coaxial cable is the standard for amateur radio. 75-ohm coax is used for cable TV."],
["T9B03","Why is coaxial cable the most common feed line for amateur radio antenna systems?",[["A","It is easy to use and requires few special installation considerations"],["B","It has less signal loss than any other type of feed line"],["C","It is easy to splice and requires no connectors"],["D","All these choices are correct"]],"A","Coaxial cable's self-shielding design makes it easy to route near metal structures without special matching requirements."],
["T9B04","What is the major function of an antenna tuner (antenna coupler)?",[["A","It matches the antenna system impedance to the transceiver's output impedance"],["B","It filters out unwanted harmonics from the transmitter output"],["C","It increases the power delivered to the antenna"],["D","It reduces transmission line losses"]],"A","An antenna tuner (ATU) is an impedance matching network that transforms the antenna system impedance to 50 ohms."],
["T9B05","What happens as the frequency of a signal in coaxial cable is increased?",[["A","The loss decreases"],["B","The loss increases"],["C","The characteristic impedance decreases"],["D","The velocity factor increases"]],"B","Coaxial cable loss increases with frequency due to skin effect, dielectric losses, and radiation losses."],
["T9B06","Which of the following RF connector types is most suitable for frequencies above 400 MHz?",[["A","PL-259 (UHF)"],["B","BNC"],["C","Type N"],["D","DB-9"]],"C","Type N connectors are precision 50-ohm connectors designed for use up to 11 GHz or higher."],
["T9B07","Which of the following is true of PL-259 type coax connectors?",[["A","They are commonly used at HF and VHF frequencies"],["B","They are watertight"],["C","They are designed for use at frequencies above 1000 MHz"],["D","They have a 75-ohm impedance"]],"A","PL-259 connectors are the most common in amateur HF and lower VHF use, despite being called UHF connectors."],
["T9B08","Which of the following is a source of loss in coaxial feed line?",[["A","Water intrusion into coaxial connectors"],["B","High SWR"],["C","Multiple connectors in the line"],["D","All these choices are correct"]],"D","All three cause feed line loss: water intrusion, high SWR additional resistive losses, and connector insertion loss."],
["T9B09","What can cause erratic changes in SWR?",[["A","A loose connection in the antenna or feed line"],["B","Changing frequency across a band"],["C","Adjustment of the transmitter tuning control"],["D","Too high a transmitter power output"]],"A","Loose connections cause intermittent impedance changes — SWR varies as the connection makes or breaks."],
["T9B10","What is the electrical difference between RG-58 and RG-213 coaxial cable?",[["A","RG-58 cable has less loss at a given frequency"],["B","RG-213 cable has less loss at a given frequency"],["C","RG-58 cable can handle higher power levels"],["D","RG-213 has a higher impedance"]],"B","RG-213 is a larger-diameter cable with lower loss per foot than the smaller RG-58. Both are 50 ohms."],
["T9B11","Which of the following types of feed line has the lowest loss at VHF and UHF?",[["A","50-ohm flexible coax"],["B","Multi-conductor unshielded cable"],["C","Air-insulated hardline"],["D","75-ohm flexible coax"]],"C","Air-insulated hardline has the lowest loss of any coaxial line type because air has virtually no dielectric loss."],
["T9B12","What is standing wave ratio (SWR)?",[["A","The ratio of maximum to minimum current along a feed line"],["B","A measure of how well a load is matched to a transmission line"],["C","The ratio of forward to reflected voltage in a transmission line"],["D","The measure of effective radiated power"]],"B","SWR is a measure of how well the load impedance (antenna) matches the transmission line impedance. Perfect match = SWR 1:1."],
["T0A01","Which of the following is a safety hazard of a 12-volt storage battery?",[["A","Shorting the terminals can cause burns, fire, or an explosion"],["B","Excessively discharged batteries are likely to explode"],["C","Overcharging destroys the potential of the battery"],["D","All these choices are correct"]],"A","A 12V lead-acid battery can deliver hundreds of amperes through a short circuit, causing instant burns, fire, and potentially igniting hydrogen gas."],
["T0A02","What health hazard is presented by electrical current flowing through the body?",[["A","It may cause injury by heating tissue"],["B","It may disrupt the electrical functions of cells"],["C","It may cause involuntary muscle contractions"],["D","All these choices are correct"]],"D","All three are real hazards: tissue heating (burns), disrupted cell signals (cardiac arrest), and involuntary muscle contractions (prevents releasing a gripped conductor)."],
["T0A03","In the United States, what circuit does black wire insulation indicate in a three-wire 120 V cable?",[["A","Neutral"],["B","Hot"],["C","Equipment ground"],["D","Protective ground"]],"B","In U.S. wiring: black = hot (live), white = neutral, green or bare = ground. The hot wire carries dangerous voltage."],
["T0A04","What is the purpose of a fuse in an electrical circuit?",[["A","To prevent excessive voltage from reaching the connected equipment"],["B","To interrupt the circuit if too much current flows"],["C","To remove power in case of overload"],["D","All these choices are correct"]],"C","A fuse melts (opens) when current exceeds its rating, removing power before excessive current damages wiring or causes fire."],
["T0A05","Why should a 5-ampere fuse never be replaced with a 20-ampere fuse?",[["A","The larger fuse would be a shock hazard"],["B","The larger fuse would not fit into the same fuse clip"],["C","Excessive current could cause a fire"],["D","All these choices are correct"]],"C","A 5A fuse protects wiring rated for 5A. A 20A fuse allows 4x more current through that wiring, which can overheat it and cause a fire."],
["T0A06","What is a good way to guard against electrical shock at your station?",[["A","Use three-wire cords and plugs for all AC powered equipment"],["B","Connect all AC powered station equipment to a common safety ground"],["C","Install mechanical interlocks in high-voltage circuits"],["D","All these choices are correct"]],"D","All three are important: grounded cords, common safety ground, and interlocks to prevent accidental high-voltage contact."],
["T0A07","Where should a lightning arrester be installed in a coaxial feed line?",[["A","At the transmitter"],["B","Anywhere along the feed line"],["C","On a grounded panel near where feed lines enter the building"],["D","As close to the antenna as possible"]],"C","Lightning arresters should be installed where the feed line enters the building, on a grounded panel, diverting lightning energy to ground before it enters."],
["T0A08","Where should a fuse or circuit breaker be installed in a 120V AC power circuit?",[["A","In series with the hot conductor only"],["B","In series with the neutral conductor only"],["C","In series with all conductors"],["D","In parallel with the hot conductor"]],"A","Fuses and breakers are installed in series with the hot (black) conductor only, interrupting the energized conductor."],
["T0A09","What should be done to all external ground rods or earth connections?",[["A","Bond them together with heavy wire or conductive strap"],["B","They should be isolated from each other to prevent corrosion"],["C","They should be connected to the antenna for maximum effectiveness"],["D","They should be installed at least 100 feet apart"]],"A","All ground rods must be bonded together to ensure they are at the same potential, preventing dangerous voltage differences."],
["T0A10","What hazard is caused by charging or discharging a battery too quickly?",[["A","Overheating or out-gassing"],["B","Irreversible loss of battery capacity"],["C","Shorting of the battery cells"],["D","All these choices are correct"]],"A","Rapid charging or discharging can cause overheating and out-gassing of explosive hydrogen. Li-ion batteries can catch fire if charged/discharged too rapidly."],
["T0A11","What hazard exists in a power supply immediately after turning it off?",[["A","Charge stored in filter capacitors"],["B","Radiation from the transformer"],["C","Magnetic field collapse in the transformer"],["D","All these choices are correct"]],"A","Large filter capacitors can store lethal charges. Always wait several minutes and verify with a voltmeter before working inside a powered-off supply."],
["T0A12","Which of the following precautions should be taken when measuring high voltages with a voltmeter?",[["A","Ensure that the voltmeter and leads are rated for use at the voltages to be measured"],["B","Ensure that the voltmeter is set to the correct range before making contact with the circuit"],["C","Ensure that the circuit is de-energized before connecting the voltmeter"],["D","All these choices are correct"]],"A","Voltmeter leads and the meter have voltage ratings. Using under-rated equipment risks insulation breakdown and electrocution."],
["T0B01","Which of the following is good practice when installing ground wires on a tower for lightning protection?",[["A","Ensure that connections are short and direct"],["B","Make the wires as long as possible to avoid the need for multiple ground rods"],["C","Twist the ground wires together for maximum security"],["D","All these choices are correct"]],"A","Short, direct ground wire runs have lower inductance and provide a better path for lightning current."],
["T0B02","What is required when climbing an antenna tower?",[["A","Have sufficient training on safe tower climbing techniques"],["B","Use appropriate tie-off to the tower at all times"],["C","Always wear an approved climbing harness"],["D","All these choices are correct"]],"D","All three are required: proper training, continuous 100% tie-off with a harness and lanyard, and an approved climbing harness."],
["T0B03","Under what circumstances is it safe to climb a tower without a helper or observer?",[["A","When the tower is less than 20 feet high"],["B","If a safety line is used"],["C","When no electrical hazards are present"],["D","Never"]],"D","It is NEVER safe to climb a tower alone. A helper or observer on the ground is always required."],
["T0B04","Which of the following is an important safety precaution to observe when putting up an antenna tower?",[["A","Look for and stay clear of any overhead electrical wires"],["B","Have the structure inspected by a licensed civil engineer"],["C","Obtain a building permit"],["D","All these choices are correct"]],"A","Overhead power lines are a critical hazard when erecting towers. Always survey the area for overhead lines before starting work."],
["T0B05","What is the purpose of a safety wire through a turnbuckle used to tension guy lines?",[["A","Prevent loosening of the turnbuckle from vibration"],["B","To provide a path for lightning to ground"],["C","To allow adjustment of the guy line tension"],["D","To prevent corrosion of the turnbuckle threads"]],"A","Turnbuckles can unscrew due to vibration. A safety wire prevents it from loosening and releasing the guy line tension."],
["T0B06","What is the minimum safe distance from a power line to allow when installing an antenna?",[["A","1 foot of clearance for every 1000 volts"],["B","At least 10 feet of clearance"],["C","Enough so that if the antenna falls, no part of it can come closer than 10 feet to the power wires"],["D","At least twice the height of the antenna"]],"C","Position the antenna so that if it completely collapses, no part comes within 10 feet of power lines."],
["T0B07","Which of the following is an important safety rule to remember when using a crank-up tower?",[["A","This type of tower must not be climbed unless it is retracted, or mechanical safety locking devices have been installed"],["B","Crank-up towers must never be climbed"],["C","Mechanical safety locks must be removed before cranking the tower up or down"],["D","Always climb a crank-up tower from the inside"]],"A","Crank-up towers must not be climbed while extended unless safety locking collars are installed to prevent collapse."],
["T0B08","Which is a proper grounding method for a tower?",[["A","A single ground rod per tower"],["B","A continuous ground strap around the base"],["C","Grounding to the power system neutral"],["D","Separate eight-foot ground rods for each tower leg, bonded to the tower and each other"]],"D","Each tower leg should have its own 8-foot ground rod, and all rods and tower legs should be bonded together."],
["T0B09","Why should you avoid attaching an antenna to a utility pole?",[["A","You could receive a citation from the FCC"],["B","The antenna could contact high-voltage power lines"],["C","The utility company may charge rental fees"],["D","All these choices are correct"]],"B","Utility poles carry high-voltage power lines. Attaching an antenna risks the antenna or feed line contacting those lines."],
["T0B10","Which of the following is true when installing grounding conductors used for lightning protection?",[["A","Sharp bends must be avoided"],["B","The conductor must be at least 25 feet in length"],["C","The conductor must not be buried"],["D","Insulated wire must be used"]],"A","Sharp bends in lightning ground conductors create high inductance, impeding fast-rising lightning current pulses. Route conductors as straight as possible."],
["T0B11","Which of the following establishes grounding requirements for an amateur radio tower or antenna?",[["A","FCC Part 97 rules"],["B","Local electrical codes"],["C","ARRL Antenna Handbook"],["D","National Electrical Safety Code"]],"B","Local electrical codes (based on the National Electrical Code) govern tower grounding requirements."],
["T0C01","What type of radiation are radio signals?",[["A","Ionizing radiation"],["B","Acoustic radiation"],["C","Non-ionizing radiation"],["D","Thermal radiation"]],"C","Radio waves are non-ionizing radiation — they do not have enough energy to remove electrons from atoms or break chemical bonds."],
["T0C02","At which of the following frequencies does maximum permissible exposure have the lowest value?",[["A","3.5 MHz"],["B","50 MHz"],["C","440 MHz"],["D","1296 MHz"]],"B","The human body absorbs RF energy most efficiently near 50 MHz (body dimensions close to resonant), so MPE limits are most restrictive there."],
["T0C03","How does the allowable power density for RF safety change if duty cycle changes from 100 percent to 50 percent?",[["A","It increases by a factor of 2"],["B","It decreases by a factor of 2"],["C","It stays the same"],["D","It increases by a factor of 3"]],"A","If you transmit only 50% of the time, average exposure is halved, so you can double the allowable power density."],
["T0C04","What factors affect the RF exposure of people near an amateur station antenna?",[["A","Frequency and power level of the RF field"],["B","Distance from the antenna to a person"],["C","Radiation pattern of the antenna"],["D","All these choices are correct"]],"D","All three factors determine RF exposure: frequency, power level, distance (field strength drops with distance), and radiation pattern."],
["T0C05","Why do exposure limits vary with frequency?",[["A","The human body absorbs more RF energy at some frequencies than at others"],["B","Higher frequencies are more dangerous than lower frequencies"],["C","Higher frequencies are less dangerous than lower frequencies"],["D","The FCC has different regulations for different frequency bands"]],"A","The human body's RF absorption varies significantly with frequency, peaking near 50 MHz where the body resonates."],
["T0C06","Which of the following is an acceptable method to determine whether your station complies with FCC RF exposure regulations?",[["A","By calculation based on FCC OET Bulletin 65"],["B","By calculation based on computer modeling"],["C","By measurement of field strength using calibrated equipment"],["D","All these choices are correct"]],"D","The FCC accepts hand calculations (OET Bulletin 65), computer modeling, or direct field strength measurements."],
["T0C07","What hazard is created by touching an antenna during a transmission?",[["A","Electrocution from induced DC current"],["B","RF burn to skin"],["C","Radiation poisoning"],["D","All these choices are correct"]],"B","RF energy concentrates at contact points with skin, causing burns. Even low power can cause RF burns on a resonant antenna."],
["T0C08","Which of the following actions can reduce exposure to RF radiation?",[["A","Relocate antennas"],["B","Reduce transmitter power"],["C","Transmit for shorter periods"],["D","All these choices are correct"]],"A","Relocating the antenna increases distance from occupied areas, dramatically reducing exposure (field strength decreases as the square of distance)."],
["T0C09","How can you make sure your station stays in compliance with RF safety regulations?",[["A","Perform a new exposure analysis when changing bands or increasing power"],["B","By re-evaluating the station whenever an item in the transmitter or antenna system is changed"],["C","By only operating at the minimum power necessary"],["D","By staying at least 50 feet from the antenna"]],"B","FCC rules require re-evaluation of RF exposure whenever you change transmitter power, frequency, antenna type, height, or location."],
["T0C10","Why is duty cycle one of the factors used to determine safe RF radiation exposure levels?",[["A","It affects the peak exposure to radiation"],["B","It affects the average exposure to radiation"],["C","It is used to determine the carrier frequency of the transmitted signal"],["D","It affects the total power output of the transmitter"]],"B","Duty cycle is the fraction of time transmitting. Biological effects depend on average power absorbed, so lower duty cycle means less average exposure."],
["T0C11","What is the definition of duty cycle during the averaging time for RF exposure?",[["A","The ratio of on time to total time"],["B","The ratio of off time to total time"],["C","The percentage of time that a transmitter is transmitting"],["D","The ratio of transmit power to peak envelope power"]],"C","Duty cycle = (transmit time / total time) × 100%. For RF safety, averaging time is 6 minutes (controlled) or 30 minutes (uncontrolled)."],
["T0C12","How does RF radiation differ from ionizing radiation (radioactivity)?",[["A","RF radiation does not have sufficient energy to cause chemical changes in cells and damage DNA"],["B","RF radiation is more dangerous than ionizing radiation"],["C","RF radiation is produced in greater quantities"],["D","RF radiation is less penetrating than ionizing radiation"]],"A","RF radiation is non-ionizing — it lacks the photon energy to ionize atoms or break DNA bonds. Ionizing radiation (X-rays) can damage DNA."],
["T0C13","Who is responsible for ensuring that no person is exposed to RF energy above the FCC exposure limits?",[["A","The FCC"],["B","The nearest FCC regional office"],["C","The station licensee"],["D","The control operator if different from the licensee"]],"C","The station licensee bears responsibility for ensuring the station's RF emissions comply with FCC exposure limits."],
];

const EXAM_SIZE = 35;
const PASS_SCORE = 26;

// ─── HELPERS ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildExam() {
  // Draw 35 questions spread across subelements proportionally (like the real exam)
  const bySubel = {};
  FULL_POOL.forEach(q => {
    const se = q[0].slice(0, 2);
    if (!bySubel[se]) bySubel[se] = [];
    bySubel[se].push(q);
  });
  const groups = Object.values(bySubel).map(g => shuffle(g));
  const questions = [];
  let gi = 0;
  while (questions.length < EXAM_SIZE) {
    const g = groups[gi % groups.length];
    const q = g[Math.floor(Math.random() * g.length)];
    if (!questions.find(x => x[0] === q[0])) questions.push(q);
    gi++;
  }
  // Shuffle answer choices within each question
  return shuffle(questions).map(([id, question, choices, correct, explanation]) => {
    const shuffledChoices = shuffle(choices);
    const correctText = choices.find(c => c[0] === correct)[1];
    const newCorrectLetter = shuffledChoices.find(c => c[1] === correctText)[0];
    return { id, question, choices: shuffledChoices, correct: newCorrectLetter, explanation };
  });
}

function loadLog() {
  try {
    const raw = window.localStorage ? window.localStorage.getItem('hamExamLog') : null;
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveLog(log) {
  try {
    if (window.localStorage) window.localStorage.setItem('hamExamLog', JSON.stringify(log));
  } catch {}
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b2a;
    --navy2: #1a2d40;
    --navy3: #243650;
    --amber: #f5a623;
    --amber2: #ffba47;
    --green: #2ecc71;
    --red: #e74c3c;
    --slate: #8fa7be;
    --white: #eef4f9;
    --mono: 'Space Mono', monospace;
    --serif: 'Lora', Georgia, serif;
  }

  body { background: var(--navy); color: var(--white); font-family: var(--serif); min-height: 100vh; }

  .app {
    max-width: 820px;
    margin: 0 auto;
    padding: 24px 16px 60px;
  }

  /* ── HEADER ── */
  .header {
    text-align: center;
    padding: 36px 0 28px;
    border-bottom: 1px solid var(--navy3);
    margin-bottom: 32px;
  }
  .header-callsign {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .header h1 {
    font-family: var(--mono);
    font-size: clamp(22px, 4vw, 32px);
    font-weight: 700;
    color: var(--white);
    line-height: 1.2;
  }
  .header h1 span { color: var(--amber); }
  .header-sub {
    font-family: var(--serif);
    font-style: italic;
    color: var(--slate);
    font-size: 14px;
    margin-top: 8px;
  }

  /* ── START SCREEN ── */
  .start-screen {
    text-align: center;
  }
  .start-banner {
    background: var(--navy2);
    border: 1px solid var(--navy3);
    border-radius: 12px;
    padding: 40px 32px;
    margin-bottom: 28px;
  }
  .start-banner h2 {
    font-family: var(--mono);
    font-size: 20px;
    color: var(--amber);
    margin-bottom: 16px;
  }
  .start-stats-row {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin: 24px 0;
    flex-wrap: wrap;
  }
  .start-stat {
    text-align: center;
  }
  .start-stat-num {
    font-family: var(--mono);
    font-size: 36px;
    font-weight: 700;
    color: var(--amber);
    display: block;
  }
  .start-stat-label {
    font-size: 12px;
    color: var(--slate);
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: var(--mono);
  }
  .start-note {
    font-style: italic;
    color: var(--slate);
    font-size: 14px;
    line-height: 1.6;
  }

  /* ── LOG TABLE ── */
  .log-section {
    background: var(--navy2);
    border: 1px solid var(--navy3);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 28px;
    text-align: left;
  }
  .log-section h3 {
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 2px;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .log-empty {
    color: var(--slate);
    font-style: italic;
    font-size: 14px;
    text-align: center;
    padding: 12px 0;
  }
  .log-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--mono);
    font-size: 13px;
  }
  .log-table th {
    text-align: left;
    color: var(--slate);
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--navy3);
  }
  .log-table td {
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: var(--white);
  }
  .log-table td:nth-child(3) { text-align: right; }
  .pass-badge { color: var(--green); font-weight: 700; }
  .fail-badge { color: var(--red); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 14px 32px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    text-transform: uppercase;
  }
  .btn-primary {
    background: var(--amber);
    color: var(--navy);
  }
  .btn-primary:hover { background: var(--amber2); transform: translateY(-1px); }
  .btn-secondary {
    background: transparent;
    color: var(--amber);
    border: 1px solid var(--amber);
  }
  .btn-secondary:hover { background: rgba(245,166,35,0.1); }
  .btn-sm { padding: 10px 20px; font-size: 12px; }

  /* ── EXAM SCREEN ── */
  .exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .exam-progress-label {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--slate);
  }
  .exam-progress-label strong {
    color: var(--white);
    font-size: 16px;
  }
  .progress-bar-wrap {
    height: 4px;
    background: var(--navy3);
    border-radius: 4px;
    margin-bottom: 28px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--amber), var(--amber2));
    border-radius: 4px;
    transition: width 0.4s ease;
  }
  .score-pill {
    font-family: var(--mono);
    font-size: 12px;
    padding: 5px 14px;
    border-radius: 20px;
    background: var(--navy3);
    color: var(--slate);
  }
  .score-pill span { color: var(--green); font-weight: 700; }

  /* ── QUESTION CARD ── */
  .question-card {
    background: var(--navy2);
    border: 1px solid var(--navy3);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 20px;
  }
  .question-id {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 3px;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .question-text {
    font-family: var(--serif);
    font-size: clamp(16px, 2.5vw, 19px);
    line-height: 1.6;
    color: var(--white);
    margin-bottom: 28px;
  }

  /* ── CHOICES ── */
  .choices { display: flex; flex-direction: column; gap: 10px; }
  .choice-btn {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 18px;
    border-radius: 10px;
    border: 1px solid var(--navy3);
    background: var(--navy);
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
    width: 100%;
  }
  .choice-btn:hover:not(:disabled) {
    border-color: var(--amber);
    background: rgba(245,166,35,0.07);
  }
  .choice-btn:disabled { cursor: default; }
  .choice-btn.selected {
    border-color: var(--amber);
    background: rgba(245,166,35,0.12);
  }
  .choice-btn.correct {
    border-color: var(--green);
    background: rgba(46,204,113,0.12);
  }
  .choice-btn.incorrect {
    border-color: var(--red);
    background: rgba(231,76,60,0.12);
  }
  .choice-btn.reveal-correct {
    border-color: var(--green);
    background: rgba(46,204,113,0.08);
  }
  .choice-letter {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 700;
    min-width: 22px;
    color: var(--slate);
    margin-top: 1px;
  }
  .choice-btn.selected .choice-letter { color: var(--amber); }
  .choice-btn.correct .choice-letter { color: var(--green); }
  .choice-btn.incorrect .choice-letter { color: var(--red); }
  .choice-btn.reveal-correct .choice-letter { color: var(--green); }
  .choice-text {
    font-family: var(--serif);
    font-size: 15px;
    line-height: 1.5;
    color: var(--white);
    flex: 1;
  }
  .choice-icon {
    font-size: 16px;
    margin-top: 2px;
  }

  /* ── FEEDBACK ── */
  .feedback-box {
    border-radius: 12px;
    padding: 18px 22px;
    margin-bottom: 20px;
    border-left: 4px solid;
    animation: slideIn 0.25s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .feedback-box.correct-fb {
    background: rgba(46,204,113,0.1);
    border-color: var(--green);
  }
  .feedback-box.incorrect-fb {
    background: rgba(231,76,60,0.1);
    border-color: var(--red);
  }
  .feedback-title {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .feedback-box.correct-fb .feedback-title { color: var(--green); }
  .feedback-box.incorrect-fb .feedback-title { color: var(--red); }
  .feedback-explanation {
    font-family: var(--serif);
    font-size: 14px;
    line-height: 1.65;
    color: var(--white);
    font-style: italic;
  }

  /* ── NAV ── */
  .exam-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* ── RESULTS ── */
  .results-screen { text-align: center; }
  .results-badge {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 52px;
    margin: 0 auto 24px;
    border: 3px solid;
  }
  .results-badge.pass { border-color: var(--green); background: rgba(46,204,113,0.1); }
  .results-badge.fail { border-color: var(--red); background: rgba(231,76,60,0.1); }
  .results-score-big {
    font-family: var(--mono);
    font-size: clamp(40px, 8vw, 64px);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 8px;
  }
  .results-score-big.pass { color: var(--green); }
  .results-score-big.fail { color: var(--red); }
  .results-label {
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--slate);
    margin-bottom: 8px;
  }
  .results-verdict {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .results-verdict.pass { color: var(--green); }
  .results-verdict.fail { color: var(--red); }
  .results-sub {
    font-style: italic;
    color: var(--slate);
    font-size: 14px;
    margin-bottom: 32px;
  }

  /* ── WRONG REVIEW ── */
  .wrong-review {
    text-align: left;
    background: var(--navy2);
    border: 1px solid var(--navy3);
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
  }
  .wrong-review h3 {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 2px;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .wrong-item {
    border-bottom: 1px solid var(--navy3);
    padding: 14px 0;
  }
  .wrong-item:last-child { border-bottom: none; padding-bottom: 0; }
  .wrong-qid {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--red);
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .wrong-q {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 6px;
  }
  .wrong-answers {
    font-family: var(--mono);
    font-size: 12px;
  }
  .wrong-yours { color: var(--red); }
  .wrong-correct { color: var(--green); }
  .wrong-expl {
    font-style: italic;
    color: var(--slate);
    font-size: 13px;
    margin-top: 5px;
    line-height: 1.5;
  }

  .results-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 8px;
  }
`;

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function HamExamApp() {
  const [screen, setScreen] = useState("start"); // start | exam | results
  const [exam, setExam] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]); // {correct: bool, selectedLetter, question}
  const [log, setLog] = useState(loadLog);

  const startExam = () => {
    setExam(buildExam());
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setAnswers([]);
    setScreen("exam");
  };

  const handleSelect = (letter) => {
    if (answered) return;
    setSelected(letter);
  };

  const handleNext = () => {
    if (!selected && !answered) return;
    if (!answered) {
      // First click on Next — evaluate answer
      const q = exam[current];
      const isCorrect = selected === q.correct;
      const newAnswers = [...answers, {
        correct: isCorrect,
        selectedLetter: selected,
        question: q,
      }];
      setAnswers(newAnswers);
      setAnswered(true);

      if (current === exam.length - 1) {
        // Finished — save to log after a brief display
        const score = newAnswers.filter(a => a.correct).length;
        const pct = Math.round((score / EXAM_SIZE) * 100);
        const entry = {
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          score,
          total: EXAM_SIZE,
          pct,
          passed: score >= PASS_SCORE,
        };
        const newLog = [entry, ...log].slice(0, 20);
        setLog(newLog);
        saveLog(newLog);
      }
    } else {
      // Already answered, move to next question
      if (current < exam.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        setScreen("results");
      }
    }
  };

  const correctSoFar = answers.filter(a => a.correct).length;

  // ── START SCREEN ──────────────────────────────────────────────────────────
  if (screen === "start") {
    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <div className="header-callsign">FCC Technician Class · 2022–2026</div>
            <h1>Ham Radio <span>Practice Exam</span></h1>
            <div className="header-sub">411 question pool · 35 per test · randomized every time</div>
          </div>
          <div className="start-screen">
            <div className="start-banner">
              <h2>Exam Format</h2>
              <div className="start-stats-row">
                <div className="start-stat">
                  <span className="start-stat-num">35</span>
                  <span className="start-stat-label">Questions</span>
                </div>
                <div className="start-stat">
                  <span className="start-stat-num">26</span>
                  <span className="start-stat-label">To Pass</span>
                </div>
                <div className="start-stat">
                  <span className="start-stat-num">74%</span>
                  <span className="start-stat-label">Pass Score</span>
                </div>
                <div className="start-stat">
                  <span className="start-stat-num">411</span>
                  <span className="start-stat-label">Pool Size</span>
                </div>
              </div>
              <p className="start-note">
                Every test draws 35 new questions from the full pool and shuffles the answer choices. Instant feedback explains each answer the moment you submit it.
              </p>
            </div>

            {log.length > 0 && (
              <div className="log-section">
                <h3>📋 Exam History</h3>
                <table className="log-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.map((entry, i) => (
                      <tr key={i}>
                        <td>{entry.date}</td>
                        <td>{entry.score}/{entry.total} ({entry.pct}%)</td>
                        <td className={entry.passed ? "pass-badge" : "fail-badge"}>
                          {entry.passed ? "✓ PASS" : "✗ FAIL"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button className="btn btn-primary" onClick={startExam} style={{ fontSize: 16, padding: "16px 48px" }}>
              Start Practice Exam →
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── EXAM SCREEN ───────────────────────────────────────────────────────────
  if (screen === "exam") {
    const q = exam[current];
    const isCorrect = answered && selected === q.correct;
    const progress = ((current + (answered ? 1 : 0)) / EXAM_SIZE) * 100;

    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <div className="header-callsign">FCC Technician Class · 2022–2026</div>
            <h1>Ham Radio <span>Practice Exam</span></h1>
          </div>

          <div className="exam-header">
            <div className="exam-progress-label">
              Question <strong>{current + 1}</strong> of {EXAM_SIZE}
            </div>
            <div className="score-pill">
              Correct: <span>{correctSoFar}</span> / {answers.length}
              {answers.length > 0 && ` (${Math.round((correctSoFar / answers.length) * 100)}%)`}
            </div>
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="question-card">
            <div className="question-id">{q.id}</div>
            <div className="question-text">{q.question}</div>
            <div className="choices">
              {q.choices.map(([letter, text]) => {
                let cls = "choice-btn";
                let icon = null;
                if (answered) {
                  if (letter === q.correct) { cls += " correct"; icon = "✓"; }
                  else if (letter === selected) { cls += " incorrect"; icon = "✗"; }
                } else if (selected === letter) {
                  cls += " selected";
                }
                return (
                  <button
                    key={letter}
                    className={cls}
                    onClick={() => handleSelect(letter)}
                    disabled={answered}
                  >
                    <span className="choice-letter">{letter}.</span>
                    <span className="choice-text">{text}</span>
                    {icon && <span className="choice-icon">{icon}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {answered && (
            <div className={`feedback-box ${isCorrect ? "correct-fb" : "incorrect-fb"}`}>
              <div className="feedback-title">
                {isCorrect ? "✓ Correct!" : `✗ Incorrect — correct answer: ${q.correct}`}
              </div>
              <div className="feedback-explanation">{q.explanation}</div>
            </div>
          )}

          <div className="exam-nav">
            <button className="btn btn-secondary btn-sm" onClick={() => setScreen("start")}>
              ← Quit
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!selected && !answered}
              style={{ opacity: (!selected && !answered) ? 0.4 : 1 }}
            >
              {!answered
                ? "Submit Answer"
                : current < exam.length - 1
                  ? "Next Question →"
                  : "See Results →"}
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── RESULTS SCREEN ────────────────────────────────────────────────────────
  if (screen === "results") {
    const score = answers.filter(a => a.correct).length;
    const pct = Math.round((score / EXAM_SIZE) * 100);
    const passed = score >= PASS_SCORE;
    const wrong = answers.filter(a => !a.correct);

    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="header">
            <div className="header-callsign">FCC Technician Class · 2022–2026</div>
            <h1>Ham Radio <span>Practice Exam</span></h1>
          </div>

          <div className="results-screen">
            <div className="results-badge" style={{ marginBottom: 24, borderColor: passed ? "var(--green)" : "var(--red)", background: passed ? "rgba(46,204,113,0.1)" : "rgba(231,76,60,0.1)" }}>
              {passed ? "🎉" : "📻"}
            </div>

            <div className={`results-score-big ${passed ? "pass" : "fail"}`}>
              {score}/{EXAM_SIZE}
            </div>
            <div className="results-label" style={{ marginTop: 6 }}>{pct}% · Need 74% to Pass</div>
            <div className={`results-verdict ${passed ? "pass" : "fail"}`} style={{ marginTop: 12 }}>
              {passed ? "PASS — Congratulations!" : "Not Quite — Keep Studying!"}
            </div>
            <div className="results-sub">
              {passed
                ? `You answered ${score} of ${EXAM_SIZE} correctly. You're ready for the real exam!`
                : `You need ${PASS_SCORE - score} more correct answer${PASS_SCORE - score === 1 ? "" : "s"} to pass. Review the mistakes below.`}
            </div>

            <div className="results-actions">
              <button className="btn btn-primary" onClick={startExam}>Try Again →</button>
              <button className="btn btn-secondary" onClick={() => setScreen("start")}>← Home</button>
            </div>

            {wrong.length > 0 && (
              <div className="wrong-review">
                <h3>Questions Missed ({wrong.length})</h3>
                {wrong.map(({ question: q, selectedLetter }, i) => {
                  const yourText = q.choices.find(c => c[0] === selectedLetter)?.[1] || "No answer";
                  const correctText = q.choices.find(c => c[0] === q.correct)?.[1] || "";
                  return (
                    <div className="wrong-item" key={i}>
                      <div className="wrong-qid">{q.id}</div>
                      <div className="wrong-q">{q.question}</div>
                      <div className="wrong-answers">
                        <span className="wrong-yours">✗ Your answer: {selectedLetter}. {yourText}</span><br />
                        <span className="wrong-correct">✓ Correct: {q.correct}. {correctText}</span>
                      </div>
                      <div className="wrong-expl">{q.explanation}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="results-actions" style={{ marginTop: 0 }}>
              <button className="btn btn-primary" onClick={startExam}>Try Again →</button>
              <button className="btn btn-secondary" onClick={() => setScreen("start")}>← Home</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
